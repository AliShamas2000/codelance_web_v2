import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'

const ReplyReviewModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  review = null,
  isLoading = false,
  className = ""
}) => {
  const [replyText, setReplyText] = useState('')

  useEffect(() => {
    if (isOpen && review) {
      // Pre-fill with existing reply if editing
      setReplyText(review.reply?.text || '')
    } else if (!isOpen) {
      // Clear reply when modal closes
      setReplyText('')
    }
  }, [isOpen, review])

  const handleSubmit = () => {
    if (replyText.trim()) {
      onSubmit && onSubmit(replyText)
    }
  }

  if (!isOpen) return null

  const isEditing = review?.reply !== null && review?.reply !== undefined

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Reply" : "Reply to Review"}
      titleIcon="reply"
      maxWidth="max-w-lg"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !replyText.trim()}
            className="px-6 py-2 rounded-xl bg-primary hover:bg-[#0fb37d] text-[#111816] text-sm font-bold shadow-lg shadow-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : isEditing ? 'Update Reply' : 'Post Reply'}
          </button>
        </div>
      }
    >
      {review && (
        <div className="space-y-4">
          {/* Review Preview */}
          <div className="bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-2">
              {review.clientAvatar ? (
                <img
                  alt="Client"
                  className="w-10 h-10 rounded-full object-cover"
                  src={review.clientAvatar}
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-400">
                    {review.clientName ? review.clientName.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-sm text-[#111816] dark:text-white">
                  {review.clientName || 'Unknown Client'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {review.service || 'N/A'}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              "{review.text || review.review || 'No review text'}"
            </p>
          </div>

          {/* Reply Textarea */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Reply
            </label>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="w-full min-h-[120px] p-4 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-sm focus:border-primary focus:ring-primary dark:text-white placeholder-gray-400 dark:placeholder-gray-500 resize-none transition-colors"
              placeholder="Write a professional and friendly reply to this review..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Your reply will be visible to the client and other visitors.
            </p>
          </div>
        </div>
      )}
    </Modal>
  )
}

export default ReplyReviewModal


