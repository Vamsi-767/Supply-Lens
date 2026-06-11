import { useState } from 'react'
import LockKeyhole from 'lucide-react/dist/esm/icons/lock-keyhole.mjs'
import Mail from 'lucide-react/dist/esm/icons/mail.mjs'
import PackageCheck from 'lucide-react/dist/esm/icons/package-check.mjs'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../context/authStore'
import api from '../services/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setToken, setUser } = useAuthStore()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    // Demo mode: auth is disabled, navigate directly
    setTimeout(() => {
      navigate('/dashboard')
      setLoading(false)
    }, 400)
  }

  return (
    <div className="app-shell flex min-h-screen items-center justify-center p-4">
      <div className="glass-panel w-full max-w-md rounded-lg p-8">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-lg border border-emerald-200/20 bg-emerald-300/10 text-emerald-100">
            <PackageCheck size={28} />
          </div>
          <h1 className="gradient-text text-3xl font-semibold">Supply Lens</h1>
          <p className="mt-2 text-sm text-slate-400">Premium inventory management</p>
        </div>

        {error && <div className="mt-6 rounded-lg border border-rose-300/30 bg-rose-400/10 p-3 text-sm text-rose-100">{error}</div>}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Email</span>
            <span className="relative block">
              <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="field pl-11"
                placeholder="admin@example.com"
                required
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
            <span className="relative block">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="field pl-11"
                placeholder="Password"
                required
              />
            </span>
          </label>

          <button type="submit" disabled={loading} className="action-primary h-12 w-full disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.055] p-4 text-center text-xs text-slate-400">
          <p className="font-semibold text-slate-200">Demo Credentials</p>
          <p className="mt-1">Email: admin@example.com</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  )
}
