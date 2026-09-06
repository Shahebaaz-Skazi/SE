import React, { useState } from 'react';
import { SectionHeader, formatCurrency } from '../components/UI/index.jsx';
import { PAYROLL as INITIAL_PAYROLL, WORKERS } from '../data/dummyData.js';

export default function Payroll() {
  const [payrollData, setPayrollData] = useState(INITIAL_PAYROLL);

  const payrollWithWorkers = payrollData.map(p => ({
    ...p,
    worker: WORKERS.find(w => w.id === p.workerId),
  })).filter(p => p.worker);

  const totalGross = payrollData.reduce((s, p) => s + p.grossPay, 0);
  const totalDeductions = payrollData.reduce((s, p) => s + p.pf + p.esic, 0);
  const totalNet = payrollData.reduce((s, p) => s + p.netPay, 0);

  const REVENUE = 338040;
  const OTHER_EXPENSES = 18000;
  const netProfit = REVENUE - totalGross - OTHER_EXPENSES;
  const profitMargin = ((netProfit / REVENUE) * 100).toFixed(1);

  const markPaid = (workerId) => {
    setPayrollData(pd => pd.map(p => p.workerId === workerId ? { ...p, status: 'Paid' } : p));
  };

  function WorkerInitials({ name }) {
    const initials = name.split(' ').slice(0, 2).map(n => n[0]).join('');
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 bg-slate-100 text-slate-800 border border-slate-300">
        {initials}
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-0">
      <SectionHeader
        title="Payroll — September 2025"
        subtitle={`${payrollWithWorkers.length} workers on payroll · Total net payout: ${formatCurrency(Math.round(totalNet))}`}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-6 fade-in-1">
        <div className="glass-card rounded-xl p-4 border-t-2 border-t-slate-900 bg-white">
          <div className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Total Gross Pay</div>
          <div className="text-xl font-bold font-mono text-slate-900">
            {formatCurrency(Math.round(totalGross))}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Before deductions</div>
        </div>
        <div className="glass-card rounded-xl p-4 border-t-2 border-t-rose-500 bg-white">
          <div className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Total Deductions</div>
          <div className="text-xl font-bold font-mono text-rose-600">
            {formatCurrency(Math.round(totalDeductions))}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">PF + ESIC contributions</div>
        </div>
        <div className="glass-card rounded-xl p-4 border-t-2 border-t-emerald-500 bg-white">
          <div className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider font-bold">Total Net Payout</div>
          <div className="text-xl font-bold font-mono text-emerald-700">
            {formatCurrency(Math.round(totalNet))}
          </div>
          <div className="text-xs text-slate-500 mt-1 font-medium">Workers' take-home</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="fade-in-2 mb-6">
        <div className="glass-card rounded-xl overflow-hidden border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="data-table w-full min-w-[750px]">
              <thead>
                <tr>
                  <th className="text-left">Worker</th>
                  <th className="text-right">Days Worked</th>
                  <th className="text-right">Gross Pay</th>
                  <th className="text-right">PF (12%)</th>
                  <th className="text-right">ESIC (0.75%)</th>
                  <th className="text-right">Net Pay</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {payrollWithWorkers.map(p => (
                  <tr key={p.workerId}>
                    <td>
                      <div className="flex items-center gap-2">
                        <WorkerInitials name={p.worker.name} />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{p.worker.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{p.workerId} · {p.worker.skill}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right">
                      <span className="text-xs text-slate-800 font-bold font-mono">{p.daysWorked}</span>
                      <span className="text-[11px] text-slate-400"> / 26</span>
                    </td>
                    <td className="text-right text-xs font-bold text-slate-900 font-mono">
                      {formatCurrency(Math.round(p.grossPay))}
                    </td>
                    <td className="text-right text-xs text-rose-600 font-bold font-mono">
                      {formatCurrency(Math.round(p.pf))}
                    </td>
                    <td className="text-right text-xs text-rose-600 font-bold font-mono">
                      {formatCurrency(Math.round(p.esic))}
                    </td>
                    <td className="text-right text-xs text-emerald-700 font-bold font-mono">
                      {formatCurrency(Math.round(p.netPay))}
                    </td>
                    <td className="text-center">
                      <span className={`badge ${p.status === 'Paid' ? 'badge-green' : 'badge-yellow'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="text-center">
                      {p.status === 'Pending' ? (
                        <button
                          className="btn-gold rounded-lg px-3 py-1 text-xs font-bold cursor-pointer"
                          onClick={() => markPaid(p.workerId)}
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-xs text-emerald-700 font-bold">✓ Done</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td className="font-bold text-slate-900 text-xs py-4 border-t border-slate-200">
                    TOTAL ({payrollWithWorkers.length} workers)
                  </td>
                  <td className="border-t border-slate-200" />
                  <td className="text-right font-bold font-mono text-slate-900 py-4 border-t border-slate-200">
                    {formatCurrency(Math.round(totalGross))}
                  </td>
                  <td className="text-right font-bold font-mono text-rose-600 py-4 border-t border-slate-200">
                    {formatCurrency(Math.round(payrollData.reduce((s,p) => s+p.pf, 0)))}
                  </td>
                  <td className="text-right font-bold font-mono text-rose-600 py-4 border-t border-slate-200">
                    {formatCurrency(Math.round(payrollData.reduce((s,p) => s+p.esic, 0)))}
                  </td>
                  <td className="text-right font-bold font-mono text-emerald-700 py-4 border-t border-slate-200">
                    {formatCurrency(Math.round(totalNet))}
                  </td>
                  <td className="border-t border-slate-200" colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Profit Summary */}
      <div className="glass-card rounded-xl p-5 fade-in-3 border-t-2 border-t-slate-900 bg-white">
        <h3 className="text-sm font-bold text-slate-900 mb-4">
          Revenue vs Payout Analysis — Sep 2025
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Revenue', value: REVENUE, color: '#0f172a' },
            { label: 'Worker Wages', value: Math.round(totalGross), color: '#be123c' },
            { label: 'Other Expenses', value: OTHER_EXPENSES, color: '#b45309' },
            { label: 'Net Profit', value: Math.round(netProfit), color: '#047857' },
          ].map((item, i) => (
            <div key={i} className="glass-card rounded-lg p-3 bg-slate-50 border-slate-200">
              <div className="text-[11px] text-slate-500 mb-1 font-semibold">{item.label}</div>
              <div className="text-base font-bold font-mono" style={{ color: item.color }}>{formatCurrency(item.value)}</div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {[
            { label: 'Worker Wages', value: Math.round(totalGross), color: '#0f172a' },
            { label: 'Other Expenses', value: OTHER_EXPENSES, color: '#b45309' },
            { label: 'Net Profit', value: Math.round(netProfit), color: '#047857' },
          ].map((item, i) => {
            const pct = Math.round((item.value / REVENUE) * 100);
            return (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5 font-semibold">
                  <span className="text-slate-700">{item.label}</span>
                  <span className="font-mono" style={{ color: item.color }}>{formatCurrency(item.value)} ({pct}%)</span>
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
        </div>

        <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-semibold">Overall Profit Margin</span>
          <span className="text-lg font-bold font-mono text-emerald-700">
            {profitMargin}%
          </span>
        </div>
      </div>
    </div>
  );
}
