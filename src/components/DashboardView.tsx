import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  HelpCircle, 
  Search, 
  ShieldAlert, 
  TrendingDown, 
  TrendingUp, 
  Zap, 
  ArrowRight,
  Filter,
  Eye,
  Store,
  MapPin
} from 'lucide-react';
import type { PageRoute } from './TopNav';

interface DashboardViewProps {
  orders: any[];
  onNavigateToRescue: (orderId?: string) => void;
  onNavigateToOrders: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  orders,
  onNavigateToRescue,
  onNavigateToOrders
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('all');
  const [selectedStoreFilter, setSelectedStoreFilter] = useState<string>('all');

  // Metrics summary
  const totalMonitored = 38500; // Case brief monthly figure
  const activeMonitoredInDb = orders.length;
  const atRiskOrders = orders.filter(o => o.status === 'AT_RISK' || (o.riskScore && o.riskScore.totalScore >= 50));
  const criticalOrders = orders.filter(o => o.riskScore?.riskLevel === 'CRITICAL');
  const rescuedOrders = orders.filter(o => o.status === 'RESCUED');
  
  // Calculate aggregated risk scores
  const avgInventoryRisk = Math.round(
    orders.reduce((acc, o) => acc + (o.riskScore?.inventoryRisk || 30), 0) / (orders.length || 1)
  );
  const avgDeliveryRisk = Math.round(
    orders.reduce((acc, o) => acc + (o.riskScore?.deliveryRisk || 25), 0) / (orders.length || 1)
  );

  // Filtered orders table
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.storeName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRisk = 
      selectedRiskFilter === 'all' || 
      order.riskScore?.riskLevel === selectedRiskFilter;

    const matchesStore = 
      selectedStoreFilter === 'all' || 
      order.storeId === selectedStoreFilter;

