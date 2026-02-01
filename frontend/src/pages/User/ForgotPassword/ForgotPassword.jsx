import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PhoneInput from '../../../components/PhoneInput/PhoneInput'
import authApi from '../../../api/auth'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    phone: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  const handlePhoneChange = (e) => {
    // PhoneInput can pass either an event object or a direct value
    const value = e?.target?.value || e || ''
    setFormData(prev => ({ ...prev, phone: value }))
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }))
    }
    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess(false)

    try {
      // Send OTP for password reset
      const response = await authApi.sendOTP({
        phone: formData.phone,
        type: 'password_reset'
      })

      if (response.success) {
        setSuccess(true)
        // Store phone number and expiration time for OTP page
        localStorage.setItem('reset_phone', formData.phone)
        if (response.expires_at) {
          localStorage.setItem('otp_expires_at', response.expires_at)
        }
        
        // Redirect to OTP page after a short delay
        setTimeout(() => {
          navigate('/otp', {
            state: {
              phone: formData.phone,
              type: 'password_reset',
              expires_at: response.expires_at,
              created_at: response.created_at,
              expires_in: response.expires_in
            }
          })
        }, 1500)
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      
      // Handle validation errors
      if (error.response?.status === 404) {
        const errorMessage = error.response?.data?.message || 
                            'No account found with this phone number.'
        setError(errorMessage)
      } else if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors || {}
        const errorMessages = []
        
        if (validationErrors.phone) {
          errorMessages.push(Array.isArray(validationErrors.phone) ? validationErrors.phone[0] : validationErrors.phone)
        }
        
        setError(errorMessages.length > 0 ? errorMessages.join('. ') : error.response?.data?.message || 'Invalid phone number.')
      } else {
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.errors?.phone?.[0] ||
                            'Failed to send OTP. Please try again.'
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/login')
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex items-center justify-center p-4 selection:bg-primary/30 selection:text-black">
      {/* Main Content Container */}
      <div className="w-full max-w-[440px] flex flex-col gap-8 animate-fade-in-up">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-green-800 dark:text-green-200 text-sm font-medium">
              Verification code has been sent to your phone number. Please check your messages.
            </p>
          </div>
        )}

        {/* Forgot Password Card */}
        <div className="bg-white dark:bg-[#152822] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e7eb] dark:border-[#2a3e36] overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center border-b border-[#f0f2f5] dark:border-[#2a3e36] relative">
            {/* Back Button */}
            <button
              onClick={handleGoBack}
              aria-label="Go back"
              className="group absolute top-8 left-8 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[#111816] dark:text-white group-hover:text-primary transition-colors">arrow_back</span>
            </button>
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-[#0fb57e] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-primary/20 transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <span className="material-symbols-outlined text-white text-[32px]">lock_reset</span>
            </div>
            <h1 className="text-[#111816] dark:text-white text-2xl font-bold leading-tight tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-[#637588] dark:text-[#8d9ba8] text-sm font-medium mt-2 max-w-[260px]">
              Don't worry! It happens. Please enter the phone number associated with your account.
            </p>
          </div>

          {/* Card Body / Form */}
          <div className="p-8 flex flex-col gap-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* Phone Number Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[#111816] dark:text-[#e2e8f0] text-sm font-semibold leading-normal">
                  Phone Number
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <PhoneInput
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  required={false}
                  error={errors.phone}
                  defaultCountry="LB"
                  className="[&>div]:gap-0"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || success}
                className="mt-3 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-[#0ebf84] active:scale-[0.98] text-[#111816] text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-[0_2px_8px_rgba(17,212,147,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2 text-[20px]">refresh</span>
                    <span className="truncate">Sending...</span>
                  </>
                ) : success ? (
                  <>
                    <span className="material-symbols-outlined mr-2 text-[20px]">check_circle</span>
                    <span className="truncate">Link Sent!</span>
                  </>
                ) : (
                  <>
                    <span className="truncate">Send Reset Link</span>
                    <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-[#fcfdfd] dark:bg-[#12221d] border-t border-[#f0f2f5] dark:border-[#2a3e36] px-8 py-4 flex justify-center">
            <p className="text-[#637588] dark:text-[#6b7280] text-xs font-medium">
              Remember password?{' '}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline ml-1 transition-colors"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword

