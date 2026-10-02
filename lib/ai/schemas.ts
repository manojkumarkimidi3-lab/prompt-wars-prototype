import { z } from 'zod';

export const AIRecommendationSchema = z.object({
  riskExplanation: z.string().min(5),
  recommendedAction: z.enum([
    'SUBSTITUTE_ITEM',
    'REROUTE_NEARBY_STORE',
    'PRIORITY_COURIER_DISPATCH',
    'AUTO_REFUND',
    'EXTEND_ETA',
    'MERCHANT_URGENT_CONFIRM'
  ]),
  reason: z.string().min(5),
  customerMessage: z.string().min(5),
  confidence: z.number().min(0).max(1)
});

export type AIRecommendationOutput = z.infer<typeof AIRecommendationSchema>;

export const StoreIntelligenceSchema = z.object({
  storeHealthSummary: z.string(),
  topRiskProducts: z.array(z.string()),
  catalogueRecommendation: z.string(),
  rushMitigationAdvice: z.string()
});

export type StoreIntelligenceOutput = z.infer<typeof StoreIntelligenceSchema>;
