export type UserRole = 'CUSTOMER' | 'STORE_MANAGER' | 'OPERATIONS' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  name: string;
  phone: string;
  createdAt: string;
}

export interface Profile {
  userId: string;
  city: string;
  address: string;
  storeId?: string; // Set if role is STORE_MANAGER
  avatarUrl: string;
}

export interface StoreEntity {
  id: string;
  name: string;
  city: string;
  locality: string;
  category: string;
  rating: number;
  reviewCount: number;
  avgPreparationTime: number;
  rejectionRate: number;
  inventoryAccuracy: number;
  isRushMode: boolean;
  ownerName: string;
  phone: string;
  bannerImage: string;
  specialtyTagline: string;
  createdAt: string;
}

export interface ProductEntity {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  currentStock: number;
  dailyDemandEst: number;
  ghostRiskScore: number;
  isSpecialty: boolean;
  image: string;
  description: string;
  substituteSuggestion?: string;
  lastVerifiedAt: string;
}

export interface InventorySnapshot {
  id: string;
  productId: string;
  stockRecorded: number;
  source: 'MANUAL' | 'SNAPSYNC' | 'ESTIMATED';
  confidencePct: number;
  timestamp: string;
}

export interface OrderEntity {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  city: string;
  storeId: string;
  storeName: string;
  totalAmount: number;
  itemCount: number;
  currentEtaMinutes: number;
  status: 'PLACED' | 'AT_RISK' | 'RESCUED' | 'DELIVERING' | 'DELIVERED' | 'CANCELLED';
  cancellationReason?: string;
  isMultiCategory: boolean;
  orderNumberForCustomer: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemEntity {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  substitutionPreference: 'auto-refund' | 'allow-smart-sub' | 'call-me';
  status: 'CONFIRMED' | 'SUBSTITUTED' | 'REFUNDED';
}

export interface DeliveryEvent {
  id: string;
  orderId: string;
  eventType: 'ORDER_PLACED' | 'BATCHED' | 'RIDER_ASSIGNED' | 'PICKED_UP' | 'RESCUE_REROUTED' | 'DELIVERED' | 'CANCELLED';
  etaMinutes: number;
  notes: string;
  timestamp: string;
}

export interface RiskScoreEntity {
  id: string;
  orderId: string;
  totalScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  inventoryRisk: number;
  deliveryRisk: number;
  storeRisk: number;
  complexityRisk: number;
  evaluatedAt: string;
}

export interface RiskFactorEntity {
  id: string;
  riskScoreId: string;
  orderId: string;
  factorType: 'INVENTORY' | 'STORE' | 'DELIVERY' | 'COMPLEXITY';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  weight: number;
  description: string;
  affectedItem?: string;
}

export interface RescueActionEntity {
  id: string;
  orderId: string;
  actionType: 'SUBSTITUTE_ITEM' | 'REROUTE_NEARBY_STORE' | 'PRIORITY_COURIER_DISPATCH' | 'AUTO_REFUND' | 'EXTEND_ETA' | 'MERCHANT_URGENT_CONFIRM';
  status: 'PROPOSED' | 'EXECUTED' | 'REJECTED' | 'EXPIRED';
  executedByRole: UserRole;
  executedByUserId: string;
  details: string;
  executedAt: string;
}

export interface RescueOutcomeEntity {
  id: string;
  rescueActionId: string;
  orderId: string;
  outcome: 'SUCCESS' | 'PARTIAL_SUCCESS' | 'FAILED';
  failurePrevented: boolean;
  customerSatisfied: boolean;
  deliveryTimeSavedMins: number;
  revenueSaved: number;
  recordedAt: string;
}

export interface SupportTicketEntity {
  id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  type: 'Refund Status' | 'Delayed Delivery' | 'Missing/Unavailable Item' | 'Coupon Issue' | 'Incorrect Order';
  amount: number;
  status: 'Open' | 'Auto-Resolved' | 'Manual Escalation';
  resolutionMinutes: number;
  auditLog: string[];
  createdAt: string;
}

export interface AIRequestEntity {
  id: string;
  provider: string;
  purpose: string;
  latencyMs: number;
  status: 'SUCCESS' | 'FAILED' | 'FALLBACK';
  createdAt: string;
}

export interface AIRecommendationEntity {
  id: string;
  requestId: string;
  orderId: string;
  riskExplanation: string;
  recommendedAction: string;
  reason: string;
  customerMessage: string;
  confidence: number;
  validatedAt: string;
}

export interface AuditLogEntity {
  id: string;
  userId: string;
  userRole: UserRole;
  action: string;
  resource: string;
  resourceId: string;
  metadata: Record<string, any>;
  timestamp: string;
}
