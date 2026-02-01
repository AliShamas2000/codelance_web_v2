import React, { useState } from 'react'

const FooterContact = ({
  title = "Get in Touch",
  address = "123 Blade Street, Soho\nNew York, NY 10012",
  phone = "(555) 123-4567",
  email = "hello@barberstudio.com",
  showNewsletter = true,
  onNewsletterSubmit,
  className = ""
}) => {
  const [emailInput, setEmailInput] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!emailInput.trim()) return

    setIsSubmitting(true)
    try {
      if (onNewsletterSubmit) {
        await onNewsletterSubmit(emailInput)
      } else {
        // Default behavior - just log
        console.log('Newsletter subscription:', emailInput)
      }
      setEmailInput("")
    } catch (error) {
      console.error('Newsletter subscription error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      <h3 className="text-text-main dark:text-white font-bold text-base uppercase tracking-wider">
        {title}
      </h3>

      {/* Contact Info */}
      <div className="flex flex-col gap-4 text-sm text-text-muted dark:text-gray-400">
        {address && (
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-xl mt-0.5">
              location_on
            </span>
            <span className="whitespace-pre-line">{address}</span>
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">
              phone_iphone
            </span>
            <a
              href={`tel:${phone.replace(/\D/g, '')}`}
              className="hover:text-primary cursor-pointer transition-colors"
            >
              {phone}
            </a>
          </div>
        )}

        {email && (
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl">
              mail
            </span>
            <a
              href={`mailto:${email}`}
              className="hover:text-primary cursor-pointer transition-colors"
            >
              {email}
            </a>
          </div>
        )}
      </div>

      {/* Newsletter Subscription */}
      {showNewsletter && (
        <div className="pt-2">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <label className="sr-only" htmlFor="email-sub">
              Subscribe to newsletter
            </label>
            <div className="relative">
              <input
                id="email-sub"
                type="email"
                placeholder="Enter your email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                disabled={isSubmitting}
                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all dark:text-white dark:placeholder-gray-500 disabled:opacity-50"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-1.5 p-1.5 bg-primary text-white rounded-md hover:bg-[#0ebf84] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-lg block">
                  {isSubmitting ? "hourglass_empty" : "arrow_forward"}
                </span>
              </button>
            </div>
            <p className="text-xs text-text-muted/60 dark:text-gray-500">
              Get the latest news and offers.
            </p>
          </form>
        </div>
      )}
    </div>
  )
}

export default FooterContact

