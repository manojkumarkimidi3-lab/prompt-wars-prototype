import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db/repository';
import { calculateOrderRisk, defaultRiskWeights, RiskWeightsConfig } from './server/riskEngine';
import { aiRouter } from './lib/ai/router';
import { authenticate, requireRole, verifyOrderAccess, createSessionToken, revokeSessionToken } from './server/auth';
import type { UserRole } from './server/db/schema';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Global Security & Request Logging Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// ==========================================
// 1. AUTHENTICATION & SESSION ENDPOINTS
// ==========================================

// Login endpoint: Supports both real credentials and 1-click test role logins
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password, testRole } = req.body;

  let user = null;
  if (testRole) {
    user = db.users.find(u => u.role === (testRole as UserRole));
  } else if (email) {
    user = db.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials or user not found' });
  }

  const token = createSessionToken(user.id);
  const profile = db.profiles.find(p => p.userId === user.id);

  db.logAudit({
    userId: user.id,
    userRole: user.role,
    action: 'USER_LOGIN',
    resource: 'session',
    resourceId: token,
    metadata: { email: user.email, role: user.role }
  });

  res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone
    },
    profile
  });
});

// Get current authenticated user profile
app.get('/api/auth/me', authenticate, (req: Request, res: Response) => {
  const user = req.user!;
  const profile = db.profiles.find(p => p.userId === user.id);
  res.json({ user, profile });
});

// Logout endpoint
app.post('/api/auth/logout', authenticate, (req: Request, res: Response) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace(/^Bearer\s+/, '').trim();
  revokeSessionToken(token);
  res.json({ success: true, message: 'Logged out successfully' });
});

// ==========================================
// 2. ORDER MANAGEMENT & RISK PIPELINE
// ==========================================

// List orders: Role-aware filtering
app.get('/api/orders', authenticate, (req: Request, res: Response) => {
  const user = req.user!;
  const { status, riskLevel, city } = req.query;

  let filtered = [...db.orders];

  // RBAC Filtering
  if (user.role === 'CUSTOMER') {
    filtered = filtered.filter(o => o.customerId === user.id);
  } else if (user.role === 'STORE_MANAGER') {
    const profile = db.profiles.find(p => p.userId === user.id);
    filtered = filtered.filter(o => o.storeId === profile?.storeId);
  }

  if (city && city !== 'all') {
    filtered = filtered.filter(o => o.city.toLowerCase() === (city as string).toLowerCase());
  }
  if (status && status !== 'all') {
    filtered = filtered.filter(o => o.status === status);
  }

  const enriched = filtered.map(order => db.getOrderWithRisk(order.id));

  // Risk level filter
  let result = enriched;
  if (riskLevel && riskLevel !== 'all') {
    result = result.filter(o => o?.riskScore?.riskLevel === riskLevel);
  }

  res.json({ orders: result });
});

// Get Single Order Detail with complete risk breakdown
app.get('/api/orders/:id', authenticate, verifyOrderAccess, (req: Request, res: Response) => {
  const orderDetails = db.getOrderWithRisk(req.params.id);
  if (!orderDetails) {
    return res.status(404).json({ error: 'Order not found' });
  }
  res.json({ order: orderDetails });
});

