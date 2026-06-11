import { useEffect, useState } from 'react'
import Eye from 'lucide-react/dist/esm/icons/eye.mjs'
import FilePlus2 from 'lucide-react/dist/esm/icons/file-plus-2.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import Truck from 'lucide-react/dist/esm/icons/truck.mjs'
import WalletCards from 'lucide-react/dist/esm/icons/wallet-cards.mjs'
import Layout from '../components/Layout'
import api from '../services/api'

export default function PurchaseOrders() {
  const fallbackOrders = [
    { id: 1, poNumber: 'PO-1001', supplier: 'Tech World', branch: 'Main Fulfillment Hub', orderDate: '2026-06-09', expectedDeliveryDate: '2026-06-16', amount: 12450, status: 'ORDERED', items: 2 },
    { id: 2, poNumber: 'PO-1002', supplier: 'Global Supplies', branch: 'North Retail Node', orderDate: '2026-06-09', expectedDeliveryDate: '2026-06-21', amount: 3420, status: 'SUBMITTED', items: 2 },
  ]
  const [orders, setOrders] = useState(fallbackOrders)

  useEffect(() => {
    api.get('/purchase-orders')
      .then((response) => setOrders(response.data))
      .catch(() => setOrders(fallbackOrders))
  }, [])

  const statusClass = (status) => {
    switch (status) {
      case 'RECEIVED':
        return 'status-green'
      case 'ORDERED':
      case 'APPROVED':
        return 'status-blue'
      case 'SUBMITTED':
      case 'DRAFT':
        return 'status-amber'
      default:
        return 'status-violet'
    }
  }

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
          <button type="button" className="action-primary">
            <FilePlus2 size={18} />
            New PO
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="metric-card p-5">
            <div className="relative flex items-start justify-between">
              <div>
                <p className="metric-label">Purchase Orders</p>
                <p className="metric-value">{orders.length}</p>
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
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-cyan-200">{order.poNumber}</td>
                    <td className="font-semibold text-white">{order.supplier}</td>
                    <td>{order.branch}</td>
                    <td>{String(order.orderDate).slice(0, 10)}</td>
                    <td>{String(order.expectedDeliveryDate).slice(0, 10)}</td>
                    <td className="font-semibold text-white">${Number(order.amount || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status-pill ${statusClass(order.status)}`}>{String(order.status).replace('_', ' ')}</span>
                    </td>
                    <td>
                      <button type="button" className="icon-button" aria-label={`View ${order.poNumber}`}>
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
