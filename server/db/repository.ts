import {
  User,
  Profile,
  StoreEntity,
  ProductEntity,
  InventorySnapshot,
  OrderEntity,
  OrderItemEntity,
  DeliveryEvent,
  RiskScoreEntity,
  RiskFactorEntity,
  RescueActionEntity,
  RescueOutcomeEntity,
  SupportTicketEntity,
  AIRequestEntity,
  AIRecommendationEntity,
  AuditLogEntity,
  UserRole
} from './schema';
import { calculateOrderRisk, RiskEvaluationResult } from '../riskEngine';

class DatabaseRepository {
  public users: User[] = [];
  public profiles: Profile[] = [];
  public stores: StoreEntity[] = [];
  public products: ProductEntity[] = [];
  public inventorySnapshots: InventorySnapshot[] = [];
  public orders: OrderEntity[] = [];
  public orderItems: OrderItemEntity[] = [];
  public deliveryEvents: DeliveryEvent[] = [];
  public riskScores: RiskScoreEntity[] = [];
  public riskFactors: RiskFactorEntity[] = [];
  public rescueActions: RescueActionEntity[] = [];
  public rescueOutcomes: RescueOutcomeEntity[] = [];
  public supportTickets: SupportTicketEntity[] = [];
  public aiRequests: AIRequestEntity[] = [];
  public aiRecommendations: AIRecommendationEntity[] = [];
  public auditLogs: AuditLogEntity[] = [];

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // 1. SEED USERS & PROFILES FOR 4 CORE ROLES
    this.users = [
      {
        id: 'usr-customer-1',
        email: 'customer@novacart.in',
        passwordHash: 'pass123',
        role: 'CUSTOMER',
        name: 'Aishwarya Rao',
        phone: '+91 98450 99881',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-customer-2',
        email: 'rahul@novacart.in',
        passwordHash: 'pass123',
        role: 'CUSTOMER',
        name: 'Rahul Deshmukh',
        phone: '+91 98220 77112',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-store-1',
        email: 'store@glensbakery.in',
        passwordHash: 'pass123',
        role: 'STORE_MANAGER',
        name: 'Chef Glen Fernandes',
        phone: '+91 98450 11234',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-ops-1',
        email: 'ops@novacart.in',
        passwordHash: 'pass123',
        role: 'OPERATIONS',
        name: 'Vikram Sethi (Ops Director)',
        phone: '+91 98800 44211',
        createdAt: new Date().toISOString()
      },
      {
        id: 'usr-admin-1',
        email: 'admin@novacart.in',
        passwordHash: 'pass123',
        role: 'ADMIN',
        name: 'Pooja Hegde (Chief Strategy Officer)',
        phone: '+91 99000 11223',
        createdAt: new Date().toISOString()
      }
    ];

    this.profiles = [
      {
        userId: 'usr-customer-1',
        city: 'Bengaluru',
        address: 'Flat 402, Sterling Terraces, Indiranagar, Bengaluru',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'
      },
      {
        userId: 'usr-customer-2',
        city: 'Pune',
        address: 'B-12, Prabhat Road, Pune',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
      },
      {
        userId: 'usr-store-1',
        city: 'Bengaluru',
        address: 'Indiranagar 100ft Rd, Bengaluru',
        storeId: 'store-1',
        avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150'
      },
      {
        userId: 'usr-ops-1',
        city: 'Bengaluru',
        address: 'Nova Cart Fulfillment Tower, Koramangala',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150'
      },
      {
        userId: 'usr-admin-1',
        city: 'Bengaluru',
        address: 'Nova Cart Headquarters, Indiranagar',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'
      }
    ];