    return matchesSearch && matchesRisk && matchesStore;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* KPI Highlight Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border-1.5 border-[#ebd99f] rounded-2xl p-4 shadow-cream">
          <span className="text-[11px] text-[#64748b] font-bold">Orders Monitored</span>
          <div className="text-xl sm:text-2xl font-black text-[#0f172a] font-mono mt-1">
            {totalMonitored.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#94a3b8] mt-1 block font-medium">38.5k/mo platform flow</span>
        </div>

        <div className="bg-white border-1.5 border-[#fecdd3] rounded-2xl p-4 shadow-cream">
          <span className="text-[11px] text-[#e11d48] font-black flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-[#e11d48]" />
            <span>At-Risk Orders</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#e11d48] font-mono mt-1">
            {atRiskOrders.length} active
          </div>
          <span className="text-[10px] text-[#e11d48]/70 mt-1 block font-bold">Intervention required</span>
        </div>

        <div className="bg-white border-1.5 border-[#fecdd3] rounded-2xl p-4 shadow-cream">
          <span className="text-[11px] text-[#b45309] font-black flex items-center gap-1">
            <ShieldAlert className="w-3 h-3 text-[#b45309]" />
            <span>Critical Risk</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#b45309] font-mono mt-1">
            {criticalOrders.length}
          </div>
          <span className="text-[10px] text-[#64748b] mt-1 block font-medium">High cancel likelihood</span>
        </div>

        <div className="bg-white border-1.5 border-[#a7f3d0] rounded-2xl p-4 shadow-cream">
          <span className="text-[11px] text-[#059669] font-black flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-[#059669]" />
            <span>Rescued Orders</span>
          </span>
          <div className="text-xl sm:text-2xl font-black text-[#059669] font-mono mt-1">
            {rescuedOrders.length}
          </div>
          <span className="text-[10px] text-[#059669]/70 mt-1 block font-bold">Failures intercepted</span>
        </div>

        <div className="bg-white border-1.5 border-[#ebd99f] rounded-2xl p-4 shadow-cream">
          <span className="text-[11px] text-[#64748b] font-bold">Cancellation Rate</span>
          <div className="text-xl sm:text-2xl font-black text-[#e11d48] font-mono mt-1">
            11.0%
          </div>
          <span className="text-[10px] text-[#059669] mt-1 block font-bold">Target: 3.8% post-rescue</span>
        </div>

        <div className="bg-white border-1.5 border-[#ebd99f] rounded-2xl p-4 shadow-cream">
          <span className="text-[11px] text-[#64748b] font-bold">Support Tickets</span>
          <div className="text-xl sm:text-2xl font-black text-[#0f172a] font-mono mt-1">
            5,900/mo
          </div>
          <span className="text-[10px] text-[#64748b] mt-1 block font-medium">9.2h resolution queue</span>
        </div>
      </div>

      {/* Real-time Risk Meters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border-1.5 border-[#ebd99f] rounded-2xl p-5 space-y-3 shadow-cream">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#0f172a] flex items-center gap-1.5 font-heading">
              <span>Average Inventory Risk (Ghost Stock)</span>
            </span>
            <span className="text-xs font-mono font-black text-[#e11d48]">{avgInventoryRisk}%</span>
          </div>
          <div className="w-full bg-[#fef9e7] h-3 rounded-full overflow-hidden p-0.5 border border-[#ebd99f]">
            <div className="bg-gradient-to-r from-[#f59e0b] to-[#e11d48] h-full rounded-full" style={{ width: `${avgInventoryRisk}%` }}></div>
          </div>
          <p className="text-[11px] text-[#475569] leading-snug font-medium">
            35% of all cancellations are caused by products missing from shelves. SnapSync updates reduce this to under 10%.
          </p>
        </div>

        <div className="bg-white border-1.5 border-[#ebd99f] rounded-2xl p-5 space-y-3 shadow-cream">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-[#0f172a] flex items-center gap-1.5 font-heading">
              <span>Average Transit & Delay Risk</span>
            </span>
            <span className="text-xs font-mono font-black text-[#d97706]">{avgDeliveryRisk}%</span>
          </div>
          <div className="w-full bg-[#fef9e7] h-3 rounded-full overflow-hidden p-0.5 border border-[#ebd99f]">
            <div className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] h-full rounded-full" style={{ width: `${avgDeliveryRisk}%` }}></div>
          </div>
          <p className="text-[11px] text-[#475569] leading-snug font-medium">
            27% of cancellations occur due to delivery delays beyond 37 minutes. Route micro-bundling reduces average transit to 24 mins.
          </p>
        </div>
      </div>

      {/* Orders Monitored Feed & Filter Controls */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-[#0f172a] flex items-center gap-2 font-heading">
              <Zap className="w-5 h-5 text-[#d97706]" />
              <span>Live Order Risk Monitor & Intervention Pipeline</span>
            </h3>
            <p className="text-xs text-[#475569] font-medium">
              Orders evaluated in real-time by the deterministic risk engine. Click any at-risk order to execute an allowed rescue action.
            </p>
          </div>

          <button
            onClick={() => onNavigateToRescue()}
            className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 text-white font-extrabold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shrink-0 transition-all shadow-md shadow-amber-500/20"
          >
            <span>Open Rescue Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#64748b] absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Order ID, Customer, Store..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#fef9e7] border-1.5 border-[#ebd99f] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#d97706] font-medium shadow-2xs"
            />
          </div>

          {/* Risk Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedRiskFilter}
              onChange={(e) => setSelectedRiskFilter(e.target.value)}
              aria-label="Filter by Risk Level"
              className="w-full bg-[#fef9e7] border-1.5 border-[#ebd99f] text-[#0f172a] font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#d97706] shadow-2xs"
            >
              <option value="all">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk (Score ≥ 75)</option>
              <option value="HIGH">High Risk (Score 50-74)</option>
              <option value="MEDIUM">Medium Risk (Score 25-49)</option>
              <option value="LOW">Low Risk (Score &lt; 25)</option>
            </select>
          </div>

          {/* Store Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedStoreFilter}
              onChange={(e) => setSelectedStoreFilter(e.target.value)}
              aria-label="Filter by Partner Store"
              className="w-full bg-[#fef9e7] border-1.5 border-[#ebd99f] text-[#0f172a] font-bold rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#d97706] shadow-2xs"
            >
              <option value="all">All Partner Stores</option>
              <option value="store-1">Glen's Artisan Bakery (Indiranagar)</option>
              <option value="store-2">Kamakshi Ayurvedic (Koramangala)</option>
              <option value="store-3">Vaidya Organics (Indiranagar)</option>
              <option value="store-4">Chitale Dairy (Pune FC Road)</option>
              <option value="store-5">Rawat Mishthan (Jaipur C-Scheme)</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b-2 border-[#ebd99f] text-[#b45309] font-black bg-[#fef9e7]/70">
                <th className="py-3 pl-3">Order ID & Customer</th>
                <th className="py-3">Store</th>
                <th className="py-3">ETA</th>
                <th className="py-3">Deterministic Risk Score</th>
                <th className="py-3">Primary Risk Factor</th>
                <th className="py-3">Status</th>
                <th className="py-3 pr-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd99f]/40">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#64748b]">
                    No orders matching selected criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const riskLevel = order.riskScore?.riskLevel || 'LOW';
                  const score = order.riskScore?.totalScore || 20;
                  const factor = order.factors?.[0]?.description || 'Normal operation';

                  return (
                    <tr key={order.id} className="hover:bg-[#fef9e7]/50 transition-colors">
                      <td className="py-3.5 pl-3">
                        <div className="font-mono font-bold text-[#0f172a]">{order.id}</div>
                        <div className="text-[11px] text-[#475569] font-medium">{order.customerName}</div>
                      </td>

                      <td className="py-3.5 text-[#0f172a]">
                        <div className="font-bold">{order.storeName}</div>
                        <div className="text-[10px] text-[#64748b]">{order.city}</div>
                      </td>

                      <td className="py-3.5 font-mono font-bold text-[#0f172a]">
                        {order.currentEtaMinutes}m
                      </td>

                      <td className="py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`font-mono font-black ${
                            riskLevel === 'CRITICAL'
                              ? 'text-[#e11d48]'
                              : riskLevel === 'HIGH'
                              ? 'text-[#d97706]'
                              : riskLevel === 'MEDIUM'
                              ? 'text-[#b45309]'
                              : 'text-[#059669]'
                          }`}>
                            {score}/100
                          </span>
                          <span className={`text-[10px] font-mono uppercase font-black px-2 py-0.5 rounded-full border ${
                            riskLevel === 'CRITICAL'
                              ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]'
                              : riskLevel === 'HIGH'
                              ? 'bg-[#fef3c7] text-[#b45309] border-[#ebd99f]'
                              : riskLevel === 'MEDIUM'
                              ? 'bg-[#fef3c7] text-[#d97706] border-[#ebd99f]'
                              : 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                          }`}>
                            {riskLevel}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 text-[11px] text-[#334155] font-medium max-w-xs truncate" title={factor}>
                        {factor}
                      </td>

                      <td className="py-3.5">
                        <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full font-bold border ${
                          order.status === 'RESCUED'
                            ? 'bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]'
                            : order.status === 'AT_RISK'
                            ? 'bg-[#ffe4e6] text-[#e11d48] border-[#fecdd3]'
                            : 'bg-[#fef9e7] text-[#334155] border-[#ebd99f]'
                        }`}>
                          {order.status.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 pr-3 text-right">
                        <button
                          onClick={() => onNavigateToRescue(order.id)}
                          className="bg-[#fef9e7] hover:bg-gradient-to-r hover:from-[#f59e0b] hover:to-[#d97706] text-[#0f172a] hover:text-white border-1.5 border-[#ebd99f] font-extrabold px-3.5 py-1.5 rounded-xl text-[11px] transition-all shadow-2xs"
                        >
                          Inspect & Rescue
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
