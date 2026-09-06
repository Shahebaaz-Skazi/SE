import React from 'react';
import { StatCard, formatCurrency, formatDate } from '../components/UI/index.jsx';
import { Icon } from '../components/UI/Icons.jsx';
import { WORKERS, INVOICES, PURCHASE_ORDERS, ACTIVITY_FEED, REVENUE_CHART, PL_HISTORY } from '../data/dummyData.js';

function RevenueChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.value));
  const chartH = 160;
  const barW = 44;
  const gap = 28;
  const padL = 16;
  const padB = 32;
  const totalW = data.length * (barW + gap) + padL * 2;

  return (
    <svg viewBox={`0 0 ${totalW} ${chartH + padB + 10}`} className="w-full h-auto overflow-visible select-none">
      <defs>
        <linearGradient id="barGradNormal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#cbd5e1" stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id="barGradActive" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" stopOpacity="1" />
          <stop offset="100%" stopColor="#334155" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((pct, i) => (
        <line
          key={i}
          x1={padL - 10}
          y1={10 + (chartH - chartH * pct)}
          x2={totalW - padL + 10}
          y2={10 + (chartH - chartH * pct)}
          stroke="#e2e8f0"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      ))}

      {data.map((d, i) => {
        const barH = Math.max(12, (d.value / maxVal) * chartH);
        const x = padL + i * (barW + gap);
        const y = 10 + chartH - barH;
        const isLast = i === data.length - 1;
        return (
          <g key={i} className="group cursor-pointer">
            <rect
              x={x}
              y={y}
              width={barW}
              height={barH}
              fill={isLast ? 'url(#barGradActive)' : 'url(#barGradNormal)'}
              rx={6}
              className="transition-all duration-200 group-hover:opacity-100"
            />
            {/* Top Value Label */}
            <text
              x={x + barW / 2}
              y={y - 8}
              textAnchor="middle"
              fontSize="11"
              fill={isLast ? '#0f172a' : '#64748b'}
              className="font-mono font-bold tracking-tight"
            >
              {(d.value / 100000).toFixed(1)}L
            </text>
            {/* Month Label */}
            <text
              x={x + barW / 2}
              y={10 + chartH + 20}
              textAnchor="middle"
              fontSize="11"
              fill={isLast ? '#0f172a' : '#64748b'}
              className="font-sans font-semibold"
            >
              {d.month}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Dashboard({ onNavigate }) {
  const activePOs = PURCHASE_ORDERS.filter(p => p.status === 'In Progress' || p.status === 'Open').length;
  const pendingInvoices = INVOICES.filter(i => i.status !== 'Paid').length;
  const latestPL = PL_HISTORY[PL_HISTORY.length - 1];
  const monthlyRevenue = latestPL.revenue;
  const monthlyProfit = latestPL.netProfit;
  const profitMargin = Math.round((monthlyProfit / monthlyRevenue) * 100);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 fade-in pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            Executive Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Sonali Enterprises · Chinchwad Highway Road, Pune · Client: Tata Motors Ltd.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono text-slate-700 font-medium">{today}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <StatCard icon={<Icon name="workers" className="w-5 h-5 text-slate-700" />} label="Total Workers" value={WORKERS.length} sub="+2 active this mo." delay={0} />
        <StatCard icon={<Icon name="orders" className="w-5 h-5 text-slate-700" />} label="Active POs" value={activePOs} sub="Tata Motors" delay={1} />
        <StatCard icon={<Icon name="invoices" className="w-5 h-5 text-slate-700" />} label="Pending Invoices" value={pendingInvoices} sub="Awaiting payment" delay={2} />
        <StatCard icon={<Icon name="profit" className="w-5 h-5 text-slate-700" />} label="Monthly Revenue" value={formatCurrency(monthlyRevenue)} sub="Sep 2025" delay={3} />
        <StatCard icon={<Icon name="payroll" className="w-5 h-5 text-slate-700" />} label="Monthly Profit" value={formatCurrency(monthlyProfit)} sub={`${profitMargin}% net margin`} delay={4} />
      </div>

      {/* Main Grid: Revenue Chart + Quick Actions & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 fade-in">
          <div className="glass-card rounded-xl p-5 border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                  Billing & Revenue Trajectory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Billed revenue to Tata Motors over last 6 months</p>
              </div>
              <div className="text-right">
                <div className="text-base font-bold font-mono text-slate-900">
                  {formatCurrency(monthlyRevenue)}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold">↑ +35.8% MoM</div>
              </div>
            </div>
            <RevenueChart data={REVENUE_CHART} />
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <div className="fade-in">
            <div className="glass-card rounded-xl p-4 border border-slate-200 bg-white">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => onNavigate('quotations')}
                  className="btn-gold rounded-lg px-4 py-2.5 text-xs font-bold w-full text-left flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="quotations" className="w-4 h-4" />
                    <span>New Quotation</span>
                  </div>
                  <Icon name="arrowRight" className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onNavigate('invoices')}
                  className="btn-outline rounded-lg px-4 py-2.5 text-xs font-semibold w-full text-left flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="invoices" className="w-4 h-4 text-slate-600" />
                    <span>New Invoice</span>
                  </div>
                  <Icon name="arrowRight" className="w-3.5 h-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => onNavigate('workers')}
                  className="btn-outline rounded-lg px-4 py-2.5 text-xs font-semibold w-full text-left flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Icon name="onboarding" className="w-4 h-4 text-slate-600" />
                    <span>Add Worker</span>
                  </div>
                  <Icon name="arrowRight" className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="fade-in">
            <div className="glass-card rounded-xl p-4 border border-slate-200 bg-white">
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Audit Log & Activity
              </h2>
              <div className="space-y-3">
                {ACTIVITY_FEED.map((item) => (
                  <div key={item.id} className="flex items-start gap-3 text-xs">
                    <div className="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0 text-slate-600 mt-0.5">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-medium leading-tight">{item.text}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Recent POs & Invoices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Recent POs */}
        <div className="fade-in">
          <div className="glass-card rounded-xl p-5 border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Active Purchase Orders
              </h2>
              <button onClick={() => onNavigate('purchase-orders')} className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer">
                <span>View all</span>
                <Icon name="arrowRight" className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {PURCHASE_ORDERS.slice(0, 3).map(po => (
                <div key={po.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div className="min-w-0 pr-3">
                    <div className="text-xs font-bold font-mono text-slate-900">{po.id}</div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">{po.workType}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold font-mono text-slate-900">{formatCurrency(po.value)}</div>
                    <span className={`badge text-[10px] mt-1 ${po.status === 'Completed' ? 'badge-green' : po.status === 'In Progress' ? 'badge-yellow' : 'badge-blue'}`}>
                      {po.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Invoices */}
        <div className="fade-in">
          <div className="glass-card rounded-xl p-5 border border-slate-200 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-900 tracking-tight">
                Recent Invoices
              </h2>
              <button onClick={() => onNavigate('invoices')} className="text-xs text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer">
                <span>View all</span>
                <Icon name="arrowRight" className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {INVOICES.map(inv => (
                <div key={inv.id} className="py-3 flex items-center justify-between first:pt-0 last:pb-0">
                  <div>
                    <div className="text-xs font-bold font-mono text-slate-900">{inv.id}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{formatDate(inv.date)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold font-mono text-slate-900">{formatCurrency(inv.grandTotal)}</div>
                    <span className={`badge text-[10px] mt-1 ${inv.status === 'Paid' ? 'badge-green' : inv.status === 'Pending' ? 'badge-yellow' : 'badge-red'}`}>
                      {inv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
