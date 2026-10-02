import React from 'react';
import { 
  BarChart3, 
  TrendingDown, 
  AlertTriangle, 
  Clock, 
  Package, 
  Store, 
  Truck, 
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const cancellationData = [
    { cause: 'Ghost Stock (Product Unavailable on Shelf)', pct: 35, orders: '~1,482/mo', fixedBy: 'SnapSync AI Bill Sync', color: 'bg-rose-500' },
    { cause: 'Transit Delay (>37m Delivery Time)', pct: 27, orders: '~1,143/mo', fixedBy: 'Route Micro-Bundling', color: 'bg-amber-500' },
    { cause: 'Store Rejection During Walk-in Rush', pct: 18, orders: '~762/mo', fixedBy: 'Rush Shield 1-Tap Throttle', color: 'bg-orange-500' },
    { cause: 'Delivery Partner Availability', pct: 12, orders: '~508/mo', fixedBy: '24% Courier Trip Reduction', color: 'bg-blue-500' },
    { cause: 'Other Operational Friction', pct: 8, orders: '~338/mo', fixedBy: 'Proactive Auto-Refund & Address Check', color: 'bg-slate-600' }
  ];

  const surveySignals = [
    { text: 'Prices/fees feel higher than expected', pct: 38 },
    { text: 'Delivery takes too long (37 min avg)', pct: 34 },
    { text: 'Products shown available become unavailable after ordering (Ghost Stock)', pct: 29 },
    { text: 'Discounts are confusing and 44% unused', pct: 24 },
    { text: 'Prefer purchasing directly from nearby stores', pct: 21 },
    { text: 'Difficult to discover relevant local products', pct: 18 },
    { text: 'Experienced refund problems (9.2 hr wait)', pct: 16 }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 lg:p-8 shadow-cream">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#b45309] font-extrabold uppercase tracking-wider mb-2">
              <BarChart3 className="w-4 h-4 text-[#d97706]" />
              <span>Diagnostic Failure Analytics & Root Causes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] font-heading">
              Root-Cause Decomposition & Empirical Distributions
            </h1>
            <p className="mt-2 text-sm text-[#334155] max-w-2xl leading-relaxed font-medium">
              Empirical breakdown of why 11% of monthly orders (4,235 orders) are cancelled and how customer loyalty is eroded.
            </p>
          </div>
        </div>
      </div>

      {/* The 11% Cancellation Breakdown Waterfall */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-6 shadow-cream">
        <div>
          <h2 className="text-lg font-black text-[#0f172a] flex items-center gap-2 font-heading">
            <AlertTriangle className="w-5 h-5 text-[#e11d48]" />
            <span>The 11% Cancellation Breakdown: 53% Occurs Before Delivery Starts</span>
          </h2>
          <p className="text-xs text-[#475569] mt-1 font-medium">
            Analyzing 4,235 cancelled orders per month across 620 store partners in Bengaluru, Pune, and Jaipur.
          </p>
        </div>

        <div className="space-y-4">
          {cancellationData.map((item, idx) => {
            const barColors = [
              'bg-gradient-to-r from-[#f59e0b] to-[#e11d48]',
              'bg-gradient-to-r from-[#f59e0b] to-[#d97706]',
              'bg-gradient-to-r from-[#d97706] to-[#b45309]',
              'bg-[#0284c7]',
              'bg-[#64748b]'
            ];
            const barColor = barColors[idx] || 'bg-[#d97706]';

            return (
              <div key={idx} className="space-y-1.5 p-3 rounded-2xl bg-[#fef9e7] border border-[#ebd99f]">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-extrabold text-[#0f172a]">
                    {idx + 1}. {item.cause}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#64748b] font-bold">{item.orders}</span>
                    <span className="font-mono font-black text-[#0f172a] text-sm">{item.pct}%</span>
                  </div>
                </div>

                <div className="w-full bg-white h-3 rounded-full overflow-hidden flex border border-[#ebd99f] p-0.5 shadow-2xs">
                  <div className={`${barColor} h-full rounded-full transition-all`} style={{ width: `${item.pct}%` }}></div>
                </div>

                <div className="text-[11px] text-[#b45309] font-mono font-bold">
                  Intervention: {item.fixedBy}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Customer Survey 2,000 Respondent Breakdown */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-4 shadow-cream">
        <div>
          <h2 className="text-lg font-black text-[#0f172a] flex items-center gap-2 font-heading">
            <span className="w-3 h-3 rounded-full bg-[#d97706]"></span>
            <span>Customer Voice & Churn Signals (2,000 Respondent Survey)</span>
          </h2>
          <p className="text-xs text-[#475569] mt-1 font-medium">
            Key finding: <strong className="text-[#b45309] font-bold">61% of churned customers previously rated NOVA CART 4★ or higher!</strong>
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {surveySignals.map((sig, idx) => (
            <div key={idx} className="bg-[#fef9e7] p-3.5 rounded-2xl border border-[#ebd99f] flex items-center justify-between gap-4">
              <span className="text-xs text-[#0f172a] font-bold">{sig.text}</span>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-24 sm:w-36 bg-white h-2.5 rounded-full overflow-hidden p-0.5 border border-[#ebd99f]">
                  <div className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] h-full rounded-full" style={{ width: `${sig.pct * 2}%` }}></div>
                </div>
                <span className="font-mono font-black text-[#b45309] text-xs w-8 text-right">{sig.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
