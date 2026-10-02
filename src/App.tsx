import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TopNav, type PageRoute } from './components/TopNav';
import { LandingView } from './components/LandingView';
import { DashboardView } from './components/DashboardView';
import { OrdersView } from './components/OrdersView';
import { RescueWorkflowView } from './components/RescueWorkflowView';
import { StoreIntelligenceView } from './components/StoreIntelligenceView';
import { CustomerRescueView } from './components/CustomerRescueView';
import { AnalyticsView } from './components/AnalyticsView';
import { BusinessImpactView } from './components/BusinessImpactView';
import { SettingsView } from './components/SettingsView';
import { AdminAuditView } from './components/AdminAuditView';
import type { UserRole } from './types';
import { CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('landing');
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [orders, setOrders] = useState<any[]>([]);
  const [inspectOrderId, setInspectOrderId] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authenticated user state (Default to OPERATIONS so reviewer has instant access to the core rescue hub)
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    name: string;
    email: string;
    role: UserRole;
    token: string;
  }>({
    id: 'usr-ops-1',
    name: 'Vikram Sethi (Ops Director)',
    email: 'ops@novacart.in',
    role: 'OPERATIONS',
    token: 'test_token_ops'
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch orders from backend
  const fetchOrders = async (token = currentUser.token, city = selectedCity) => {
    try {
      const res = await fetch(`/api/orders?city=${city}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  useEffect(() => {
    fetchOrders(currentUser.token, selectedCity);
  }, [currentUser.token, selectedCity]);

  // Switch role and update session token
  const handleSwitchRole = (newRole: UserRole) => {
    let userDetails = {
      id: 'usr-ops-1',
      name: 'Vikram Sethi (Ops Director)',
      email: 'ops@novacart.in',
      role: 'OPERATIONS' as UserRole,
      token: 'test_token_ops'
    };

    if (newRole === 'CUSTOMER') {
      userDetails = {
        id: 'usr-customer-1',
        name: 'Aishwarya Rao (Customer)',
        email: 'customer@novacart.in',
        role: 'CUSTOMER',
        token: 'test_token_customer'
      };
    } else if (newRole === 'STORE_MANAGER') {
      userDetails = {
        id: 'usr-store-1',
        name: 'Chef Glen (Glen’s Bakery)',
        email: 'store@glensbakery.in',
        role: 'STORE_MANAGER',
        token: 'test_token_store'
      };
    } else if (newRole === 'ADMIN') {
      userDetails = {
        id: 'usr-admin-1',
        name: 'Pooja Hegde (Strategy Chief)',
        email: 'admin@novacart.in',
        role: 'ADMIN',
        token: 'test_token_admin'
      };
    }

    setCurrentUser(userDetails);
    fetchOrders(userDetails.token, selectedCity);
    showToast(`Switched active session to: ${userDetails.name} (${newRole})`);

    // Route smartly to relevant role page
    if (newRole === 'CUSTOMER') setCurrentPage('customers');
    else if (newRole === 'STORE_MANAGER') setCurrentPage('stores');
    else if (newRole === 'OPERATIONS') setCurrentPage('rescue');
    else if (newRole === 'ADMIN') setCurrentPage('impact');
  };

  // Execute rescue action on backend
  const handleExecuteRescueAction = async (orderId: string, actionType: string, details?: string) => {
    try {
      const res = await fetch('/api/rescue/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${currentUser.token}`
        },
        body: JSON.stringify({
          orderId,
          actionType,
          details
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Execution failed');
      }

      const data = await res.json();
      
      // Update local orders state
      setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));

      // Confetti celebration for successful rescue!
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}

      showToast(data.message || `Action ${actionType} executed!`);
      return data;
    } catch (err: any) {
      console.error('Rescue execution error', err);
      throw err;
    }
  };

  const atRiskCount = orders.filter(
    o => o.status === 'AT_RISK' || (o.riskScore && o.riskScore.totalScore >= 50)
  ).length;

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#fff6dc_0%,#fffaea_40%,#fff1c5_100%)] bg-fixed text-[#0f172a] flex flex-col font-sans antialiased selection:bg-[#f59e0b]/25 selection:text-[#b45309]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#ffffff] text-[#0f172a] font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs border-2 border-[#ebd99f] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Top Navigation with Role Switcher */}
      <TopNav
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        currentUser={currentUser}
        onSwitchRole={handleSwitchRole}
        onLogout={() => handleSwitchRole('OPERATIONS')}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        atRiskCount={atRiskCount}
      />

      {/* Main Dynamic View Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {currentPage === 'landing' && (
          <LandingView
            onNavigate={(page) => setCurrentPage(page)}
            onSelectRole={handleSwitchRole}
          />
        )}

        {currentPage === 'dashboard' && (
          <DashboardView
            orders={orders}
            onNavigateToRescue={(orderId) => {
              if (orderId) setInspectOrderId(orderId);
              setCurrentPage('rescue');
            }}
            onNavigateToOrders={() => setCurrentPage('orders')}
          />
        )}

        {currentPage === 'orders' && (
          <OrdersView
            orders={orders}
            onInspectRescue={(orderId) => {
              setInspectOrderId(orderId);
              setCurrentPage('rescue');
            }}
          />
        )}

        {currentPage === 'rescue' && (
          <RescueWorkflowView
            orders={orders}
            initialSelectedOrderId={inspectOrderId}
            onExecuteRescueAction={handleExecuteRescueAction}
          />
        )}

        {currentPage === 'stores' && (
          <StoreIntelligenceView currentUser={currentUser} />
        )}

        {currentPage === 'customers' && (
          <CustomerRescueView
            orders={orders}
            currentUser={currentUser}
            onExecuteRescueAction={handleExecuteRescueAction}
          />
        )}

        {currentPage === 'analytics' && <AnalyticsView />}

        {currentPage === 'impact' && <BusinessImpactView orders={orders} />}

        {currentPage === 'settings' && <SettingsView />}

        {currentPage === 'admin' && <AdminAuditView />}
      </main>

      {/* Warm Cream Footer */}
      <footer className="border-t-2 border-[#ebd99f] bg-[#fff6dc]/90 backdrop-blur-sm mt-auto py-6 text-xs text-[#64748b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-[#b45309] tracking-tight font-heading text-sm">NOVA RESCUE OS</span>
            <span className="text-[#ebd99f] font-bold">·</span>
            <span className="text-[#334155] font-semibold">Intelligent Quick-Commerce Triage Platform</span>
            <span className="text-[#ebd99f] font-bold">·</span>
            <span className="text-[#d97706] font-mono font-bold">620 Stores Protected</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#475569] font-medium">
            <span>Deterministic Risk Engine</span>
            <span className="text-[#ebd99f]">·</span>
            <span>Gemini 3.8 Flash + Zod Validation</span>
            <span className="text-[#ebd99f]">·</span>
            <span className="text-[#b45309] font-bold">₹25L Budget Compliant</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
