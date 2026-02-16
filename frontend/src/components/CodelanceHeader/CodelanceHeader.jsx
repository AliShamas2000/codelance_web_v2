import React, { useEffect, useState } from 'react'
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

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

  const handleNavClick = (href) => {
    setIsMobileMenuOpen(false)
    if (href?.startsWith('#')) {
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <>
      {/* Mobile Overlay (dim + blur website behind, header stays above) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden"
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />
      )}
      
      <header
        className={`fixed top-0 left-0 right-0 z-50 border-b border-navy-deep/5 dark:border-white/5 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/70 dark:bg-[#10221c]/70 backdrop-blur-xl shadow-sm'
            : 'bg-white dark:bg-[#10221c]'
        }`}
        style={
          isScrolled
            ? {
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }
            : undefined
        }
      >
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
          
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-navy-deep dark:text-white hover:text-primary transition-colors"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="material-symbols-outlined text-3xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`md:hidden border-t border-navy-deep/5 dark:border-white/5 bg-white dark:bg-background-dark overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? 'max-h-[600px] opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <nav className={`px-6 py-4 space-y-2 transition-all duration-300 ${
          isMobileMenuOpen 
            ? 'translate-y-0' 
            : '-translate-y-4'
        }`}>
            {navigationItems.map((item, index) => {
              const isHashLink = item.href?.startsWith('#')
              
              return (
                <a
                  key={index}
                  href={item.href}
                  className="block px-4 py-3 text-sm font-semibold text-navy-deep dark:text-white hover:text-primary dark:hover:text-primary transition-colors rounded-lg hover:bg-navy-deep/5 dark:hover:bg-white/5"
                  onClick={(e) => {
                    if (isHashLink) {
                      e.preventDefault()
                      handleNavClick(item.href)
                    } else {
                      setIsMobileMenuOpen(false)
                    }
                  }}
                >
                  {item.label}
                </a>
              )
            })}
            {showGetStarted && (
              <button
                onClick={() => {
                  handleGetStarted()
                  setIsMobileMenuOpen(false)
                }}
                className="group relative w-full mt-4 bg-primary text-white text-sm font-bold px-6 py-3 rounded-xl overflow-hidden transition-all shadow-xl shadow-primary/30 active:scale-[0.98]"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Get Started
                  <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                    arrow_forward
                  </span>
                </span>
                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  )
}

export default CodelanceHeader
