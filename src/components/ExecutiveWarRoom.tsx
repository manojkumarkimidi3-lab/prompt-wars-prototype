import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  ShoppingBag, 
  Clock, 
  DollarSign, 
  HelpCircle, 
  ShieldAlert, 
  ArrowRight, 
  CheckCircle2, 
  BrainCircuit, 
  ChevronRight,
  Flame,
  Scale
} from 'lucide-react';
import type { BusinessMetrics } from '../types';

interface ExecutiveWarRoomProps {
  metrics: BusinessMetrics;
  onNavigateToSimulator: () => void;
  onNavigateToMerchantOS: () => void;
}

export const ExecutiveWarRoom: React.FC<ExecutiveWarRoomProps> = ({
  metrics,
  onNavigateToSimulator,
  onNavigateToMerchantOS
}) => {
  const [selectedStakeholder, setSelectedStakeholder] = useState<string>('all');

  const metricCards = [
    {
      label: 'Repeat Purchase Rate',
      past: `${(metrics.repeatPurchaseRate.sixMonthsAgo * 100).toFixed(0)}%`,
      current: `${(metrics.repeatPurchaseRate.current * 100).toFixed(0)}%`,
      delta: '-34.1%',
      isBad: true,
      criticalAlert: 'THE CORE CRISIS: Retention collapsed by over a third while marketing spend increased.',
      icon: Users
    },
    {
      label: 'Order Cancellation Rate',
      past: `${(metrics.cancellationRate.sixMonthsAgo * 100).toFixed(0)}%`,
      current: `${(metrics.cancellationRate.current * 100).toFixed(0)}%`,
      delta: '+83.3%',
      isBad: true,
      criticalAlert: 'Nearly doubled! 53% of cancellations are caused by ghost inventory and store rush rejections.',
      icon: AlertTriangle
    },
    {
      label: 'Monthly Promo Spend',
      past: '₹9.5 Lakh',
      current: '₹17.0 Lakh',
      delta: '+78.9%',
      isBad: true,
      criticalAlert: 'Negative marginal return: Spent ₹7.5L extra in marketing to gain only ₹4.3L in gross revenue.',
      icon: DollarSign
    },
    {
      label: 'Monthly Support Tickets',
      past: '3,100',
      current: '5,900',
      delta: '+90.3%',
      isBad: true,
      criticalAlert: 'Support gridlock: Avg resolution time is 9.2 hours; 29% are angry refund status requests.',
      icon: HelpCircle
    },
    {
      label: 'Average Delivery Time',
      past: '29 min',
      current: '37 min',
      delta: '+27.6%',
      isBad: true,
      criticalAlert: '13% of orders delivered >15m late, driving 27% of customer-initiated cancellations.',
      icon: Clock
    },
    {
      label: 'Monthly Gross Revenue',
      past: '₹21.8 Lakh',
      current: '₹26.1 Lakh',
      delta: '+19.7%',
      isBad: false,
      criticalAlert: 'Illusion of growth: Topline grew 20% while EBITDA plunged from -₹4.2L to -₹12.8L/month.',
      icon: ShoppingBag
    }
  ];

  const stakeholders = [
    {
      id: 'finance',
      role: 'Finance Head',
      quote: '“Our problem isn’t growth. It’s the quality and cost of that growth.”',
      stance: 'Critical Priority: Stop burning ₹17L/month on 1st-order discounts when 44% of coupons are never redeemed and customers churn after 1 order.',
      verdict: '100% VALIDATED BY DATA: Marginal spend yields -₹3.2L net return.',
      tagColor: 'border-emerald-500/40 text-emerald-400'
    },
    {
      id: 'partner',
      role: 'Partner Store Manager',
      quote: '“Inventory accuracy and store experience are the real bottlenecks.”',
      stance: '39% of stores find inventory maintenance too painful; 18% reject orders during peak hours; 18% are considering leaving.',
      verdict: '100% ROOT CAUSE: 53% of all cancellations occur in the store, before dispatch.',
      tagColor: 'border-amber-500/40 text-amber-400'
    },
    {
      id: 'product',
      role: 'Product Head',
      quote: '“We’re treating ourselves like another delivery app instead of giving customers a reason to choose local commerce.”',
      stance: 'NOVA CART cannot out-subsidize Blinkit or Zepto on commodity 10m delivery. Our moat is 620 unique artisan bakeries, organic grocers, and pharmacies.',
      verdict: 'STRATEGIC MOAT: Multi-category customers order 2.8x more frequently.',
      tagColor: 'border-blue-500/40 text-blue-400'
    },
    {
      id: 'ops',
      role: 'Operations Head',
      quote: '“Delivery reliability is damaging the experience.”',
      stance: 'Delivery time climbed to 37m and 13% are severely delayed. We need route batching across nearby stores.',
      verdict: 'OPERATIONAL FIX: Multi-store bundling reduces courier trips by 24%.',
      tagColor: 'border-purple-500/40 text-purple-400'
    },
    {
      id: 'ceo',
      role: 'Chief Executive Officer',
      quote: '“We need to improve customer retention.”',
      stance: '61% of churned customers previously gave us 4★ ratings. They wanted to stay, but our unreliability drove them away.',
      verdict: 'STRATEGIC FOCUS: Reaching 3 orders yields 72% retention probability.',
      tagColor: 'border-rose-500/40 text-rose-400'
    },
    {
      id: 'marketing',
      role: 'Marketing Head',
      quote: '“We need stronger acquisition and better promotions with +30% budget.”',
      stance: 'Believes more users will eventually create repeat customers.',
      verdict: 'REJECTED: Pouring water into a bucket with a 34% hole in the bottom accelerates bankruptcy.',
      tagColor: 'border-red-500/40 text-red-400'
    }
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Executive Brief */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2 text-xs font-mono text-amber-400 uppercase tracking-wider">
              <Flame className="w-4 h-4 text-amber-500 animate-pulse" />
              <span>PromptWars Challenge Brief Diagnosis</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-300">Target Budget: ₹25 Lakh Max</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              NOVA CART is Getting Bigger. <span className="text-amber-400">It is Not Getting Better.</span>
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
              While registered users grew +46% and revenue grew +20%, NOVA CART is caught in a 
              classic <strong className="text-white">Leaky Bucket death spiral</strong>. 
              Repeat purchase rate plummeted from <strong className="text-rose-400">41% to 27%</strong>, 
              cancellations doubled to <strong className="text-rose-400">11%</strong>, and marketing burn reached 
              <strong className="text-rose-400"> ₹17 Lakh/month</strong> with negative marginal returns.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={onNavigateToSimulator}
              className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-3 rounded-lg text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Test ₹25L Turnaround Simulator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onNavigateToMerchantOS}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-lg text-xs sm:text-sm border border-slate-700 transition-all"
            >
              <span>Launch SnapSync Merchant Tool</span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* 6-Month Comparison Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-400" />
              <span>Six-Month Performance Reality Matrix</span>
            </h2>
            <p className="text-xs text-slate-400">
              Comparing 6 Months Ago vs Today: The data reveals where enterprise value is leaking.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">620 Partner Stores / 38,500 Orders Monthly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metricCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-400">{card.label}</span>
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-white tracking-tight">{card.current}</span>
                      <span className="ml-2 text-xs text-slate-500 line-through">was {card.past}</span>
                    </div>
                    <span className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                      card.isBad 
                        ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}>
                      {card.delta}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <p className="text-xs text-slate-300 leading-relaxed flex items-start gap-1.5">
                    <span className="text-amber-400 text-sm leading-none">•</span>
                    <span>{card.criticalAlert}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Root-Cause Waterfall: Anatomy of a Broken Order */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="max-w-3xl mb-6">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            Where Orders & Customer Trust are Destroyed
          </div>
          <h3 className="text-xl font-bold text-white">
            The 11% Cancellation Breakdown: 53% Happens Before Delivery Even Starts
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Out of 38,500 monthly orders, 4,235 orders are cancelled. More than half are cancelled because the store shelf did not match the app.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-950 border border-rose-500/40 rounded-lg p-4 relative overflow-hidden">
            <div className="text-xs font-medium text-slate-400">1. Ghost Inventory</div>
            <div className="text-2xl font-black text-rose-400 mt-1">35%</div>
            <div className="text-xs text-slate-300 mt-1">~1,482 orders/mo</div>
            <p className="text-[11px] text-slate-400 mt-3 leading-snug">
              Item displayed on app is missing on store shelf. Store updates stock once every 1–3 days.
            </p>
            <div className="mt-3 text-[10px] font-mono text-amber-400 bg-amber-500/10 p-1.5 rounded">
              Fixed by: SnapSync 5s AI Bill Sync
            </div>
          </div>

          <div className="bg-slate-950 border border-amber-500/30 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-400">2. Delivery Delays</div>
            <div className="text-2xl font-black text-amber-400 mt-1">27%</div>
            <div className="text-xs text-slate-300 mt-1">~1,143 orders/mo</div>
            <p className="text-[11px] text-slate-400 mt-3 leading-snug">
              Customer cancels because delivery estimate blew past 37+ mins; riders waiting at congested counters.
            </p>
            <div className="mt-3 text-[10px] font-mono text-amber-400 bg-amber-500/10 p-1.5 rounded">
              Fixed by: Micro-Route Bundler
            </div>
          </div>

          <div className="bg-slate-950 border border-rose-500/30 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-400">3. Store Rejections</div>
            <div className="text-2xl font-black text-rose-400 mt-1">18%</div>
            <div className="text-xs text-slate-300 mt-1">~762 orders/mo</div>
            <p className="text-[11px] text-slate-400 mt-3 leading-snug">
              23% of stores reject online orders when busy with in-person walk-in customers.
            </p>
            <div className="mt-3 text-[10px] font-mono text-amber-400 bg-amber-500/10 p-1.5 rounded">
              Fixed by: Rush Shield 1-Tap Throttle
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-400">4. Rider Unavailable</div>
            <div className="text-2xl font-black text-slate-300 mt-1">12%</div>
            <div className="text-xs text-slate-300 mt-1">~508 orders/mo</div>
            <p className="text-[11px] text-slate-400 mt-3 leading-snug">
              Unbundled single-store dispatches exhaust driver supply during peak rain/hours.
            </p>
            <div className="mt-3 text-[10px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded">
              Fixed by: 24% Trip Reduction
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-lg p-4">
            <div className="text-xs font-medium text-slate-400">5. Other Friction</div>
            <div className="text-2xl font-black text-slate-400 mt-1">8%</div>
            <div className="text-xs text-slate-300 mt-1">~338 orders/mo</div>
            <p className="text-[11px] text-slate-400 mt-3 leading-snug">
              Customer address issues, duplicate orders, payment gateway dropouts.
            </p>
            <div className="mt-3 text-[10px] font-mono text-slate-400 bg-slate-900 p-1.5 rounded">
              Fixed by: Clean Address Validator
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-slate-950/80 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="text-xs text-slate-300">
              <strong className="text-white">Crucial Behavioral Fact: </strong>
              Customers completing <span className="text-amber-400 font-bold">3 orders</span> have a{' '}
              <span className="text-emerald-400 font-bold">72% probability</span> of ordering again!
              If we fix Ghost Inventory and Rush Rejections, customers effortlessly cross order #3.
            </div>
          </div>
          <div className="text-xs font-mono text-amber-400 font-bold shrink-0">
            Target Repeat Rate: 49%+
          </div>
        </div>
      </div>

      {/* Stakeholder Debate Arena */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              Internal Leadership Debate
            </div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-amber-400" />
              <span>Resolving the 6 Conflicting Management Opinions</span>
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Each executive has partial visibility. Here is how data synthesizes their viewpoints into one actionable solution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStakeholder}
              onChange={(e) => setSelectedStakeholder(e.target.value)}
              aria-label="Filter Stakeholder Position"
              className="bg-slate-950 border border-slate-700 text-xs text-amber-300 rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500"
            >
              <option value="all">View All 6 Stakeholders</option>
              {stakeholders.map((s) => (
                <option key={s.id} value={s.id}>{s.role}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stakeholders
            .filter((s) => selectedStakeholder === 'all' || selectedStakeholder === s.id)
            .map((s) => (
              <div
                key={s.id}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{s.role}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${s.tagColor}`}>
                      {s.role.split(' ')[0]}
                    </span>
                  </div>

                  <p className="mt-3 text-xs italic text-amber-200/90 leading-relaxed font-serif">
                    {s.quote}
                  </p>

                  <div className="mt-3 text-xs text-slate-400 leading-normal">
                    {s.stance}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-900">
                  <div className="text-[11px] font-semibold text-slate-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{s.verdict}</span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Customer Survey Insight Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="text-3xl font-black text-rose-400">61%</div>
          <div className="text-xs font-semibold text-white mt-1">Churned Users Loved Us</div>
          <p className="text-xs text-slate-400 mt-2">
            61% of customers who stopped ordering had previously rated NOVA CART 4★ or higher. They didn’t leave because of the concept—they left because of broken promises.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="text-3xl font-black text-amber-400">44%</div>
          <div className="text-xs font-semibold text-white mt-1">Coupons Never Redeemed</div>
          <p className="text-xs text-slate-400 mt-2">
            ₹17L marketing spend is squandered on convoluted coupons. First-order discount hunters churn immediately. Organic and habit-rewarded users retain at 3x rates.
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
          <div className="text-3xl font-black text-emerald-400">2.8x</div>
          <div className="text-xs font-semibold text-white mt-1">Multi-Category Moat</div>
          <p className="text-xs text-slate-400 mt-2">
            Customers purchasing across multiple categories (e.g. bakery + organic produce + chemist) exhibit 2.8x higher lifetime retention and ₹540+ AOV.
          </p>
        </div>
      </div>
    </div>
  );
};
