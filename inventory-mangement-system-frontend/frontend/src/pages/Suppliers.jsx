import { useEffect, useState } from 'react'
import Building2 from 'lucide-react/dist/esm/icons/building-2.mjs'
import Edit3 from 'lucide-react/dist/esm/icons/edit-3.mjs'
import Mail from 'lucide-react/dist/esm/icons/mail.mjs'
import Phone from 'lucide-react/dist/esm/icons/phone.mjs'
import Plus from 'lucide-react/dist/esm/icons/plus.mjs'
import Star from 'lucide-react/dist/esm/icons/star.mjs'
import TrendingUp from 'lucide-react/dist/esm/icons/trending-up.mjs'
import Layout from '../components/Layout'
import Modal from '../components/Modal'
import { showToast } from '../components/Toast'
import api from '../services/api'

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editSupplier, setEditSupplier] = useState(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', contactPerson: '', leadTimeDays: '', preferred: false })
  const [page, setPage] = useState(1)
  const perPage = 10

  useEffect(() => {
    loadSuppliers()
  }, [])

  const loadSuppliers = () => {
    setLoading(true)
    api.get('/suppliers')
      .then((response) => setSuppliers(response.data))
      .catch(() => setSuppliers([]))
      .finally(() => setLoading(false))
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await api.post('/suppliers', {
        name: form.name,
        email: form.email,
        phone: form.phone,
        contactPerson: form.contactPerson,
        leadTimeDays: form.leadTimeDays ? Number(form.leadTimeDays) : 7,
        preferred: form.preferred,
      })
      setShowAddModal(false)
      setForm({ name: '', email: '', phone: '', contactPerson: '', leadTimeDays: '', preferred: false })
      loadSuppliers()
    } catch (err) {
      showToast('Failed to add supplier', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (supplier) => {
    setEditSupplier(supplier)
    setForm({
      name: supplier.name,
      email: supplier.email,
      phone: supplier.phone,
      contactPerson: '',
      leadTimeDays: supplier.leadTimeDays || '',
      preferred: supplier.preferred || false,
    })
    setShowEditModal(true)
  }

  const handleContact = (supplier) => {
    window.location.href = `mailto:${supplier.email}?subject=Supply Lens - Order Inquiry`
  }

  const totalPages = Math.ceil(suppliers.length / perPage)
  const paginatedSuppliers = suppliers.slice((page - 1) * perPage, page * perPage)

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="page-kicker">Partner network</p>
            <h1 className="page-title">Suppliers</h1>
            <p className="page-subtitle">Manage supplier health, contact channels, performance quality, and category coverage.</p>
          </div>
          <button type="button" className="action-primary" onClick={() => { setForm({ name: '', email: '', phone: '', contactPerson: '', leadTimeDays: '', preferred: false }); setShowAddModal(true) }}>
            <Plus size={18} />
            Add Supplier
          </button>
        </div>

        {loading ? (
          <div className="glass-panel rounded-lg p-8 text-center text-slate-400">Loading suppliers...</div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {paginatedSuppliers.map((supplier) => (
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
                    {supplier.leadTimeDays && (
                      <p className="text-xs text-slate-500">Lead time: {supplier.leadTimeDays} days</p>
                    )}
                  </div>

                  <div className="relative mt-6 flex gap-2 border-t border-white/10 pt-4">
                    <button type="button" className="action-ghost flex-1" onClick={() => handleContact(supplier)}>
                      <Mail size={16} />
                      Contact
                    </button>
                    <button type="button" className="action-ghost flex-1" onClick={() => handleEdit(supplier)}>
                      <Edit3 size={16} />
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-400">Page {page} of {totalPages} ({suppliers.length} suppliers)</p>
                <div className="flex gap-2">
                  <button type="button" className="action-ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
                  <button type="button" className="action-ghost" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
                </div>
              </div>
            )}
          </>
        )}

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
              <p className="metric-value">{suppliers.length > 0 ? (suppliers.reduce((sum, s) => sum + Number(s.rating || 0), 0) / suppliers.length).toFixed(1) : '0'}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <p className="metric-label">Preferred</p>
              <p className="metric-value">{suppliers.filter((s) => s.preferred).length}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.055] p-4">
              <p className="metric-label">Avg Lead Time</p>
              <p className="metric-value">{suppliers.length > 0 ? Math.round(suppliers.reduce((sum, s) => sum + (Number(s.leadTimeDays) || 0), 0) / suppliers.length) : 0} days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Supplier Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Supplier">
        <form onSubmit={handleAdd} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Supplier Name *</span>
            <input className="field" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Metro Distributors" />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Contact Person</span>
            <input className="field" value={form.contactPerson} onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} placeholder="John Smith" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Email *</span>
              <input className="field" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="contact@supplier.com" />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Phone</span>
              <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1-555-0100" />
            </label>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Lead Time (days)</span>
              <input className="field" type="number" min="1" value={form.leadTimeDays} onChange={(e) => setForm({ ...form, leadTimeDays: e.target.value })} placeholder="7" />
            </label>
            <label className="flex items-center gap-3 pt-6">
              <input type="checkbox" checked={form.preferred} onChange={(e) => setForm({ ...form, preferred: e.target.checked })} className="h-4 w-4 rounded border-white/20 bg-white/10" />
              <span className="text-sm text-slate-300">Preferred Supplier</span>
            </label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="action-ghost" onClick={() => setShowAddModal(false)}>Cancel</button>
            <button type="submit" className="action-primary" disabled={saving}>{saving ? 'Saving...' : 'Add Supplier'}</button>
          </div>
        </form>
      </Modal>

      {/* Edit Supplier Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Supplier">
        <form onSubmit={(e) => { e.preventDefault(); setShowEditModal(false); showToast('Supplier updated successfully') }} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Supplier Name</span>
            <input className="field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Email</span>
              <input className="field" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1 block text-sm text-slate-300">Phone</span>
              <input className="field" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1 block text-sm text-slate-300">Lead Time (days)</span>
            <input className="field" type="number" min="1" value={form.leadTimeDays} onChange={(e) => setForm({ ...form, leadTimeDays: e.target.value })} />
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" className="action-ghost" onClick={() => setShowEditModal(false)}>Cancel</button>
            <button type="submit" className="action-primary">Save Changes</button>
          </div>
        </form>
      </Modal>
    </Layout>
  )
}
