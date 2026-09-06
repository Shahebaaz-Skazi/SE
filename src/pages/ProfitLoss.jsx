import React, { useState } from 'react';
import { SectionHeader, formatCurrency } from '../components/UI/index.jsx';
import { PL_HISTORY } from '../data/dummyData.js';

function ComparisonChart({ data }) {
  const maxVal = Math.max(...data.map(d => d.revenue));
  const W = 500, H = 180, padL = 10, padB = 28, barW = 36, gap = 14;
  const groupW = 3 * barW + 2 * gap;
  const groupGap = 40;

  return (
    <svg viewBox={`0 0 ${W} ${H + padB}`} width="100%" preserveAspectRatio="xMidYMid meet">
      {/* Legend */}
      {[
        { color: '#0f172a', label: 'Revenue' },
        { color: '#be123c', label: 'Wages' },
        { color: '#047857', label: 'Profit' },
      ].map((l, i) => (
        <g key={i} transform={`translate(${W - 140 + i * 0}, ${8 + i * 16})`}>
          <rect x={0} y={0} width={10} height={10} fill={l.color} rx={2} />
          <text x={14} y={9} fontSize="9" fill="#475569" fontWeight="600">{l.label}</text>
        </g>
      ))}
      {/* Grid lines */}
      {[0.25, 0.5, 0.75, 1].map((pct, i) => (
        <line key={i} x1={padL} x2={W - 10} y1={8 + H * (1 - pct)} y2={8 + H * (1 - pct)}
              stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
      ))}
      {data.map((d, gi) => {
        const gx = padL + gi * (groupW + groupGap);
        const bars = [
          { value: d.revenue, color: '#0f172a' },
          { value: d.workerWages, color: '#be123c' },
          { value: d.netProfit, color: '#047857' },
        ];
        return (
          <g key={gi}>
            {bars.map((b, bi) => {
              const bh = Math.max(4, (b.value / maxVal) * H);
              const bx = gx + bi * (barW + gap);
              const by = 8 + H - bh;
              const valStr = (b.value / 100000).toFixed(1) + 'L';
              return (
                <g key={bi}>
                  <rect x={bx} y={by} width={barW} height={bh} fill={b.color} rx={3} />
                  <text x={bx + barW / 2} y={by - 4} textAnchor="middle" fontSize="8"
                        fill={b.color} fontWeight="700" className="font-mono">
                    {valStr}
                  </text>
                </g>
              );
            })}
            <text x={gx + groupW / 2} y={8 + H + 18} textAnchor="middle" fontSize="10"
                  fill={gi === data.length - 1 ? '#0f172a' : '#64748b'}
                  fontWeight={gi === data.length - 1 ? '700' : '500'}>
              {d.month.split(' ')[0]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default function ProfitLoss() {
  const [selectedMonth, setSelectedMonth] = useState(PL_HISTORY.length - 1);
  const data = PL_HISTORY[selectedMonth];
  const prevData = selectedMonth > 0 ? PL_HISTORY[selectedMonth - 1] : null;

  const margin = ((data.netProfit / data.revenue) * 100).toFixed(1);
  const prevMargin = prevData ? ((prevData.netProfit / prevData.revenue) * 100).toFixed(1) : null;
  const marginDelta = prevMargin ? (parseFloat(margin) - parseFloat(prevMargin)).toFixed(1) : null;
  const revGrowth = prevData ? (((data.revenue - prevData.revenue) / prevData.revenue) * 100).toFixed(1) : null;

  const bestMonth = PL_HISTORY.reduce((a, b) => a.netProfit > b.netProfit ? a : b);

  const breakdown = [
    { label: 'Worker Wages', value: data.workerWages, color: '#0f172a' },
    { label: 'Other Expenses', value: data.otherExpenses, color: '#b45309' },
    { label: 'Net Profit', value: data.netProfit, color: '#047857' },
  ];

  return (
    <div className="pb-20 md:pb-0">
      <SectionHeader
        title="Profit & Loss"
        subtitle="Financial overview · Last 3 months · Tata Motors contracts"
      />

      {/* Month selector */}
      <div className="flex gap-2 mb-5 fade-in-1">
        {PL_HISTORY.map((d, i) => (
          <button
            key={i}
            onClick={() => setSelectedMonth(i)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              selectedMonth === i
                ? 'bg-slate-900 text-white'
                : 'btn-outline'
            }`}
          >
            {d.month}
          </button>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-5 fade-in-2">
        {[
          { label: 'Total Revenue', value: data.revenue, icon: '📈', color: '#0f172a', sub: 'Billed to Tata Motors' },
          { label: 'Worker Wages', value: data.workerWages, icon: '👷', color: '#be123c', sub: 'Total payout' },
          { label: 'Other Expenses', value: data.otherExpenses, icon: '📊', color: '#b45309', sub: 'Operating costs' },
          { label: 'Net Profit', value: data.netProfit, icon: '💰', color: '#047857', sub: `${margin}% margin` },
        ].map((card, i) => (
          <div key={i} className="glass-card rounded-xl p-4 bg-white" style={{ borderTop: `2px solid ${card.color}` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xl">{card.icon}</span>
              <span className="text-[11px] text-slate-500 font-medium">{card.sub}</span>
            </div>
            <div className="text-base font-bold font-mono text-slate-900">
              {formatCurrency(card.value)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-wide font-semibold">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* P&L Statement */}
        <div className="fade-in-3">
          <div className="glass-card rounded-xl overflow-hidden border border-slate-200 bg-white">
            <div className="px-5 py-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">
                P&L Statement — {data.month}
              </h3>
            </div>
            <div className="p-5">
              {/* Income */}
              <div className="mb-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Income</div>
                <div className="flex justify-between py-2 text-xs border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Revenue from Tata Motors</span>
                  <span className="font-bold font-mono text-slate-900">{formatCurrency(data.revenue)}</span>
                </div>
              </div>
              {/* Expenses */}
              <div className="mb-4">
                <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Expenses</div>
                <div className="flex justify-between py-2 text-xs border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Worker Wages & Salaries</span>
                  <span className="text-rose-600 font-mono font-bold">{formatCurrency(data.workerWages)}</span>
                </div>
                <div className="flex justify-between py-2 text-xs border-b border-slate-200">
                  <span className="text-slate-700 font-medium">Other Operating Expenses</span>
                  <span className="text-rose-600 font-mono font-bold">{formatCurrency(data.otherExpenses)}</span>
                </div>
                <div className="flex justify-between py-2 text-xs border-b border-slate-200">
                  <span className="text-slate-700 font-medium">PF & ESIC (Est. Employer Share)</span>
                  <span className="text-rose-600 font-mono font-bold">{formatCurrency(Math.round(data.workerWages * 0.135))}</span>
                </div>
              </div>
              {/* Net */}
              <div className="flex justify-between py-3 text-sm font-bold border-t border-slate-200">
                <span className="text-emerald-700">Net Profit</span>
                <span className="text-emerald-700 font-mono text-base">{formatCurrency(data.netProfit)}</span>
              </div>
              <div className="flex justify-between py-2 text-xs font-semibold">
                <span className="text-slate-500">Profit Margin</span>
                <span className="font-bold text-emerald-700 font-mono">{margin}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="fade-in-4">
          <div className="glass-card rounded-xl p-5 border border-slate-200 bg-white">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Cost Breakdown
            </h3>
            {breakdown.map((item, i) => {
              const pct = Math.round((item.value / data.revenue) * 100);
              return (
                <div key={i} className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5 font-semibold">
                    <span className="text-slate-700">{item.label}</span>
                    <span className="font-mono" style={{ color: item.color }}>
                      {formatCurrency(item.value)} · {pct}%
                    </span>
                  </div>
                  <div className="progress-bar bg-slate-100">
                    <div
                      className="progress-fill"
                      style={{ width: `${pct}%`, background: item.color }}
                    />
                  </div>
                </div>
              );
            })}

            {/* Revenue bar */}
            <div className="mt-2 pt-4 border-t border-slate-200">
              <div className="text-xs text-slate-500 mb-2 font-semibold">Revenue Utilization</div>
              <div className="flex h-5 rounded-full overflow-hidden border border-slate-200">
                <div style={{ width: `${Math.round(data.workerWages / data.revenue * 100)}%`, background: '#0f172a' }} title="Wages" />
                <div style={{ width: `${Math.round(data.otherExpenses / data.revenue * 100)}%`, background: '#b45309' }} title="Expenses" />
                <div style={{ width: `${Math.round(data.netProfit / data.revenue * 100)}%`, background: '#047857' }} title="Profit" />
              </div>
              <div className="flex justify-between text-[11px] text-slate-600 mt-1.5 font-medium">
                <span>Wages {Math.round(data.workerWages / data.revenue * 100)}%</span>
                <span>Expenses {Math.round(data.otherExpenses / data.revenue * 100)}%</span>
                <span>Profit {Math.round(data.netProfit / data.revenue * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Month Comparison Chart */}
      <div className="glass-card rounded-xl p-5 mb-5 fade-in-5 border border-slate-200 bg-white">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          3-Month Comparison
        </h3>
        <ComparisonChart data={PL_HISTORY} />
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 fade-in-5">
        {[
          {
            icon: '📈',
            title: 'Margin Trend',
            body: marginDelta !== null
              ? `Profit margin ${parseFloat(marginDelta) >= 0 ? 'improved' : 'declined'} by ${Math.abs(marginDelta)}% vs ${prevData?.month}. Current: ${margin}%`
              : `Current profit margin is ${margin}%.`,
            color: parseFloat(marginDelta || 0) >= 0 ? '#047857' : '#be123c',
          },
          {
            icon: '🚀',
            title: 'Revenue Growth',
            body: revGrowth !== null
              ? `Revenue grew by ${revGrowth}% vs ${prevData?.month}. From ${formatCurrency(prevData?.revenue || 0)} to ${formatCurrency(data.revenue)}.`
              : `Revenue this month: ${formatCurrency(data.revenue)}`,
            color: '#0f172a',
          },
          {
            icon: '🏆',
            title: 'Best Month',
            body: `${bestMonth.month} was the best month with ${formatCurrency(bestMonth.netProfit)} net profit (${((bestMonth.netProfit / bestMonth.revenue) * 100).toFixed(1)}% margin).`,
            color: '#0f172a',
          },
        ].map((insight, i) => (
          <div key={i} className="glass-card rounded-xl p-4 bg-white" style={{ borderLeft: `4px solid ${insight.color}` }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{insight.icon}</span>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-700">{insight.title}</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">{insight.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
