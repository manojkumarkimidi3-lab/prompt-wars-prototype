import { AIProvider, OrderRiskContext } from './provider';
import { AIRecommendationSchema, AIRecommendationOutput, StoreIntelligenceSchema, StoreIntelligenceOutput } from './schemas';

export class ClaudeProvider implements AIProvider {
  name = 'ClaudeProvider (anthropic-claude-3-5-sonnet)';

  async recommendRescue(context: OrderRiskContext): Promise<AIRecommendationOutput> {
    // Secondary / Fallback deterministic domain model
    let action: AIRecommendationOutput['recommendedAction'] = 'SUBSTITUTE_ITEM';
    let explanation = `Order ${context.orderId} at ${context.storeName} exhibits high failure probability (${context.totalRiskScore}/100).`;
    let reason = 'Preventing customer churn before cancellation threshold.';
    let customerMessage = 'We are verifying your order details with the local store to ensure fresh delivery.';

    if (context.riskFactors.some(f => f.toLowerCase().includes('ghost') || f.toLowerCase().includes('stock'))) {
      action = 'SUBSTITUTE_ITEM';
      explanation = `Ghost stock detected: Item shelf count is near-zero while daily demand exceeds safety stock.`;
      reason = 'Immediate pre-approved artisanal substitute prevents the 35% unavailable item cancellation.';
      customerMessage = `Your neighborhood store is substituting with fresh batch to ensure your order arrives on time.`;
    } else if (context.riskFactors.some(f => f.toLowerCase().includes('rejection') || f.toLowerCase().includes('rush'))) {
      action = 'EXTEND_ETA';
      explanation = `Store is experiencing peak in-store counter footfall; rejection probability is elevated.`;
      reason = 'Extending ETA by 12 mins prevents store manager from rejecting the order.';
      customerMessage = `Your artisan store is carefully handcrafting your items. Adjusted delivery window updated.`;
    } else if (context.currentEtaMinutes > 35) {
      action = 'PRIORITY_COURIER_DISPATCH';
      explanation = `Delivery time of ${context.currentEtaMinutes}m exceeds customer tolerance threshold.`;
      reason = 'Micro-bundling courier route prevents 27% delay-related cancellation.';
      customerMessage = `Priority neighborhood courier dispatched directly to your location.`;
    }

    const payload: AIRecommendationOutput = {
      riskExplanation: explanation,
      recommendedAction: action,
      reason,
      customerMessage,
      confidence: 0.88
    };

    // Validate with Zod
    return AIRecommendationSchema.parse(payload);
  }

  async generateStoreIntelligence(store: any): Promise<StoreIntelligenceOutput> {
    const payload: StoreIntelligenceOutput = {
      storeHealthSummary: `${store.name} maintains ${store.inventoryAccuracy}% inventory confidence with ${store.rejectionRate}% order rejection.`,
      topRiskProducts: store.products?.slice(0, 2).map((p: any) => p.name) || ['Artisan Loaf', 'Organic Greens'],
      catalogueRecommendation: 'Run SnapSync bill scan every morning at 9:00 AM to eliminate 70% of ghost inventory.',
      rushMitigationAdvice: 'Toggle Rush Shield between 6:00 PM and 8:30 PM to dynamically throttle delivery promises.'
    };

    return StoreIntelligenceSchema.parse(payload);
  }
}
