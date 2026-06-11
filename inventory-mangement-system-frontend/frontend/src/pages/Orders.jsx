import { useEffect, useState } from 'react'
import Eye from 'lucide-react/dist/esm/icons/eye.mjs'
import FilePlus2 from 'lucide-react/dist/esm/icons/file-plus-2.mjs'
import PackageOpen from 'lucide-react/dist/esm/icons/package-open.mjs'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.mjs'
import Timer from 'lucide-react/dist/esm/icons/timer.mjs'
import Truck from 'lucide-react/dist/esm/icons/truck.mjs'
import Layout from '../components/Layout'
import api from '../services/api'

export default function Orders() {
  const fallbackOrders = [
    { id: 1, orderNumber: 'ORD-001', customer: 'John Doe', date: '2026-06-10', amount: 2500, status: 'Completed', items: 3 },
    { id: 2, orderNumber: 'ORD-002', customer: 'Jane Smith', date: '2026-06-09', amount: 3200, status: 'Pending', items: 5 },
    { id: 3, orderNumber: 'ORD-003', customer: 'Mike Johnson', date: '2026-06-08', amount: 1800, status: 'In Transit', items: 2 },
    { id: 4, orderNumber: 'ORD-004', customer: 'Sarah Williams', date: '2026-06-07', amount: 4100, status: 'Completed', items: 7 },
  ]
  const [orders, setOrders] = useState(fallbackOrders)

  useEffect(() => {
    api.get('/orders')
      .then((response) => setOrders(response.data))
      .catch(() => setOrders(fallbackOrders))
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'status-green'
      case 'Pending':
        return 'status-amber'
      case 'In Transit':
        return 'status-blue'
      case 'Processing':
        return 'status-violet'
      default:
        return 'status-red'
    }
  }

  const metrics = [
    { label: 'Total Orders', value: orders.length, note: 'This month', icon: ShoppingCart, tone: 'text-cyan-200' },
    { label: 'Total Revenue', value: `$${orders.reduce((sum, o) => sum + o.amount, 0).toLocaleString()}`, note: 'All time', icon: PackageOpen, tone: 'text-emerald-200' },
    { label: 'Pending', value: orders.filter((o) => o.status === 'Pending').length, note: 'Awaiting approval', icon: Timer, tone: 'text-amber-200' },
    { label: 'In Transit', value: orders.filter((o) => o.status === 'In Transit').length, note: 'On the way', icon: Truck, tone: 'text-violet-200' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-kicker">Order orchestration</p>
            <h1 className="page-title">Sales Orders</h1>
            <p className="page-subtitle">Track customer demand, shipment state, value, and operational status in one dispatch-ready board.</p>
          </div>
          <button type="button" className="action-primary">
            <FilePlus2 size={18} />
            New Order
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const Icon = metric.icon
            return (
              <div key={metric.label} className="metric-card p-5">
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="metric-label">{metric.label}</p>
                    <p className="metric-value">{metric.value}</p>
                    <p className="metric-note">{metric.note}</p>
                  </div>
                  <div className={`rounded-lg border border-white/10 bg-white/[0.07] p-3 ${metric.tone}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="glass-panel rounded-lg">
          <div className="border-b border-white/10 p-6">
            <h2 className="section-title">Order Flow</h2>
            <p className="mt-1 text-sm text-slate-400">Customer orders and shipment readiness</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-cyan-200">{order.orderNumber}</td>
                    <td className="font-semibold text-white">{order.customer}</td>
                    <td>
                      <span className="status-pill status-blue">{order.items} items</span>
                    </td>
                    <td>{String(order.date).slice(0, 10)}</td>
                    <td className="font-semibold text-white">${Number(order.amount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status-pill ${getStatusColor(order.status)}`}>{order.status}</span>
                    </td>
                    <td>
                      <button type="button" className="icon-button" aria-label={`View ${order.orderNumber}`}>
                        <Eye size={16} />
                      </button>
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
