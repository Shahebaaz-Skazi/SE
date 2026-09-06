import React from 'react';
import { Icon } from '../UI/Icons.jsx';

const navItems = [
  { key: 'dashboard',       label: 'Dashboard',       icon: 'dashboard' },
  { key: 'workers',         label: 'Workers',          icon: 'workers' },
  { key: 'onboarding',      label: 'Onboarding',       icon: 'onboarding' },
  { key: 'offboarding',     label: 'Offboarding',      icon: 'offboarding' },
  { key: 'quotations',      label: 'Quotations',       icon: 'quotations' },
  { key: 'purchase-orders', label: 'Orders',           icon: 'orders' },
  { key: 'invoices',        label: 'Invoices',         icon: 'invoices' },
  { key: 'payroll',         label: 'Payroll',          icon: 'payroll' },
  { key: 'profit-loss',     label: 'P & L',            icon: 'profit' },
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="hidden md:flex sidebar sticky top-0 h-screen w-64 flex-shrink-0 flex-col z-30 bg-white border-r border-slate-200 select-none">
      {/* Brand Header */}
      <div className="px-5 py-5 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs bg-slate-900 text-white shadow-xs font-mono tracking-wider">
            SE
          </div>
          <div>
            <div className="text-sm font-bold text-slate-900 tracking-tight leading-none">
              Sonali Enterprises
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-medium">Labour Contractors</div>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-slate-400 font-medium tracking-tight">
          Chinchwad Highway Rd, Pune
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        <div className="text-[10px] text-slate-400 uppercase tracking-widest px-3 mb-2 font-semibold">
          Operations
        </div>
        {navItems.map(item => {
          const isActive = active === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon name={item.icon} className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-xs" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="px-4 py-3.5 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold bg-slate-200 text-slate-800 border border-slate-300">
            SP
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-slate-900 truncate">Sonali Patil</div>
            <div className="text-[10px] text-slate-500 font-medium">Administrator</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
