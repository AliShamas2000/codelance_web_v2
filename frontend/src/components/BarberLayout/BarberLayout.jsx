import React from 'react'
import { Outlet } from 'react-router-dom'
import BarberSidebar from '../BarberSidebar/BarberSidebar'
import { useBarberUserContext } from '../../contexts/BarberUserContext'

const BarberLayout = () => {
  const { user, handleLogout } = useBarberUserContext()

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark text-[#111816] dark:text-gray-100 font-display transition-colors duration-300 antialiased selection:bg-primary selection:text-white">
      <div className="flex">
        <BarberSidebar user={user} onLogout={handleLogout} />
        <Outlet />
      </div>
    </div>
  )
}

export default BarberLayout

