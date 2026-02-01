import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import PasswordInput from '../../../components/PasswordInput/PasswordInput'
import authApi from '../../../api/auth'

const ResetPassword = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  // Get reset token and phone from location state
  const resetToken = location.state?.reset_token || new URLSearchParams(location.search).get('token') || null
  const phone = location.state?.phone || localStorage.getItem('reset_phone') || null

  // Redirect if no token or phone
  useEffect(() => {
    if (!resetToken || !phone) {
      navigate('/forgot-password', { replace: true })
    }
  }, [resetToken, phone, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
    if (error) {
      setError('')
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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

    try {
      const response = await authApi.resetPassword({
        token: resetToken,
        phone: phone, // Use phone instead of email
        password: formData.password,
        password_confirmation: formData.confirmPassword
      })

      if (response.success || response.message) {
        setSuccess(true)
        // Clear stored phone
        localStorage.removeItem('reset_phone')
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login')
        }, 2000)
      }
    } catch (error) {
      console.error('Reset password error:', error)
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.password?.[0] ||
                          error.response?.data?.errors?.password_confirmation?.[0] ||
                          'Failed to reset password. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate('/otp')
  }

  // TODO: Uncomment this check when backend is ready
  // if (!resetToken || resetToken === 'demo-token') {
  //   return null // Will redirect in useEffect
  // }

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
              Password reset successfully! Redirecting to login...
            </p>
          </div>
        )}

        {/* Reset Password Card */}
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
              New Password
            </h1>
            <p className="text-[#637588] dark:text-[#8d9ba8] text-sm font-medium mt-2 max-w-[260px]">
              Your new password must be different from previous used passwords.
            </p>
          </div>

          {/* Card Body / Form */}
          <div className="p-8 flex flex-col gap-5">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* New Password Input */}
              <div className="flex flex-col gap-2">
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create new password"
                  required
                  error={errors.password}
                />
                {!errors.password && (
                  <p className="text-xs text-[#637588] dark:text-[#8d9ba8] ml-1">
                    Must be at least 8 characters.
                  </p>
                )}
              </div>

              {/* Confirm Password Input */}
              <div className="flex flex-col gap-2">
                <PasswordInput
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  error={errors.confirmPassword}
                />
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
                    <span className="truncate">Resetting...</span>
                  </>
                ) : success ? (
                  <>
                    <span className="material-symbols-outlined mr-2 text-[20px]">check_circle</span>
                    <span className="truncate">Password Reset!</span>
                  </>
                ) : (
                  <>
                    <span className="truncate">Reset Password</span>
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

export default ResetPassword

