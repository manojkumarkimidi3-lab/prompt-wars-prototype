import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  CheckCircle2, 
  ShieldCheck, 
  HelpCircle, 
  PieChart, 
  Clock, 
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

interface BusinessImpactViewProps {
  orders: any[];
}

export const BusinessImpactView: React.FC<BusinessImpactViewProps> = ({
  orders
}) => {
  const rescuedCount = orders.filter(o => o.status === 'RESCUED').length;
  const atRiskCount = orders.filter(o => o.status === 'AT_RISK' || (o.riskScore && o.riskScore.totalScore >= 50)).length;
  const measuredRevenueSaved = orders
    .filter(o => o.status === 'RESCUED')
    .reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 lg:p-8 shadow-cream">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#b45309] font-extrabold uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4 text-[#d97706]" />
              <span>Business Rescue Proof • Journey 4</span>
              <span className="text-[#ebd99f]">•</span>
              <span className="text-[#475569]">Constrained to ₹25 Lakh Budget</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] font-heading">
              Executive Business Impact & Turnaround Model
            </h1>
            <p className="mt-2 text-sm text-[#334155] max-w-2xl leading-relaxed font-medium">
              Transparently demonstrating how intercepting failures at the order level turns NOVA CART’s unit economics 
              from a -₹12.8 Lakh monthly loss into a +₹4.8 Lakh monthly EBITDA profit.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION A: ACTUAL MEASURED VALUES IN RUNNING PROTOTYPE */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebd99f]/60">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#d97706] animate-pulse"></span>
            <h2 className="text-base font-black text-[#0f172a] font-heading">
              Section A: Actual Measured Prototype Metrics (Live Session)
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#b45309] bg-[#fef9e7] px-3 py-1 rounded-full border border-[#ebd99f] font-black uppercase">
            Measured in Prototype
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#fef9e7] p-4 rounded-2xl border border-[#ebd99f]">
            <span className="text-[11px] text-[#64748b] font-bold">Orders Analyzed in Session</span>
            <div className="text-2xl font-black text-[#0f172a] font-mono mt-1">{orders.length}</div>
            <span className="text-[10px] text-[#64748b] mt-1 block font-medium">Live database records</span>
          </div>

          <div className="bg-[#fef9e7] p-4 rounded-2xl border border-[#fecdd3]">
            <span className="text-[11px] text-[#e11d48] font-black">At-Risk Intercepted</span>
            <div className="text-2xl font-black text-[#e11d48] font-mono mt-1">{atRiskCount}</div>
            <span className="text-[10px] text-[#e11d48]/70 mt-1 block font-bold">Score ≥ 50/100</span>
          </div>

          <div className="bg-[#fef9e7] p-4 rounded-2xl border border-[#a7f3d0]">
            <span className="text-[11px] text-[#059669] font-black">Orders Rescued</span>
            <div className="text-2xl font-black text-[#059669] font-mono mt-1">{rescuedCount}</div>
            <span className="text-[10px] text-[#059669]/70 mt-1 block font-bold">Failure prevented</span>
          </div>

          <div className="bg-[#fef9e7] p-4 rounded-2xl border border-[#ebd99f]">
            <span className="text-[11px] text-[#b45309] font-bold">Order GMV Saved</span>
            <div className="text-2xl font-black text-[#b45309] font-mono mt-1">₹{measuredRevenueSaved}</div>
            <span className="text-[10px] text-[#64748b] mt-1 block font-medium">Preserved revenue</span>
          </div>
        </div>
      </div>

      {/* SECTION B: PROJECTED MONTHLY BUSINESS IMPACT (SIMULATION ESTIMATION) */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-6 shadow-cream">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebd99f]/60">
          <div>
            <h2 className="text-lg font-black text-[#0f172a] flex items-center gap-2 font-heading">
              <span>Section B: Full Platform 6-Month Projection (38,500 Orders Monthly)</span>
            </h2>
            <p className="text-xs text-[#475569] mt-0.5 font-medium">
              Based on empirical pilot rates from 620 store partners across Bengaluru, Pune, and Jaipur.
            </p>
          </div>
          <span className="text-[10px] font-mono text-[#b45309] bg-[#fef9e7] px-3 py-1 rounded-full border border-[#ebd99f] uppercase font-black">
            Simulated / Estimated Model
          </span>
        </div>

        {/* 6-Month Comparison Matrix */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b-2 border-[#ebd99f] text-[#b45309] font-black bg-[#fef9e7]/70">
                <th className="py-3 pl-3">Key Metric</th>
                <th className="py-3">6 Months Ago</th>
                <th className="py-3 text-[#e11d48]">Current (Crisis)</th>
                <th className="py-3 text-[#059669]">Post-Nova Rescue</th>
                <th className="py-3 pr-3 text-right">Net Value Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ebd99f]/40 font-sans">
              <tr className="hover:bg-[#fef9e7]/50 transition-colors">
                <td className="py-3.5 pl-3 font-bold text-[#0f172a]">Cancellation Rate</td>
                <td className="py-3.5 text-[#64748b] font-mono font-medium">6.0%</td>
                <td className="py-3.5 text-[#e11d48] font-mono font-black">11.0%</td>
                <td className="py-3.5 text-[#059669] font-mono font-black">3.8%</td>
                <td className="py-3.5 pr-3 text-right text-[#059669] font-black">2,780 orders/mo saved</td>
              </tr>
              <tr className="hover:bg-[#fef9e7]/50 transition-colors">
                <td className="py-3.5 pl-3 font-bold text-[#0f172a]">Repeat Purchase Rate</td>
                <td className="py-3.5 text-[#64748b] font-mono font-medium">41.0%</td>
                <td className="py-3.5 text-[#e11d48] font-mono font-black">27.0%</td>
                <td className="py-3.5 text-[#059669] font-mono font-black">48.5%</td>
                <td className="py-3.5 pr-3 text-right text-[#059669] font-black">+79% retention rebound</td>
              </tr>
              <tr className="hover:bg-[#fef9e7]/50 transition-colors">
                <td className="py-3.5 pl-3 font-bold text-[#0f172a]">Average Delivery Time</td>
                <td className="py-3.5 text-[#64748b] font-mono font-medium">29 min</td>
                <td className="py-3.5 text-[#e11d48] font-mono font-black">37 min</td>
                <td className="py-3.5 text-[#059669] font-mono font-black">24 min</td>
                <td className="py-3.5 pr-3 text-right text-[#059669] font-black">-13 mins faster</td>
              </tr>
              <tr className="hover:bg-[#fef9e7]/50 transition-colors">
                <td className="py-3.5 pl-3 font-bold text-[#0f172a]">Monthly Promo Spend</td>
                <td className="py-3.5 text-[#64748b] font-mono font-medium">₹9.5 Lakh</td>
                <td className="py-3.5 text-[#e11d48] font-mono font-black">₹17.0 Lakh</td>
                <td className="py-3.5 text-[#059669] font-mono font-black">₹11.6 Lakh</td>
                <td className="py-3.5 pr-3 text-right text-[#059669] font-black">₹5.4 Lakh/mo saved</td>
              </tr>
              <tr className="hover:bg-[#fef9e7]/50 transition-colors">
                <td className="py-3.5 pl-3 font-bold text-[#0f172a]">Support Tickets</td>
                <td className="py-3.5 text-[#64748b] font-mono font-medium">3,100/mo</td>
                <td className="py-3.5 text-[#e11d48] font-mono font-black">5,900/mo</td>
                <td className="py-3.5 text-[#059669] font-mono font-black">1,650/mo</td>
                <td className="py-3.5 pr-3 text-right text-[#059669] font-black">-72% ticket reduction</td>
              </tr>
              <tr className="hover:bg-[#fef9e7]/50 transition-colors">
                <td className="py-3.5 pl-3 font-bold text-[#0f172a]">Monthly Net EBITDA</td>
                <td className="py-3.5 text-[#64748b] font-mono font-medium">-₹4.2 Lakh</td>
                <td className="py-3.5 text-[#e11d48] font-mono font-black">-₹12.8 Lakh</td>
                <td className="py-3.5 text-[#059669] font-mono font-black">+₹4.8 Lakh</td>
                <td className="py-3.5 pr-3 text-right text-[#059669] font-black">+₹17.6 Lakh/mo swing</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ₹25 Lakh Capital Payback Card */}
        <div className="p-5 bg-[#fef9e7] rounded-2xl border-1.5 border-[#ebd99f] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xs">
          <div>
            <div className="text-xs font-black text-[#0f172a] flex items-center gap-2 font-heading">
              <ShieldCheck className="w-4 h-4 text-[#059669]" />
              <span>₹25 Lakh Implementation Budget Capital Payback:</span>
            </div>
            <p className="text-xs text-[#475569] mt-1 font-medium">
              At a net monthly EBITDA gain of +₹17.6 Lakhs, the entire ₹25 Lakh software capex is fully paid back in <strong className="text-[#b45309] font-bold">1.5 months</strong>.
            </p>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs text-[#64748b] font-bold">6-Month Net EBITDA ROI</span>
            <div className="text-xl font-black text-[#059669] font-mono">+₹80.6 Lakh Net</div>
          </div>
        </div>
      </div>
    </div>
  );
};
