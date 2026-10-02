import { AIRecommendationOutput, StoreIntelligenceOutput } from './schemas';

export interface OrderRiskContext {
  orderId: string;
  customerName: string;
  storeName: string;
  items: Array<{ name: string; quantity: number; stock: number; ghostRisk: number }>;
  totalRiskScore: number;
  riskFactors: string[];
  currentEtaMinutes: number;
  rejectionHistoryPct: number;
}

export interface AIProvider {
  name: string;
  recommendRescue(context: OrderRiskContext): Promise<AIRecommendationOutput>;
  generateStoreIntelligence(storeContext: any): Promise<StoreIntelligenceOutput>;
}
