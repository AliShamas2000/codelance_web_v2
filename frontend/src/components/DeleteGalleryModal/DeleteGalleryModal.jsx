import React, { useState, useEffect, useCallback } from 'react'
import galleryApi from '../../api/gallery'

const DeleteGalleryModal = ({
  isOpen,
  onClose,
  image = null,
  onSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsDeleting(false)
      setError(null)
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel()
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
  }, [isOpen])

  const handleCancel = useCallback(() => {
    setError(null)
    setIsDeleting(false)
    onClose()
  }, [onClose])

  const handleDelete = async () => {
    if (!image || !image.id) {
      setError('Image information is missing')
      return
    }

    setIsDeleting(true)
    setError(null)

    try {
      await galleryApi.deleteGalleryImage(image.id)
      
      // Success - close modal and refresh
      if (onSuccess) {
        onSuccess()
      }
      handleCancel()
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      setError(error.response?.data?.message || 'Failed to delete image. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  if (!isOpen || !image) return null

  const imageTitle = image.title || image.name || 'this image'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e26] shadow-2xl transition-all border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-xl">
                warning
              </span>
            </div>
            <h3 className="text-xl font-bold text-[#111816] dark:text-white">
              Delete Image
            </h3>
          </div>
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-[#10221c] dark:hover:text-gray-300 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to delete <span className="font-semibold text-gray-900 dark:text-white">"{imageTitle}"</span>? This action cannot be undone.
          </p>
          
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 mb-4">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-yellow-600 dark:text-yellow-400 text-lg">
                info
              </span>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                This will permanently remove the image from your gallery. This action cannot be reversed.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#152721] px-6 py-4">
          <button
            onClick={handleCancel}
            disabled={isDeleting}
            className="rounded-lg bg-white dark:bg-[#10221c] border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            type="button"
          >
            {isDeleting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                Deleting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">delete_outline</span>
                Delete Image
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteGalleryModal


