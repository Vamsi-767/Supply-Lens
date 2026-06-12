import { useEffect, useState } from 'react'
import Eye from 'lucide-react/dist/esm/icons/eye.mjs'
import FilePlus2 from 'lucide-react/dist/esm/icons/file-plus-2.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import Truck from 'lucide-react/dist/esm/icons/truck.mjs'
import WalletCards from 'lucide-react/dist/esm/icons/wallet-cards.mjs'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import api from '../services/api'

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showNewPOModal, setShowNewPOModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [page, setPage] = useState(1)
  const perPage = 25

  useEffect(() => {
    setLoading(true)
    api.get('/purchase-orders')
      .then((response) => setOrders(response.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [])

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const statusClass = (status) => {
    switch (status) {
      case 'RECEIVED': return 'status-green'
      case 'ORDERED':
      case 'APPROVED': return 'status-blue'
      case 'SUBMITTED':
      case 'DRAFT': return 'status-amber'
      default: return 'status-violet'
    }
  }

  const totalPages = Math.ceil(orders.length / perPage)
  const paginatedOrders = orders.slice((page - 1) * perPage, page * perPage)
  const totalAmount = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-kicker">Procurement control</p>
            <h1 className="page-title">Purchase Orders</h1>
            <p className="page-subtitle">Track supplier replenishment, expected delivery dates, receiving state, and procurement value.</p>
          </div>
          <button type="button" className="action-primary" onClick={() => setShowNewPOModal(true)}>
            <FilePlus2 size={18} />
            New PO
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="metric-card p-5">
            <div className="relative flex items-start justify-between">
              <div>
                <p className="metric-label">Purchase Orders</p>
                <p className="metric-value">{orders.length.toLocaleString()}</p>
                <p className="metric-note">Supplier replenishment flows</p>
              </div>
              <PackageCheck className="text-cyan-200" size={24} />
            </div>
          </div>
          <div className="metric-card p-5">
            <div className="relative flex items-start justify-between">
              <div>
                <p className="metric-label">Open Value</p>
                <p className="metric-value">${totalAmount.toLocaleString()}</p>
                <p className="metric-note">Committed procurement spend</p>
              </div>
              <WalletCards className="text-emerald-200" size={24} />
            </div>
          </div>
          <div className="metric-card p-5">
            <div className="relative flex items-start justify-between">
              <div>
                <p className="metric-label">In Transit</p>
                <p className="metric-value">{orders.filter((order) => ['ORDERED', 'APPROVED'].includes(order.status)).length}</p>
                <p className="metric-note">Expected deliveries active</p>
              </div>
              <Truck className="text-amber-200" size={24} />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-lg">
          <div className="border-b border-white/10 p-6">
            <h2 className="section-title">Supplier Replenishment</h2>
            <p className="mt-1 text-sm text-slate-400">Purchase orders and delivery commitments</p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading purchase orders...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PO Number</th>
                      <th>Supplier</th>
                      <th>Branch</th>
                      <th>Order Date</th>
                      <th>Expected</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="font-mono text-cyan-200">{order.poNumber}</td>
                        <td className="font-semibold text-white">{order.supplier}</td>
                        <td>{order.branch}</td>
                        <td>{String(order.orderDate).slice(0, 10)}</td>
                        <td>{String(order.expectedDeliveryDate).slice(0, 10)}</td>
                        <td className="font-semibold text-white">${Number(order.amount || 0).toFixed(2)}</td>
                        <td>
                          <span className={`status-pill ${statusClass(order.status)}`}>{String(order.status).replace('_', ' ')}</span>
                        </td>
                        <td>
                          <button type="button" className="icon-button" aria-label={`View ${order.poNumber}`} onClick={() => handleViewOrder(order)}>
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

      {/* PO Detail Modal */}
      <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Purchase Order Details">
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-500">PO Number</p>
                <p className="font-mono text-cyan-200">{selectedOrder.poNumber}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Status</p>
                <span className={`status-pill ${statusClass(selectedOrder.status)}`}>{selectedOrder.status}</span>
              </div>
              <div>
                <p className="text-xs text-slate-500">Supplier</p>
                <p className="font-medium text-white">{selectedOrder.supplier}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Branch</p>
                <p className="text-slate-300">{selectedOrder.branch}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Order Date</p>
                <p className="text-slate-300">{String(selectedOrder.orderDate).slice(0, 10)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Expected Delivery</p>
                <p className="text-slate-300">{String(selectedOrder.expectedDeliveryDate).slice(0, 10)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Amount</p>
                <p className="font-semibold text-emerald-200">${Number(selectedOrder.amount || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Items</p>
                <p className="text-slate-300">{selectedOrder.items} line items</p>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" className="action-ghost" onClick={() => { setShowDetailModal(false); showToast('Purchase order marked as received') }}>Mark Received</button>
              <button type="button" className="action-primary" onClick={() => setShowDetailModal(false)}>Close</button>
            </div>
          </div>
        )}
      </Modal>

      {/* New PO Modal */}
      <Modal open={showNewPOModal} onClose={() => setShowNewPOModal(false)} title="Create Purchase Order">
        <form onSubmit={(e) => { e.preventDefault(); setShowNewPOModal(false); showToast('Purchase order created successfully') }} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Supplier *</span>
            <input className="field" required placeholder="Select or type supplier name" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Product / Item *</span>
            <input className="field" required placeholder="Search product..." />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Quantity *</span>
              <input className="field" type="number" min="1" required defaultValue="100" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Expected Delivery</span>
              <input className="field" type="date" />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Notes</span>
            <textarea className="field" rows="2" placeholder="Special terms or instructions..." />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="action-ghost" onClick={() => setShowNewPOModal(false)}>Cancel</button>
            <button type="submit" className="action-primary">Create PO</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
