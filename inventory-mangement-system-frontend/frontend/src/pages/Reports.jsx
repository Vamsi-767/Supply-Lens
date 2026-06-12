import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Download from 'lucide-react/dist/esm/icons/download.mjs'
import LineChart from 'lucide-react/dist/esm/icons/line-chart.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.mjs'
import Zap from 'lucide-react/dist/esm/icons/zap.mjs'
import Layout from '../components/Layout'
import api from '../services/api'

const COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b', '#ef4444', '#10b981', '#ec4899', '#f97316']

export default function Reports() {
  const [dateRange, setDateRange] = useState('month')
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get('/reports')
      .then((response) => setReport(response.data))
      .catch(() => setReport(null))
      .finally(() => setLoading(false))
  }, [])

  const handleExport = () => {
    if (!report) return
    const csvContent = [
      'Metric,Value',
      `Total Revenue,$${Number(report.totalRevenue || 0).toFixed(2)}`,
      `Total Orders,${report.totalOrders}`,
      `Average Order Value,$${Number(report.averageOrderValue || 0).toFixed(2)}`,
      `Fulfillment Rate,${report.fulfillmentRate}%`,
      '',
      'Top Products',
      'Product,Sales,Units',
      ...(report.topProducts || []).map((p) => `${p.name},$${p.sales},${p.units}`),
      '',
      'Category Performance',
      'Category,Revenue,Units Sold,Growth',
      ...(report.categoryPerformance || []).map((c) => `${c.category},$${c.revenue},${c.unitsSold},${c.growth}`),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `supply-lens-report-${dateRange}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center text-slate-400">Loading reports...</div>
      </Layout>
    )
  }

  if (!report) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center text-slate-400">Failed to load reports</div>
      </Layout>
    )
  }

  const kpis = [
    { label: 'Total Revenue', value: `$${Number(report.totalRevenue || 0).toLocaleString()}`, delta: '+12% vs last period', icon: TrendingUp, tone: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { label: 'Total Orders', value: Number(report.totalOrders || 0).toLocaleString(), delta: '+8% vs last period', icon: PackageCheck, tone: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200' },
    { label: 'Avg Order Value', value: `$${Number(report.averageOrderValue || 0).toFixed(2)}`, delta: '+4% vs last period', icon: LineChart, tone: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { label: 'Fulfillment Rate', value: `${Number(report.fulfillmentRate || 0)}%`, delta: 'Shipped + Delivered', icon: Zap, tone: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
  ]

  const salesData = (report.salesTrend || []).slice(0, 10).map((d) => ({
    date: d.date,
    sales: Number(d.sales || 0),
  }))

  // Take top 6 categories only for clean pie chart
  const pieData = (report.categoryPerformance || [])
    .sort((a, b) => Number(b.revenue || 0) - Number(a.revenue || 0))
    .slice(0, 6)
    .map((c) => ({
      name: c.category.length > 15 ? c.category.slice(0, 15) + '…' : c.category,
      value: Number(c.revenue || 0),
    }))

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="page-kicker">Executive analytics</p>
            <h1 className="page-title">Reports & Analytics</h1>
            <p className="page-subtitle">Revenue, orders, product velocity, and category performance.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="field sm:w-44">
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button type="button" className="action-primary" onClick={handleExport}>
              <Download size={18} />
              Export CSV
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon
            return (
              <div key={kpi.label} className="metric-card p-5">
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="metric-label">{kpi.label}</p>
                    <p className="metric-value">{kpi.value}</p>
                    <p className="metric-note text-emerald-600">{kpi.delta}</p>
                  </div>
                  <div className={`rounded-lg border p-2.5 ${kpi.bg}`}>
                    <Icon size={20} className={kpi.tone} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {/* Sales Trend */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-4">
              <h2 className="section-title">Sales Trend</h2>
              <p className="mt-1 text-xs text-slate-400">Revenue by date</p>
            </div>
            <div style={{ width: '100%', height: '280px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(v) => `$${v}`} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                    formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Revenue']}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="sales" name="Revenue" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart — top 6 categories, NO labels on chart, use legend below */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="section-title">Revenue by Category</h2>
            <p className="mt-1 text-xs text-slate-400">Top 6 categories</p>
            <div style={{ width: '100%', height: '220px' }} className="mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={35}>
                    {pieData.map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend below chart */}
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: COLORS[idx % COLORS.length] }} />
                  <span className="truncate text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="section-title">Top Products by Revenue</h2>
          <p className="mt-1 text-xs text-slate-400">Best-performing items</p>
          <div className="mt-4 space-y-4">
            {(report.topProducts || []).map((product, idx) => (
              <div key={product.name}>
                <div className="mb-2 flex justify-between gap-3 text-sm">
                  <span className="font-medium text-slate-800">{idx + 1}. {product.name}</span>
                  <span className="font-bold text-indigo-600">${Number(product.sales || 0).toLocaleString()} ({product.units} units)</span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill bg-indigo-500"
                    style={{ width: `${Math.min(100, (Number(product.sales || 0) / Math.max(...(report.topProducts || []).map((p) => Number(p.sales || 0)), 1)) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Table */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="section-title">Category Performance</h2>
          <p className="mt-1 text-xs text-slate-400">Revenue, units sold, and growth by category</p>
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
                {(report.categoryPerformance || []).slice(0, 8).map((row) => (
                  <tr key={row.category}>
                    <td className="font-medium text-slate-800">{row.category}</td>
                    <td className="font-semibold">${Number(row.revenue || 0).toLocaleString()}</td>
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
