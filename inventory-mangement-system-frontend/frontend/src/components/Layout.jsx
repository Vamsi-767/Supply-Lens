import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3.mjs'
import Bell from 'lucide-react/dist/esm/icons/bell.mjs'
import Boxes from 'lucide-react/dist/esm/icons/boxes.mjs'
import Building2 from 'lucide-react/dist/esm/icons/building-2.mjs'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.mjs'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.mjs'
import ClipboardList from 'lucide-react/dist/esm/icons/clipboard-list.mjs'
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard.mjs'
import PackageSearch from 'lucide-react/dist/esm/icons/package-search.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.mjs'
import Warehouse from 'lucide-react/dist/esm/icons/warehouse.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'
import api from '../services/api'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth >= 1024))
  const [searchOpen, setSearchOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [searching, setSearching] = useState(false)
  const searchRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Boxes },
    { name: 'Inventory', path: '/inventory', icon: ClipboardList },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Purchase Orders', path: '/purchase-orders', icon: PackageSearch },
    { name: 'Suppliers', path: '/suppliers', icon: Building2 },
    { name: 'Reports', path: '/reports', icon: BarChart3 },
  ]

  const isActive = (path) => location.pathname === path

  // Global search with debounce
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults(null)
      return
    }
    const timer = setTimeout(() => {
      setSearching(true)
      Promise.all([
        api.get('/products').catch(() => ({ data: [] })),
        api.get('/suppliers').catch(() => ({ data: [] })),
        api.get('/orders').catch(() => ({ data: [] })),
      ]).then(([products, suppliers, orders]) => {
        const q = searchQuery.toLowerCase()
        const matchedProducts = products.data
          .filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
          .slice(0, 5)
        const matchedSuppliers = suppliers.data
          .filter((s) => s.name.toLowerCase().includes(q))
          .slice(0, 3)
        const matchedOrders = orders.data
          .filter((o) => o.orderNumber.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q))
          .slice(0, 5)
        setSearchResults({ products: matchedProducts, suppliers: matchedSuppliers, orders: matchedOrders })
        setSearching(false)
      })
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    setSearchOpen(false)
    setSearchQuery('')
    setSearchResults(null)
  }, [location.pathname])

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
        setTimeout(() => searchRef.current?.focus(), 100)
      }
      if (e.key === 'Escape') {
        setSearchOpen(false)
        setSearchQuery('')
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="app-shell flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white transition-all duration-300 lg:sticky lg:top-0 lg:h-screen ${
          sidebarOpen ? 'w-64' : 'w-16 lg:w-16'
        }`}
      >
        <div className={`flex h-16 items-center border-b border-slate-100 ${sidebarOpen ? 'justify-between px-4' : 'justify-center px-2'}`}>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className={`flex items-center gap-2.5 ${sidebarOpen ? '' : 'justify-center'}`}
            aria-label="Open dashboard"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20">
              <Warehouse size={18} />
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-bold text-slate-900">Supply Lens</p>
                <p className="text-[10px] text-slate-400">Inventory System</p>
              </div>
            )}
          </button>
          {sidebarOpen && (
            <button type="button" onClick={() => setSidebarOpen(false)} className="text-slate-500 hover:text-white" aria-label="Collapse">
              <ChevronLeft size={16} />
            </button>
          )}
          {!sidebarOpen && (
            <button type="button" onClick={() => setSidebarOpen(true)} className="absolute -right-3 top-5 hidden rounded-full border border-slate-200 bg-white p-1 text-slate-400 hover:text-indigo-600 shadow-sm lg:flex" aria-label="Expand">
              <ChevronRight size={12} />
            </button>
          )}
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''} ${sidebarOpen ? '' : 'justify-center px-0'}`}
                aria-label={item.name}
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon className="shrink-0" size={18} />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          {sidebarOpen && (
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
              <span className="live-pulse h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-700 font-medium">System Online</span>
            </div>
          )}
          <div className={`flex items-center gap-2.5 ${sidebarOpen ? 'px-2' : 'justify-center'}`}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-xs font-bold text-white">
              A
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-xs font-medium text-slate-800">Admin</p>
                <p className="text-[10px] text-slate-400">Store Manager</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-sm md:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            {/* Search */}
            <button
              type="button"
              onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100) }}
              className="hidden flex-1 items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-left text-slate-400 transition-colors hover:border-indigo-200 hover:bg-indigo-50 md:flex"
            >
              <Search size={15} />
              <span className="flex-1 text-sm">Search products, orders, suppliers...</span>
              <kbd className="rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">⌘K</kbd>
            </button>

            <div className="ml-auto flex items-center gap-2">
              <button type="button" className="icon-button relative md:hidden" onClick={() => { setSearchOpen(true); setTimeout(() => searchRef.current?.focus(), 100) }} aria-label="Search">
                <Search size={15} />
              </button>
              <div className="relative">
                <button type="button" className="icon-button relative" aria-label="Notifications" onClick={() => setNotifOpen(!notifOpen)}>
                  <Bell size={15} />
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>
                {notifOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                    <p className="mb-2 text-xs font-bold text-slate-800">Notifications</p>
                    <div className="space-y-2 text-xs">
                      <div className="rounded-lg bg-red-50 border border-red-100 p-2.5">
                        <p className="font-medium text-red-800">Low stock alert</p>
                        <p className="text-red-600/70">12 items below reorder point</p>
                      </div>
                      <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5">
                        <p className="font-medium text-blue-800">New order received</p>
                        <p className="text-blue-600/70">Order #OL-4829 — $42.50</p>
                      </div>
                      <div className="rounded-lg bg-green-50 border border-green-100 p-2.5">
                        <p className="font-medium text-green-800">PO delivered</p>
                        <p className="text-green-600/70">PO-7A3F from FreshMart Distributors</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="hidden items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 sm:flex">
                <span className="live-pulse h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs font-medium text-emerald-700">Live</span>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-6 md:py-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        <footer className="border-t border-slate-100 px-4 py-4 md:px-6">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Supply Lens — Inventory & Supply Chain Management</span>
            <a href="https://aistreams.io" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              <img src="https://aistreams.io/favicon.ico" alt="aiStreams" className="h-4 w-4 rounded" onError={(e) => { e.target.style.display = 'none' }} />
              © 2025 aiStreams LLC
            </a>
          </div>
        </footer>
      </div>

      {/* Global Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh]">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults(null) }} />
          <div className="relative z-10 w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3">
              <Search size={18} className="text-slate-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, orders, suppliers, SKUs..."
                className="flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                autoFocus
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults(null) }} className="text-slate-400 hover:text-slate-700">
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {searching && <p className="px-3 py-6 text-center text-sm text-slate-400">Searching...</p>}
              {!searching && searchResults && (
                <div className="space-y-2">
                  {searchResults.products.length > 0 && (
                    <div>
                      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Products</p>
                      {searchResults.products.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-indigo-50"
                          onClick={() => { navigate('/products'); setSearchOpen(false) }}
                        >
                          <Boxes size={14} className="text-indigo-500" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-slate-800">{p.name}</p>
                            <p className="text-xs text-slate-400">{p.sku} • ${Number(p.price || 0).toFixed(2)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.orders.length > 0 && (
                    <div>
                      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Orders</p>
                      {searchResults.orders.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-indigo-50"
                          onClick={() => { navigate('/orders'); setSearchOpen(false) }}
                        >
                          <ShoppingCart size={14} className="text-emerald-500" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-slate-800">{o.orderNumber}</p>
                            <p className="text-xs text-slate-400">{o.customer}</p>
                          </div>
                          <span className={`status-pill ${o.status === 'Completed' ? 'status-green' : 'status-amber'}`}>{o.status}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.suppliers.length > 0 && (
                    <div>
                      <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Suppliers</p>
                      {searchResults.suppliers.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-indigo-50"
                          onClick={() => { navigate('/suppliers'); setSearchOpen(false) }}
                        >
                          <Building2 size={14} className="text-purple-500" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm text-slate-800">{s.name}</p>
                            <p className="text-xs text-slate-400">{s.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.products.length === 0 && searchResults.orders.length === 0 && searchResults.suppliers.length === 0 && (
                    <p className="py-8 text-center text-sm text-slate-400">No results for "{searchQuery}"</p>
                  )}
                </div>
              )}
              {!searching && !searchResults && (
                <div className="px-2 py-3">
                  <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Quick nav</p>
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={item.path}
                        type="button"
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-indigo-50"
                        onClick={() => { navigate(item.path); setSearchOpen(false) }}
                      >
                        <Icon size={14} className="text-slate-400" />
                        <span className="text-sm text-slate-600">{item.name}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
