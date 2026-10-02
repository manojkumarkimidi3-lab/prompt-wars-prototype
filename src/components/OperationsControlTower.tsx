import React, { useState } from 'react';
import { 
  Truck, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Zap, 
  ShieldCheck, 
  User, 
  DollarSign, 
  HelpCircle,
  ArrowRight,
  Route,
  Share2
} from 'lucide-react';
import type { MultiStoreOrder, SupportTicket } from '../types';

interface OperationsControlTowerProps {
  orders: MultiStoreOrder[];
  tickets: SupportTicket[];
  onOrderAction: (orderId: string, action: string) => void;
  onAutoRefund: (ticketId: string) => void;
}

export const OperationsControlTower: React.FC<OperationsControlTowerProps> = ({
  orders,
  tickets,
  onOrderAction,
  onAutoRefund
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'dispatch' | 'refunds'>('dispatch');
  const [refundingId, setRefundingId] = useState<string | null>(null);

  const handleInstantRefund = async (ticketId: string) => {
    setRefundingId(ticketId);
    try {
      await onAutoRefund(ticketId);
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
              <Truck className="w-4 h-4" />
              <span>Operations Control & Dispatch Tower</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Live Real-Time Fulfillment Mesh</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Micro-Route Bundler & 30-Second Instant Refund Desk
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-3xl leading-relaxed">
              Delivery delays (37 min avg) drove 27% of cancellations, while 5,900 customer support tickets suffered a 9.2-hour resolution wait.
              Operations Tower batches adjacent local merchant pickups and automates instant UPI refunds for missing items.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 shrink-0">
            <button
              onClick={() => setActiveSubTab('dispatch')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeSubTab === 'dispatch'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              1. Route Dispatch ({orders.length} Active)
            </button>
            <button
              onClick={() => setActiveSubTab('refunds')}
              className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                activeSubTab === 'refunds'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              2. Auto-Refund Desk ({tickets.filter(t => t.status === 'Open').length} Pending)
            </button>
          </div>
        </div>
      </div>

      {/* Operational Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Bundled Courier Trips</div>
          <div className="text-2xl font-black text-amber-400 font-mono mt-1">68%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Pickups batched within 800m store radius
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Delivery Time Reduction</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">37m → 24m</div>
          <div className="text-[11px] text-slate-500 mt-1">
            -13 mins average per neighborhood order
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Refund Resolution Time</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">24 seconds</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Down from 9.2 hours manual backlog
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-xs text-slate-400">Customer CSAT Post-Refund</div>
          <div className="text-2xl font-black text-white font-mono mt-1">94%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Instant UPI reversal protects customer loyalty
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: LIVE ROUTE DISPATCH & MICRO-BUNDLING */}
      {activeSubTab === 'dispatch' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Route className="w-4 h-4 text-amber-400" />
                  <span>Active Neighborhood Dispatch Queue</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Orders combining multiple stores are automatically batched to minimize delivery delay and rider trips.
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">
                {orders.length} Active Dispatches
              </span>
            </div>

            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {order.id}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{order.customerName}</span>
                          {order.isMultiCategory && (
                            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              Multi-Store Basket (2.8x Moat)
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          <span>{order.customerAddress}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs shrink-0">
                      <div>
                        <span className="text-slate-500">Bill:</span>{' '}
                        <span className="font-mono font-bold text-white">₹{order.totalAmount}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Est. Delivery:</span>{' '}
                        <span className="font-mono font-bold text-amber-400">{order.deliveryTimeEst} mins</span>
                      </div>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                        order.deliveryStatus === 'delivered'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : order.deliveryStatus === 'delivering'
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                          : order.deliveryStatus === 'rider_assigned'
                          ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}>
                        {order.deliveryStatus.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Bundled Store Stops Pipeline */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Synchronized Micro-Route Stops ({order.storesInvolved.length} merchants in 1 run):</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {order.storesInvolved.map((storeStop, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-900/90 border border-slate-800/80 rounded-lg p-2.5 flex items-center justify-between text-xs"
                        >
                          <div>
                            <div className="font-semibold text-slate-200">
                              Stop {idx + 1}: {storeStop.storeName}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Prep: {storeStop.prepTimeMinutes}m • Status: {storeStop.status}
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            Verified
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items in order */}
                  <div className="pt-2 text-xs text-slate-400 flex flex-wrap gap-2">
                    {order.items.map((it, idx) => (
                      <span key={idx} className="bg-slate-900 px-2 py-1 rounded text-[11px] text-slate-300">
                        {it.product.name} × {it.quantity} ({it.store.name.split(' ')[0]})
                      </span>
                    ))}
                  </div>

                  {/* Interactive Status Step Actions */}
                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between flex-wrap gap-2 text-xs">
                    <div className="text-[11px] text-slate-500 font-mono">
                      Bundle ID: {order.routeBundleId || 'SINGLE-STOP'}
                    </div>

                    <div className="flex items-center gap-2">
                      {order.deliveryStatus === 'placed' && (
                        <button
                          onClick={() => onOrderAction(order.id, 'batch')}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1 rounded font-medium text-xs transition-colors"
                        >
                          Bundle Nearby Route
                        </button>
                      )}
                      {(order.deliveryStatus === 'placed' || order.deliveryStatus === 'batching') && (
                        <button
                          onClick={() => onOrderAction(order.id, 'assign_rider')}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1 rounded text-xs transition-colors shadow-sm"
                        >
                          Assign Neighborhood Rider
                        </button>
                      )}
                      {order.deliveryStatus === 'rider_assigned' && (
                        <button
                          onClick={() => onOrderAction(order.id, 'dispatch')}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 py-1 rounded text-xs transition-colors shadow-sm"
                        >
                          Mark Out for Delivery
                        </button>
                      )}
                      {order.deliveryStatus === 'delivering' && (
                        <button
                          onClick={() => onOrderAction(order.id, 'deliver')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-1 rounded text-xs transition-colors shadow-sm"
                        >
                          Confirm Delivery Complete
                        </button>
                      )}
                      {order.deliveryStatus === 'delivered' && (
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Delivered in {order.deliveryTimeEst} mins</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INSTANT 30-SECOND AUTO-REFUND DESK */}
      {activeSubTab === 'refunds' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>30-Second Instant Auto-Refund Desk</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Refund complaints (29% of 5,900 monthly tickets) previously took 9.2 hours to resolve. 
                  Nexus OS cross-references merchant ghost stock logs and executes immediate NPCI UPI reversals in 24 seconds.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                UPI Gateway Live
              </span>
            </div>

            <div className="space-y-4">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  className={`bg-slate-950 border rounded-xl p-5 transition-all space-y-3 ${
                    ticket.status === 'Auto-Resolved'
                      ? 'border-emerald-500/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-900">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {ticket.id}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {ticket.customerName}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {ticket.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-mono font-bold text-white text-sm">
                        ₹{ticket.amount}
                      </span>
                      <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${
                        ticket.status === 'Auto-Resolved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {ticket.details}
                  </p>

                  {/* Audit Trail & Execution */}
                  <div className="pt-2 border-t border-slate-900/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                    <div className="text-[11px] text-slate-400 space-y-1">
                      {ticket.auditLog.map((log, idx) => (
                        <div key={idx} className="flex items-center gap-1.5">
                          <span className="text-amber-400 text-xs">•</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>

                    <div className="shrink-0">
                      {ticket.status === 'Open' ? (
                        <button
                          onClick={() => handleInstantRefund(ticket.id)}
                          disabled={refundingId === ticket.id}
                          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md"
                        >
                          {refundingId === ticket.id ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Processing NPCI UPI Reversal...</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3.5 h-3.5" />
                              <span>Execute 30s Instant Auto-Refund (₹{ticket.amount})</span>
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Resolved in {ticket.resolutionMinutes * 60} seconds</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
