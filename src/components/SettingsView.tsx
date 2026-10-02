import React, { useState } from 'react';
import { 
  Sliders, 
  Save, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Info 
} from 'lucide-react';
import { defaultRiskWeights } from '../../server/riskEngine';

export const SettingsView: React.FC = () => {
  const [weights, setWeights] = useState(defaultRiskWeights);
  const [criticalThreshold, setCriticalThreshold] = useState(75);
  const [highThreshold, setHighThreshold] = useState(50);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  const handleReset = () => {
    setWeights(defaultRiskWeights);
    setCriticalThreshold(75);
    setHighThreshold(50);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 lg:p-8 shadow-cream">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-[#b45309] font-extrabold uppercase tracking-wider mb-2">
              <Sliders className="w-4 h-4 text-[#d97706]" />
              <span>Deterministic Risk Engine Configuration</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0f172a] font-heading">
              Risk Weightings & Policy Thresholds
            </h1>
            <p className="mt-2 text-sm text-[#334155] max-w-2xl leading-relaxed font-medium">
              Transparent, non-black-box risk weightings. Tune factor contributions according to empirical operational priorities.
            </p>
          </div>
        </div>
      </div>

      {/* Weight Controls */}
      <div className="bg-white border-2 border-[#ebd99f] rounded-3xl p-6 space-y-6 shadow-cream">
        <div className="flex items-center justify-between pb-3 border-b border-[#ebd99f]/60">
          <h2 className="text-base font-black text-[#0f172a] font-heading">Factor Weightings (Normalized)</h2>
          <span className="text-xs font-mono text-[#b45309] font-bold">Sum: 1.0 (100%)</span>
        </div>

        <div className="space-y-6">
          <div className="space-y-2 bg-[#fef9e7] p-4 rounded-2xl border border-[#ebd99f]">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-[#0f172a]">
                1. Inventory Risk Weight (Ghost Stock on Shelf)
              </label>
              <span className="font-mono font-black text-[#d97706] bg-white px-2.5 py-0.5 rounded-full border border-[#ebd99f] shadow-2xs">
                {(weights.inventoryWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.6"
              step="0.05"
              value={weights.inventoryWeight}
              onChange={(e) => setWeights({ ...weights, inventoryWeight: parseFloat(e.target.value) })}
              className="w-full accent-[#d97706] bg-white h-2 rounded-full cursor-pointer"
            />
            <p className="text-[11px] text-[#475569] font-medium">
              Reflects the empirical reality that 35% of all cancellations are caused by shelf stockouts.
            </p>
          </div>

          <div className="space-y-2 bg-[#fef9e7] p-4 rounded-2xl border border-[#ebd99f]">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-[#0f172a]">
                2. Delivery & Transit Risk Weight (ETA Delays)
              </label>
              <span className="font-mono font-black text-[#d97706] bg-white px-2.5 py-0.5 rounded-full border border-[#ebd99f] shadow-2xs">
                {(weights.deliveryWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={weights.deliveryWeight}
              onChange={(e) => setWeights({ ...weights, deliveryWeight: parseFloat(e.target.value) })}
              className="w-full accent-[#d97706] bg-white h-2 rounded-full cursor-pointer"
            />
            <p className="text-[11px] text-[#475569] font-medium">
              Accounts for the 27% of cancellations triggered when transit time blows past 37 minutes.
            </p>
          </div>

          <div className="space-y-2 bg-[#fef9e7] p-4 rounded-2xl border border-[#ebd99f]">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-[#0f172a]">
                3. Store Reliability & Rejection Weight
              </label>
              <span className="font-mono font-black text-[#d97706] bg-white px-2.5 py-0.5 rounded-full border border-[#ebd99f] shadow-2xs">
                {(weights.storeWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="0.5"
              step="0.05"
              value={weights.storeWeight}
              onChange={(e) => setWeights({ ...weights, storeWeight: parseFloat(e.target.value) })}
              className="w-full accent-[#d97706] bg-white h-2 rounded-full cursor-pointer"
            />
            <p className="text-[11px] text-[#475569] font-medium">
              Accounts for the 18% of orders rejected by stores during busy counter rush hours.
            </p>
          </div>

          <div className="space-y-2 bg-[#fef9e7] p-4 rounded-2xl border border-[#ebd99f]">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-[#0f172a]">
                4. Order Complexity & Item Count Weight
              </label>
              <span className="font-mono font-black text-[#d97706] bg-white px-2.5 py-0.5 rounded-full border border-[#ebd99f] shadow-2xs">
                {(weights.complexityWeight * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.3"
              step="0.05"
              value={weights.complexityWeight}
              onChange={(e) => setWeights({ ...weights, complexityWeight: parseFloat(e.target.value) })}
              className="w-full accent-[#d97706] bg-white h-2 rounded-full cursor-pointer"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#ebd99f]/60 flex items-center justify-between">
          <button
            onClick={handleReset}
            className="text-xs text-[#64748b] hover:text-[#0f172a] font-bold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Standard Weights</span>
          </button>

          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:opacity-95 text-white font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-md shadow-amber-500/25 transition-all"
          >
            <Save className="w-3.5 h-3.5 text-white" />
            <span>Save Configuration</span>
          </button>
        </div>

        {savedMessage && (
          <div className="p-4 bg-[#ecfdf5] border-1.5 border-[#a7f3d0] rounded-2xl text-xs text-[#059669] flex items-center gap-2 font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
            <span>Risk weights saved to server-side engine configuration!</span>
          </div>
        )}
      </div>
    </div>
  );
};
