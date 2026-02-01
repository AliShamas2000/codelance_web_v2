import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../Logo/Logo'
import Navigation from '../Navigation/Navigation'
import PhoneCTA from '../PhoneCTA/PhoneCTA'
import MobileMenuToggle from '../MobileMenuToggle/MobileMenuToggle'
import UserAvatar from '../UserAvatar/UserAvatar'

const Header = ({ 
  logoHref = "#",
  logoUrl = null,
  navigationItems = [],
  phone = "(555) 123-4567",
  className = ""
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <header className={`sticky top-0 z-50 w-full border-b border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-[#10221c]/95 backdrop-blur-md shadow-sm transition-all duration-300 ${className}`}>
      <div className="w-full max-w-[1440px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        {/* Logo Section */}
        <Logo href={logoHref} logoUrl={logoUrl} />

        {/* Desktop Navigation Menu */}
        <Navigation items={navigationItems} />

        {/* Action Button Section */}
        <div className="flex items-center gap-6">
          {/* Phone CTA */}
          <PhoneCTA phone={phone} />

          {/* User Avatar */}
          <UserAvatar />

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle 
            onClick={toggleMobileMenu}
            isOpen={isMobileMenuOpen}
          />
        </div>
      </div>

      {/* Mobile Menu (can be expanded later) */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#10221c]">
          <nav className="px-6 py-4 space-y-2">
            {navigationItems.length > 0 ? navigationItems.map((item, index) => {
              const isHashLink = item.href.startsWith('#')
              
              if (isHashLink) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    className="block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-white/5"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              }
              
              return (
                <Link
                  key={index}
                  to={item.href}
                  className="block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-slate-50 dark:hover:bg-white/5"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              )
            }) : (
              <>
                <Link to="/" className="block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <a href="#about" className="block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>About</a>
                <a href="#services" className="block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Services</a>
                <a href="#barbers" className="block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Barbers</a>
                <a href="#gallery" className="block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Gallery</a>
                <a href="#contact" className="block px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header

