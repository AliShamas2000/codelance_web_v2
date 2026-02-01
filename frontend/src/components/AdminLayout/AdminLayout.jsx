import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../AdminSidebar/AdminSidebar'
import { useAdminUserContext } from '../../contexts/AdminUserContext'

const AdminLayout = () => {
  const { user, handleLogout, isLoadingUser } = useAdminUserContext()

  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark text-[#111816] dark:text-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading user data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      <AdminSidebar
        user={{
          name: user?.name || 'Admin',
          role: user?.role || 'Administrator',
          avatar: user?.avatar || user?.profile_photo || null
        }}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark p-6 lg:p-10">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
