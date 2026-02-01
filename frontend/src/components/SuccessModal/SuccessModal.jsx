import React from 'react'

const SuccessModal = ({
  isOpen = false,
  onClose,
  className = ""
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-3xl shadow-2xl max-w-md w-full text-center fade-in border border-gray-100 dark:border-gray-800">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
          <span className="material-symbols-outlined text-[48px]">check_circle</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-[#111816] dark:text-white">
          Thank You!
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          Your feedback helps us improve our service. We appreciate you taking the time.
        </p>
        <button
          onClick={onClose}
          className="w-full py-3 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary/25"
        >
          Return to Home
        </button>
      </div>
    </div>
  )
}

export default SuccessModal