// Create New Order: Immediately executes Deterministic Risk Engine
app.post('/api/orders', authenticate, (req: Request, res: Response) => {
  const user = req.user!;
  const { storeId, items, customerAddress, city } = req.body;

  if (!items || !items.length) {
    return res.status(400).json({ error: 'Order must contain at least 1 item' });
  }

  const store = db.stores.find(s => s.id === storeId) || db.stores[0];
  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;

  let totalAmount = 0;
  const newOrderItems = items.map((it: any) => {
    const prod = db.products.find(p => p.id === it.productId);
    const price = prod ? prod.price : (it.price || 150);
    totalAmount += price * it.quantity;

    const orderItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      orderId,
      productId: it.productId,
      productName: prod ? prod.name : it.productName || 'Neighborhood Item',
      quantity: it.quantity,
      unitPrice: price,
      substitutionPreference: it.substitutionPreference || 'auto-refund',
      status: 'CONFIRMED' as const
    };
    db.orderItems.push(orderItem);
    return orderItem;
  });

  const newOrder = {
    id: orderId,
    customerId: user.id,
    customerName: user.name,
    customerAddress: customerAddress || '100ft Road, Indiranagar',
    city: city || store.city,
    storeId: store.id,
    storeName: store.name,
    totalAmount,
    itemCount: newOrderItems.reduce((acc: number, i: { quantity: number }) => acc + i.quantity, 0),
    currentEtaMinutes: store.avgPreparationTime + 16,
    status: 'PLACED' as const,
    isMultiCategory: false,
    orderNumberForCustomer: 3,
    createdAt: 'Just now',
    updatedAt: 'Just now'
  };

  db.orders.unshift(newOrder);

  // Evaluate Deterministic Risk
  db.refreshAllOrderRisks();

  db.logAudit({
    userId: user.id,
    userRole: user.role,
    action: 'ORDER_PLACED',
    resource: 'order',
    resourceId: orderId,
    metadata: { totalAmount, itemCount: newOrder.itemCount }
  });

  const fullOrder = db.getOrderWithRisk(orderId);
  res.status(201).json({
    success: true,
    order: fullOrder,
    message: fullOrder?.status === 'AT_RISK'
      ? 'Order placed! High risk factors detected by Nova Rescue.'
      : 'Order placed successfully!'
  });
});

// ==========================================
// 3. RISK ENGINE & AT-RISK ORDERS
// ==========================================

// Get at-risk orders for Operations Rescue hub
app.get('/api/risk/orders', authenticate, requireRole(['OPERATIONS', 'ADMIN', 'STORE_MANAGER']), (req: Request, res: Response) => {
  const atRisk = db.orders
    .filter(o => o.status === 'AT_RISK' || o.status === 'PLACED')
    .map(o => db.getOrderWithRisk(o.id))
    .filter(o => o?.riskScore && (o.riskScore.totalScore >= 35));

  res.json({
    totalAtRisk: atRisk.length,
    criticalCount: atRisk.filter(o => o?.riskScore?.riskLevel === 'CRITICAL').length,
    highCount: atRisk.filter(o => o?.riskScore?.riskLevel === 'HIGH').length,
    orders: atRisk
  });
});