    // 2. SEED STORES ACROSS 3 INDIAN METROS (REPRESENTING 620 MERCHANTS)
    this.stores = [
      {
        id: 'store-1',
        name: 'Glen’s Artisan Bakery & Pâtisserie',
        city: 'Bengaluru',
        locality: 'Indiranagar 100ft Rd',
        category: 'Artisan Bakery',
        rating: 4.8,
        reviewCount: 420,
        avgPreparationTime: 12,
        rejectionRate: 14,
        inventoryAccuracy: 72,
        isRushMode: false,
        ownerName: 'Chef Glen Fernandes',
        phone: '+91 98450 11234',
        bannerImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600',
        specialtyTagline: 'Slow-fermented Sourdough & Signature Red Velvet',
        createdAt: new Date().toISOString()
      },
      {
        id: 'store-2',
        name: 'Kamakshi Ayurvedic & Wellness Chemist',
        city: 'Bengaluru',
        locality: 'Koramangala 4th Block',
        category: 'Ayurvedic & Pharmacy',
        rating: 4.9,
        reviewCount: 680,
        avgPreparationTime: 8,
        rejectionRate: 8,
        inventoryAccuracy: 89,
        isRushMode: false,
        ownerName: 'V. S. Ramanathan, B.Pharm',
        phone: '+91 98452 77812',
        bannerImage: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=600',
        specialtyTagline: 'Authentic Kottakkal Arya Vaidya Sala & Organic Herbs',
        createdAt: new Date().toISOString()
      },
      {
        id: 'store-3',
        name: 'Vaidya Organics & Hydroponic Greens',
        city: 'Bengaluru',
        locality: 'Indiranagar 12th Main',
        category: 'Organic Produce',
        rating: 4.7,
        reviewCount: 310,
        avgPreparationTime: 10,
        rejectionRate: 19,
        inventoryAccuracy: 61,
        isRushMode: true,
        ownerName: 'Priya & Arjun Vaidya',
        phone: '+91 97311 44521',
        bannerImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600',
        specialtyTagline: 'Pesticide-Free Butterhead Lettuce & Microgreens',
        createdAt: new Date().toISOString()
      },
      {
        id: 'store-4',
        name: 'Chitale Dairy & Artisanal Shrikhand',
        city: 'Pune',
        locality: 'FC Road / Deccan',
        category: 'Gourmet Dairy & Cheese',
        rating: 4.9,
        reviewCount: 2200,
        avgPreparationTime: 6,
        rejectionRate: 7,
        inventoryAccuracy: 92,
        isRushMode: false,
        ownerName: 'Makarand Chitale',
        phone: '+91 98220 54100',
        bannerImage: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600',
        specialtyTagline: 'Legendary Pune Bakarwadi & Kesar Shrikhand',
        createdAt: new Date().toISOString()
      },
      {
        id: 'store-5',
        name: 'Rawat Mishthan Bhandar',
        city: 'Jaipur',
        locality: 'Station Road / C-Scheme',
        category: 'Heritage Sweets & Snacks',
        rating: 4.8,
        reviewCount: 3400,
        avgPreparationTime: 15,
        rejectionRate: 18,
        inventoryAccuracy: 68,
        isRushMode: true,
        ownerName: 'Nandlal Rawat',
        phone: '+91 94140 76221',
        bannerImage: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600',
        specialtyTagline: 'World-Famous Pyaaz Kachori & Malai Ghevar',
        createdAt: new Date().toISOString()
      }
    ];

