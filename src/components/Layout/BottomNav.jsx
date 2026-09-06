import React, { useState } from 'react';
import { Icon } from '../UI/Icons.jsx';

const mainTabs = [
  { key: 'dashboard',      label: 'Home',     icon: 'dashboard' },
  { key: 'workers',        label: 'Workers',  icon: 'workers' },
  { key: 'invoices',       label: 'Invoices', icon: 'invoices' },
  { key: 'payroll',        label: 'Payroll',  icon: 'payroll' },
  { key: 'more',           label: 'More',     icon: 'more' },
];

const moreItems = [
  { key: 'onboarding',      label: 'Onboarding',  icon: 'onboarding' },
  { key: 'offboarding',     label: 'Offboarding', icon: 'offboarding' },
  { key: 'quotations',      label: 'Quotations',  icon: 'quotations' },
  { key: 'purchase-orders', label: 'Orders',      icon: 'orders' },
  { key: 'profit-loss',     label: 'P & L',       icon: 'profit' },
];

export default function BottomNav({ active, onNavigate }) {
  const [showMore, setShowMore] = useState(false);
  const isMoreActive = moreItems.some(m => m.key === active);

  const handleTab = (key) => {
    if (key === 'more') {
      setShowMore(s => !s);
    } else {
      setShowMore(false);
      onNavigate(key);
    }
  };

  return (
    <>
      {/* More drawer overlay */}
      {showMore && (
        <div
          className="flex md:hidden fixed bottom-16 left-0 right-0 z-40 px-4 pb-2"
          style={{ animation: 'fadeInUp 0.2s ease-out' }}
        >
          <div className="glass-card rounded-xl p-2 border border-slate-200 shadow-2xl w-full bg-white">
            {moreItems.map(item => (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key); setShowMore(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                  active === item.key
                    ? 'text-white bg-slate-900'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon name={item.icon} className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {/* Backdrop */}
      {showMore && (
        <div className="flex md:hidden fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowMore(false)} />
      )}

      {/* Mobile Bottom Nav Bar */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 z-40 items-center justify-around h-16 px-2 bg-white/95 border-t border-slate-200 backdrop-blur-xl select-none">
        {mainTabs.map(tab => {
          const isActive = tab.key === 'more' ? isMoreActive || showMore : active === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => handleTab(tab.key)}
              className="flex flex-col items-center justify-center gap-1 flex-1 py-1 px-1 transition-all cursor-pointer rounded-lg relative"
            >
              <Icon name={tab.icon} className={`w-5 h-5 transition-all ${isActive ? 'text-slate-900 scale-110' : 'text-slate-400'}`} />
              <span className={`text-[10px] font-medium tracking-tight ${isActive ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-0.5 w-1 h-1 rounded-full bg-slate-900 shadow-xs" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
