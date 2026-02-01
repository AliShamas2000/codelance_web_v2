import React, { useState, useMemo } from 'react'
import PhoneInput from '../PhoneInput/PhoneInput'
import StarRating from '../StarRating/StarRating'
import MultiSelect from '../MultiSelect/MultiSelect'

const ReviewForm = ({
  appointment = null,
  onSubmit,
  isLoading = false,
  className = ""
}) => {
  const [rating, setRating] = useState(0)
  const [services, setServices] = useState([]) // Changed to array for multi-select
  const [phone, setPhone] = useState('')
  const [feedback, setFeedback] = useState('')
  const [recommend, setRecommend] = useState(true)
  const [errors, setErrors] = useState({})

  // Convert appointment services to options for MultiSelect
  const serviceOptions = useMemo(() => {
    if (!appointment?.services || !Array.isArray(appointment.services)) {
      return []
    }
    return appointment.services.map(service => ({
      value: service.id || service,
      label: service.name || service.name_en || service
    }))
  }, [appointment?.services])

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch (error) {
      return dateString
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!rating || rating === 0) {
      newErrors.rating = 'Please select a rating'
    }
    
    if (!services || services.length === 0) {
      newErrors.services = 'Please select at least one service'
    }
    
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }
    // Remove phone validation regex - react-phone-number-input handles validation
    // The phone number from PhoneInput is already in international format (e.g., +96171422423)
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (onSubmit) {
      onSubmit({
        rating,
        services, // Changed to services array
        phone,
        feedback,
        recommend
      })
    }
  }

  return (
    <>
      <div className={`flex flex-col items-center mb-8 ${className}`}>
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xl mb-4 shadow-lg shadow-primary/20">
          B
        </div>
        <h2 className="font-bold text-lg tracking-tight text-gray-900 dark:text-white">
          Blade Barbershop
        </h2>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-surface-light dark:bg-surface-dark p-8 md:p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden"
      >
      {/* Gradient Top Border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-block relative mb-4">
          <img
            alt="Barber"
            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-surface-dark shadow-md mx-auto"
            src={appointment?.barberAvatar || 'https://via.placeholder.com/80'}
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-primary rounded-full border-2 border-white dark:border-surface-dark flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[14px] font-bold">content_cut</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-[#111816] dark:text-white mb-2 leading-tight">
          How was your experience with {appointment?.barberName || 'your barber'}?
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Please rate your recent visit on {formatDate(appointment?.date)}
        </p>
      </div>

      {/* Star Rating */}
      <div className="mb-8 flex flex-col items-center">
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Tap to Rate
        </label>
        <StarRating
          value={rating}
          onChange={setRating}
          error={errors.rating}
        />
        {errors.rating && (
          <p className="text-xs text-red-500 mt-2">{errors.rating}</p>
        )}
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Services MultiSelect */}
        <div>
          <MultiSelect
            label="Services Received"
            name="services"
            value={services}
            onChange={(value) => {
              setServices(value)
              setErrors(prev => ({ ...prev, services: '' }))
            }}
            options={serviceOptions}
            placeholder={serviceOptions.length === 0 ? "No services available" : "Select services"}
            required
            error={errors.services}
            icon="content_cut"
          />
          {errors.services && (
            <p className="text-xs text-red-500 mt-2">{errors.services}</p>
          )}
        </div>

        {/* Phone Number */}
        <PhoneInput
          label="Phone Number"
          name="phone"
          id="phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value)
            setErrors(prev => ({ ...prev, phone: '' }))
          }}
          placeholder="Enter phone number"
          error={errors.phone}
        />

        {/* Feedback Textarea */}
        <div>
          <label
            htmlFor="feedback"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Your Feedback
          </label>
          <textarea
            id="feedback"
            name="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Tell us about your cut, the atmosphere, or the service..."
            rows="4"
            className="block w-full px-4 py-3 text-base border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary sm:text-sm rounded-xl transition-all resize-none text-[#111816] dark:text-gray-200 placeholder-gray-400"
          />
        </div>

        {/* Recommend Toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Would you recommend us?
            </span>
            <span className="text-xs text-gray-500">
              Let others know about your barber
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer" htmlFor="recommend-toggle">
            <input
              id="recommend-toggle"
              type="checkbox"
              checked={recommend}
              onChange={(e) => setRecommend(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 border border-transparent rounded-xl shadow-lg shadow-primary/25 text-base font-semibold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Submitting...</span>
            </>
          ) : (
            <>
              Submit Rating
              <span className="material-symbols-outlined text-[20px]">send</span>
            </>
          )}
        </button>
        <p className="mt-4 text-center text-xs text-gray-400">
          Your review helps others find great barbers.
        </p>
      </div>
    </form>
    </>
  )
}

export default ReviewForm