    // 3. SEED PRODUCTS
    this.products = [
      {
        id: 'prod-101',
        storeId: 'store-1',
        name: 'Country Artisan Sourdough Loaf',
        category: 'Breads',
        price: 195,
        unit: '450g',
        currentStock: 2, // Low stock -> High Ghost risk
        dailyDemandEst: 25,
        ghostRiskScore: 78,
        isSpecialty: true,
        image: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=400',
        description: '36-hour wild yeast naturally fermented sourdough with crisp blistered crust.',
        substituteSuggestion: 'Multi-grain Rye Loaf',
        lastVerifiedAt: '6 hours ago'
      },
      {
        id: 'prod-102',
        storeId: 'store-1',
        name: 'Signature Red Velvet Cupcake',
        category: 'Pastry',
        price: 110,
        unit: 'Pack of 2',
        currentStock: 1, // Critical stock!
        dailyDemandEst: 35,
        ghostRiskScore: 84,
        isSpecialty: true,
        image: 'https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400',
        description: 'Velvety cocoa crumb with Madagascar vanilla cream cheese frosting.',
        substituteSuggestion: 'Belgian Dark Chocolate Cupcake',
        lastVerifiedAt: '7 hours ago'
      },
      {
        id: 'prod-103',
        storeId: 'store-1',
        name: 'French Butter Croissant',
        category: 'Viennoiserie',
        price: 135,
        unit: '1 pc',
        currentStock: 14,
        dailyDemandEst: 40,
        ghostRiskScore: 15,
        isSpecialty: true,
        image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400',
        description: 'Pure 84% Normandy butter, flaky 27-layer honeycomb interior.',
        substituteSuggestion: 'Pain au Chocolat',
        lastVerifiedAt: '30 mins ago'
      },
      {
        id: 'prod-201',
        storeId: 'store-2',
        name: 'Kottakkal Chyavanaprasham Premium',
        category: 'Immunity',
        price: 360,
        unit: '500g jar',
        currentStock: 12,
        dailyDemandEst: 10,
        ghostRiskScore: 10,
        isSpecialty: true,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400',
        description: 'Classical Kerala formulation with organic wild amla and 48 herbs.',
        substituteSuggestion: 'Dabur Organic Chyawanprash',
        lastVerifiedAt: '1 hour ago'
      },
      {
        id: 'prod-301',
        storeId: 'store-3',
        name: 'Hydroponic Living Butterhead Lettuce',
        category: 'Greens',
        price: 120,
        unit: '1 head with roots',
        currentStock: 0, // OUT OF STOCK!
        dailyDemandEst: 18,
        ghostRiskScore: 95,
        isSpecialty: true,
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400',
        description: 'Fresh living butterhead with roots intact for peak sweetness.',
        substituteSuggestion: 'Crisp Romaine Cos Hearts',
        lastVerifiedAt: '1 day ago'
      },
      {
        id: 'prod-401',
        storeId: 'store-4',
        name: 'Original Pune Spiced Bakarwadi',
        category: 'Snacks',
        price: 130,
        unit: '500g pouch',
        currentStock: 35,
        dailyDemandEst: 50,
        ghostRiskScore: 8,
        isSpecialty: true,
        image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400',
        description: 'Crispy spiral roll stuffed with sweet, spicy coconut and poppy seeds.',
        substituteSuggestion: 'Mini Samosa Crisps',
        lastVerifiedAt: '15 mins ago'
      },
      {
        id: 'prod-501',
        storeId: 'store-5',
        name: 'Authentic Royal Pyaaz Kachori',
        category: 'Hot Savouries',
        price: 90,
        unit: '2 pcs',
        currentStock: 4,
        dailyDemandEst: 75,
        ghostRiskScore: 72,
        isSpecialty: true,
        image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400',
        description: 'Golden flaky puff pastry stuffed with spiced caramelized onions and hing.',
        substituteSuggestion: 'Dal Kachori Crisp',
        lastVerifiedAt: '3 hours ago'
      }
    ];

    // 4. SEED SAMPLE ORDERS REPRESENTING REALISTIC RISK PROFILES
    this.orders = [
      {
        id: 'ORD-98214',
        customerId: 'usr-customer-1',
        customerName: 'Aishwarya Rao',
        customerAddress: 'Flat 402, Sterling Terraces, Indiranagar, Bengaluru',
        city: 'Bengaluru',
        storeId: 'store-1',
        storeName: 'Glen’s Artisan Bakery',
        totalAmount: 515,
        itemCount: 3,
        currentEtaMinutes: 44, // Delay!
        status: 'AT_RISK',
        isMultiCategory: true,
        orderNumberForCustomer: 3,
        createdAt: '18 mins ago',
        updatedAt: 'Just now'
      },
      {
        id: 'ORD-98215',
        customerId: 'usr-customer-1',
        customerName: 'Aishwarya Rao',
        customerAddress: 'Flat 402, Sterling Terraces, Indiranagar, Bengaluru',
        city: 'Bengaluru',
        storeId: 'store-3',
        storeName: 'Vaidya Organics',
        totalAmount: 240,
        itemCount: 2,
        currentEtaMinutes: 28,
        status: 'AT_RISK',
        isMultiCategory: false,
        orderNumberForCustomer: 4,
        createdAt: '25 mins ago',
        updatedAt: '5 mins ago'
      },
      {
        id: 'ORD-98210',
        customerId: 'usr-customer-2',
        customerName: 'Rahul Deshmukh',
        customerAddress: 'B-12, Prabhat Road, Pune',
        city: 'Pune',
        storeId: 'store-4',
        storeName: 'Chitale Dairy',
        totalAmount: 260,
        itemCount: 2,
        currentEtaMinutes: 18,
        status: 'RESCUED',
        isMultiCategory: false,
        orderNumberForCustomer: 2,
        createdAt: '35 mins ago',
        updatedAt: '12 mins ago'
      },
      {
        id: 'ORD-98199',
        customerId: 'usr-customer-1',
        customerName: 'Aishwarya Rao',
        customerAddress: 'Indiranagar, Bengaluru',
        city: 'Bengaluru',
        storeId: 'store-2',
        storeName: 'Kamakshi Ayurvedic',
        totalAmount: 360,
        itemCount: 1,
        currentEtaMinutes: 22,
        status: 'DELIVERING',
        isMultiCategory: false,
        orderNumberForCustomer: 2,
        createdAt: '42 mins ago',
        updatedAt: '15 mins ago'
      },
      {
        id: 'ORD-98188',
        customerId: 'usr-customer-2',
        customerName: 'Rahul Deshmukh',
        customerAddress: 'Station Rd, Jaipur',
        city: 'Jaipur',
        storeId: 'store-5',
        storeName: 'Rawat Mishthan Bhandar',
        totalAmount: 180,
        itemCount: 2,
        currentEtaMinutes: 38,
        status: 'AT_RISK',
        isMultiCategory: false,
        orderNumberForCustomer: 1,
        createdAt: '12 mins ago',
        updatedAt: '2 mins ago'
      }
    ];

