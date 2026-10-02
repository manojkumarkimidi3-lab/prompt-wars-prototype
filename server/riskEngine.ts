export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface DeterministicRiskFactors {
  inventoryRisk: number; // 0 - 100
  deliveryRisk: number;  // 0 - 100
  storeRisk: number;     // 0 - 100
  complexityRisk: number; // 0 - 100
}

export interface RiskEvaluationResult {
  totalScore: number; // 0 - 100
  riskLevel: RiskLevel;
  factors: DeterministicRiskFactors;
  weights: {
    inventoryWeight: number;
    deliveryWeight: number;
    storeWeight: number;
    complexityWeight: number;
  };
  factorDetails: Array<{
    type: 'INVENTORY' | 'STORE' | 'DELIVERY' | 'COMPLEXITY';
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    weight: number;
    description: string;
    affectedItem?: string;
  }>;
  isPrototypeSimulation: boolean;
}

export interface RiskWeightsConfig {
  inventoryWeight: number; // default: 0.35 (Ghost stock accounts for 35% of cancellations)
  deliveryWeight: number;  // default: 0.25 (Delays account for 27% of cancellations)
  storeWeight: number;     // default: 0.25 (Rejections account for 18% of cancellations)
  complexityWeight: number; // default: 0.15 (Items count, peak hour congestion)
}

export const defaultRiskWeights: RiskWeightsConfig = {
  inventoryWeight: 0.35,
  deliveryWeight: 0.25,
  storeWeight: 0.25,
  complexityWeight: 0.15
};

/**
 * Deterministic Order Risk Engine
 * Calculates multi-factor risk without calling an LLM.
 * Configurable weights reflect empirical case failure distributions.
 */
export function calculateOrderRisk(
  order: {
    items: Array<{ name: string; quantity: number; currentStock: number; ghostRiskScore: number }>;
    store: { rejectionRate: number; inventoryAccuracy: number; isRushMode: boolean; avgPrepTime: number };
    currentEtaMinutes: number;
    itemCount: number;
  },
  customWeights: RiskWeightsConfig = defaultRiskWeights
): RiskEvaluationResult {
  const factorDetails: RiskEvaluationResult['factorDetails'] = [];

  // 1. INVENTORY RISK CALCULATION
  // Based on item shelf stock vs order quantity and product ghost risk
  let totalItemRisk = 0;
  for (const item of order.items) {
    let itemRisk = item.ghostRiskScore;
    if (item.currentStock < item.quantity) {
      itemRisk = 95; // Extreme stockout
      factorDetails.push({
        type: 'INVENTORY',
        severity: 'CRITICAL',
        weight: customWeights.inventoryWeight,
        description: `Severe stockout: Requested ${item.quantity} units of "${item.name}", shelf has only ${item.currentStock}.`,
        affectedItem: item.name
      });
    } else if (item.currentStock <= 3) {
      itemRisk = Math.max(itemRisk, 75);
      factorDetails.push({
        type: 'INVENTORY',
        severity: 'HIGH',
        weight: customWeights.inventoryWeight,
        description: `Low buffer stock: Only ${item.currentStock} units left of "${item.name}" (Ghost Stock Risk: ${item.ghostRiskScore}%).`,
        affectedItem: item.name
      });
    } else if (item.ghostRiskScore > 45) {
      factorDetails.push({
        type: 'INVENTORY',
        severity: 'MEDIUM',
        weight: customWeights.inventoryWeight,
        description: `Moderate inventory drift for "${item.name}" (last verified > 4 hours ago).`,
        affectedItem: item.name
      });
    }
    totalItemRisk += itemRisk;
  }
  const avgInventoryRisk = order.items.length > 0 ? Math.round(totalItemRisk / order.items.length) : 20;

  // 2. STORE RISK CALCULATION
  // Based on historical rejection rate, store inventory accuracy, and active rush mode
  let storeRiskCalc = (order.store.rejectionRate * 2.5) + ((100 - order.store.inventoryAccuracy) * 0.8);
  if (order.store.isRushMode) {
    storeRiskCalc += 25; // Rush mode increases load
    factorDetails.push({
      type: 'STORE',
      severity: 'HIGH',
      weight: customWeights.storeWeight,
      description: `Store is in active Rush Mode (walk-in counter congestion). Order rejection risk is elevated.`
    });
  } else if (order.store.rejectionRate > 12) {
    factorDetails.push({
      type: 'STORE',
      severity: 'MEDIUM',
      weight: customWeights.storeWeight,
      description: `Store exhibits above-average rejection rate (${order.store.rejectionRate}% historically during peak hours).`
    });
  }
  const storeRisk = Math.min(100, Math.round(storeRiskCalc));

  // 3. DELIVERY RISK CALCULATION
  // Based on current ETA vs baseline target (25 min)
  let deliveryRisk = 15;
  if (order.currentEtaMinutes > 40) {
    deliveryRisk = 90;
    factorDetails.push({
      type: 'DELIVERY',
      severity: 'CRITICAL',
      weight: customWeights.deliveryWeight,
      description: `Severe transit delay: Current ETA is ${order.currentEtaMinutes} mins (crosses 37m churn threshold).`
    });
  } else if (order.currentEtaMinutes > 30) {
    deliveryRisk = 65;
    factorDetails.push({
      type: 'DELIVERY',
      severity: 'HIGH',
      weight: customWeights.deliveryWeight,
      description: `Moderate transit risk: ETA is ${order.currentEtaMinutes} mins. May require priority dispatch.`
    });
  } else if (order.currentEtaMinutes > 25) {
    deliveryRisk = 40;
  }

  // 4. COMPLEXITY RISK CALCULATION
  // More items = higher pick failure rate
  let complexityRisk = 10;
  if (order.itemCount >= 4) {
    complexityRisk = 60;
    factorDetails.push({
      type: 'COMPLEXITY',
      severity: 'MEDIUM',
      weight: customWeights.complexityWeight,
      description: `Multi-item basket (${order.itemCount} units) across multiple store sections.`
    });
  }

  // Deterministic Weighted Formula
  const weightedScore = Math.round(
    (avgInventoryRisk * customWeights.inventoryWeight) +
    (deliveryRisk * customWeights.deliveryWeight) +
    (storeRisk * customWeights.storeWeight) +
    (complexityRisk * customWeights.complexityWeight)
  );

  const totalScore = Math.min(100, Math.max(0, weightedScore));

  let riskLevel: RiskLevel = 'LOW';
  if (totalScore >= 75) {
    riskLevel = 'CRITICAL';
  } else if (totalScore >= 50) {
    riskLevel = 'HIGH';
  } else if (totalScore >= 25) {
    riskLevel = 'MEDIUM';
  }

  return {
    totalScore,
    riskLevel,
    factors: {
      inventoryRisk: avgInventoryRisk,
      deliveryRisk,
      storeRisk,
      complexityRisk
    },
    weights: customWeights,
    factorDetails,
    isPrototypeSimulation: true
  };
}
