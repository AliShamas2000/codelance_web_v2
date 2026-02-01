import React from 'react'
import Modal from '../Modal/Modal'

const DeleteReviewModal = ({
  isOpen = false,
  onClose,
  onConfirm,
  review = null,
  isLoading = false,
  className = ""
}) => {
  const handleConfirm = () => {
    if (onConfirm && review) {
      onConfirm(review.id, review)
    }
  }

  if (!isOpen || !review) return null

  const clientName = review.clientName || review.customerName || 'this review'

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      footer={
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-5 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-surface-dark focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">delete</span>
                <span>Confirm Delete</span>
              </>
            )}
          </button>
        </div>
      }
      className={className}
    >
      <div className="text-center">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-900/50">
          <span className="material-symbols-outlined text-3xl">delete</span>
        </div>

        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Delete Review?
        </h4>

        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
          Are you sure you want to delete the review from{' '}
          <span className="font-bold text-gray-900 dark:text-white">{clientName}</span>? This action cannot be undone.
        </p>
      </div>
    </Modal>
  )
}

export default DeleteReviewModal

