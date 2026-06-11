import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('authToken', token)
    set({ token, isAuthenticated: !!token })
  },
  loadToken: () => {
    const token = localStorage.getItem('authToken')
    if (token) {
      set({ token, isAuthenticated: true })
    }
  },
  logout: () => {
    localStorage.removeItem('authToken')
    set({ user: null, token: null, isAuthenticated: false })
  },
}))
