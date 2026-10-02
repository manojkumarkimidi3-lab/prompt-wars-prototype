import { OrderRiskContext } from './provider';

export function buildRescuePrompt(ctx: OrderRiskContext): string {
  return `You are NOVA RESCUE, an AI decision engine for NOVA CART (620 local stores, 38,500 monthly orders).
Analyze this at-risk order and recommend the optimal intervention.

Order Context:
- Order ID: ${ctx.orderId}
- Store: ${ctx.storeName} (Historical rejection rate: ${ctx.rejectionHistoryPct}%)
- Current Delivery ETA: ${ctx.currentEtaMinutes} mins
- Risk Score: ${ctx.totalRiskScore}/100
- Risk Factors: ${ctx.riskFactors.join(', ')}
- Order Items & Shelf Stock:
${ctx.items.map(i => `  * ${i.name} (Qty: ${i.quantity}, Shelf Stock: ${i.stock}, Ghost Risk: ${i.ghostRisk}%)`).join('\n')}

Allowed Actions:
- 'SUBSTITUTE_ITEM': If an item has low stock/high ghost risk and an artisan substitute exists.
- 'REROUTE_NEARBY_STORE': If the current store has high rejection/out of stock but an adjacent partner within 800m has verified inventory.
- 'PRIORITY_COURIER_DISPATCH': If delay is the primary issue.
- 'AUTO_REFUND': If the customer opted for instant refund or item cannot be substituted.
- 'EXTEND_ETA': If store is in Rush mode.
- 'MERCHANT_URGENT_CONFIRM': If stock status is ambiguous.

Return ONLY a strict JSON object matching this schema without markdown fences:
{
  "riskExplanation": "Concise analysis of failure point",
  "recommendedAction": "ONE_OF_ALLOWED_ACTIONS",
  "reason": "Why this intervention saves the customer and avoids cancellation",
  "customerMessage": "Reassuring, empathetic SMS/app notification to customer",
  "confidence": 0.85
}`;
}

export function buildStoreIntelligencePrompt(store: any): string {
  return `You are NOVA RESCUE Store Intelligence Advisor for ${store.name} (${store.category}, ${store.city}).
Store Metrics:
- Inventory Accuracy: ${store.inventoryAccuracy}%
- Order Rejection Rate: ${store.rejectionRate}%
- Active SKUs: ${store.products?.length || 0}
- Items with Ghost Risk > 40%: ${store.products?.filter((p: any) => p.ghostRiskScore > 40).map((p: any) => p.name).join(', ') || 'None'}

Return ONLY a strict JSON object:
{
  "storeHealthSummary": "Summary of current operational vulnerability",
  "topRiskProducts": ["Product A", "Product B"],
  "catalogueRecommendation": "Concrete recommendation to improve stock synchronization",
  "rushMitigationAdvice": "Actionable step during counter rush hours"
}`;
}
