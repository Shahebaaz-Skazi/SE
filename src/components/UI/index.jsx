import React from 'react';
import { Icon } from './Icons.jsx';

export function Badge({ status }) {
  const map = {
    // Worker
    Active: 'badge-green',
    Inactive: 'badge-gray',
    // Quotation
    Draft: 'badge-gray',
    Sent: 'badge-blue',
    Approved: 'badge-green',
    Rejected: 'badge-red',
    // PO
    Open: 'badge-blue',
    'In Progress': 'badge-yellow',
    Completed: 'badge-green',
    // Invoice
    Paid: 'badge-green',
    Pending: 'badge-yellow',
    Overdue: 'badge-red',
    // Onboarding / Offboarding
    Blocked: 'badge-red',
    Activated: 'badge-green',
  };

  const dots = {
    'badge-green': 'bg-emerald-600',
    'badge-yellow': 'bg-amber-600',
    'badge-red': 'bg-rose-600',
    'badge-blue': 'bg-sky-600',
    'badge-gray': 'bg-slate-500',
  };

  const cls = map[status] || 'badge-gray';
  const dotCls = dots[cls] || 'bg-slate-500';

  return (
    <span className={`badge ${cls} inline-flex items-center gap-1.5`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
      <span>{status}</span>
    </span>
  );
}

export function Card({ children, className = '', style = {} }) {
  return (
    <div
      className={`glass-card rounded-xl p-4.5 bg-white border border-slate-200 shadow-xs hover:border-slate-300 transition-all ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, delay = 0 }) {
  return (
    <div
      className="glass-card rounded-xl p-4 border border-slate-200 hover:border-slate-300 fade-in flex flex-col justify-between space-y-2 bg-white shadow-xs"
      style={{ animationDelay: `${delay * 0.05}s` }}
    >
      <div className="flex items-center justify-between">
        <div className="p-2 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
          {icon}
        </div>
        <span className="text-[11px] text-slate-500 font-medium tracking-tight">{sub}</span>
      </div>
      <div>
        <div className="text-xl md:text-2xl font-bold font-mono tracking-tight text-slate-900">
          {value}
        </div>
        <div className="text-[11px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">{label}</div>
      </div>
    </div>
  );
}

export function Button({ children, onClick, variant = 'gold', size = 'md', className = '', type = 'button', disabled = false }) {
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-xs', lg: 'px-5 py-2.5 text-sm' };
  const variants = {
    gold: 'btn-gold rounded-lg shadow-xs',
    outline: 'btn-outline rounded-lg',
    danger: 'rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 cursor-pointer transition-all',
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${variants[variant]} ${sizes[size]} font-bold ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
}

export function Modal({ isOpen, onClose, title, children, width = 'max-w-lg' }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div
        className={`glass-card rounded-2xl w-full ${width} max-h-[88vh] overflow-y-auto shadow-2xl bg-white border border-slate-200`}
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-900 transition-colors w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <Icon name="close" className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

export function Input({ label, error, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-slate-600 font-semibold tracking-wide">{label}</label>}
      <input
        className="form-input rounded-lg px-3.5 py-2.5 text-xs w-full bg-white border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none font-medium"
        {...props}
      />
      {error && <span className="text-[11px] font-semibold text-rose-600">⚠ {error}</span>}
    </div>
  );
}

export function Select({ label, error, children, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs text-slate-600 font-semibold tracking-wide">{label}</label>}
      <select
        className="form-input rounded-lg px-3.5 py-2.5 text-xs w-full bg-white border border-slate-300 text-slate-900 focus:border-slate-800 focus:ring-1 focus:ring-slate-800 outline-none font-medium"
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-[11px] font-semibold text-rose-600">⚠ {error}</span>}
    </div>
  );
}

export function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-5 gap-3 pb-3 border-b border-slate-200">
      <div>
        <h1 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5 font-medium">{subtitle}</p>}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function ProgressBar({ value, max, color = '#0f172a' }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="progress-bar bg-slate-100 h-1.5 rounded-full overflow-hidden">
      <div className="progress-fill h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function formatCurrency(n) {
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

export function formatDate(d) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
