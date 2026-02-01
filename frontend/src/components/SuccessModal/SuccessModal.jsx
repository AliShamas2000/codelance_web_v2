import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

const SuccessModal = ({
  isOpen,
  onClose,
  title = "Success!",
  message = "Your request has been processed successfully.",
  className = ""
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <div
        className={`relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e26] shadow-2xl transition-all duration-300 border border-gray-100 dark:border-gray-800 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
        style={{ 
          zIndex: 10000,
          position: 'relative',
          margin: 'auto'
        }}
      >
        {/* Success Icon Animation */}
        <div className="flex flex-col items-center justify-center px-6 pt-8 pb-6">
          <div className="relative mb-4">
            {/* Animated Checkmark Circle */}
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center animate-pulse">
              <div className="w-16 h-16 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-4xl font-bold">
                  check
                </span>
              </div>
            </div>
            {/* Success Rings Animation */}
            <div className="absolute inset-0 rounded-full border-4 border-green-500/30 animate-ping"></div>
            <div className="absolute inset-0 rounded-full border-4 border-green-500/20 animate-ping" style={{ animationDelay: '0.2s' }}></div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            {message}
          </p>
        </div>

        {/* Close Button */}
        <div className="flex items-center justify-center border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#152721] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-[#111816] shadow-sm hover:bg-[#0eb37d] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all transform hover:scale-105 active:scale-95"
            type="button"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  )

  // Use React Portal to render modal at document body level
  return createPortal(modalContent, document.body)
}

export default SuccessModal
