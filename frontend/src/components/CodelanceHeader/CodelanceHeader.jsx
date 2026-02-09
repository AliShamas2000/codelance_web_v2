import React from 'react'
import { useNavigate } from 'react-router-dom'

const CodelanceHeader = ({ 
  logoUrl = null,
  brandName = "CODELANCE",
  navigationItems = [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],
  userAvatar = null,
  onGetStartedClick = null,
  showGetStarted = true
}) => {
  const navigate = useNavigate()

  const handleGetStarted = () => {
    if (onGetStartedClick) {
      onGetStartedClick()
    } else {
      // Scroll to contact section
      const contactSection = document.getElementById('contact')
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Fallback: navigate to contact page if section not found
        navigate('/contact')
      }
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-navy-deep/5 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex h-20 items-center justify-between">
        <div className="flex items-center gap-1">
          <img 
            src={logoUrl || "/logo.png"} 
            alt={brandName} 
            className="size-9 object-contain"
          />
          <h2 className="text-xl font-extrabold tracking-tighter text-navy-deep dark:text-white">
            {brandName}
          </h2>
        </div>
        <nav className="hidden md:flex items-center gap-10">
          {navigationItems.map((item, index) => (
            <a
              key={index}
              className="text-sm font-semibold hover:text-primary transition-colors"
              href={item.href}
              onClick={(e) => {
                if (item.href?.startsWith('#')) {
                  e.preventDefault()
                  const element = document.querySelector(item.href)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          {showGetStarted && (
            <button
              onClick={handleGetStarted}
              className="group relative hidden sm:flex bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl overflow-hidden transition-all shadow-xl shadow-primary/30 active:scale-[0.98]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
              {/* Shimmer Effect */}
              <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

export default CodelanceHeader

