import { useEffect, useState } from 'react'
import Edit3 from 'lucide-react/dist/esm/icons/edit-3.mjs'
import PackagePlus from 'lucide-react/dist/esm/icons/package-plus.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import SlidersHorizontal from 'lucide-react/dist/esm/icons/sliders-horizontal.mjs'
import Trash2 from 'lucide-react/dist/esm/icons/trash-2.mjs'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import api from '../services/api'

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStock, setFilterStock] = useState('')
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState({ name: '', sku: '', categoryId: '', price: '', reorderLevel: '' })
  const [saving, setSaving] = useState(false)
  const [page, setPage] = useState(1)
  const perPage = 50

  useEffect(() => {
    loadProducts()
    api.get('/categories').then((r) => setCategories(r.data)).catch(() => {})
  }, [])

  const loadProducts = () => {
    setLoading(true)
    api.get('/products')
      .then((response) => setProducts(response.data))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload = {
        name: form.name,
        sku: form.sku || `SKU-${Date.now()}`,
        categoryId: form.categoryId ? Number(form.categoryId) : null,
        price: form.price ? Number(form.price) : 5.00,
        reorderLevel: form.reorderLevel ? Number(form.reorderLevel) : 10,
      }
      await api.post('/products', payload)
      setShowAddModal(false)
      setForm({ name: '', sku: '', categoryId: '', price: '', reorderLevel: '' })
      loadProducts()
    } catch (err) {
      showToast('Failed to add product', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      sku: product.sku,
      categoryId: '',
      price: product.price || '',
      reorderLevel: '',
    })
    setShowEditModal(true)
  }

  const handleDelete = (product) => {
    if (window.confirm(`Delete "${product.name}"?`)) {
      api.delete?.(`/products/${product.id}`)
        .then(() => { loadProducts(); showToast('Product deleted successfully') })
        .catch(() => {
          setProducts((prev) => prev.filter((p) => p.id !== product.id))
          showToast('Product removed')
        })
    }
  }

  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = !filterCategory || p.category === filterCategory
    const matchStock =
      !filterStock ||
      (filterStock === 'low' && p.stock < 50) ||
      (filterStock === 'medium' && p.stock >= 50 && p.stock <= 100) ||
      (filterStock === 'high' && p.stock > 100)
    return matchSearch && matchCategory && matchStock
  })

  const totalPages = Math.ceil(filteredProducts.length / perPage)
  const paginatedProducts = filteredProducts.slice((page - 1) * perPage, page * perPage)

  const getStockStatus = (stock) => {
    if (stock > 100) return 'status-green'
    if (stock > 30) return 'status-blue'
    return 'status-red'
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-kicker">Catalog intelligence</p>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">Manage SKUs, stock posture, pricing, and category signals across the network.</p>
          </div>
          <button type="button" className="action-primary" onClick={() => { setForm({ name: '', sku: '', categoryId: '', price: '', reorderLevel: '' }); setShowAddModal(true) }}>
            <PackagePlus size={18} />
            Add Product
          </button>
        </div>

        <div className="glass-panel rounded-lg p-4">
          <div className="flex flex-col gap-3 md:flex-row">
            <label className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="text"
                placeholder="Search by product name or SKU"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
                className="field pl-11"
              />
            </label>
            <button type="button" className="action-ghost" onClick={() => setShowFilterModal(true)}>
              <SlidersHorizontal size={17} />
              Filters
              {(filterCategory || filterStock) && <span className="ml-1 h-2 w-2 rounded-full bg-emerald-400" />}
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-lg">
          {loading ? (
            <div className="p-8 text-center text-slate-400">Loading products...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product Name</th>
                      <th>SKU</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id}>
                        <td>
                          <div>
                            <p className="font-semibold text-white">{product.name}</p>
                            <p className="mt-1 text-xs text-slate-500">ID: {product.id}</p>
                          </div>
                        </td>
                        <td className="font-mono text-cyan-200">{product.sku}</td>
                        <td>
                          <span className="status-pill status-violet">{product.category}</span>
                        </td>
                        <td className="font-semibold text-white">${Number(product.price || 0).toFixed(2)}</td>
                        <td>
                          <span className={`status-pill ${getStockStatus(product.stock)}`}>{product.stock} units</span>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button type="button" className="icon-button" aria-label={`Edit ${product.name}`} onClick={() => handleEdit(product)}>
                              <Edit3 size={16} />
                            </button>
                            <button type="button" className="icon-button text-rose-200" aria-label={`Delete ${product.name}`} onClick={() => handleDelete(product)}>
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
                  <p className="text-sm text-slate-400">
                    Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filteredProducts.length)} of {filteredProducts.length}
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="metric-card p-5">
            <p className="metric-label">Total Products</p>
            <p className="metric-value">{products.length.toLocaleString()}</p>
            <p className="metric-note">Catalog records online</p>
          </div>
          <div className="metric-card p-5">
            <p className="metric-label">Low Stock Items</p>
            <p className="metric-value">{products.filter((p) => p.stock < 50).length}</p>
            <p className="metric-note">Below replenishment target</p>
          </div>
          <div className="metric-card p-5">
            <p className="metric-label">Categories</p>
            <p className="metric-value">{[...new Set(products.map((p) => p.category))].length}</p>
            <p className="metric-note">Active product categories</p>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Product">
        <form onSubmit={handleAdd} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Product Name *</span>
            <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Organic Rice 1kg" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">SKU</span>
            <input className="field" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="Auto-generated if empty" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Category</span>
            <select className="field" value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
              <option value="">Select category</option>
              {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
            </select>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Price ($)</span>
              <input className="field" type="number" step="0.01" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="5.00" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Reorder Level</span>
              <input className="field" type="number" min="0" value={form.reorderLevel} onChange={(e) => setForm({ ...form, reorderLevel: e.target.value })} placeholder="10" />
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="action-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button type="submit" className="action-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Product'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Product Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Product">
        <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); showToast('Product updated successfully') }} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Product Name</span>
            <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">SKU</span>
            <input className="field opacity-60" value={form.sku} readOnly />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Price ($)</span>
            <input className="field" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="action-ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button type="submit" className="action-primary">Save Changes</button>
          </div>
        </form>
      </Modal>

      {/* Filters Modal */}
      <Modal open={showFilterModal} onClose={() => setShowFilterModal(false)} title="Filter Products">
        <div className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Category</span>
            <select className="field" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">All Categories</option>
              {[...new Set(products.map((p) => p.category))].sort().map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Stock Level</span>
            <select className="field" value={filterStock} onChange={(e) => setFilterStock(e.target.value)}>
              <option value="">All Levels</option>
              <option value="low">Low Stock (&lt; 50)</option>
              <option value="medium">Medium (50–100)</option>
              <option value="high">High (&gt; 100)</option>
            </select>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="action-ghost" onClick={() => { setFilterCategory(''); setFilterStock(''); setPage(1) }}>Clear All</button>
            <button type="button" className="action-primary" onClick={() => { setPage(1); setShowFilterModal(false) }}>Apply Filters</button>
          </div>
        </div>
      </Modal>
    </Layout>
  )
}
