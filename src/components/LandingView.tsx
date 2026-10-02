import React from 'react';
import { 
  Zap, 
  ShieldAlert, 
  ArrowRight, 
  TrendingDown, 
  CheckCircle2, 
  Users, 
  Store, 
  Truck, 
  Activity, 
  BarChart3, 
  Sparkles,
  Flame,
  BrainCircuit
} from 'lucide-react';
import type { PageRoute } from './TopNav';
import type { UserRole } from '../types';

interface LandingViewProps {
  onNavigate: (page: PageRoute) => void;
  onSelectRole: (role: UserRole) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onNavigate,
  onSelectRole
}) => {
  const productLoopSteps = [
    {
      step: '1. DETECT',
      title: 'Real-time Signal Ingestion',
      desc: 'Monitors inventory drift, shelf buffer stock, historical store rejection rates, and courier dispatch delays as orders arrive.',
      color: 'border-blue-500/40 text-blue-400'
    },
    {
      step: '2. PREDICT',
      title: 'Deterministic Risk Scoring',
      desc: 'Calculates multi-factor failure probability (0–100) combining Inventory (0.35), Delivery (0.25), Store (0.25), and Complexity (0.15).',
      color: 'border-amber-500/40 text-amber-400'
    },
    {
      step: '3. DECIDE',
      title: 'AI Structured Intervention',
      desc: 'Gemini 3.8 Flash evaluates failure factors and returns validated Zod-governed rescue actions with customer reassurance messaging.',
      color: 'border-purple-500/40 text-purple-400'
    },
    {
      step: '4. RESCUE',
      title: 'Operational Execution',
      desc: 'Executes allowed action: pre-approved artisanal substitute, adjacent 800m store reroute, priority courier batching, or instant 30s UPI refund.',
      color: 'border-emerald-500/40 text-emerald-400'
    },
    {
      step: '5. LEARN',
      title: 'Outcome Measurement',
      desc: 'Measures failure avoided, customer satisfaction, delivery time saved, and updates the local merchant accuracy index.',
      color: 'border-cyan-500/40 text-cyan-400'
    },
    {
      step: '6. PROVE',
      title: 'Business Turnaround Proof',
      desc: 'Proves reduction in the 11% cancellation rate, rebound in 27% repeat rate, and +₹17.6L monthly EBITDA swing within the ₹25L budget.',
      color: 'border-rose-500/40 text-rose-400'
    }
  ];

  const roleExperiences = [
    {
      role: 'CUSTOMER' as UserRole,
      title: 'Customer Order Rescue',
      targetPage: 'customers' as PageRoute,
      icon: Users,
      summary: 'Experiences early warning when a product is low-stock, chooses pre-approved replacement, or reroutes to nearby partner store without cancellation.'
    },
    {
      role: 'STORE_MANAGER' as UserRole,
      title: 'Store Intelligence & Rush Shield',
      targetPage: 'stores' as PageRoute,
      icon: Store,
      summary: '620 store partners access 3-second SnapSync receipt scanning, 1-tap Rush Shield to prevent 18% store rejections, and AI catalog advice.'
    },
    {
      role: 'OPERATIONS' as UserRole,
      title: 'Operations Rescue Hub',
      targetPage: 'rescue' as PageRoute,
      icon: Zap,
      summary: 'Live at-risk dispatch feed, deterministic factor inspector, Gemini-powered rescue recommendations, and 1-click execution.'
    },
    {
      role: 'ADMIN' as UserRole,
      title: 'Business Impact & Governance',
      targetPage: 'impact' as PageRoute,
      icon: BarChart3,
      summary: 'Executive control: actual measured prototype outcomes vs projected monthly turnaround, ₹25 Lakh budget audit, and system audit trail.'
    }
  ];

  return (
    <div className="space-y-12 pb-20">
      {/* Hero Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 sm:p-12 relative overflow-hidden shadow-cream">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#f59e0b]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-[#e11d48]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 bg-[#fef9e7] border-1.5 border-[#ebd99f] rounded-full shadow-2xs">
            <span className="text-sm">⚡</span>
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#b45309] font-mono">
              Smart India Hackathon · Quick-Commerce Triage Platform
            </span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0f172a] tracking-tight leading-tight font-heading">
            NOVA RESCUE OS
          </h1>
          <p className="text-lg sm:text-2xl font-extrabold text-[#d97706] mt-2 font-heading">
            Intelligent Order-Risk Detection, Triage Intervention & Business Turnaround
          </p>
          <p className="mt-4 text-sm sm:text-base text-[#334155] leading-relaxed max-w-3xl font-medium">
            NOVA CART connects 1,20,000 users with 620 local stores across 3 Indian cities, but is bleeding from an 
            <strong className="text-[#0f172a] font-bold"> 11% cancellation rate</strong>, a <strong className="text-[#e11d48] font-bold">collapse in repeat rate (41% → 27%)</strong>, 
            and a <strong className="text-[#e11d48] font-bold">₹17 Lakh monthly marketing burn</strong> with negative returns.
            <br />
            <strong>NOVA RESCUE</strong> intercepts order failures before courier dispatch, transforming unreliability into verified customer loyalty.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate('rescue')}
              className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 text-white font-extrabold px-7 py-3.5 rounded-2xl text-sm flex items-center gap-2.5 shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-white" />
              <span>Launch Operations Rescue Hub</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="bg-[#fef9e7] hover:bg-white text-[#0f172a] font-bold px-7 py-3.5 rounded-2xl text-sm border-1.5 border-[#ebd99f] transition-all shadow-2xs hover:-translate-y-0.5"
            >
              <span>View Executive War Room</span>
            </button>
          </div>
        </div>
      </div>

      {/* Role-Specific User Journeys (Styled like Portal Cards from SIH 2026 site) */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-[#b45309] font-extrabold mb-1">
            Role Portals & Triage Consoles
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] font-heading">
            Select Your Operational Experience
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
            Dedicated consoles tailored for field dispatchers, store managers, end customers, and executives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roleExperiences.map((exp, idx) => {
            const Icon = exp.icon;
            const gradientBar = idx === 0 ? 'from-[#059669] to-[#d97706]' : idx === 1 ? 'from-[#0284c7] to-[#d97706]' : idx === 2 ? 'from-[#e11d48] to-[#d97706]' : 'from-[#d97706] to-[#b45309]';
            const iconColor = idx === 0 ? 'text-[#059669]' : idx === 1 ? 'text-[#0284c7]' : idx === 2 ? 'text-[#e11d48]' : 'text-[#d97706]';

            return (
              <div
                key={idx}
                className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between shadow-cream hover:shadow-hover transition-all group"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${gradientBar}`}></div>
                <div>
                  <div className={`w-16 h-16 rounded-2xl bg-[#fef9e7] border-1.5 border-[#ebd99f] flex items-center justify-center ${iconColor} mb-4 group-hover:scale-105 transition-transform shadow-2xs`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-[11px] font-mono uppercase font-black text-[#b45309] tracking-wider">
                    Role: {exp.role}
                  </div>
                  <h3 className="text-lg font-black text-[#0f172a] mt-1 font-heading">
                    {exp.title}
                  </h3>
                  <p className="text-xs text-[#334155] mt-2.5 leading-relaxed font-medium">
                    {exp.summary}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#ebd99f]/60">
                  <button
                    onClick={() => {
                      onSelectRole(exp.role);
                      onNavigate(exp.targetPage);
                    }}
                    className="w-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 text-white font-black py-2.5 rounded-xl text-xs transition-all flex items-center justify-between px-4 shadow-sm shadow-amber-500/20 group-hover:shadow-md"
                  >
                    <span>Launch {exp.role.split('_')[0]} Console</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* The Core Product Loop: DETECT → PREDICT → DECIDE → RESCUE → LEARN → PROVE */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-8 sm:p-10 shadow-cream">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="text-xs font-mono uppercase tracking-wider text-[#b45309] font-extrabold mb-1">
            System Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0f172a] font-heading flex items-center justify-center gap-2">
            <span>Six-Phase Closed-Loop Turnaround Engine</span>
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
            Real Ingestion → Deterministic Rules → Gemini 3.8 Flash AI → Real Execution → Measurable Payback.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {productLoopSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#fef9e7] border-1.5 border-[#ebd99f] rounded-2xl p-5 hover:bg-white hover:border-[#d97706] transition-all space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-black px-2.5 py-0.5 rounded-full bg-white text-[#b45309] border border-[#ebd99f]">
                  {step.step}
                </span>
                <span className="text-[11px] font-mono font-bold text-[#64748b]">Phase {idx + 1}</span>
              </div>
              <h3 className="text-sm font-extrabold text-[#0f172a] font-heading">{step.title}</h3>
              <p className="text-xs text-[#334155] leading-relaxed font-medium">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Case Evidence Summary Callout */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-8 shadow-cream">
        <h3 className="text-lg font-black text-[#0f172a] mb-4 flex items-center gap-2 font-heading">
          <span className="w-3 h-3 rounded-full bg-[#e11d48]"></span>
          <span>The Empirical Evidence Behind NOVA RESCUE:</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="bg-[#fef9e7] p-4 rounded-2xl border-1.5 border-[#ebd99f]">
            <span className="text-[#64748b] font-bold block">35% of Cancellations</span>
            <span className="text-xl font-black text-[#e11d48] font-mono mt-1 block">Ghost Inventory</span>
            <span className="text-[11px] text-[#334155] mt-1 block font-medium">In-app stock missing on shelf.</span>
          </div>
          <div className="bg-[#fef9e7] p-4 rounded-2xl border-1.5 border-[#ebd99f]">
            <span className="text-[#64748b] font-bold block">18% of Cancellations</span>
            <span className="text-xl font-black text-[#d97706] font-mono mt-1 block">Store Rush Rejection</span>
            <span className="text-[11px] text-[#334155] mt-1 block font-medium">Stores overwhelmed by offline walk-ins.</span>
          </div>
          <div className="bg-[#fef9e7] p-4 rounded-2xl border-1.5 border-[#ebd99f]">
            <span className="text-[#64748b] font-bold block">The Core Lever</span>
            <span className="text-xl font-black text-[#059669] font-mono mt-1 block">3 Orders = 72%</span>
            <span className="text-[11px] text-[#334155] mt-1 block font-medium">Customers reaching order #3 stay.</span>
          </div>
          <div className="bg-[#fef9e7] p-4 rounded-2xl border-1.5 border-[#ebd99f]">
            <span className="text-[#64748b] font-bold block">Strict Budget Limit</span>
            <span className="text-xl font-black text-[#0f172a] font-mono mt-1 block">₹25 Lakh Cap</span>
            <span className="text-[11px] text-[#334155] mt-1 block font-medium">1.5 month cashflow payback.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
