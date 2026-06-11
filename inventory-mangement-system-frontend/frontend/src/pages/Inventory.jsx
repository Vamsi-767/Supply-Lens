import { useEffect, useState } from 'react'
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle.mjs'
import ClipboardEdit from 'lucide-react/dist/esm/icons/clipboard-edit.mjs'
import GitBranch from 'lucide-react/dist/esm/icons/git-branch.mjs'
import Layers3 from 'lucide-react/dist/esm/icons/layers-3.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import UploadCloud from 'lucide-react/dist/esm/icons/upload-cloud.mjs'
import Layout from '../components/Layout'
import api from '../services/api'

export default function Inventory() {
  const fallbackInventory = [
    { id: 1, productName: 'Laptop Pro', sku: 'LAP-001', branch: 'Main Store', quantity: 45, reorderPoint: 10, status: 'Good' },
    { id: 2, productName: 'Wireless Mouse', sku: 'MOU-002', branch: 'Main Store', quantity: 5, reorderPoint: 20, status: 'Critical' },
    { id: 3, productName: 'USB-C Cable', sku: 'CAB-003', branch: 'Branch 1', quantity: 500, reorderPoint: 50, status: 'Excellent' },
    { id: 4, productName: 'Monitor 27"', sku: 'MON-004', branch: 'Branch 2', quantity: 8, reorderPoint: 5, status: 'Good' },
    { id: 5, productName: 'Keyboard RGB', sku: 'KEY-005', branch: 'Main Store', quantity: 15, reorderPoint: 25, status: 'Critical' },
  ]
  const [inventory, setInventory] = useState(fallbackInventory)

  useEffect(() => {
    api.get('/inventory')
      .then((response) => setInventory(response.data))
      .catch(() => setInventory(fallbackInventory))
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent':
        return 'status-green'
      case 'Good':
        return 'status-blue'
      case 'Critical':
        return 'status-red'
      default:
        return 'status-amber'
    }
  }

  const alertCards = [
    { title: 'Critical Stock', value: 2, note: 'Items below reorder point', icon: AlertTriangle, tone: 'text-rose-200' },
    { title: 'Low Stock', value: 0, note: 'Items below 50 units', icon: Layers3, tone: 'text-amber-200' },
    { title: 'Total Items', value: 5, note: 'Unique products', icon: PackageCheck, tone: 'text-emerald-200' },
    { title: 'Branches', value: 3, note: 'Active locations', icon: GitBranch, tone: 'text-cyan-200' },
  ]

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-kicker">Stock command</p>
            <h1 className="page-title">Inventory Management</h1>
            <p className="page-subtitle">Track stock, reorder thresholds, and branch-level exceptions before they turn into missed shipments.</p>
          </div>
          <button type="button" className="action-primary">
            <UploadCloud size={18} />
            Bulk Update
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {alertCards.map((card) => {
            const Icon = card.icon
            return (
              <div key={card.title} className="metric-card glass-hover p-5">
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="metric-label">{card.title}</p>
                    <p className="metric-value">{card.value}</p>
                    <p className="metric-note">{card.note}</p>
                  </div>
                  <div className={`rounded-lg border border-white/10 bg-white/[0.07] p-3 ${card.tone}`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="glass-panel rounded-lg">
          <div className="border-b border-white/10 p-6">
            <h2 className="section-title">Branch Stock Ledger</h2>
            <p className="mt-1 text-sm text-slate-400">Current on-hand inventory by location</p>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Branch</th>
                  <th>Current Qty</th>
                  <th>Reorder Point</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td className="font-semibold text-white">{item.productName}</td>
                    <td className="font-mono text-cyan-200">{item.sku}</td>
                    <td>{item.branch}</td>
                    <td className="font-semibold text-white">{item.quantity}</td>
                    <td>{item.reorderPoint}</td>
                    <td>
                      <span className={`status-pill ${getStatusColor(item.status)}`}>{item.status}</span>
                    </td>
                    <td>
                      <button type="button" className="icon-button" aria-label={`Edit ${item.productName}`}>
                        <ClipboardEdit size={16} />
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
