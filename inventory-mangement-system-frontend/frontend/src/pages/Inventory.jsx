import { useEffect, useState } from 'react'
import AlertTriangle from 'lucide-react/dist/esm/icons/alert-triangle.mjs'
import ClipboardEdit from 'lucide-react/dist/esm/icons/clipboard-edit.mjs'
import GitBranch from 'lucide-react/dist/esm/icons/git-branch.mjs'
import Layers3 from 'lucide-react/dist/esm/icons/layers-3.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import UploadCloud from 'lucide-react/dist/esm/icons/upload-cloud.mjs'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import AnimatedNumber from '../components/AnimatedNumber'
import { showToast } from '../components/Toast'
import api from '../services/api'

export default function Inventory() {
  const [inventory, setInventory] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBulkModal, setShowBulkModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editItem, setEditItem] = useState(null)
  const [editQty, setEditQty] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 30

  useEffect(() => {
    loadInventory()
    const interval = setInterval(loadInventory, 12000)
    return () => clearInterval(interval)
  }, [])

  const loadInventory = () => {
    api.get('/inventory')
      .then((response) => setInventory(response.data))
      .catch(() => setInventory([]))
      .finally(() => setLoading(false))
  }

  const handleEditItem = (item) => {
    setEditItem(item)
    setEditQty(item.quantity)
    setShowEditModal(true)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    // Update locally for demo
    setInventory((prev) =>
      prev.map((item) =>
        item.id === editItem.id ? { ...item, quantity: Number(editQty) } : item
      )
    )
    setShowEditModal(false)
    setEditItem(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Excellent': return 'status-green'
      case 'Good': return 'status-blue'
      case 'Critical': return 'status-red'
      default: return 'status-amber'
    }
  }

  const criticalItems = inventory.filter((i) => i.status === 'Critical')
  const lowStockItems = inventory.filter((i) => i.quantity < 50 && i.status !== 'Critical')
  const branches = [...new Set(inventory.map((i) => i.branch))]
  const totalPages = Math.ceil(inventory.length / perPage)
  const paginatedInventory = inventory.slice((page - 1) * perPage, page * perPage)

  const alertCards = [
    { title: 'Critical Stock', value: criticalItems.length, note: 'Items below reorder point', icon: AlertTriangle, tone: 'text-red-400' },
    { title: 'Low Stock', value: lowStockItems.length, note: 'Items below 50 units', icon: Layers3, tone: 'text-amber-400' },
    { title: 'Total Items', value: inventory.length, note: 'Unique inventory records', icon: PackageCheck, tone: 'text-green-400' },
    { title: 'Branches', value: branches.length, note: 'Active locations', icon: GitBranch, tone: 'text-blue-400' },
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
          <button type="button" className="action-primary" onClick={() => setShowBulkModal(true)}>
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
                    <p className="metric-value">
                      <AnimatedNumber value={card.value} live />
                    </p>
                    <p className="metric-note">{card.note}</p>
                  </div>
                  <div className={`rounded-lg border border-slate-600 bg-slate-800 p-2.5 ${card.tone}`}>
                    <Icon size={20} />
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
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading inventory...</div>
          ) : (
            <>
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
                    {paginatedInventory.map((item) => (
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
                          <button type="button" className="icon-button" aria-label={`Edit ${item.productName}`} onClick={() => handleEditItem(item)}>
                            <ClipboardEdit size={16} />
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
                    Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, inventory.length)} of {inventory.length}
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

      {/* Edit Inventory Item Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Update Stock">
        {editItem && (
          <form onSubmit={handleSaveEdit} className="space-y-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
              <p className="text-sm text-slate-400">Product</p>
              <p className="font-semibold text-white">{editItem.productName}</p>
              <p className="mt-1 text-xs text-slate-500">{editItem.sku} • {editItem.branch}</p>
            </div>
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">New Quantity</span>
              <input className="field" type="number" min="0" value={editQty} onChange={(e) => setEditQty(e.target.value)} required />
            </label>
            <p className="text-xs text-slate-500">Reorder point: {editItem.reorderPoint} • Current status: {editItem.status}</p>
            <div className="flex justify-end gap-3 pt-2">
              <button type="button" className="action-ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button type="submit" className="action-primary">Update Stock</button>
            </div>
          </form>
        )}
      </Modal>

      {/* Bulk Update Modal */}
      <Modal open={showBulkModal} onClose={() => setShowBulkModal(false)} title="Bulk Inventory Update">
        <div className="space-y-4">
          <p className="text-sm text-slate-300">Upload a CSV file with columns: SKU, Branch, New Quantity</p>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">CSV File</span>
            <input type="file" accept=".csv" className="field text-sm file:mr-4 file:rounded file:border-0 file:bg-emerald-200/10 file:px-3 file:py-1 file:text-sm file:text-emerald-200" />
          </label>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
            <p className="text-xs font-semibold text-slate-300">CSV Format Example:</p>
            <pre className="mt-2 text-xs text-slate-500">SKU,Branch,Quantity{'\n'}OFF-1234567890123,Downtown Store,150{'\n'}RET-ORGANICMILK,Mall Outlet,75</pre>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="action-ghost" onClick={() => setShowBulkModal(false)}>Cancel</button>
            <button type="button" className="action-primary" onClick={() => { setShowBulkModal(false); showToast('Bulk inventory update processed') }}>Upload & Update</button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
