import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  ShoppingBag, 
  Zap, 
  Store, 
  User, 
  BarChart3, 
  TrendingUp, 
  Sliders, 
  ShieldCheck, 
  LogOut,
  MapPin,
  Lock,
  ChevronDown,
  Info
} from 'lucide-react';
import type { UserRole } from '../types';

export type PageRoute = 
  | 'landing' 
  | 'dashboard' 
  | 'orders' 
  | 'rescue' 
  | 'stores' 
  | 'customers' 
  | 'analytics' 
  | 'impact' 
  | 'settings' 
  | 'admin';

interface TopNavProps {
  currentPage: PageRoute;
  setCurrentPage: (page: PageRoute) => void;
  currentUser: { id: string; name: string; email: string; role: UserRole } | null;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  atRiskCount: number;
}

export const TopNav: React.FC<TopNavProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  onSwitchRole,
  onLogout,
  selectedCity,
  setSelectedCity,
  atRiskCount
}) => {
  // Navigation permissions by role
  const isAllowed = (page: PageRoute): boolean => {
    if (!currentUser) return page === 'landing';
    if (currentUser.role === 'ADMIN') return true;
    if (page === 'landing' || page === 'dashboard' || page === 'orders') return true;
    if (page === 'rescue' && currentUser.role === 'OPERATIONS') return true;
    if (page === 'stores' && (currentUser.role === 'STORE_MANAGER' || currentUser.role === 'OPERATIONS')) return true;
    if (page === 'customers' && (currentUser.role === 'CUSTOMER' || currentUser.role === 'OPERATIONS')) return true;
    if (page === 'analytics' || page === 'impact') return currentUser.role !== 'CUSTOMER';
    if (page === 'settings' || page === 'admin') return false;
    return false;
  };

  const navItems: Array<{ id: PageRoute; label: string; icon: any; count?: number }> = [
    { id: 'landing', label: 'Brief & Model', icon: Info },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'rescue', label: 'Rescue Hub', icon: Zap, count: atRiskCount },
    { id: 'stores', label: 'Store Intel', icon: Store },
    { id: 'customers', label: 'Customer Care', icon: User },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'impact', label: 'Impact Proof', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Sliders },
    { id: 'admin', label: 'Admin Audit', icon: ShieldCheck }
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#fff6dc]/95 backdrop-blur-md border-b-2 border-[#ebd99f] shadow-[0_4px_20px_rgba(217,119,6,0.06)]">
      {/* Top System Status Bar */}
      <div className="bg-[#fef9e7]/95 border-b border-[#ebd99f]/80 px-4 py-1.5 text-xs flex items-center justify-between text-[#334155]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-0.5 bg-white rounded-full border border-[#ebd99f] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#059669] pulse-emerald"></span>
            <span className="font-extrabold tracking-wider text-[11px] text-[#b45309]">RESCUE ENGINE LIVE</span>
          </div>
          <span className="text-[#ebd99f] hidden sm:inline">|</span>
          <span className="text-[#475569] font-medium hidden sm:inline">620 Partner Stores Monitored</span>
          <span className="text-[#ebd99f] hidden sm:inline">|</span>
          <span className="text-[#475569] font-medium hidden md:inline">₹25L Budget Cap</span>
        </div>

        <div className="flex items-center gap-3">
          {/* City Selector */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <MapPin className="w-3.5 h-3.5 text-[#d97706]" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              aria-label="Filter City"
              className="bg-white border-1.5 border-[#ebd99f] text-[#0f172a] font-bold rounded-lg px-2.5 py-0.5 text-xs focus:outline-none focus:border-[#d97706] shadow-2xs cursor-pointer"
            >
              <option value="Bengaluru">Bengaluru (310 Stores)</option>
              <option value="Pune">Pune (185 Stores)</option>
              <option value="Jaipur">Jaipur (125 Stores)</option>
            </select>
          </div>

          {/* Quick Role Switcher */}
          <div className="flex items-center gap-1.5 bg-white border-1.5 border-[#ebd99f] rounded-lg px-2.5 py-0.5 text-xs shadow-2xs">
            <span className="text-[#64748b] font-mono text-[10px] font-bold">ROLE:</span>
            <select
              value={currentUser?.role || 'OPERATIONS'}
              onChange={(e) => onSwitchRole(e.target.value as UserRole)}
              aria-label="Active User Role"
              className="bg-transparent font-extrabold text-[#b45309] focus:outline-none cursor-pointer"
            >
              <option value="OPERATIONS">Operations Manager</option>
              <option value="STORE_MANAGER">Store Manager (Glen's)</option>
              <option value="CUSTOMER">Customer (Aishwarya)</option>
              <option value="ADMIN">Administrator (Strategy)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Header & Nav Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Platform Name */}
          <div 
            onClick={() => setCurrentPage('landing')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#f59e0b] to-[#d97706] text-white flex items-center justify-center font-black text-xl tracking-tighter shadow-[0_6px_18px_rgba(217,119,6,0.3)] group-hover:scale-105 transition-transform">
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-tight text-[#0f172a] font-heading group-hover:text-[#d97706] transition-colors">
                  NOVA RESCUE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-wider uppercase bg-[#fef9e7] text-[#b45309] font-extrabold border border-[#ebd99f]">
                  SIH Edition
                </span>
              </div>
              <p className="text-[11px] text-[#475569] font-semibold -mt-0.5">
                Intelligent Quick-Commerce Triage Platform
              </p>
            </div>
          </div>

          {/* Role-Aware Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const allowed = isAllowed(item.id);
              if (!allowed) return null;
              const Icon = item.icon;
              const isActive = currentPage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white shadow-md shadow-amber-500/20 font-extrabold'
                      : 'text-[#334155] hover:bg-white hover:text-[#b45309] hover:shadow-2xs'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.count !== undefined && item.count > 0 && (
                    <span className={`w-4 h-4 rounded-full text-[9px] font-black flex items-center justify-center ${
                      isActive ? 'bg-white text-[#d97706]' : 'bg-[#e11d48] text-white animate-pulse'
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Current User Role Pill */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-extrabold text-[#0f172a] font-heading">{currentUser?.name || 'Authorized User'}</div>
              <div className="text-[10px] font-mono text-[#b45309] font-extrabold tracking-wide">{currentUser?.role || 'OPERATIONS'}</div>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Scrollbar Nav */}
        <div className="flex lg:hidden overflow-x-auto py-2 space-x-1 border-t border-[#ebd99f]/60 scrollbar-none text-xs">
          {navItems.map((item) => {
            if (!isAllowed(item.id)) return null;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-bold ${
                  isActive
                    ? 'bg-gradient-to-r from-[#f59e0b] to-[#d97706] text-white font-extrabold'
                    : 'text-[#334155] bg-white border border-[#ebd99f]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
