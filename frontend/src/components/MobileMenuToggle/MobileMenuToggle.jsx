import React from 'react'

const MobileMenuToggle = ({ onClick, isOpen = false, className = "" }) => {
  return (
    <button
      onClick={onClick}
      className={`lg:hidden p-2 text-slate-600 dark:text-white hover:text-primary transition-colors ${className}`}
      aria-label="Toggle mobile menu"
      aria-expanded={isOpen}
    >
      <span className="material-symbols-outlined text-3xl">
        {isOpen ? 'close' : 'menu'}
      </span>
    </button>
  )
}

export default MobileMenuToggle

