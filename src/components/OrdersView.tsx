import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  X, 
  Package, 
  Store, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface OrdersViewProps {
  orders: any[];
  onInspectRescue: (orderId: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  orders,
  onInspectRescue
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeOrderDetail, setActiveOrderDetail] = useState<any | null>(null);

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.storeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 lg:p-8 shadow-cream">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#d97706] font-bold uppercase tracking-wider mb-2">
              <ShoppingBag className="w-4 h-4 text-[#d97706]" />
              <span>Full Orders Directory & Detailed Inspector</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a] font-outfit">
              Order Registry & Risk Breakdown
            </h1>
            <p className="mt-2 text-sm text-[#475569] max-w-2xl leading-relaxed">
              Browse all historical and active orders. Inspect underlying items, fulfillment factors, and active rescue interventions.
            </p>
          </div>

          <span className="text-xs font-mono text-[#0f172a] bg-[#fef9e7] px-4 py-2.5 rounded-xl border border-[#ebd99f] shrink-0 font-medium shadow-xs">
            Total Orders in System: <strong className="text-[#d97706] font-bold">{orders.length}</strong>
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#94a3b8] absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search by Order ID, Customer name, Store..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-[#ebd99f] rounded-xl pl-10 pr-3 py-2.5 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#d97706] focus:ring-2 focus:ring-[#d97706]/20 shadow-xs font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter Orders by Status"
          className="bg-white border-2 border-[#ebd99f] text-[#0f172a] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#d97706] shrink-0 shadow-xs font-semibold"
        >
          <option value="all">All Statuses</option>
          <option value="AT_RISK">At Risk</option>
          <option value="RESCUED">Rescued</option>
          <option value="PLACED">Placed</option>
          <option value="DELIVERING">Delivering</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Orders List Table */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 shadow-cream">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#ebd99f] text-[#64748b] font-semibold">
                <th className="pb-3 pl-2 font-outfit">Order ID</th>
                <th className="pb-3 font-outfit">Customer</th>
                <th className="pb-3 font-outfit">Store</th>
                <th className="pb-3 font-outfit">Amount</th>
                <th className="pb-3 font-outfit">Risk Level</th>
                <th className="pb-3 font-outfit">Status</th>
                <th className="pb-3 pr-2 text-right font-outfit">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd99f]/30">
              {filteredOrders.map((order) => {
                const riskLevel = order.riskScore?.riskLevel || 'LOW';
                const score = order.riskScore?.totalScore || 20;

                return (
                  <tr key={order.id} className="hover:bg-[#fef9e7] transition-colors">
                    <td className="py-3 pl-2 font-mono font-bold text-[#0f172a]">{order.id}</td>
                    <td className="py-3 text-[#334155]">
                      <div className="font-bold text-[#0f172a]">{order.customerName}</div>
                      <div className="text-[10px] text-[#64748b]">{order.customerAddress}</div>
                    </td>
                    <td className="py-3 text-[#475569] font-medium">{order.storeName}</td>
                    <td className="py-3 font-mono font-bold text-[#0f172a]">₹{order.totalAmount}</td>
                    <td className="py-3">
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border ${
                        riskLevel === 'CRITICAL'
                          ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]'
                          : riskLevel === 'HIGH'
                          ? 'bg-[#fef3c7] text-[#d97706] border-[#fde68a]'
                          : 'bg-[#d1fae5] text-[#059669] border-[#a7f3d0]'
                      }`}>
                        {score}/100 • {riskLevel}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full border font-bold ${
                        order.status === 'RESCUED'
                          ? 'bg-[#fef9e7] text-[#d97706] border-[#ebd99f]'
                          : order.status === 'AT_RISK'
                          ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]'
                          : 'bg-[#f1f5f9] text-[#475569] border-[#cbd5e1]'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 pr-2 text-right">
                      <button
                        onClick={() => setActiveOrderDetail(order)}
                        className="bg-[#fef9e7] hover:bg-[#fff6dc] text-[#0f172a] hover:text-[#d97706] border border-[#ebd99f] font-bold px-3 py-1 rounded-lg text-xs transition-all shadow-xs"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Order Modal / Slideover (`/orders/[id]`) */}
      {activeOrderDetail && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4 bg-[#0f172a]/50 backdrop-blur-xs">
          <div className="bg-white border-2 border-[#ebd99f] rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#ebd99f]">
              <div>
                <span className="text-xs font-mono font-bold text-[#d97706]">{activeOrderDetail.id}</span>
                <h2 className="text-xl font-extrabold text-[#0f172a] mt-0.5 font-outfit">Order Detail & Risk Breakdown</h2>
              </div>
              <button
                onClick={() => setActiveOrderDetail(null)}
                className="text-[#64748b] hover:text-[#0f172a] p-1.5 hover:bg-[#fef9e7] rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Risk Snapshot */}
            <div className="p-4 bg-[#fef9e7] rounded-2xl border border-[#ebd99f] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#64748b] font-medium">Deterministic Risk Assessment</div>
                <div className="text-xl font-bold font-mono text-[#0f172a] mt-0.5">
                  {activeOrderDetail.riskScore?.totalScore || 20}/100{' '}
                  <span className="text-xs text-[#e11d48] font-bold">
                    ({activeOrderDetail.riskScore?.riskLevel || 'LOW'})
                  </span>
                </div>
              </div>

              {activeOrderDetail.status === 'AT_RISK' && (
                <button
                  onClick={() => {
                    const id = activeOrderDetail.id;
                    setActiveOrderDetail(null);
                    onInspectRescue(id);
                  }}
                  className="bg-gradient-to-r from-[#d97706] to-[#f59e0b] hover:from-[#b45309] hover:to-[#d97706] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all hover:scale-[1.02]"
                >
                  <span>Execute Rescue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Risk Factors */}
            <div>
              <h3 className="text-xs font-bold text-[#0f172a] mb-2 font-outfit">Evaluated Risk Factors:</h3>
              <div className="space-y-2">
                {activeOrderDetail.factors?.length > 0 ? (
                  activeOrderDetail.factors.map((f: any, idx: number) => (
                    <div key={idx} className="p-3 bg-[#fef9e7] rounded-xl text-xs text-[#0f172a] border border-[#ebd99f] flex items-center justify-between">
                      <span className="font-semibold">{f.description}</span>
                      <span className="text-[10px] font-mono text-[#e11d48] uppercase font-bold bg-[#ffe4e6] px-2 py-0.5 rounded-full border border-[#fecdd3]">{f.severity}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-[#64748b] p-3 bg-[#fef9e7] rounded-xl border border-[#ebd99f]">No critical risk factors recorded.</div>
                )}
              </div>
            </div>

            {/* Items */}
            <div>
              <h3 className="text-xs font-bold text-[#0f172a] mb-2 font-outfit">Order Items:</h3>
              <div className="space-y-2">
                {activeOrderDetail.items?.map((it: any) => (
                  <div key={it.id} className="p-3 bg-white rounded-xl text-xs flex justify-between border border-[#ebd99f] shadow-xs">
                    <div>
                      <div className="font-bold text-[#0f172a]">{it.productName}</div>
                      <div className="text-[10px] text-[#64748b]">Qty: {it.quantity} • Sub: {it.substitutionPreference}</div>
                    </div>
                    <div className="font-mono font-bold text-[#0f172a]">₹{it.unitPrice * it.quantity}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#ebd99f] flex justify-end">
              <button
                onClick={() => setActiveOrderDetail(null)}
                className="bg-[#fef9e7] hover:bg-[#fff6dc] text-[#0f172a] border border-[#ebd99f] px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
