import React, { useState } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceFooterNewsletter = ({
  title = "Subscribe to our newsletter",
  placeholder = "Email address",
  onSubmit = null,
  className = ""
}) => {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) return

    if (onSubmit) {
      setIsSubmitting(true)
      try {
        await onSubmit(email)
        setEmail('')
      } catch (error) {
        console.error('Error subscribing:', error)
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Frontend-only: Just log the email
      console.log('Newsletter subscription:', email)
      alert('Thank you for subscribing!')
      setEmail('')
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
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="bg-white dark:bg-white/5 border border-navy-deep/10 dark:border-white/10 rounded-l px-4 py-2 text-sm w-full focus:outline-none focus:ring-1 focus:ring-primary text-navy-deep dark:text-white placeholder:text-navy-deep/40 dark:placeholder:text-white/40"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary text-navy-deep font-bold text-sm px-4 py-2 rounded-r hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined">send</span>
        </button>
      </form>
    </div>
  )
}

export default CodelanceFooterNewsletter