// Deterministic risk calculation testing / simulation endpoint
app.post('/api/risk/analyze', authenticate, (req: Request, res: Response) => {
  const { orderId, customWeights } = req.body;
  const order = db.getOrderWithRisk(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const items = order.items.map(it => {
    const prod = db.products.find(p => p.id === it.productId);
    return {
      name: it.productName,
      quantity: it.quantity,
      currentStock: prod ? prod.currentStock : 1,
      ghostRiskScore: prod ? prod.ghostRiskScore : 50
    };
  });

  const riskResult = calculateOrderRisk(
    {
      items,
      store: {
        rejectionRate: order.store?.rejectionRate || 10,
        inventoryAccuracy: order.store?.inventoryAccuracy || 75,
        isRushMode: Boolean(order.store?.isRushMode),
        avgPrepTime: order.store?.avgPreparationTime || 12
      },
      currentEtaMinutes: order.currentEtaMinutes,
      itemCount: order.itemCount
    },
    customWeights || defaultRiskWeights
  );

  res.json({ riskResult });
});

// ==========================================
// 4. AI RESCUE RECOMMENDATION & EXECUTION
// ==========================================

// Generate AI Recommendation for an at-risk order using Zod validation
app.post('/api/rescue/recommend', authenticate, async (req: Request, res: Response) => {
  const { orderId } = req.body;
  const order = db.getOrderWithRisk(orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const riskScore = order.riskScore?.totalScore || 65;
  const factors = order.factors?.map(f => f.description) || ['Potential stock mismatch'];
  const items = order.items.map(i => {
    const prod = db.products.find(p => p.id === i.productId);
    return {
      name: i.productName,
      quantity: i.quantity,
      stock: prod ? prod.currentStock : 1,
      ghostRisk: prod ? prod.ghostRiskScore : 50
    };
  });

  try {
    const result = await aiRouter.recommendRescue({
      orderId: order.id,
      customerName: order.customerName,
      storeName: order.storeName,
      items,
      totalRiskScore: riskScore,
      riskFactors: factors,
      currentEtaMinutes: order.currentEtaMinutes,
      rejectionHistoryPct: order.store?.rejectionRate || 12
    });

    // Save AI request and recommendation to database
    const reqId = `aireq-${Date.now()}`;
    db.aiRequests.push({
      id: reqId,
      provider: result.provider,
      purpose: 'ORDER_RESCUE_RECOMMENDATION',
      latencyMs: result.latencyMs,
      status: 'SUCCESS',
      createdAt: new Date().toISOString()
    });

    db.aiRecommendations.push({
      id: `rec-${Date.now()}`,
      requestId: reqId,
      orderId: order.id,
      riskExplanation: result.output.riskExplanation,
      recommendedAction: result.output.recommendedAction,
      reason: result.output.reason,
      customerMessage: result.output.customerMessage,
      confidence: result.output.confidence,
      validatedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      recommendation: result.output,
      provider: result.provider,
      latencyMs: result.latencyMs
    });
  } catch (err: any) {
    res.status(500).json({ error: `AI recommendation failed: ${err.message}` });
  }
});

// Execute Allowed Rescue Action
app.post('/api/rescue/execute', authenticate, verifyOrderAccess, (req: Request, res: Response) => {
  const user = req.user!;
  const { orderId, actionType, details, substitutedItemId, replacementItemName } = req.body;

  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Allowed actions whitelist
  const allowedActions = [
    'SUBSTITUTE_ITEM',
    'REROUTE_NEARBY_STORE',
    'PRIORITY_COURIER_DISPATCH',
    'AUTO_REFUND',
    'EXTEND_ETA',
    'MERCHANT_URGENT_CONFIRM'
  ];

  if (!allowedActions.includes(actionType)) {
    return res.status(400).json({ error: 'Invalid rescue action type requested' });
  }

  const actionId = `act-${Date.now()}`;
  db.rescueActions.push({
    id: actionId,
    orderId: order.id,
    actionType,
    status: 'EXECUTED',
    executedByRole: user.role,
    executedByUserId: user.id,
    details: details || `Executed ${actionType} by ${user.role} ${user.name}`,
    executedAt: new Date().toISOString()
  });

  // Apply state transformations according to action
  let failurePrevented = true;
  let revenueSaved = order.totalAmount;
  let timeSaved = 12;

  if (actionType === 'SUBSTITUTE_ITEM') {
    const item = db.orderItems.find(i => i.orderId === order.id);
    if (item) {
      item.status = 'SUBSTITUTED';
      item.productName = replacementItemName || `${item.productName} (Artisanal Batch Replacement)`;
    }
    order.status = 'RESCUED';
  } else if (actionType === 'REROUTE_NEARBY_STORE') {
    order.storeName = `${order.storeName} → Rerouted to Adjacent Hub (250m)`;
    order.currentEtaMinutes = Math.max(18, order.currentEtaMinutes - 10);
    order.status = 'RESCUED';
  } else if (actionType === 'PRIORITY_COURIER_DISPATCH') {
    order.currentEtaMinutes = Math.max(18, order.currentEtaMinutes - 16);
    order.status = 'DELIVERING';
    timeSaved = 16;
  } else if (actionType === 'AUTO_REFUND') {
    order.status = 'CANCELLED';
    order.cancellationReason = 'Proactive 30s Auto-Refund executed';
    failurePrevented = false; // Graceful cancellation
  } else if (actionType === 'EXTEND_ETA') {
    order.currentEtaMinutes += 12;
    order.status = 'RESCUED';
  } else if (actionType === 'MERCHANT_URGENT_CONFIRM') {
    order.status = 'RESCUED';
  }

  // Record outcome
  db.rescueOutcomes.push({
    id: `out-${Date.now()}`,
    rescueActionId: actionId,
    orderId: order.id,
    outcome: 'SUCCESS',
    failurePrevented,
    customerSatisfied: true,
    deliveryTimeSavedMins: timeSaved,
    revenueSaved,
    recordedAt: new Date().toISOString()
  });

  // Refresh risk score
  db.refreshAllOrderRisks();

  db.logAudit({
    userId: user.id,
    userRole: user.role,
    action: `RESCUE_ACTION_${actionType}`,
    resource: 'order',
    resourceId: order.id,
    metadata: { actionType, details, outcome: 'SUCCESS' }
  });

  const updatedOrder = db.getOrderWithRisk(order.id);
  res.json({
    success: true,
    message: `Rescue Action '${actionType}' successfully executed! Failure avoided and recorded in audit ledger.`,
    order: updatedOrder
  });
});

// ==========================================
// 5. STORES & STORE INTELLIGENCE
// ==========================================

app.get('/api/stores', (req: Request, res: Response) => {
  const { city, category } = req.query;
  let storesList = [...db.stores];

  if (city && city !== 'all') {
    storesList = storesList.filter(s => s.city.toLowerCase() === (city as string).toLowerCase());
  }
  if (category && category !== 'all') {
    storesList = storesList.filter(s => s.category === category);
  }

  const enriched = storesList.map(store => {
    const prods = db.products.filter(p => p.storeId === store.id);
    return {
      ...store,
      products: prods
    };
  });

  res.json({
    totalStores: 620,
    sampleCount: enriched.length,
    stores: enriched
  });
});

app.get('/api/stores/:id', (req: Request, res: Response) => {
  const store = db.stores.find(s => s.id === req.params.id);
  if (!store) {
    return res.status(404).json({ error: 'Store not found' });
  }

  const products = db.products.filter(p => p.storeId === store.id);
  res.json({ store, products });
});

// Toggle Store Rush Mode
app.post('/api/stores/:id/rush-mode', authenticate, requireRole(['STORE_MANAGER', 'OPERATIONS', 'ADMIN']), (req: Request, res: Response) => {
  const store = db.stores.find(s => s.id === req.params.id);
  if (!store) return res.status(404).json({ error: 'Store not found' });

  store.isRushMode = !store.isRushMode;
  db.refreshAllOrderRisks();

  db.logAudit({
    userId: req.user!.id,
    userRole: req.user!.role,
    action: store.isRushMode ? 'RUSH_MODE_ACTIVATED' : 'RUSH_MODE_DEACTIVATED',
    resource: 'store',
    resourceId: store.id,
    metadata: { storeName: store.name, isRushMode: store.isRushMode }
  });

  res.json({
    success: true,
    storeId: store.id,
    isRushMode: store.isRushMode,
    message: store.isRushMode
      ? `Rush Shield Activated! In-store rush protection on. ETA extended to prevent order rejection.`
      : `Rush Shield Deactivated. Standard prep time restored.`
  });
});

// Update store product inventory (Manual or SnapSync)
app.post('/api/stores/:id/inventory', authenticate, requireRole(['STORE_MANAGER', 'OPERATIONS', 'ADMIN']), (req: Request, res: Response) => {
  const { productId, currentStock } = req.body;
  const product = db.products.find(p => p.id === productId && p.storeId === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  product.currentStock = Math.max(0, parseInt(currentStock));
  product.lastVerifiedAt = 'Just now (Verified)';
  product.ghostRiskScore = product.currentStock === 0 ? 0 : Math.max(5, Math.round(15 * (product.dailyDemandEst / (product.currentStock + 1))));

  // Record inventory snapshot
  db.inventorySnapshots.push({
    id: `snap-${Date.now()}`,
    productId: product.id,
    stockRecorded: product.currentStock,
    source: 'SNAPSYNC',
    confidencePct: 98,
    timestamp: new Date().toISOString()
  });

  db.refreshAllOrderRisks();

  res.json({ success: true, product });
});

// AI Store Intelligence Summary
app.get('/api/stores/:id/intelligence', authenticate, async (req: Request, res: Response) => {
  const store = db.stores.find(s => s.id === req.params.id);
  if (!store) return res.status(404).json({ error: 'Store not found' });

  const products = db.products.filter(p => p.storeId === store.id);
  const result = await aiRouter.generateStoreIntelligence({ ...store, products });

  res.json({ intelligence: result.output, provider: result.provider });
});

// ==========================================
// 6. BUSINESS ANALYTICS & IMPACT (JOURNEY 4)
// ==========================================

app.get('/api/analytics', authenticate, (_req: Request, res: Response) => {
  res.json({
    baseline: {
      registeredUsers: 120000,
      monthlyOrders: 38500,
      cancellationRate: 11.0,
      repeatPurchaseRate: 27.0,
      avgDeliveryTime: 37,
      monthlySupportTickets: 5900,
      monthlyPromoSpend: 1700000,
      monthlyRevenue: 2610000
    },
    cancellationCauses: [
      { cause: 'Product Unavailable (Ghost Stock)', pct: 35, ordersAffected: 1482 },
      { cause: 'Customer Delay Cancellation', pct: 27, ordersAffected: 1143 },
      { cause: 'Store Rejection During Rush', pct: 18, ordersAffected: 762 },
      { cause: 'Delivery Partner Unavailable', pct: 12, ordersAffected: 508 },
      { cause: 'Other Issues', pct: 8, ordersAffected: 338 }
    ],
    riskDistribution: {
      critical: db.riskScores.filter(r => r.riskLevel === 'CRITICAL').length,
      high: db.riskScores.filter(r => r.riskLevel === 'HIGH').length,
      medium: db.riskScores.filter(r => r.riskLevel === 'MEDIUM').length,
      low: db.riskScores.filter(r => r.riskLevel === 'LOW').length
    }
  });
});

app.get('/api/impact', authenticate, (_req: Request, res: Response) => {
  const totalRescued = db.rescueOutcomes.filter(o => o.failurePrevented).length;
  const totalRevenueSaved = db.rescueOutcomes.reduce((acc, o) => acc + o.revenueSaved, 0);
  const totalTimeSaved = db.rescueOutcomes.reduce((acc, o) => acc + o.deliveryTimeSavedMins, 0);

  res.json({
    prototypeMeasured: {
      ordersMonitored: db.orders.length,
      atRiskIdentified: db.orders.filter(o => o.status === 'AT_RISK').length,
      rescuedCount: totalRescued,
      revenueSaved: totalRevenueSaved,
      deliveryTimeSavedMinutes: totalTimeSaved,
      supportTicketsAutoResolved: db.supportTickets.filter(t => t.status === 'Auto-Resolved').length
    },
    projectedMonthlyImpact: {
      ordersRecoveredMonthly: 2780,
      cancellationRateDrop: '11.0% → 3.8%',
      repeatRateIncrease: '27.0% → 48.5%',
      monthlyEbitdaTurnaround: '+₹17.6 Lakh',
      paybackPeriodMonths: 1.5,
      budgetCap: 2500000
    },
    isPrototypeSimulation: true
  });
});

// ==========================================
// 7. ADMIN AUDIT & SYSTEM INSPECTION
// ==========================================

app.get('/api/admin/audit-logs', authenticate, requireRole(['ADMIN']), (_req: Request, res: Response) => {
  res.json({ logs: db.auditLogs });
});

app.get('/api/admin/ai-requests', authenticate, requireRole(['ADMIN']), (_req: Request, res: Response) => {
  res.json({ requests: db.aiRequests, recommendations: db.aiRecommendations });
});

// Vite Middleware integration in dev / static in prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 NOVA RESCUE Platform listening on port ${PORT}`);
  });
}

startServer();
