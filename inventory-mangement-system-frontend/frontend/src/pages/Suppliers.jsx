import { useEffect, useState } from 'react'
import Building2 from 'lucide-react/dist/esm/icons/building-2.mjs'
import Edit3 from 'lucide-react/dist/esm/icons/edit-3.mjs'
import Mail from 'lucide-react/dist/esm/icons/mail.mjs'
import Phone from 'lucide-react/dist/esm/icons/phone.mjs'
import Plus from 'lucide-react/dist/esm/icons/plus.mjs'
import Star from 'lucide-react/dist/esm/icons/star.mjs'
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.mjs'
import Layout from '../components/Layout'
import api from '../services/api'

export default function Suppliers() {
  const fallbackSuppliers = [
    { id: 1, name: 'Tech World', email: 'contact@techworld.com', phone: '+1-555-0101', category: 'Electronics', rating: 4.8 },
    { id: 2, name: 'Global Supplies', email: 'info@globalsupplies.com', phone: '+1-555-0102', category: 'Accessories', rating: 4.5 },
    { id: 3, name: 'Prime Distribution', email: 'sales@primedist.com', phone: '+1-555-0103', category: 'General', rating: 4.9 },
    { id: 4, name: 'Quality Imports', email: 'orders@qualityimports.com', phone: '+1-555-0104', category: 'Electronics', rating: 4.6 },
  ]
  const [suppliers, setSuppliers] = useState(fallbackSuppliers)

  useEffect(() => {
    api.get('/suppliers')
      .then((response) => setSuppliers(response.data))
      .catch(() => setSuppliers(fallbackSuppliers))
  }, [])

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-kicker">Partner network</p>
            <h1 className="page-title">Suppliers</h1>
            <p className="page-subtitle">Manage supplier health, contact channels, performance quality, and category coverage.</p>
          </div>
          <button type="button" className="action-primary">
            <Plus size={18} />
            Add Supplier
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {suppliers.map((supplier) => (
            <div key={supplier.id} className="supplier-card glass-panel glass-hover rounded-lg p-6">
              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07] text-cyan-200">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">{supplier.name}</h2>
                    <p className="mt-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{supplier.category}</p>
                  </div>
                </div>
                <div className="status-pill status-amber gap-1">
                  <Star size={14} />
                  {supplier.rating}
                </div>
              </div>

              <div className="relative mt-6 grid gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-emerald-200" />
                  <span>{supplier.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-cyan-200" />
                  <span>{supplier.phone}</span>
                </div>
              </div>

              <div className="relative mt-6 flex gap-2 border-t border-white/10 pt-4">
                <button type="button" className="action-ghost flex-1">
                  <Mail size={16} />
                  Contact
                </button>
                <button type="button" className="action-ghost flex-1">
                  <Edit3 size={16} />
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="glass-panel rounded-lg p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg border border-white/10 bg-white/[0.07] p-3 text-emerald-200">
              <TrendingUp size={20} />
            </div>
            <div>
              <h2 className="section-title">Performance Overview</h2>
              <p className="mt-1 text-sm text-slate-400">Supplier network quality signals</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <p className="metric-label">Total Suppliers</p>
              <p className="metric-value">{suppliers.length}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <p className="metric-label">Avg Rating</p>
              <p className="metric-value">{(suppliers.reduce((sum, s) => sum + s.rating, 0) / suppliers.length).toFixed(1)}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <p className="metric-label">Electronics</p>
              <p className="metric-value">{suppliers.filter((s) => s.category === 'Electronics').length}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <p className="metric-label">Active Orders</p>
              <p className="metric-value">12</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
