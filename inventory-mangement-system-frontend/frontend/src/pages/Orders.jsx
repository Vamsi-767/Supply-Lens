import { useEffect, useState } from 'react'
import Eye from 'lucide-react/dist/esm/icons/eye.mjs'
import FilePlus2 from 'lucide-react/dist/esm/icons/file-plus-2.mjs'
import PackageOpen from 'lucide-react/dist/esm/icons/package-open.mjs'
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw.mjs'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.mjs'
import Timer from 'lucide-react/dist/esm/icons/timer.mjs'
import Truck from 'lucide-react/dist/esm/icons/truck.mjs'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import AnimatedNumber from '../components/AnimatedNumber'
import { showToast } from '../components/Toast'
import api from '../services/api'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 25

  const loadOrders = () => {
    api.get('/orders')
      .then((response) => setOrders(response.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadOrders()
    const interval = setInterval(loadOrders, 15000)
    return () => clearInterval(interval)
  }, [])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'status-green'
      case 'Pending': return 'status-amber'
      case 'In Transit': return 'status-blue'
      case 'Processing': return 'status-violet'
      case 'Confirmed': return 'status-blue'
      default: return 'status-red'
    }
  }

  const totalPages = Math.ceil(orders.length / perPage)
  const paginatedOrders = orders.slice((page - 1) * perPage, page * perPage)

  const metrics = [
    { label: 'Total Orders', value: orders.length, note: 'All time', icon: ShoppingCart, tone: 'text-blue-400' },
    { label: 'Total Revenue', value: orders.reduce((sum, o) => sum + Number(o.amount || 0), 0), prefix: '$', note: 'All time', icon: PackageOpen, tone: 'text-green-400' },
    { label: 'Pending', value: orders.filter((o) => o.status === 'Pending').length, note: 'Awaiting approval', icon: Timer, tone: 'text-amber-400' },
    { label: 'In Transit', value: orders.filter((o) => o.status === 'In Transit').length, note: 'On the way', icon: Truck, tone: 'text-purple-400' },
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
          <button type="button" className="action-primary" onClick={() => setShowNewOrderModal(true)}>
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
                    <p className="metric-value">
                      <AnimatedNumber value={metric.value} prefix={metric.prefix || ''} live />
                    </p>
                    <p className="metric-note">{metric.note}</p>
                  </div>
                  <div className={`rounded-lg border border-slate-600 bg-slate-800 p-2.5 ${metric.tone}`}>
                    <Icon size={20} />
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
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading orders...</div>
          ) : (
            <>
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
                    {paginatedOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="font-mono text-cyan-200">{order.orderNumber}</td>
                        <td className="font-semibold text-white">{order.customer}</td>
                        <td>
                          <span className="status-pill status-blue">{order.items} items</span>
                        </td>
                        <td>{String(order.date).slice(0, 10)}</td>
                        <td className="font-semibold text-white">${Number(order.amount || 0).toFixed(2)}</td>
                        <td>
                          <span className={`status-pill ${getStatusColor(order.status)}`}>{order.status}</span>
                        </td>
                        <td>
                          <button type="button" className="icon-button" aria-label={`View ${order.orderNumber}`} onClick={() => handleViewOrder(order)}>
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                  <p className="text-sm text-slate-400">
                    Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, orders.length)} of {orders.length}
                  </p>
                  <div className="flex gap-2">
                    <button type="button" className="action-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                    <button type="button" className="action-ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Order Details">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">Order Number</p>
                <p className="font-mono text-cyan-200">{selectedOrder.orderNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <span className={`status-pill ${getStatusColor(selectedOrder.status)}`}>{selectedOrder.status}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Customer</p>
                <p className="font-medium text-white">{selectedOrder.customer}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Amount</p>
                <p className="font-semibold text-emerald-200">${Number(selectedOrder.amount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Date</p>
                <p className="text-slate-300">{String(selectedOrder.date).slice(0, 10)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Items</p>
                <p className="text-slate-300">{selectedOrder.items} items</p>
              </div>
            </div>
            <div className="flex justify-end pt-4">
              <button type="button" className="action-primary" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* New Order Modal */}
      <Modal open={showNewOrderModal} onClose={() => setShowNewOrderModal(false)} title="Create New Order">
        <form onSubmit={(e) => { e.preventDefault(); setShowNewOrderModal(false); showToast('Order created successfully') }} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Customer Name *</span>
            <input className="field" required placeholder="e.g. John Smith" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Product / Item</span>
            <input className="field" placeholder="Search product..." />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Quantity</span>
              <input className="field" type="number" min="1" defaultValue="1" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Priority</span>
              <select className="field">
                <option value="normal">Normal</option>
                <option value="urgent">Urgent</option>
                <option value="low">Low</option>
              </select>
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Notes</span>
            <textarea className="field" rows="2" placeholder="Special instructions..." />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="action-ghost" onClick={() => setShowNewOrderModal(false)}>Cancel</button>
            <button type="submit" className="action-primary">Create Order</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
