import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navigation = ({ items = [], className = "" }) => {
  const location = useLocation()
  const defaultItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Barbers", href: "#barbers" },
    { label: "Gallery", href: "#gallery" },
    { label: "Contact", href: "#contact" },
  ]

  const navItems = items.length > 0 ? items : defaultItems

  const isActive = (href) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname === href || location.hash === href
  }

  return (
    <nav className={`hidden lg:flex items-center gap-1 ${className}`}>
      {navItems.map((item, index) => {
        // Use Link for internal routes, anchor for hash links
        const isHashLink = item.href.startsWith('#')
        const isActiveLink = isActive(item.href)
        
        const linkClasses = `px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 ${
          isActiveLink
            ? 'text-primary dark:text-primary'
            : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary'
        }`

        if (isHashLink) {
          return (
            <a
              key={index}
              href={item.href}
              className={linkClasses}
            >
              {item.label}
            </a>
          )
        }

        return (
          <Link
            key={index}
            to={item.href}
            className={linkClasses}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

export default Navigation

