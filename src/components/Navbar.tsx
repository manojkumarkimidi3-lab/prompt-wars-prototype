import React from 'react';
import { 
  BarChart3, 
  Store, 
  ShoppingBag, 
  Truck, 
  Sparkles, 
  FileText, 
  Sliders, 
  MapPin, 
  ShieldCheck, 
  RefreshCw 
} from 'lucide-react';

export type ActiveTab = 
  | 'war-room' 
  | 'simulator' 
  | 'merchant-os' 
  | 'customer-basket' 
  | 'operations' 
  | 'ai-copilot' 
  | 'dossier';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  cartCount: number;
  openCart: () => void;
  onQuickReset?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCity,
  setSelectedCity,
  cartCount,
  openCart,
  onQuickReset
}) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Notification Bar */}
      <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-1.5 text-xs text-amber-300 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">NOVA CART Turnaround Active</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">620 Local Stores Across 3 Indian Metros</span>
          <span className="text-slate-400">|</span>
          <span className="text-amber-200 font-semibold">₹25 Lakh Budget Cap</span>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Active City:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Active City"
              className="bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-amber-300 font-medium focus:outline-none focus:border-amber-500"
            >
              <option value="Bengaluru">Bengaluru (310 Stores)</option>
              <option value="Pune">Pune (185 Stores)</option>
              <option value="Jaipur">Jaipur (125 Stores)</option>
            </select>
          </div>
          {onQuickReset && (
            <button
              onClick={onQuickReset}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
              title="Reset Live Demo Data"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset State</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            onClick={() => setActiveTab('war-room')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-xl tracking-tighter shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              NC
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors">
                  NOVA CART
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono tracking-widest uppercase bg-slate-800 text-amber-400 border border-amber-500/30">
                  Nexus OS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 -mt-0.5">
                Local Commerce Rescue & Turnaround Engine
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('war-room')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'war-room'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>1. War Room</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'simulator'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>2. ROI Simulator</span>
            </button>

            <button
              onClick={() => setActiveTab('merchant-os')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'merchant-os'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>3. SnapSync & Rush</span>
            </button>

            <button
              onClick={() => setActiveTab('customer-basket')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'customer-basket'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>4. Neighborhood Basket</span>
              {cartCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-400 text-[10px] font-bold flex items-center justify-center border border-amber-400">
                  {cartCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('operations')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'operations'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>5. Dispatch & Refunds</span>
            </button>

            <button
              onClick={() => setActiveTab('ai-copilot')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'ai-copilot'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>6. AI Copilot</span>
            </button>

            <button
              onClick={() => setActiveTab('dossier')}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'dossier'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-300 hover:bg-slate-900 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>7. Dossier (Brief)</span>
            </button>
          </nav>

          {/* Right Action: Cart quick trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-slate-200 px-3 py-2 rounded-lg text-xs font-medium transition-all"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Basket</span>
              <span className="font-bold text-amber-400">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-slate-900 scrollbar-none text-xs">
          {[
            { id: 'war-room', label: '1. War Room' },
            { id: 'simulator', label: '2. Simulator' },
            { id: 'merchant-os', label: '3. SnapSync' },
            { id: 'customer-basket', label: '4. Basket' },
            { id: 'operations', label: '5. Dispatch' },
            { id: 'ai-copilot', label: '6. AI Copilot' },
            { id: 'dossier', label: '7. Dossier' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={`whitespace-nowrap px-3 py-1.5 rounded text-xs ${
                activeTab === tab.id
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-300 bg-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
