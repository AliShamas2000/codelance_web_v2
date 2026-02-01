import React, { useEffect } from 'react'

const Modal = ({
  isOpen = false,
  onClose,
  title,
  titleIcon,
  children,
  footer,
  maxWidth = "max-w-lg",
  customHeader,
  className = ""
}) => {
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose && onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      aria-labelledby="modal-title"
      aria-modal="true"
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Centering wrapper */}
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          ​
        </span>

        {/* Modal panel */}
        <div
          className={`inline-block align-bottom bg-white dark:bg-card-dark rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle ${maxWidth} sm:w-full border border-gray-200 dark:border-gray-700 ${className}`}
        >
          {/* Header */}
          {customHeader ? (
            <div className="border-b border-gray-100 dark:border-gray-800">
              {customHeader}
            </div>
          ) : title ? (
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-[#111816] dark:text-white flex items-center gap-2" id="modal-title">
                {titleIcon && (
                  <span className={`material-symbols-outlined ${typeof titleIcon === 'object' && titleIcon.color ? titleIcon.color : 'text-primary'}`}>
                    {typeof titleIcon === 'object' ? titleIcon.name : titleIcon}
                  </span>
                )}
                {title}
              </h3>
              {onClose && (
                <button
                  onClick={onClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-500 focus:outline-none transition-colors"
                  type="button"
                  aria-label="Close modal"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              )}
            </div>
          ) : null}

          {/* Content */}
          <div className="px-6 py-6 overflow-y-auto custom-scrollbar bg-background-light dark:bg-background-dark/50">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-surface-light dark:bg-surface-dark flex justify-end gap-3 z-10">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Modal

