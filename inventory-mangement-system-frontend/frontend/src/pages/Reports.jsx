import { useEffect, useState } from 'react'
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3.mjs'
import Download from 'lucide-react/dist/esm/icons/download.mjs'
import LineChart from 'lucide-react/dist/esm/icons/line-chart.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.mjs'
import Zap from 'lucide-react/dist/esm/icons/zap.mjs'
import Layout from '../components/Layout'
import api from '../services/api'

export default function Reports() {
  const [dateRange, setDateRange] = useState('month')

  const fallbackReport = {
    totalRevenue: 156400,
    totalOrders: 342,
    averageOrderValue: 457,
    fulfillmentRate: 98.5,
    salesTrend: [
    { date: 'Jun 1', sales: 2400, orders: 24 },
    { date: 'Jun 2', sales: 1398, orders: 22 },
    { date: 'Jun 3', sales: 9800, orders: 29 },
    { date: 'Jun 4', sales: 3908, orders: 40 },
    ],
    topProducts: [
    { name: 'Laptop Pro', sales: 12500, units: 45 },
    { name: 'Monitor 27"', sales: 8960, units: 32 },
    { name: 'Keyboard RGB', sales: 4320, units: 78 },
    { name: 'USB-C Cable', sales: 2490, units: 500 },
    ],
    categoryPerformance: [
      { category: 'Electronics', revenue: 62400, unitsSold: 89, growth: '+15%' },
      { category: 'Accessories', revenue: 48200, unitsSold: 342, growth: '+8%' },
    ],
  }
  const [report, setReport] = useState(fallbackReport)

  useEffect(() => {
    api.get('/reports')
      .then((response) => setReport({ ...fallbackReport, ...response.data }))
      .catch(() => setReport(fallbackReport))
  }, [])

  const kpis = [
    { label: 'Total Revenue', value: `$${Number(report.totalRevenue || 0).toLocaleString()}`, delta: '+12% vs last period', icon: TrendingUp, tone: 'text-emerald-200' },
    { label: 'Total Orders', value: Number(report.totalOrders || 0).toLocaleString(), delta: '+8% vs last period', icon: PackageCheck, tone: 'text-cyan-200' },
    { label: 'Avg Order Value', value: `$${Number(report.averageOrderValue || 0).toLocaleString()}`, delta: '+4% vs last period', icon: LineChart, tone: 'text-violet-200' },
    { label: 'Fulfillment Rate', value: `${Number(report.fulfillmentRate || 0)}%`, delta: '+1.2% vs last period', icon: Zap, tone: 'text-amber-200' },
  ]
  const maxSales = Math.max(...(report.salesTrend || []).map((data) => Number(data.sales || 0)), 1)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="page-kicker">Executive analytics</p>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Review revenue, orders, product velocity, and category performance across the operating period.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="field sm:w-44">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button type="button" className="action-primary">
              <Download size={18} />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} className="metric-card p-5">
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="metric-label">{kpi.label}</p>
                    <p className="metric-value">{kpi.value}</p>
                    <p className="metric-note text-emerald-200/80">{kpi.delta}</p>
                  </div>
                  <div className={`rounded-lg border border-white/10 bg-white/[0.07] p-3 ${kpi.tone}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="glass-panel rounded-lg p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="section-title">Sales Trend</h2>
                <p className="mt-1 text-sm text-slate-400">Sales in USD by operating day</p>
              </div>
              <BarChart3 className="text-cyan-200" size={22} />
            </div>
            <div className="chart-surface flex h-80 items-end gap-3 rounded-lg border border-white/10 p-4">
              {(report.salesTrend || []).map((data) => (
                <div key={data.date} className="flex h-full flex-1 flex-col justify-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-cyan-400 via-emerald-300 to-white/90 shadow-[0_0_28px_rgba(45,212,191,0.16)]"
                    style={{ height: `${(Number(data.sales || 0) / maxSales) * 100}%` }}
                    title={`$${Number(data.sales || 0).toLocaleString()}`}
                  />
                  <p className="mt-3 text-center text-xs text-slate-500">{data.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-lg p-6">
            <h2 className="section-title">Top Products</h2>
            <p className="mt-1 text-sm text-slate-400">Revenue leaders</p>
            <div className="mt-6 space-y-5">
              {(report.topProducts || []).map((product) => (
                <div key={product.name}>
                  <div className="mb-2 flex justify-between gap-3 text-sm">
                    <span className="font-medium text-white">{product.name}</span>
                    <span className="font-semibold text-emerald-200">${Number(product.sales || 0).toLocaleString()}</span>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill bg-gradient-to-r from-emerald-300 to-cyan-300"
                      style={{ width: `${Math.min(100, (Number(product.sales || 0) / Math.max(...(report.topProducts || []).map((p) => Number(p.sales || 0)), 1)) * 100)}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{product.units} units sold</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg p-6">
          <h2 className="section-title">Category Performance</h2>
          <p className="mt-1 text-sm text-slate-400">Revenue, units sold, and growth by category</p>
          <div className="mt-4 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Revenue</th>
                  <th>Units Sold</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {(report.categoryPerformance || []).map((row) => (
                  <tr key={row.category}>
                    <td className="font-semibold text-white">{row.category}</td>
                    <td>${Number(row.revenue || 0).toLocaleString()}</td>
                    <td>{row.unitsSold}</td>
                    <td>
                      <span className="status-pill status-green">{row.growth}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
