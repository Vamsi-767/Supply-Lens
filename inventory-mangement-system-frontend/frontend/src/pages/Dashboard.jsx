import { useEffect, useState } from 'react'
import Activity from 'lucide-react/dist/esm/icons/activity.mjs'
import ArrowUpRight from 'lucide-react/dist/esm/icons/arrow-up-right.mjs'
import Boxes from 'lucide-react/dist/esm/icons/boxes.mjs'
import Clock3 from 'lucide-react/dist/esm/icons/clock-3.mjs'
import DollarSign from 'lucide-react/dist/esm/icons/dollar-sign.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import Route from 'lucide-react/dist/esm/icons/route.mjs'
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert.mjs'
import Layout from '../components/Layout'
import api from '../services/api'

export default function Dashboard() {
  const fallback = {
    totalProducts: 1250,
    lowStockAlerts: 45,
    totalOrders: 3420,
    revenue: 125640,
    fulfillmentRate: 98.5,
    recentOrders: [
      { orderNumber: 'ORD001', customer: 'John Doe', amount: 2500, status: 'Completed', eta: 'Delivered' },
      { orderNumber: 'ORD002', customer: 'Jane Smith', amount: 3200, status: 'Pending', eta: 'Approval' },
      { orderNumber: 'ORD003', customer: 'Mike Johnson', amount: 1800, status: 'In Transit', eta: '2h 18m' },
    ],
    capacity: [
      { name: 'Inbound receiving', value: 84 },
      { name: 'Picking capacity', value: 72 },
      { name: 'Dock utilization', value: 61 },
      { name: 'Exception queue', value: 28 },
    ],
  }
  const [stats, setStats] = useState(fallback)

  useEffect(() => {
    api.get('/dashboard')
      .then((response) => setStats({ ...fallback, ...response.data }))
      .catch(() => setStats(fallback))
  }, [])

  const statCards = [
    {
      title: 'Active SKUs',
      value: stats.totalProducts.toLocaleString(),
      note: 'Across 3 fulfillment nodes',
      icon: Boxes,
      accent: 'text-cyan-200',
    },
    {
      title: 'Stock Alerts',
      value: stats.lowStockAlerts,
      note: `${stats.lowStockAlerts} require action today`,
      icon: ShieldAlert,
      accent: 'text-rose-200',
    },
    {
      title: 'Orders Routed',
      value: stats.totalOrders.toLocaleString(),
      note: `${Number(stats.fulfillmentRate || 0)}% shipped or delivered`,
      icon: Route,
      accent: 'text-emerald-200',
    },
    {
      title: 'Revenue',
      value: `$${Number(stats.revenue || 0).toLocaleString()}`,
      note: '+14.8% month over month',
      icon: DollarSign,
      accent: 'text-amber-200',
    },
  ]

  const laneColors = ['from-emerald-300 to-cyan-300', 'from-cyan-300 to-sky-300', 'from-amber-300 to-orange-300', 'from-rose-300 to-fuchsia-300']

  return (
    <Layout>
      <div className="space-y-6">
        <section className="glass-panel rounded-lg p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="page-kicker">Supply chain command</p>
              <h1 className="page-title">Inventory Control Tower</h1>
              <p className="page-subtitle">
                Monitor stock risk, fulfillment velocity, order flow, and supplier movement from a single premium operations view.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3 text-sm sm:min-w-[360px] sm:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <div className="flex items-center gap-2 text-emerald-200">
                  <Activity size={16} />
                  <span className="font-semibold">{Number(stats.fulfillmentRate || 0)}%</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Fulfillment rate</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
                <div className="flex items-center gap-2 text-amber-200">
                  <Clock3 size={16} />
                  <span className="font-semibold">11m</span>
                </div>
                <p className="mt-1 text-xs text-slate-400">Avg pick delay</p>
              </div>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="metric-card glass-hover p-5">
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="metric-label">{card.title}</p>
                    <p className="metric-value">{card.value}</p>
                    <p className="metric-note">{card.note}</p>
                  </div>
                  <div className={`rounded-lg border border-white/10 bg-white/[0.07] p-3 ${card.accent}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="glass-panel rounded-lg p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="section-title">Demand vs Fulfillment</h2>
                <p className="mt-1 text-sm text-slate-400">Last 8 operational days</p>
              </div>
              <span className="status-pill status-green">On Plan</span>
            </div>
            <div className="chart-surface flex h-72 items-end gap-3 rounded-lg border border-white/10 p-4">
              {[65, 45, 78, 55, 85, 72, 90, 68].map((height, idx) => (
                <div key={idx} className="flex h-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-emerald-400 via-cyan-300 to-white/90 shadow-[0_0_30px_rgba(45,212,191,0.2)]"
                    style={{ height: `${height}%` }}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-lg p-6">
            <h2 className="section-title">Network Capacity</h2>
            <p className="mt-1 text-sm text-slate-400">Live lane health</p>
            <div className="mt-6 space-y-5">
              {(stats.capacity || []).map((lane, idx) => (
                <div key={lane.name}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="font-medium text-slate-200">{lane.name}</span>
                    <span className="text-slate-400">{lane.value}%</span>
                  </div>
                  <div className="progress-track">
                    <div className={`progress-fill bg-gradient-to-r ${laneColors[idx] || laneColors[0]}`} style={{ width: `${lane.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-lg p-6">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="section-title">Recent Orders</h2>
              <p className="mt-1 text-sm text-slate-400">Latest customer demand signals</p>
            </div>
            <button type="button" className="action-ghost">
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
                  <th>ETA</th>
                </tr>
              </thead>
              <tbody>
                {(stats.recentOrders || []).map((order) => (
                  <tr key={order.id || order.orderNumber}>
                    <td className="font-mono text-cyan-200">{order.orderNumber}</td>
                    <td className="font-medium text-white">{order.customer}</td>
                    <td>${Number(order.amount || 0).toLocaleString()}</td>
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
                      <span className="inline-flex items-center gap-2 text-slate-300">
                        <ArrowUpRight size={14} />
                        {order.status === 'Completed' ? 'Delivered' : order.status === 'Pending' ? 'Approval' : 'Active'}
                      </span>
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