    // 5. SEED ORDER ITEMS
    this.orderItems = [
      {
        id: 'item-1',
        orderId: 'ORD-98214',
        productId: 'prod-101',
        productName: 'Country Artisan Sourdough Loaf',
        quantity: 2,
        unitPrice: 195,
        substitutionPreference: 'allow-smart-sub',
        status: 'CONFIRMED'
      },
      {
        id: 'item-2',
        orderId: 'ORD-98214',
        productId: 'prod-102',
        productName: 'Signature Red Velvet Cupcake',
        quantity: 1,
        unitPrice: 110,
        substitutionPreference: 'auto-refund',
        status: 'CONFIRMED'
      },
      {
        id: 'item-3',
        orderId: 'ORD-98215',
        productId: 'prod-301',
        productName: 'Hydroponic Living Butterhead Lettuce',
        quantity: 2,
        unitPrice: 120,
        substitutionPreference: 'allow-smart-sub',
        status: 'CONFIRMED'
      },
      {
        id: 'item-4',
        orderId: 'ORD-98210',
        productId: 'prod-401',
        productName: 'Original Pune Spiced Bakarwadi',
        quantity: 2,
        unitPrice: 130,
        substitutionPreference: 'auto-refund',
        status: 'CONFIRMED'
      },
      {
        id: 'item-5',
        orderId: 'ORD-98199',
        productId: 'prod-201',
        productName: 'Kottakkal Chyavanaprasham Premium',
        quantity: 1,
        unitPrice: 360,
        substitutionPreference: 'auto-refund',
        status: 'CONFIRMED'
      },
      {
        id: 'item-6',
        orderId: 'ORD-98188',
        productId: 'prod-501',
        productName: 'Authentic Royal Pyaaz Kachori',
        quantity: 2,
        unitPrice: 90,
        substitutionPreference: 'call-me',
        status: 'CONFIRMED'
      }
    ];

    // 6. EVALUATE DETERMINISTIC RISK FOR ALL SEEDED ORDERS
    this.refreshAllOrderRisks();

    // 7. SEED INITIAL RESCUE ACTIONS & OUTCOMES
    this.rescueActions.push({
      id: 'act-101',
      orderId: 'ORD-98210',
      actionType: 'PRIORITY_COURIER_DISPATCH',
      status: 'EXECUTED',
      executedByRole: 'OPERATIONS',
      executedByUserId: 'usr-ops-1',
      details: 'Micro-bundled route assigned to courier on FC Road; delivery time reduced from 35m to 18m.',
      executedAt: '12 mins ago'
    });

    this.rescueOutcomes.push({
      id: 'out-101',
      rescueActionId: 'act-101',
      orderId: 'ORD-98210',
      outcome: 'SUCCESS',
      failurePrevented: true,
      customerSatisfied: true,
      deliveryTimeSavedMins: 17,
      revenueSaved: 260,
      recordedAt: '10 mins ago'
    });

