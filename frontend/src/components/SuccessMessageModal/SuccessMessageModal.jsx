import React, { useEffect } from 'react'
import Modal from '../Modal/Modal'

const SuccessMessageModal = ({
  isOpen = false,
  onClose,
  title = "Success!",
  message = "Operation completed successfully.",
  className = ""
}) => {
  // Auto-close after 2 seconds
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      className={className}
    >
      <div className="text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-green-100 dark:border-green-800">
          <span className="material-symbols-outlined text-3xl">check_circle</span>
        </div>

        {/* Title */}
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h4>

        {/* Message */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
          {message}
        </p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-primary hover:bg-[#0fb37d] text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/25"
        >
          OK
        </button>
      </div>
    </Modal>
  )
}

export default SuccessMessageModal

