import { Request, Response, NextFunction } from 'express';
import { db } from './db/repository';
import { User, UserRole } from './db/schema';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// In-memory token store for sessions
const activeSessions = new Map<string, { userId: string; expiresAt: number }>();

export function createSessionToken(userId: string): string {
  const token = `sess_${userId}_${Math.random().toString(36).substring(2)}_${Date.now()}`;
  activeSessions.set(token, {
    userId,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  return token;
}

export function revokeSessionToken(token: string) {
  activeSessions.delete(token);
}

// Authentication Middleware: Verifies Bearer Token
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authentication required. Missing Authorization header.' });
  }

  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  const session = activeSessions.get(token);

  // Allow test mock tokens for quick role evaluation: `test_token_customer`, `test_token_store`, etc.
  let userId = session?.userId;
  if (!userId) {
    if (token === 'test_token_customer') userId = 'usr-customer-1';
    else if (token === 'test_token_store') userId = 'usr-store-1';
    else if (token === 'test_token_ops') userId = 'usr-ops-1';
    else if (token === 'test_token_admin') userId = 'usr-admin-1';
  }

  if (!userId) {
    return res.status(401).json({ error: 'Invalid or expired session token.' });
  }

  const user = db.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found in system.' });
  }

  req.user = user;
  next();
}

// Role-Based Access Control (RBAC) Middleware
export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User identity not established.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      db.logAudit({
        userId: req.user.id,
        userRole: req.user.role,
        action: 'ACCESS_DENIED',
        resource: req.originalUrl,
        resourceId: req.params.id || 'none',
        metadata: { requiredRoles: allowedRoles, attemptedMethod: req.method }
      });

      return res.status(403).json({
        error: `Forbidden: Role '${req.user.role}' is not authorized to access this resource. Required: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

// Ownership Authorization Middleware: Ensures Customer only accesses their orders,
// and Store Manager only accesses their store's orders
export function verifyOrderAccess(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  // Admins and Operations have global access
  if (user.role === 'ADMIN' || user.role === 'OPERATIONS') {
    return next();
  }

  const orderId = req.params.id || req.body.orderId;
  if (!orderId) return next();

  const order = db.orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });

  if (user.role === 'CUSTOMER' && order.customerId !== user.id) {
    return res.status(403).json({ error: 'Forbidden: You can only access your own orders.' });
  }

  if (user.role === 'STORE_MANAGER') {
    const profile = db.profiles.find(p => p.userId === user.id);
    if (!profile || profile.storeId !== order.storeId) {
      return res.status(403).json({ error: 'Forbidden: You can only access orders for your store.' });
    }
  }

  next();
}
