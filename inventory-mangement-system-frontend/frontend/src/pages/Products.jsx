import { useEffect, useState } from 'react'
import Edit3 from 'lucide-react/dist/esm/icons/edit-3.mjs'
import PackagePlus from 'lucide-react/dist/esm/icons/package-plus.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import SlidersHorizontal from 'lucide-react/dist/esm/icons/sliders-horizontal.mjs'
import Trash2 from 'lucide-react/dist/esm/icons/trash-2.mjs'
import Layout from '../components/Layout'
import api from '../services/api'

export default function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const fallbackProducts = [
    { id: 1, name: 'Laptop Pro', sku: 'LAP-001', price: 1299, stock: 45, category: 'Electronics' },
    { id: 2, name: 'Wireless Mouse', sku: 'MOU-002', price: 29.99, stock: 150, category: 'Electronics' },
    { id: 3, name: 'USB-C Cable', sku: 'CAB-003', price: 9.99, stock: 500, category: 'Accessories' },
    { id: 4, name: 'Monitor 27"', sku: 'MON-004', price: 349, stock: 32, category: 'Electronics' },
    { id: 5, name: 'Keyboard RGB', sku: 'KEY-005', price: 89.99, stock: 78, category: 'Accessories' },
  ]
  const [products, setProducts] = useState(fallbackProducts)

  useEffect(() => {
    api.get('/products')
      .then((response) => setProducts(response.data))
      .catch(() => setProducts(fallbackProducts))
  }, [])

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
          <button type="button" className="action-primary">
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="field pl-11"
              />
            </label>
            <button type="button" className="action-ghost">
              <SlidersHorizontal size={17} />
              Filters
            </button>
          </div>
        </div>

        <div className="glass-panel rounded-lg">
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
                {filteredProducts.map((product) => (
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
                    <td className="font-semibold text-white">${Number(product.price || 0).toLocaleString()}</td>
                    <td>
                      <span className={`status-pill ${getStockStatus(product.stock)}`}>{product.stock} units</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button type="button" className="icon-button" aria-label={`Edit ${product.name}`}>
                          <Edit3 size={16} />
                        </button>
                        <button type="button" className="icon-button text-rose-200" aria-label={`Delete ${product.name}`}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="metric-card p-5">
            <p className="metric-label">Total Products</p>
            <p className="metric-value">{products.length}</p>
            <p className="metric-note">Catalog records online</p>
          </div>
          <div className="metric-card p-5">
            <p className="metric-label">Low Stock Items</p>
            <p className="metric-value">{products.filter((p) => p.stock < 50).length}</p>
            <p className="metric-note">Below replenishment target</p>
          </div>
          <div className="metric-card p-5">
            <p className="metric-label">Total Value</p>
            <p className="metric-value">${products.reduce((sum, p) => sum + p.price * p.stock, 0).toFixed(2)}</p>
            <p className="metric-note">Current on-hand inventory</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
