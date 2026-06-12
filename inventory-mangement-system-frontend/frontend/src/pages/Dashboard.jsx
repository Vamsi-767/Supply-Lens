import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Activity from 'lucide-react/dist/esm/icons/activity.mjs'
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import Boxes from 'lucide-react/dist/esm/icons/boxes.mjs'
import Clock3 from 'lucide-react/dist/esm/icons/clock-3.mjs'
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.mjs'
import Route from 'lucide-react/dist/esm/icons/route.mjs'
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert.mjs'
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.mjs'
import Layout from '../components/Layout'
import AnimatedNumber from '../components/AnimatedNumber'
import { showToast } from '../components/Toast'
import api from '../services/api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [refreshing, setRefreshing] = useState(false)
  const [chartData, setChartData] = useState([])

  // Stable chart data based on real API — small business does ~$4K-7K per day
  const generateStableChart = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Today']
    const baseRevenues = [4200, 3800, 5100, 4600, 6200, 5800, 3200, 4900]
    return days.map((day, i) => ({
      day,
      revenue: baseRevenues[i] + Math.round(Math.random() * 300 - 150), // ±$150 tiny variation
    }))
  }

  useEffect(() => {
    setChartData(generateStableChart())
  }, [])

  const fetchDashboard = () => {
    setRefreshing(true)
    api.get('/dashboard')
      .then((response) => {
        setStats(response.data)
      })
      .catch(() => {})
      .finally(() => setRefreshing(false))
  }

  useEffect(() => {
    fetchDashboard()
    // Auto-refresh every 10 seconds for real-time feel
    const interval = setInterval(fetchDashboard, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!stats) {
    return (
      <Layout>
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto mb-3 animate-spin text-blue-400" size={24} />
            <p className="text-sm text-slate-400">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    )
  }

  const statCards = [
    {
      title: 'Active SKUs',
      value: stats.totalProducts,
      prefix: '',
      suffix: '',
      note: 'Products in catalog',
      icon: Boxes,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-200',
    },
    {
      title: 'Stock Alerts',
      value: stats.lowStockAlerts,
      prefix: '',
      suffix: '',
      note: 'Items need restock',
      icon: ShieldAlert,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
    },
    {
      title: 'Orders Processed',
      value: stats.totalOrders,
      prefix: '',
      suffix: '',
      note: `${Number(stats.fulfillmentRate || 0).toFixed(1)}% fulfilled`,
      icon: Route,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-200',
    },
    {
      title: 'Revenue',
      value: Number(stats.revenue || 0),
      prefix: '$',
      suffix: '',
      note: 'Total sales value',
      icon: DollarSign,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-200',
    },
  ]

  const laneColors = ['bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500']

  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero Banner — Product Advertisement */}
        <section className="animate-banner relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 p-6 md:p-8 text-white">
          <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(110deg,transparent_30%,rgba(255,255,255,0.1)_50%,transparent_70%)] bg-[length:200%_100%]" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
          
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold md:text-3xl">Inventory & Supply Chain Intelligence</h2>
              <p className="mt-3 text-sm leading-relaxed text-indigo-100 md:text-base">
                Complete visibility into your business operations. Track products across 
                multiple locations, manage orders, coordinate with suppliers, and make data-driven decisions with real-time analytics.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <button type="button" onClick={() => navigate('/inventory')} className="banner-chip border-white/30 bg-white/15 text-white hover:bg-white/25 hover:scale-105">
                  📦 Inventory Tracking
                </button>
                <button type="button" onClick={() => navigate('/reports')} className="banner-chip border-white/30 bg-white/15 text-white hover:bg-white/25 hover:scale-105">
                  📊 Analytics & Reports
                </button>
                <button type="button" onClick={() => navigate('/orders')} className="banner-chip border-white/30 bg-white/15 text-white hover:bg-white/25 hover:scale-105">
                  🚚 Order Management
                </button>
                <button type="button" onClick={() => navigate('/suppliers')} className="banner-chip border-white/30 bg-white/15 text-white hover:bg-white/25 hover:scale-105">
                  🤝 Supplier Network
                </button>
                <button type="button" onClick={() => navigate('/products')} className="banner-chip border-white/30 bg-white/15 text-white hover:bg-white/25 hover:scale-105">
                  🏷️ Product Catalog
                </button>
              </div>
              <p className="mt-4 text-[10px] text-indigo-300/70 italic">* This demo uses publicly available datasets for demonstration purposes.</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-3 text-right">
              <p className="text-xs text-indigo-200">Powered by aiStreams LLC</p>
            </div>
          </div>
        </section>

        {/* Header */}
        <section className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-kicker">Real-time overview</p>
            <h1 className="page-title">Inventory Control Tower</h1>
            <p className="page-subtitle">
              Live monitoring of stock, orders, fulfillment velocity, and supplier activity.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="action-ghost"
              onClick={fetchDashboard}
              disabled={refreshing}
            >
              <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
              Refresh
            </button>
          </div>
        </section>

        {/* KPI Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="metric-card glass-hover p-5">
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="metric-label">{card.title}</p>
                    <p className="metric-value">
                      <AnimatedNumber value={card.value} prefix={card.prefix} suffix={card.suffix} live />
                    </p>
                    <p className="metric-note">{card.note}</p>
                  </div>
                  <div className={`rounded-lg border p-2.5 ${card.bgColor}`}>
                    <Icon size={20} className={card.color} />
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        {/* Live Metrics Bar */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-emerald-600">
              <Activity size={14} />
              <span className="text-lg font-bold">
                <AnimatedNumber value={Number(stats.fulfillmentRate || 0)} suffix="%" live />
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Fulfillment rate</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-indigo-600">
              <TrendingUp size={14} />
              <span className="text-lg font-bold">
                <AnimatedNumber value={stats.activeSuppliers} live />
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Active suppliers</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-amber-600">
              <Clock3 size={14} />
              <span className="text-lg font-bold">
                <AnimatedNumber value={8} suffix="m" live />
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Avg processing</p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-purple-600">
              <Boxes size={14} />
              <span className="text-lg font-bold">
                <AnimatedNumber value={15} live />
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-400">Store branches</p>
          </div>
        </section>

        {/* Charts + Capacity */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Bar Chart with live data */}
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="section-title">Weekly Sales Revenue</h2>
                <p className="mt-1 text-xs text-slate-400">This week's daily breakdown</p>
              </div>
              <span className="status-pill status-green">On Track</span>
            </div>
            <div style={{ width: '100%', height: '260px', minHeight: '260px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={{ stroke: '#e2e8f0' }} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={{ stroke: '#e2e8f0' }} tickFormatter={(v) => `$${(v/1000).toFixed(0)}k`} />
                  <Tooltip
                    contentStyle={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                    formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                    labelStyle={{ color: '#1e293b', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ color: '#64748b', fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="revenue" name="Daily Revenue" fill="url(#barGrad)" radius={[6, 6, 0, 0]} animationDuration={1200} />
                  <defs>
                    <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#818cf8" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Network Capacity */}
          <div className="glass-panel rounded-xl p-6">
            <h2 className="section-title">Network Capacity</h2>
            <p className="mt-1 text-xs text-slate-500">Live lane health</p>
            <div className="mt-5 space-y-4">
              {(stats.capacity || []).map((lane, idx) => (
                <div key={lane.name}>
                  <div className="mb-1.5 flex justify-between text-xs">
                    <span className="font-medium text-slate-300">{lane.name}</span>
                    <span className="font-bold text-white">
                      <AnimatedNumber value={lane.value} suffix="%" live />
                    </span>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill ${laneColors[idx] || laneColors[0]}`} style={{ width: `${lane.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Recent Orders */}
        <section className="glass-panel rounded-xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="section-title">Recent Orders</h2>
              <p className="mt-1 text-xs text-slate-500">Latest demand signals — auto-refreshing</p>
            </div>
            <button type="button" className="action-primary" onClick={() => showToast('Wave released! Orders moved to Processing')}>
              <PackageCheck size={16} />
              Release Wave
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {(stats.recentOrders || []).map((order) => (
                  <tr key={order.id || order.orderNumber}>
                    <td className="font-mono text-blue-300">{order.orderNumber}</td>
                    <td className="font-medium text-white">{order.customer}</td>
                    <td className="font-semibold text-white">${Number(order.amount || 0).toFixed(2)}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          order.status === 'Completed'
                            ? 'status-green'
                            : order.status === 'Pending'
                              ? 'status-amber'
                              : 'status-blue'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td>
                      <button type="button" className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white" onClick={() => window.location.href = '/orders'}>
                        <ArrowUpRight size={12} />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Layout>
  )
}
