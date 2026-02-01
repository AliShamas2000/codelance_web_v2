import React, { useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'
import SuccessModal from '../SuccessModal/SuccessModal'
import newsletterSubscriptionsApi from '../../api/newsletterSubscriptions'

const CodelanceFooterNewsletter = ({
  title = "Subscribe to our newsletter",
  placeholder = "Email address",
  onSubmit = null,
  className = ""
}) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [error, setError] = useState(null)
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email.trim()) return

    setError(null)
    setIsSubmitting(true)

    try {
      if (onSubmit && typeof onSubmit === 'function') {
        await onSubmit(email)
      } else {
        // Fallback: Submit directly to API
        await newsletterSubscriptionsApi.subscribe(email)
      }
      
      setEmail('')
      setShowSuccessModal(true)
    } catch (error) {
      // Handle duplicate email error
      if (error.response?.data?.error === 'duplicate_email' || error.response?.status === 422) {
        setError(error.response?.data?.message || 'This email is already subscribed to our newsletter.')
      } else {
        setError(error.response?.data?.message || 'Failed to subscribe. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div 
      ref={ref}
      className={`mt-8 transition-all duration-1000 ease-out delay-400 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {title && (
        <p className="text-xs text-navy-deep/50 dark:text-white/40 mb-3">
          {title}
        </p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError(null)
            }}
            placeholder={placeholder}
            className={`bg-white dark:bg-white/5 border rounded-l px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 text-navy-deep dark:text-white placeholder:text-navy-deep/40 dark:placeholder:text-white/40 ${
              error 
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                : 'border-navy-deep/10 dark:border-white/10 focus:ring-primary focus:border-primary'
            }`}
            required
            disabled={isSubmitting}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary text-navy-deep font-bold text-sm px-4 py-2 rounded-r hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin">hourglass_empty</span>
            ) : (
              <span className="material-symbols-outlined">send</span>
            )}
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-500 dark:text-red-400 mt-1">
            {error}
          </p>
        )}
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Successfully Subscribed!"
        message="Thank you for subscribing to our newsletter! You'll receive the latest updates and news from us."
      />
    </div>
  )
}

export default CodelanceFooterNewsletter

