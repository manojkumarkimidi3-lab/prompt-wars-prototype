import React, { useState } from 'react';
import { 
  Zap, 
  ShieldAlert, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  RefreshCw, 
  ArrowRight, 
  Clock, 
  Store, 
  Package, 
  DollarSign, 
  Send,
  Check,
  ShieldCheck,
  RotateCcw,
  Truck
} from 'lucide-react';
import type { AIRecommendationOutput } from '../../lib/ai/schemas';

interface RescueWorkflowViewProps {
  orders: any[];
  initialSelectedOrderId?: string;
  onExecuteRescueAction: (orderId: string, actionType: string, details?: string) => Promise<any>;
}

export const RescueWorkflowView: React.FC<RescueWorkflowViewProps> = ({
  orders,
  initialSelectedOrderId,
  onExecuteRescueAction
}) => {
  // Only show at-risk or active orders
  const atRiskList = orders.filter(
    o => o.status === 'AT_RISK' || (o.riskScore && o.riskScore.totalScore >= 35)
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    initialSelectedOrderId || atRiskList[0]?.id || orders[0]?.id
  );
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendationOutput | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [executionMessage, setExecutionMessage] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const currentOrder = orders.find(o => o.id === selectedOrderId) || atRiskList[0] || orders[0];

  const handleRequestAIRecommendation = async () => {
    if (!currentOrder) return;
    setIsAiLoading(true);
    setExecutionMessage(null);

    try {
      const res = await fetch('/api/rescue/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test_token_ops'
        },
        body: JSON.stringify({ orderId: currentOrder.id })
      });

      if (res.ok) {
        const data = await res.json();
        setAiRecommendation(data.recommendation);
      } else {
        alert('Could not generate AI recommendation');
      }
    } catch (err) {
      console.error('Failed to fetch AI recommendation', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleExecuteAction = async (actionType: string) => {
    if (!currentOrder) return;
    setIsExecuting(true);
    try {
      const result = await onExecuteRescueAction(currentOrder.id, actionType);
      setExecutionMessage(result?.message || `Executed ${actionType} successfully!`);
    } catch (err: any) {
      alert(`Action execution failed: ${err.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  if (!currentOrder) {
    return (
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-12 text-center text-[#64748b] shadow-cream">
        <CheckCircle2 className="w-12 h-12 text-[#059669] mx-auto mb-3" />
        <h3 className="text-base font-extrabold text-[#0f172a] font-heading">No At-Risk Orders in Pipeline!</h3>
        <p className="text-xs text-[#64748b] mt-1 font-medium">All orders are running with healthy fulfillment indices.</p>
      </div>
    );
  }

  const riskScore = currentOrder.riskScore?.totalScore || 65;
  const riskLevel = currentOrder.riskScore?.riskLevel || 'HIGH';

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 lg:p-8 shadow-cream">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#b45309] font-extrabold uppercase tracking-wider mb-2">
              <Zap className="w-4 h-4 text-[#d97706]" />
              <span>Core Operations Workflow · Journey 2</span>
              <span className="text-[#ebd99f]">·</span>
              <span className="text-[#475569]">Deterministic Detection + Structured AI Rescue</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] font-heading">
              Operations Rescue Hub
            </h1>
            <p className="mt-2 text-sm text-[#334155] max-w-3xl leading-relaxed font-medium">
              Intercept at-risk orders before customer cancellation occurs. Review deterministic factor breakdowns, 
              request Zod-validated Gemini recommendations, and execute allowed rescue actions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Rescue Workspace: Left Queue (4 cols) vs Right Detail & Action Panel (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* At-Risk Orders Queue */}
        <div className="lg:col-span-4 bg-white border-2 border-[#ebd99f] rounded-3xl p-4 space-y-3 shadow-cream">
          <div className="flex items-center justify-between pb-2 border-b border-[#ebd99f]/60">
            <span className="text-xs font-black text-[#0f172a] flex items-center gap-1.5 font-heading">
              <AlertTriangle className="w-3.5 h-3.5 text-[#e11d48]" />
              <span>At-Risk Queue</span>
            </span>
            <span className="text-[10px] font-mono text-[#b45309] font-extrabold">
              {atRiskList.length} requiring intervention
            </span>
          </div>

          <div className="space-y-2 max-h-[640px] overflow-y-auto pr-1">
            {atRiskList.map((order) => {
              const isSelected = order.id === currentOrder.id;
              const oRisk = order.riskScore?.riskLevel || 'MEDIUM';
              const oScore = order.riskScore?.totalScore || 45;

              return (
                <div
                  key={order.id}
                  onClick={() => {
                    setSelectedOrderId(order.id);
                    setAiRecommendation(null);
                    setExecutionMessage(null);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#fef9e7] border-2 border-[#d97706] shadow-sm'
                      : 'bg-white border-[#ebd99f] hover:border-[#d97706]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black text-[#0f172a]">{order.id}</span>
                    <span className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full border ${
                      oRisk === 'CRITICAL'
                        ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]'
                        : 'bg-[#fef3c7] text-[#b45309] border-[#ebd99f]'
                    }`}>
                      {oScore}/100 · {oRisk}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-extrabold text-[#0f172a] font-heading">{order.customerName}</div>
                    <div className="text-[11px] text-[#64748b]">{order.storeName}</div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#64748b] pt-1 border-t border-[#ebd99f]/40">
                    <span className="text-[#b45309] font-mono font-bold">ETA: {order.currentEtaMinutes}m</span>
                    <span className="capitalize text-[#475569] font-bold">{order.status.replace('_', ' ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Order Detailed Inspector & Rescue Action Pad */}
        <div className="lg:col-span-8 space-y-6">
          {/* Order Snapshot & Deterministic Risk Card */}
          <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#ebd99f]/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-mono font-black text-[#d97706]">{currentOrder.id}</span>
                  <span className={`text-xs font-mono uppercase font-black px-2.5 py-0.5 rounded-full border ${
                    riskLevel === 'CRITICAL'
                      ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]'
                      : 'bg-[#fef3c7] text-[#b45309] border-[#ebd99f]'
                  }`}>
                    {riskLevel} RISK ({riskScore}/100)
                  </span>
                  <span className="text-xs font-mono uppercase text-[#64748b] font-bold">
                    Status: {currentOrder.status}
                  </span>
                </div>
                <div className="text-xs text-[#334155] mt-1 font-medium">
                  Customer: <strong className="text-[#0f172a] font-bold">{currentOrder.customerName}</strong> · {currentOrder.customerAddress}
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs text-[#64748b] font-bold">Delivery Window</span>
                <div className="text-xl font-black font-mono text-[#0f172a]">{currentOrder.currentEtaMinutes} mins</div>
              </div>
            </div>

            {/* Risk Factors Breakdown Table */}
            <div>
              <div className="text-xs font-black text-[#0f172a] mb-2 font-heading">
                Deterministic Risk Factors Triggered:
              </div>
              <div className="space-y-2">
                {currentOrder.factors && currentOrder.factors.length > 0 ? (
                  currentOrder.factors.map((factor: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#fef9e7] rounded-xl border border-[#ebd99f] flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-extrabold text-[#b45309] bg-white px-2 py-0.5 rounded-full border border-[#ebd99f]">
                            {factor.factorType}
                          </span>
                          <span className="font-bold text-[#0f172a]">{factor.description}</span>
                        </div>
                        {factor.affectedItem && (
                          <div className="text-[11px] text-[#475569] pl-2 font-medium">
                            Affected Item: <strong className="text-[#e11d48]">{factor.affectedItem}</strong>
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border shrink-0 font-black ${
                        factor.severity === 'CRITICAL'
                          ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]'
                          : 'bg-[#fef3c7] text-[#b45309] border-[#ebd99f]'
                      }`}>
                        {factor.severity}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#64748b] p-2">Standard operational profile.</div>
                )}
              </div>
            </div>

            {/* Items in this order */}
            <div>
              <div className="text-xs font-black text-[#0f172a] mb-2 font-heading">Order Items & Shelf Status:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentOrder.items?.map((it: any) => (
                  <div key={it.id} className="p-3 bg-[#fef9e7] rounded-xl border border-[#ebd99f] text-xs flex justify-between">
                    <div>
                      <div className="font-bold text-[#0f172a]">{it.productName}</div>
                      <div className="text-[10px] text-[#64748b] font-medium">Qty: {it.quantity} · Sub Pref: {it.substitutionPreference}</div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-[#0f172a]">₹{it.unitPrice * it.quantity}</span>
                      <div className={`text-[10px] font-mono font-bold ${it.status === 'SUBSTITUTED' ? 'text-[#d97706]' : 'text-[#64748b]'}`}>
                        {it.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* AI Structured Recommendation Box */}
          <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#d97706]" />
                <h3 className="text-sm font-black text-[#0f172a] font-heading">
                  AI Rescue Decision Recommendation (Gemini 3.8 Flash · Zod Validated)
                </h3>
              </div>

              <button
                onClick={handleRequestAIRecommendation}
                disabled={isAiLoading}
                className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 disabled:opacity-50 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/25"
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Evaluating via Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate AI Recommendation</span>
                  </>
                )}
              </button>
            </div>

            {aiRecommendation ? (
              <div className="bg-[#fef9e7] border-1.5 border-[#ebd99f] rounded-2xl p-5 space-y-4 animate-in fade-in duration-200 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#ebd99f]">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748b] font-bold">
                      Recommended Action:
                    </span>
                    <span className="font-mono font-black text-[#d97706] text-sm bg-white px-3 py-1 rounded-full border border-[#ebd99f] shadow-2xs">
                      {aiRecommendation.recommendedAction}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-[#0f172a] font-black">
                    Confidence: {(aiRecommendation.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[#64748b] font-bold">Risk Explanation:</span>
                    <p className="text-[#0f172a] mt-0.5 leading-relaxed font-medium">{aiRecommendation.riskExplanation}</p>
                  </div>
                  <div>
                    <span className="text-[#64748b] font-bold">Intervention Rationale:</span>
                    <p className="text-[#0f172a] mt-0.5 leading-relaxed font-medium">{aiRecommendation.reason}</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-[#ebd99f]">
                    <span className="text-[11px] text-[#b45309] font-bold block mb-1">
                      Customer SMS/App Reassurance Message:
                    </span>
                    <p className="text-xs text-[#334155] italic font-medium">“{aiRecommendation.customerMessage}”</p>
                  </div>
                </div>

                {/* Quick 1-Click Execute AI Action */}
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => handleExecuteAction(aiRecommendation.recommendedAction)}
                    disabled={isExecuting}
                    className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-500/25 transition-all hover:scale-[1.01]"
                  >
                    <Check className="w-4 h-4 text-white" />
                    <span>Execute AI Recommended Action ({aiRecommendation.recommendedAction})</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-[#fef9e7] rounded-2xl border border-[#ebd99f] text-center text-xs text-[#64748b] space-y-1">
                <p className="font-medium">Click "Generate AI Recommendation" to evaluate this failure profile against allowed rescue policies.</p>
                <p className="text-[11px] text-[#94a3b8]">Enforces strict schema validation before any action proposal.</p>
              </div>
            )}
          </div>

          {/* Action Execution Palette: All Allowed Rescue Operations */}
          <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
            <h3 className="text-xs font-mono uppercase tracking-wider text-[#b45309] font-black">
              Execute Allowed Rescue Actions (Audit Logged):
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleExecuteAction('SUBSTITUTE_ITEM')}
                disabled={isExecuting}
                className="bg-[#fef9e7] hover:bg-white border-1.5 border-[#ebd99f] hover:border-[#d97706] p-4 rounded-2xl text-left transition-all space-y-1 group shadow-2xs hover:shadow-cream"
              >
                <div className="text-xs font-black text-[#0f172a] group-hover:text-[#d97706] flex items-center justify-between font-heading">
                  <span>1. Substitute Item</span>
                  <Package className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#d97706]" />
                </div>
                <p className="text-[11px] text-[#475569] leading-snug font-medium">
                  Replaces out-of-stock item with pre-approved artisan equivalent.
                </p>
              </button>

              <button
                onClick={() => handleExecuteAction('REROUTE_NEARBY_STORE')}
                disabled={isExecuting}
                className="bg-[#fef9e7] hover:bg-white border-1.5 border-[#ebd99f] hover:border-[#d97706] p-4 rounded-2xl text-left transition-all space-y-1 group shadow-2xs hover:shadow-cream"
              >
                <div className="text-xs font-black text-[#0f172a] group-hover:text-[#d97706] flex items-center justify-between font-heading">
                  <span>2. Reroute Nearby Store</span>
                  <Store className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#d97706]" />
                </div>
                <p className="text-[11px] text-[#475569] leading-snug font-medium">
                  Fulfills from adjacent partner shop within 800m with verified shelf stock.
                </p>
              </button>

              <button
                onClick={() => handleExecuteAction('PRIORITY_COURIER_DISPATCH')}
                disabled={isExecuting}
                className="bg-[#fef9e7] hover:bg-white border-1.5 border-[#ebd99f] hover:border-[#d97706] p-4 rounded-2xl text-left transition-all space-y-1 group shadow-2xs hover:shadow-cream"
              >
                <div className="text-xs font-black text-[#0f172a] group-hover:text-[#d97706] flex items-center justify-between font-heading">
                  <span>3. Priority Courier</span>
                  <Truck className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#d97706]" />
                </div>
                <p className="text-[11px] text-[#475569] leading-snug font-medium">
                  Micro-routes express delivery to prevent delay-related cancellation.
                </p>
              </button>

              <button
                onClick={() => handleExecuteAction('EXTEND_ETA')}
                disabled={isExecuting}
                className="bg-[#fef9e7] hover:bg-white border-1.5 border-[#ebd99f] hover:border-[#d97706] p-4 rounded-2xl text-left transition-all space-y-1 group shadow-2xs hover:shadow-cream"
              >
                <div className="text-xs font-black text-[#0f172a] group-hover:text-[#d97706] flex items-center justify-between font-heading">
                  <span>4. Extend ETA (+12m)</span>
                  <Clock className="w-3.5 h-3.5 text-[#64748b] group-hover:text-[#d97706]" />
                </div>
                <p className="text-[11px] text-[#475569] leading-snug font-medium">
                  Engages Rush Shield to protect store counter from rejecting order.
                </p>
              </button>

              <button
                onClick={() => handleExecuteAction('AUTO_REFUND')}
                disabled={isExecuting}
                className="bg-[#ffe4e6] hover:bg-white border-1.5 border-[#fecdd3] hover:border-[#e11d48] p-4 rounded-2xl text-left transition-all space-y-1 group shadow-2xs hover:shadow-cream"
              >
                <div className="text-xs font-black text-[#e11d48] flex items-center justify-between font-heading">
                  <span>5. Instant Auto-Refund</span>
                  <RotateCcw className="w-3.5 h-3.5 text-[#e11d48]" />
                </div>
                <p className="text-[11px] text-[#334155] leading-snug font-medium">
                  Executes 30-second NPCI UPI reversal instead of 9.2h dispute backlog.
                </p>
              </button>
            </div>

            {executionMessage && (
              <div className="p-4 bg-[#ecfdf5] border-1.5 border-[#a7f3d0] rounded-2xl text-xs text-[#059669] flex items-center gap-2 font-bold shadow-2xs">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span>{executionMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
