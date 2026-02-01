import React, { memo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const BarberSidebar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const menuItems = [
    { icon: 'dashboard', label: 'Dashboard', path: '/barber/dashboard' },
    { icon: 'event', label: 'Appointments', path: '/barber/appointments' },
    { icon: 'history', label: 'History', path: '/barber/history' },
    { icon: 'calendar_month', label: 'Schedule', path: '/barber/schedule' },
    { icon: 'groups', label: 'Clients', path: '/barber/clients' },
    { icon: 'star', label: 'Reviews', path: '/barber/reviews' }
  ]

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-surface-light dark:bg-surface-dark border-r border-gray-200 dark:border-gray-800 fixed left-0 top-0 h-screen pt-8 pb-4 overflow-y-auto z-20">
      {/* Logo */}
      <div className="px-8 mb-10 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
          B
        </div>
        <span className="font-bold text-xl tracking-tight">BladeCMS</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (location.pathname !== item.path) {
                navigate(item.path, { replace: false })
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive(item.path)
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.label}
          </button>
        ))}
        
        {/* System Section */}
        <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
            System
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              navigate('/barber/settings')
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
              isActive('/barber/settings')
                ? 'bg-primary/10 text-primary'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
            }`}
          >
            <span className="material-symbols-outlined">settings</span>
            Settings
          </button>
        </div>
      </nav>

      {/* User Profile */}
      <div className="px-4 mt-auto pb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              navigate('/barber/profile')
            }}
            className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-black/30 transition-colors"
          >
            {user?.profile_photo || user?.avatar ? (
              <img
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                src={user.profile_photo || user.avatar}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/40'
                }}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center border border-gray-200 text-white font-bold text-sm">
                {user?.first_name?.[0] || user?.last_name?.[0] || user?.name?.[0] || 'B'}
              </div>
            )}
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold">
                {user?.first_name && user?.last_name 
                  ? `${user.first_name} ${user.last_name}` 
                  : user?.name || 'Barber'}
              </span>
              <span className="text-xs text-gray-500">{user?.role || 'Barber'}</span>
            </div>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              if (onLogout) {
                onLogout()
              }
            }}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl transition-colors"
            title="Logout"
          >
            <span className="material-symbols-outlined text-red-500 text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default memo(BarberSidebar)


