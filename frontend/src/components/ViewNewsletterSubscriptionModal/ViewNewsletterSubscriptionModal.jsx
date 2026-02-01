import React, { useState, useEffect, useCallback } from 'react'
import newsletterSubscriptionsApi from '../../api/newsletterSubscriptions'

const ViewNewsletterSubscriptionModal = ({
  isOpen,
  onClose,
  subscription = null,
  onUpdate
}) => {
  const [formData, setFormData] = useState({
    status: 'active',
    admin_notes: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (subscription) {
      setFormData({
        status: subscription.status || 'active',
        admin_notes: subscription.adminNotes || subscription.admin_notes || ''
      })
    }
    setErrors({})
  }, [subscription, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    
    try {
      await newsletterSubscriptionsApi.updateSubscription(subscription.id, formData)

      if (onUpdate) {
        onUpdate()
      }
      onClose()
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to update subscription. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      status: 'active',
      admin_notes: ''
    })
    setErrors({})
    onClose()
  }, [onClose])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) handleCancel()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleCancel])

  if (!isOpen || !subscription) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && handleCancel()}
    >
      <div
        className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e26] shadow-2xl transition-all border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-5">
          <h3 className="text-xl font-bold text-[#111816] dark:text-white">
            Newsletter Subscription Details
          </h3>
          <button
            onClick={handleCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-[#10221c] dark:hover:text-gray-300 focus:outline-none transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subscription Info */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="px-4 py-3 bg-gray-50 dark:bg-[#10221c] rounded-lg text-gray-900 dark:text-gray-100">
                {subscription.email || 'N/A'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Subscribed At
                </label>
                <div className="px-4 py-3 bg-gray-50 dark:bg-[#10221c] rounded-lg text-gray-900 dark:text-gray-100">
                  {subscription.subscribedAt || subscription.subscribed_at 
                    ? new Date(subscription.subscribedAt || subscription.subscribed_at).toLocaleString() 
                    : 'N/A'}
                </div>
              </div>
              {subscription.unsubscribedAt || subscription.unsubscribed_at ? (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unsubscribed At
                  </label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-[#10221c] rounded-lg text-gray-900 dark:text-gray-100">
                    {new Date(subscription.unsubscribedAt || subscription.unsubscribed_at).toLocaleString()}
                  </div>
                </div>
              ) : null}
            </div>

            {/* Admin Controls */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Admin Notes
                </label>
                <textarea
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 resize-none"
                  rows="4"
                  value={formData.admin_notes}
                  onChange={(e) => handleInputChange('admin_notes', e.target.value)}
                  placeholder="Add internal notes about this subscription..."
                />
              </div>
            </div>

            {errors.submit && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#152721] px-6 py-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="rounded-lg bg-white dark:bg-[#10221c] border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-[#111816] shadow-sm hover:bg-[#0eb37d] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
                Updating...
              </span>
            ) : (
              'Update Status'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ViewNewsletterSubscriptionModal

