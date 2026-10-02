import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Package, 
  Store, 
  HelpCircle, 
  ShieldCheck, 
  Clock, 
  ShoppingBag,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';

interface CustomerRescueViewProps {
  orders: any[];
  currentUser: any;
  onExecuteRescueAction: (orderId: string, actionType: string, details?: string) => Promise<any>;
}

export const CustomerRescueView: React.FC<CustomerRescueViewProps> = ({
  orders,
  currentUser,
  onExecuteRescueAction
}) => {
  // Filter customer's own orders or fallback to customer-1's orders
  const customerOrders = orders.filter(
    o => o.customerId === currentUser?.id || o.customerId === 'usr-customer-1'
  );

  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    customerOrders[0]?.id || ''
  );
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);
  const [interventionFeedback, setInterventionFeedback] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const activeOrder = customerOrders.find(o => o.id === selectedOrderId) || customerOrders[0];

  const handleCustomerAction = async (actionChoice: string, actionType: string, note: string) => {
    if (!activeOrder) return;
    setIsProcessing(true);
    try {
      const res = await onExecuteRescueAction(activeOrder.id, actionType, note);
      setSelectedIntervention(actionChoice);
      setInterventionFeedback(res?.message || 'Your preference was saved and the order updated.');
    } catch (err: any) {
      alert(`Could not complete choice: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 lg:p-8 shadow-cream">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#b45309] font-extrabold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-[#d97706]" />
              <span>Customer Trust & Order Intervention • Journey 1</span>
              <span className="text-[#ebd99f]">•</span>
              <span className="text-[#475569]">Preventing Customer Churn Before Cancellation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] font-heading">
              Customer Order Care & Proactive Rescue
            </h1>
            <p className="mt-2 text-sm text-[#334155] max-w-3xl leading-relaxed font-medium">
              61% of churned NOVA CART customers previously rated the app 4★ or higher. They left because promised products became unavailable after ordering.
              Here, customer-facing interventions resolve inventory drift proactively.
            </p>
          </div>

          <div className="bg-[#fef9e7] p-4 rounded-2xl border-1.5 border-[#ebd99f] text-xs shrink-0 shadow-2xs">
            <span className="text-[#64748b] font-bold block">Logged in as Customer:</span>
            <span className="font-black text-[#0f172a] text-sm font-heading">{currentUser?.name || 'Aishwarya Rao'}</span>
            <span className="text-[11px] text-[#b45309] font-extrabold block">{customerOrders.length} orders on file</span>
          </div>
        </div>
      </div>

      {/* Main Order Selection and Intervention */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Customer Order Selector */}
        <div className="lg:col-span-4 bg-white border-2 border-[#ebd99f] rounded-3xl p-5 space-y-4 shadow-cream">
          <h3 className="text-base font-black text-[#0f172a] flex items-center gap-2 font-heading">
            <ShoppingBag className="w-5 h-5 text-[#d97706]" />
            <span>Select Your Order to Inspect</span>
          </h3>

          <div className="space-y-2.5">
            {customerOrders.map((o) => {
              const isSelected = o.id === activeOrder?.id;
              const isAtRisk = o.status === 'AT_RISK' || (o.riskScore && o.riskScore.totalScore >= 50);

              return (
                <div
                  key={o.id}
                  onClick={() => {
                    setSelectedOrderId(o.id);
                    setSelectedIntervention(null);
                    setInterventionFeedback(null);
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-[#fef9e7] border-2 border-[#d97706] shadow-sm'
                      : 'bg-white border-[#ebd99f] hover:border-[#d97706]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-black text-[#0f172a]">{o.id}</span>
                    <span className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full border ${
                      isAtRisk
                        ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]'
                        : 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                    }`}>
                      {o.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs text-[#0f172a] font-bold">{o.storeName}</div>
                  <div className="flex items-center justify-between text-[11px] text-[#64748b] font-medium">
                    <span>₹{o.totalAmount} • {o.itemCount} items</span>
                    <span className="font-bold text-[#b45309]">ETA: {o.currentEtaMinutes}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Order Detailed Intervention Pad */}
        <div className="lg:col-span-8 space-y-6">
          {activeOrder ? (
            <div className="space-y-6">
              {/* Order Status Header */}
              <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-3 shadow-cream">
                <div className="flex items-center justify-between pb-3 border-b border-[#ebd99f]/60">
                  <div>
                    <span className="text-xs font-mono font-black text-[#d97706]">{activeOrder.id}</span>
                    <h2 className="text-lg font-black text-[#0f172a] mt-0.5 font-heading">Order from {activeOrder.storeName}</h2>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-[#64748b] font-bold">Total Paid</span>
                    <div className="text-xl font-black font-mono text-[#0f172a]">₹{activeOrder.totalAmount}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
                  <div>
                    <span className="text-[#64748b] font-bold">Delivery Address:</span>
                    <div className="text-[#0f172a] mt-0.5 font-medium">{activeOrder.customerAddress}</div>
                  </div>
                  <div>
                    <span className="text-[#64748b] font-bold">Promised ETA:</span>
                    <div className="text-[#0f172a] mt-0.5 font-mono font-black">{activeOrder.currentEtaMinutes} mins</div>
                  </div>
                  <div>
                    <span className="text-[#64748b] font-bold">Order Milestone:</span>
                    <div className="text-[#059669] mt-0.5 font-bold">Order #{activeOrder.orderNumberForCustomer} (72% Tier)</div>
                  </div>
                  <div>
                    <span className="text-[#64748b] font-bold">Current Status:</span>
                    <div className="text-[#d97706] mt-0.5 font-mono font-black">{activeOrder.status}</div>
                  </div>
                </div>
              </div>

              {/* The Journey 1 Intervention Card: Potential Issue Detected */}
              {activeOrder.status === 'AT_RISK' || (activeOrder.riskScore && activeOrder.riskScore.totalScore >= 50) ? (
                <div className="bg-white border-2 border-[#fecdd3] rounded-3xl p-6 space-y-4 shadow-cream">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#ffe4e6] border border-[#fecdd3] flex items-center justify-center text-[#e11d48] shrink-0">
                      <AlertTriangle className="w-6 h-6 animate-pulse text-[#e11d48]" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#b45309] font-black bg-[#fef9e7] px-2.5 py-0.5 rounded-full border border-[#ebd99f]">
                        Proactive Order Intervention
                      </span>
                      <h3 className="text-lg font-black text-[#0f172a] mt-1.5 font-heading">
                        Potential Issue Detected on Your Order
                      </h3>
                      <p className="text-xs text-[#334155] mt-1 leading-relaxed font-medium">
                        {activeOrder.factors?.[0]?.description || 
                          `One or more items in your order may be out of stock on the shelf at ${activeOrder.storeName}.`}
                      </p>
                    </div>
                  </div>

                  {/* Customer Action Choices */}
                  <div className="pt-2 space-y-3">
                    <div className="text-xs font-black text-[#0f172a] font-heading">
                      How would you like NOVA RESCUE to handle this?
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Option 1: Choose Alternative Product */}
                      <button
                        onClick={() =>
                          handleCustomerAction(
                            'substitute',
                            'SUBSTITUTE_ITEM',
                            'Customer approved artisan batch substitute'
                          )
                        }
                        disabled={isProcessing}
                        className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
                          selectedIntervention === 'substitute'
                            ? 'bg-[#fef9e7] border-2 border-[#d97706] text-[#0f172a]'
                            : 'bg-white border-1.5 border-[#ebd99f] hover:border-[#d97706] text-[#334155]'
                        }`}
                      >
                        <div className="text-xs font-black text-[#0f172a] flex items-center justify-between font-heading">
                          <span>1. Choose Alternative Product</span>
                          <Package className="w-4 h-4 text-[#d97706]" />
                        </div>
                        <p className="text-[11px] text-[#475569] font-medium leading-snug">
                          Allow store to replace with fresh equivalent artisanal item (e.g. Multi-grain Sourdough).
                        </p>
                      </button>

                      {/* Option 2: Choose Nearby Store */}
                      <button
                        onClick={() =>
                          handleCustomerAction(
                            'reroute',
                            'REROUTE_NEARBY_STORE',
                            'Customer approved fulfillment from adjacent partner store'
                          )
                        }
                        disabled={isProcessing}
                        className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
                          selectedIntervention === 'reroute'
                            ? 'bg-[#fef9e7] border-2 border-[#d97706] text-[#0f172a]'
                            : 'bg-white border-1.5 border-[#ebd99f] hover:border-[#d97706] text-[#334155]'
                        }`}
                      >
                        <div className="text-xs font-black text-[#0f172a] flex items-center justify-between font-heading">
                          <span>2. Choose Nearby Store</span>
                          <Store className="w-4 h-4 text-[#d97706]" />
                        </div>
                        <p className="text-[11px] text-[#475569] font-medium leading-snug">
                          Reroute order to partner store 300m away with verified live shelf stock.
                        </p>
                      </button>

                      {/* Option 3: Instant 30s Auto-Refund */}
                      <button
                        onClick={() =>
                          handleCustomerAction(
                            'refund',
                            'AUTO_REFUND',
                            'Customer opted for immediate 30s UPI auto-refund'
                          )
                        }
                        disabled={isProcessing}
                        className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
                          selectedIntervention === 'refund'
                            ? 'bg-[#ffe4e6] border-2 border-[#e11d48] text-[#e11d48]'
                            : 'bg-white border-1.5 border-[#fecdd3] hover:border-[#e11d48] text-[#e11d48]'
                        }`}
                      >
                        <div className="text-xs font-black flex items-center justify-between text-[#e11d48] font-heading">
                          <span>3. Instant 30-Sec UPI Refund</span>
                          <RefreshCw className="w-4 h-4 text-[#e11d48]" />
                        </div>
                        <p className="text-[11px] text-[#475569] font-medium leading-snug">
                          Refund item amount instantly to your original payment method without waiting.
                        </p>
                      </button>

                      {/* Option 4: Continue With Risk */}
                      <button
                        onClick={() =>
                          handleCustomerAction(
                            'continue',
                            'EXTEND_ETA',
                            'Customer chose to wait for store manual confirmation'
                          )
                        }
                        disabled={isProcessing}
                        className={`p-4 rounded-2xl border transition-all text-left space-y-1 ${
                          selectedIntervention === 'continue'
                            ? 'bg-[#fef9e7] border-2 border-[#d97706] text-[#0f172a]'
                            : 'bg-white border-1.5 border-[#ebd99f] hover:border-[#d97706] text-[#334155]'
                        }`}
                      >
                        <div className="text-xs font-black text-[#0f172a] flex items-center justify-between font-heading">
                          <span>4. Continue & Wait for Store</span>
                          <Clock className="w-4 h-4 text-[#64748b]" />
                        </div>
                        <p className="text-[11px] text-[#475569] font-medium leading-snug">
                          Keep order as is; store staff will check backroom storage.
                        </p>
                      </button>
                    </div>

                    {interventionFeedback && (
                      <div className="p-4 bg-[#ecfdf5] border-1.5 border-[#a7f3d0] rounded-2xl text-xs text-[#059669] flex items-center gap-2 font-bold shadow-2xs mt-3">
                        <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                        <span>{interventionFeedback}</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white border-2 border-[#a7f3d0] rounded-3xl p-6 flex items-center gap-4 shadow-cream">
                  <div className="w-14 h-14 rounded-2xl bg-[#ecfdf5] border-1.5 border-[#a7f3d0] flex items-center justify-center text-[#059669] shrink-0">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#0f172a] font-heading">Order Verified & Protected</h3>
                    <p className="text-xs text-[#475569] mt-0.5 font-medium">
                      Inventory has been verified by the merchant and delivery courier is on schedule. No intervention needed!
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-12 text-center text-[#64748b] font-medium">
              No orders selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
