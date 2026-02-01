import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

const AdminSidebar = ({
  logoIcon = "bolt",
  logoText = "CMS",
  logoSubtext = "Admin Panel",
  navigationItems = [],
  user = {
    name: "Sadek",
    role: "Administrator",
    avatar: null
  },
  onLogout,
  className = ""
}) => {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState("")

  const defaultNavigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "dashboard",
      href: "/admin/dashboard",
      active: true
    },
    {
      type: "divider",
      label: "CMS Modules"
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: "calendar_month",
      href: "/admin/appointments",
      badge: 24
    },
    {
      id: "banners",
      label: "Banners",
      icon: "view_carousel",
      href: "/admin/banners"
    },
    {
      id: "informative-sections",
      label: "Informative Sections",
      icon: "article",
      href: "/admin/informative-sections"
    },
    {
      id: "services",
      label: "Services",
      icon: "handyman",
      href: "/admin/services"
    },
    {
      id: "packages",
      label: "Packages",
      icon: "inventory_2",
      href: "/admin/packages"
    },
    {
      id: "process-steps",
      label: "How We Work",
      icon: "timeline",
      href: "/admin/process-steps"
    },
    {
      id: "gallery",
      label: "Gallery",
      icon: "collections",
      href: "/admin/gallery"
    },
    {
      id: "team",
      label: "Team",
      icon: "groups",
      href: "/admin/team"
    },
    {
      id: "about-us",
      label: "About Us",
      icon: "info",
      href: "/admin/about-us"
    },
    {
      id: "footer",
      label: "Footer",
      icon: "call_to_action",
      href: "/admin/footer"
    },
    {
      type: "divider",
      label: "System"
    },
    {
      id: "settings",
      label: "Settings",
      icon: "settings",
      href: "/admin/settings"
    }
  ]

  const navItems = navigationItems.length > 0 ? navigationItems : defaultNavigationItems

  const isActive = (href) => {
    if (!href) return false
    return location.pathname === href || location.pathname.startsWith(href + "/")
  }

  const filteredItems = navItems.filter(item => {
    if (item.type === "divider") return true
    if (!searchQuery) return true
    return item.label?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <aside className={`w-64 flex-shrink-0 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-colors duration-200 overflow-y-auto ${className}`}>
      {/* Logo Section */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gray-900 dark:bg-primary rounded-lg flex items-center justify-center text-white">
            <span className="material-symbols-outlined text-2xl">{logoIcon}</span>
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight dark:text-white">{logoText}</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">{logoSubtext}</p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search navigation..."
            className="w-full py-2 pl-10 pr-4 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {filteredItems.map((item, index) => {
          if (item.type === "divider") {
            return (
              <div key={`divider-${index}`} className="pt-4 pb-2">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </p>
              </div>
            )
          }

          const active = isActive(item.href)

          return (
            <Link
              key={item.id || index}
              to={item.href || "#"}
              className={`flex items-center px-3 py-2 rounded-lg group transition-colors font-medium ${
                active
                  ? "text-gray-900 dark:text-blue-400 bg-blue-50 dark:bg-gray-700/50"
                  : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <span className={`material-symbols-outlined text-xl mr-3 ${
                active
                  ? "text-gray-900 dark:text-blue-400"
                  : "text-gray-400 group-hover:text-gray-500 dark:text-gray-400"
              }`}>
                {item.icon}
              </span>
              {item.label}
              {item.badge && (
                <span className="ml-auto bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300 py-0.5 px-2 rounded-full text-xs">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gray-800 text-white flex items-center justify-center">
                <span className="material-symbols-outlined">person</span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user.role}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-red-500 text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default AdminSidebar
