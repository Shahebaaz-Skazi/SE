import React, { useState, Suspense, lazy } from 'react';
import Sidebar from './components/Layout/Sidebar.jsx';
import BottomNav from './components/Layout/BottomNav.jsx';
import './index.css';

// Lazy load pages for performance
const Dashboard     = lazy(() => import('./pages/Dashboard.jsx'));
const Workers       = lazy(() => import('./pages/Workers.jsx'));
const Onboarding    = lazy(() => import('./pages/Onboarding.jsx'));
const Offboarding   = lazy(() => import('./pages/Offboarding.jsx'));
const Quotations    = lazy(() => import('./pages/Quotations.jsx'));
const PurchaseOrders = lazy(() => import('./pages/PurchaseOrders.jsx'));
const Invoices      = lazy(() => import('./pages/Invoices.jsx'));
const Payroll       = lazy(() => import('./pages/Payroll.jsx'));
const ProfitLoss    = lazy(() => import('./pages/ProfitLoss.jsx'));

const PAGE_MAP = {
  dashboard:       Dashboard,
  workers:         Workers,
  onboarding:      Onboarding,
  offboarding:     Offboarding,
  quotations:      Quotations,
  'purchase-orders': PurchaseOrders,
  invoices:        Invoices,
  payroll:         Payroll,
  'profit-loss':   ProfitLoss,
};

function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-slate-300 border-t-slate-900 animate-spin" />
        <span className="text-xs text-slate-500 font-medium">Loading module...</span>
      </div>
    </div>
  );
}

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');

  const navigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const ActivePage = PAGE_MAP[activePage] || Dashboard;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row selection:bg-slate-200 selection:text-slate-900 antialiased">
      {/* Desktop Sidebar */}
      <Sidebar active={activePage} onNavigate={navigate} />

      {/* Main content area */}
      <main className="flex-1 min-w-0 min-h-screen flex flex-col">
        {/* Mobile Header Bar */}
        <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-white/95 border-b border-slate-200 backdrop-blur-xl">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center font-bold text-xs bg-slate-900 text-white font-mono">
              SE
            </div>
            <span className="font-bold text-sm text-slate-900 tracking-tight">
              Sonali Enterprises
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold bg-slate-100 text-slate-800 border border-slate-300">
              SP
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 py-6 pb-28 md:pb-16 max-w-7xl mx-auto w-full">
          <Suspense fallback={<PageLoader />}>
            <ActivePage onNavigate={navigate} />
          </Suspense>
        </div>
      </main>

      {/* Mobile Bottom Nav Bar */}
      <BottomNav active={activePage} onNavigate={navigate} />
    </div>
  );
}
