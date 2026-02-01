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
      navigate('/contact')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-navy-deep/5 dark:border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex h-20 items-center justify-between">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img 
              src={logoUrl} 
              alt={brandName} 
              className="size-9 object-contain"
            />
          ) : (
            <div className="size-9 bg-primary flex items-center justify-center rounded-lg text-white">
              <svg className="size-6" fill="currentColor" viewBox="0 0 48 48">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
              </svg>
            </div>
          )}
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
              className="hidden sm:flex bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95"
            >
              Get Started
            </button>
          )}
          {userAvatar ? (
            <div
              className="size-10 rounded-full bg-cover bg-center border-2 border-primary"
              style={{ backgroundImage: `url("${userAvatar}")` }}
              alt="User profile avatar portrait"
            />
          ) : (
            <div className="size-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">account_circle</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default CodelanceHeader