    // 8. SEED SUPPORT TICKETS
    this.supportTickets = [
      {
        id: 'TICK-4401',
        orderId: 'ORD-98215',
        customerId: 'usr-customer-1',
        customerName: 'Aishwarya Rao',
        type: 'Missing/Unavailable Item',
        amount: 240,
        status: 'Open',
        resolutionMinutes: 280,
        auditLog: [
          'Ticket generated via customer app',
          'Ghost inventory identified on Hydroponic Lettuce',
          'Awaiting 30s auto-refund or smart replacement'
        ],
        createdAt: '4 hours ago'
      },
      {
        id: 'TICK-4402',
        orderId: 'ORD-98188',
        customerId: 'usr-customer-2',
        customerName: 'Rahul Deshmukh',
        type: 'Delayed Delivery',
        amount: 90,
        status: 'Auto-Resolved',
        resolutionMinutes: 0.4,
        auditLog: [
          'GPS transit delay detected >15m',
          'System auto-credited ₹50 wallet compensation',
          'Resolved in 24 seconds'
        ],
        createdAt: '1 hour ago'
      }
    ];

    // 9. AUDIT LOG
    this.logAudit({
      userId: 'system',
      userRole: 'ADMIN',
      action: 'SYSTEM_BOOTSTRAP',
      resource: 'database',
      resourceId: 'all',
      metadata: { seededStores: this.stores.length, seededOrders: this.orders.length }
    });
  }

  // Risk Re-evaluation
  public refreshAllOrderRisks() {
    this.riskScores = [];
    this.riskFactors = [];

    for (const order of this.orders) {
      const store = this.stores.find(s => s.id === order.storeId) || this.stores[0];
      const itemsForOrder = this.orderItems.filter(i => i.orderId === order.id);
      const enrichedItems = itemsForOrder.map(it => {
        const prod = this.products.find(p => p.id === it.productId);
        return {
          name: it.productName,
          quantity: it.quantity,
          currentStock: prod ? prod.currentStock : 1,
          ghostRiskScore: prod ? prod.ghostRiskScore : 50
        };
      });

      const riskResult = calculateOrderRisk({
        items: enrichedItems,
        store: {
          rejectionRate: store.rejectionRate,
          inventoryAccuracy: store.inventoryAccuracy,
          isRushMode: store.isRushMode,
          avgPrepTime: store.avgPreparationTime
        },
        currentEtaMinutes: order.currentEtaMinutes,
        itemCount: order.itemCount
      });

      const scoreId = `risk-${order.id}`;
      this.riskScores.push({
        id: scoreId,
        orderId: order.id,
        totalScore: riskResult.totalScore,
        riskLevel: riskResult.riskLevel,
        inventoryRisk: riskResult.factors.inventoryRisk,
        deliveryRisk: riskResult.factors.deliveryRisk,
        storeRisk: riskResult.factors.storeRisk,
        complexityRisk: riskResult.factors.complexityRisk,
        evaluatedAt: new Date().toISOString()
      });

      for (const f of riskResult.factorDetails) {
        this.riskFactors.push({
          id: `fact-${Math.random().toString(36).substr(2, 9)}`,
          riskScoreId: scoreId,
          orderId: order.id,
          factorType: f.type,
          severity: f.severity,
          weight: f.weight,
          description: f.description,
          affectedItem: f.affectedItem
        });
      }

      // Sync order status if high/critical risk
      if (order.status !== 'RESCUED' && order.status !== 'DELIVERED' && order.status !== 'CANCELLED') {
        if (riskResult.totalScore >= 50) {
          order.status = 'AT_RISK';
        }
      }
    }
  }

  // Audit Logging
  public logAudit(entry: Omit<AuditLogEntity, 'id' | 'timestamp'>) {
    this.auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      ...entry,
      timestamp: new Date().toISOString()
    });
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
  }

  // Helper Finders
  public getOrderWithRisk(orderId: string) {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return null;
    const store = this.stores.find(s => s.id === order.storeId);
    const items = this.orderItems.filter(i => i.orderId === orderId);
    const riskScore = this.riskScores.find(r => r.orderId === orderId);
    const factors = this.riskFactors.filter(f => f.orderId === orderId);
    const actions = this.rescueActions.filter(a => a.orderId === orderId);
    const outcomes = this.rescueOutcomes.filter(o => o.orderId === orderId);

    return {
      ...order,
      store,
      items,
      riskScore,
      factors,
      actions,
      outcomes
    };
  }
}

export const db = new DatabaseRepository();
