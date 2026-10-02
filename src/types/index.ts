export type City = 'Bengaluru' | 'Pune' | 'Jaipur';

export type UserRole = 'CUSTOMER' | 'STORE_MANAGER' | 'OPERATIONS' | 'ADMIN';

export type StoreCategory = 
  | 'Artisan Bakery' 
  | 'Organic Produce' 
  | 'Ayurvedic & Pharmacy' 
  | 'Heritage Sweets & Snacks' 
  | 'Gourmet Dairy & Cheese' 
  | 'Fine Stationery & Books';

export interface Product {
  id: string;
  storeId: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit: string;
  stock: number;
  dailyDemandEst: number;
  ghostRiskScore: number; // 0 (accurate) to 100 (high risk of ghost stock)
  lastUpdated: string;
  isSpecialty: boolean;
  image: string;
  description: string;
  substituteSuggestion?: string;
}

export interface Store {
  id: string;
  name: string;
  city: City;
  locality: string;
  category: StoreCategory;
  rating: number;
  reviewCount: number;
  avgPreparationTime: number; // minutes
  isRushMode: boolean; // Rush Shield: active when busy, adjusts delivery promise
  rushMultiplier: number;
  monthlyOrders: number;
  rejectionRate: number; // %
  inventoryAccuracy: number; // %
  partnerSentiment: 'High Risk' | 'Neutral' | 'Loyal Partner';
  ownerName: string;
  phone: string;
  bannerImage: string;
  products: Product[];
  specialtyTagline: string;
}

export interface CartItem {
  product: Product;
  store: Store;
  quantity: number;
  substitutionPreference: 'auto-refund' | 'allow-smart-sub' | 'call-me';
}

export interface MultiStoreOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerAddress: string;
  city: City;
  items: CartItem[];
  storesInvolved: {
    storeId: string;
    storeName: string;
    status: 'pending' | 'preparing' | 'ready' | 'picked_up';
    prepTimeMinutes: number;
  }[];
  totalAmount: number;
  itemCount: number;
  discountApplied: number;
  couponCode?: string;
  deliveryTimeEst: number; // minutes (bundled)
  deliveryStatus: 'placed' | 'batching' | 'rider_assigned' | 'delivering' | 'delivered' | 'cancelled';
  cancellationReason?: string;
  isMultiCategory: boolean;
  orderNumberForCustomer: number; // 1, 2, 3+
  timestamp: string;
  routeBundleId?: string;
}

export interface SupportTicket {
  id: string;
  orderId: string;
  customerName: string;
  type: 'Refund Status' | 'Delayed Delivery' | 'Missing/Unavailable Item' | 'Coupon Issue' | 'Incorrect Order';
  amount: number;
  status: 'Open' | 'Auto-Resolved' | 'Manual Escalation';
  resolutionMinutes: number;
  createdAt: string;
  details: string;
  autoRefundEligible: boolean;
  auditLog: string[];
}

export interface BusinessMetrics {
  registeredUsers: { sixMonthsAgo: number; current: number; projected: number };
  monthlyActiveUsers: { sixMonthsAgo: number; current: number; projected: number };
  monthlyOrders: { sixMonthsAgo: number; current: number; projected: number };
  averageOrderValue: { sixMonthsAgo: number; current: number; projected: number };
  repeatPurchaseRate: { sixMonthsAgo: number; current: number; projected: number };
  averageDeliveryTime: { sixMonthsAgo: number; current: number; projected: number };
  cancellationRate: { sixMonthsAgo: number; current: number; projected: number };
  monthlySupportTickets: { sixMonthsAgo: number; current: number; projected: number };
  promotionalSpendMonthly: { sixMonthsAgo: number; current: number; projected: number };
  revenueMonthly: { sixMonthsAgo: number; current: number; projected: number };
  estimatedMonthlyEbitda: { sixMonthsAgo: number; current: number; projected: number };
}

export interface SimulationParams {
  ghostStockReductionPct: number; // 0 to 80%
  rushShieldAdoptionPct: number; // 0 to 100%
  promoBudgetRebalancePct: number; // % shifted from 1st-order burn to 2nd/3rd order habits
  multiStoreBundlingAdoption: number; // 0 to 100%
  instantRefundAutomation: boolean;
}

export interface AIChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  scenarioImpact?: Partial<SimulationParams>;
}
