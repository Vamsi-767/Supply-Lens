import Compass from 'lucide-react/dist/esm/icons/compass.mjs'
import Home from 'lucide-react/dist/esm/icons/home.mjs'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel max-w-lg rounded-lg p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-lg border border-cyan-200/20 bg-cyan-300/10 text-cyan-100">
          <Compass size={32} />
        </div>
        <p className="gradient-text text-7xl font-semibold">404</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Page Not Found</h1>
        <p className="mt-3 text-sm leading-6 text-slate-400">The page you are looking for does not exist or has been moved.</p>
        <button type="button" onClick={() => navigate('/dashboard')} className="action-primary mt-8">
          <Home size={18} />
          Back to Dashboard
        </button>
      </div>
    </div>
  )
}
