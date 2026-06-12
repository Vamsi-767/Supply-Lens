import { useEffect, useState } from 'react'
import CheckCircle from 'lucide-react/dist/esm/icons/check-circle.mjs'
import AlertCircle from 'lucide-react/dist/esm/icons/alert-circle.mjs'
import Info from 'lucide-react/dist/esm/icons/info.mjs'
import X from 'lucide-react/dist/esm/icons/x.mjs'

// Global toast state
let toastListeners = []
let toastId = 0

export function showToast(message, type = 'success') {
  toastId++
  const toast = { id: toastId, message, type }
  toastListeners.forEach((fn) => fn(toast))
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    const listener = (toast) => {
      setToasts((prev) => [...prev, toast])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id))
      }, 3500)
    }
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle size={20} className="text-emerald-400" />
      case 'error': return <AlertCircle size={20} className="text-red-400" />
      default: return <Info size={20} className="text-indigo-400" />
    }
  }

  const getBorder = (type) => {
    switch (type) {
      case 'success': return 'border-emerald-500/30'
      case 'error': return 'border-red-500/30'
      default: return 'border-indigo-500/30'
    }
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 rounded-xl border ${getBorder(toast.type)} bg-white px-5 py-4 shadow-2xl animate-toast-in`}
          >
            {getIcon(toast.type)}
            <p className="text-sm font-medium text-slate-800">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-slate-700"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
