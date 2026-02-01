import React, { useState, useEffect } from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'
import SuccessModal from '../SuccessModal/SuccessModal'
import contactSubmissionsApi from '../../api/contactSubmissions'

const CodelanceContactForm = ({
  projects = [],
  onSubmit = null,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    project_id: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (onSubmit && typeof onSubmit === 'function') {
      setIsSubmitting(true)
      try {
        await onSubmit(formData)
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          project_id: '',
          message: ''
        })
        // Show success modal
        setShowSuccessModal(true)
      } catch (error) {
        // Error is handled by parent component, but don't show success modal on error
        alert(error.response?.data?.message || 'Failed to send message. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    } else {
      // Fallback: Submit directly to API if no handler provided
      setIsSubmitting(true)
      try {
        await contactSubmissionsApi.submitContactForm({
          name: formData.name,
          email: formData.email,
          project_id: formData.project_id ? parseInt(formData.project_id) : null,
          message: formData.message
        })
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          project_id: '',
          message: ''
        })
        // Show success modal
        setShowSuccessModal(true)
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to send message. Please try again.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div 
      ref={ref}
      className={`glass-panel p-8 md:p-10 rounded-xl shadow-2xl relative transition-all duration-1000 ease-out delay-200 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-navy-deep dark:text-white px-1">
              Full Name
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-lg bg-white/50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              placeholder="John Doe"
              type="text"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-navy-deep dark:text-white px-1">
              Email Address
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-4 rounded-lg bg-white/50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400"
              placeholder="john@example.com"
              type="email"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-navy-deep dark:text-white px-1">
            Required Service
          </label>
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-lg bg-white/50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all appearance-none cursor-pointer"
            required
          >
            <option disabled value="">Select a service</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-navy-deep dark:text-white px-1">
            Your Message
          </label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-5 py-4 rounded-lg bg-white/50 dark:bg-background-dark/50 border border-slate-200 dark:border-white/10 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-slate-400 resize-none"
            placeholder="Tell us about your project..."
            rows="4"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full bg-primary text-white py-5 rounded-lg font-bold text-lg overflow-hidden transition-all shadow-xl shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSubmitting ? 'Sending...' : 'Send Message'}
            {!isSubmitting && (
              <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            )}
          </span>
          {/* Shimmer Effect */}
          <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
        </button>

        <p className="text-center text-xs text-slate-400">
          By clicking send, you agree to our{' '}
          <a className="underline hover:text-primary" href="#privacy">
            Privacy Policy
          </a>
          .
        </p>
      </form>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Message Sent Successfully!"
        message="Thank you for reaching out! We've received your message and will get back to you as soon as possible."
      />
    </div>
  )
}

export default CodelanceContactForm

