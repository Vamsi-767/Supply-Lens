import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3.mjs'
import Bell from 'lucide-react/dist/esm/icons/bell.mjs'
import Boxes from 'lucide-react/dist/esm/icons/boxes.mjs'
import Building2 from 'lucide-react/dist/esm/icons/building-2.mjs'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left.mjs'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right.mjs'
import ClipboardList from 'lucide-react/dist/esm/icons/clipboard-list.mjs'
import LayoutDashboard from 'lucide-react/dist/esm/icons/layout-dashboard.mjs'
import LogOut from 'lucide-react/dist/esm/icons/log-out.mjs'
import PackageSearch from 'lucide-react/dist/esm/icons/package-search.mjs'
import Search from 'lucide-react/dist/esm/icons/search.mjs'
import ShoppingCart from 'lucide-react/dist/esm/icons/shopping-cart.mjs'
import Warehouse from 'lucide-react/dist/esm/icons/warehouse.mjs'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(() => (typeof window === 'undefined' ? true : window.innerWidth >= 1024))
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

  return (
    <div className="app-shell flex min-h-screen">
      <aside
        className={`glass-panel fixed inset-y-0 left-0 z-50 flex flex-col rounded-none border-y-0 border-l-0 transition-all duration-300 lg:sticky ${
          sidebarOpen ? 'w-72' : 'w-16 lg:w-24'
        }`}
      >
        <div
          className={`flex h-24 border-b border-white/10 ${
            sidebarOpen ? 'items-center justify-between px-5' : 'flex-col items-center justify-center gap-2 px-2'
          }`}
        >
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className={`flex min-w-0 items-center gap-3 ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
            aria-label="Open dashboard"
          >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-emerald-200/20 bg-emerald-300/10 text-emerald-100 shadow-[0_0_32px_rgba(16,185,129,0.16)]">
              <Warehouse size={25} />
            </div>
            {sidebarOpen && (
              <div className="min-w-0 text-left">
                <p className="gradient-text text-lg font-semibold leading-5">Supply Lens</p>
                <p className="mt-1 text-xs font-medium uppercase tracking-[0.22em] text-slate-500">Operations</p>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="icon-button"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => navigate(item.path)}
                className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''} ${
                  sidebarOpen ? '' : 'justify-center px-0'
                }`}
                aria-label={item.name}
                title={!sidebarOpen ? item.name : undefined}
              >
                <Icon className="shrink-0" size={19} />
                {sidebarOpen && <span className="truncate">{item.name}</span>}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <div className={`mb-4 rounded-lg border border-white/10 bg-white/[0.045] p-3 ${sidebarOpen ? '' : 'hidden'}`}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-300/12 text-cyan-100">
                <PackageSearch size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Live Sync</p>
                <p className="text-xs text-emerald-200/80">All lanes healthy</p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className={`action-ghost w-full text-rose-200 hover:text-rose-100 ${sidebarOpen ? '' : 'px-0'}`}
            aria-label="Public demo"
            title={!sidebarOpen ? 'Public demo' : undefined}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Public Demo</span>}
          </button>
        </div>
      </aside>

      <div className="main-content flex flex-col">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080a0e]/72 px-4 py-4 backdrop-blur-2xl md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-lg border border-white/10 bg-white/[0.055] px-4 py-3 text-slate-400 md:flex">
              <Search size={18} />
              <span className="truncate text-sm">Search orders, SKUs, suppliers, lanes</span>
            </div>

            <div className="ml-auto flex items-center gap-3">
              <button type="button" className="icon-button" aria-label="Notifications">
                <Bell size={18} />
              </button>
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.055] px-3 py-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-200 to-cyan-200 text-sm font-bold text-slate-950">
                  D
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-semibold text-white">Demo User</p>
                  <p className="text-xs text-slate-500">Public customer demo</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  )
}
