import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PhoneInput from '../../../components/PhoneInput/PhoneInput'
import authApi from '../../../api/auth'

const UserLogin = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        
        if (!token) {
          setIsCheckingAuth(false)
          return
        }

        // Verify token and get user info
        const response = await authApi.getCurrentUser()
        const user = response.user || response
        
        if (user && user.role) {
          // User is already logged in, redirect based on role
          if (user.role === 'client') {
            navigate('/', { replace: true })
          } else if (user.role === 'barber') {
            navigate('/barber/dashboard', { replace: true })
          } else if (user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true })
          }
        } else {
          // Invalid token, clear it and show login form
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user')
          setIsCheckingAuth(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Clear invalid token
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [navigate])

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

  const handlePasswordChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, password: value }))
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }))
    }
    if (error) {
      setError('')
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev)
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
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
      const response = await authApi.login({
        phone: formData.phone,
        password: formData.password,
        remember_me: false
      })

      // Store token if provided
      if (response.token) {
        localStorage.setItem('auth_token', response.token)
      }

      // Store user data if provided
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user))
      }

      // Navigate based on user role
      const userRole = response.user?.role || response.role
      if (userRole === 'client') {
        // Client - navigate to home page
        navigate('/', { replace: true })
      } else if (userRole === 'barber') {
        navigate('/barber/dashboard', { replace: true })
      } else if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true })
      } else {
        // Default - navigate to home
        navigate('/', { replace: true })
      }
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle validation errors
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors || {}
        const errorMessages = []
        
        if (validationErrors.phone) {
          errorMessages.push(Array.isArray(validationErrors.phone) ? validationErrors.phone[0] : validationErrors.phone)
        }
        if (validationErrors.password) {
          errorMessages.push(Array.isArray(validationErrors.password) ? validationErrors.password[0] : validationErrors.password)
        }
        
        setError(errorMessages.length > 0 ? errorMessages.join('. ') : error.response?.data?.message || 'Invalid credentials. Please try again.')
      } else {
        // Handle other errors
        const errorMessage = error.response?.data?.message || 
                            error.response?.data?.errors?.phone?.[0] ||
                            error.response?.data?.errors?.password?.[0] ||
                            'Invalid phone number or password. Please try again.'
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }


  // Show loading state while checking auth
  if (isCheckingAuth) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
          <p className="text-[#637588] dark:text-[#8d9ba8] text-sm">Loading...</p>
        </div>
      </div>
    )
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

        {/* Login Card */}
        <div className="bg-white dark:bg-[#152822] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e7eb] dark:border-[#2a3e36] overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center border-b border-[#f0f2f5] dark:border-[#2a3e36]">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-[#0fb57e] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-primary/20 transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <span className="material-symbols-outlined text-white text-[32px]">content_cut</span>
            </div>
            <h1 className="text-[#111816] dark:text-white text-2xl font-bold leading-tight tracking-tight">
              Welcome Back
            </h1>
            <p className="text-[#637588] dark:text-[#8d9ba8] text-sm font-medium mt-2 max-w-[260px]">
              Please enter your phone number to sign in.
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

              {/* Password Input */}
              <div className="flex flex-col gap-2">
                <label className="text-[#111816] dark:text-[#e2e8f0] text-sm font-semibold leading-normal">
                  Password
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="relative flex w-full items-center">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password || ''}
                    onChange={handlePasswordChange}
                    placeholder="••••••••••••"
                    required
                    className={`flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#111816] dark:text-white dark:bg-[#0b1a15] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary border ${
                      errors.password ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
                    } bg-white h-12 placeholder:text-[#9ca3af] pl-11 pr-12 text-base font-normal leading-normal transition-all duration-200`}
                  />
                  <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-11 text-[#9ca3af]">
                    <span className="material-symbols-outlined text-[20px]">lock</span>
                  </div>
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-0 bottom-0 px-4 text-[#9ca3af] hover:text-[#111816] dark:hover:text-white transition-colors flex items-center justify-center outline-none focus:text-primary"
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold text-[#637588] dark:text-[#8d9ba8] hover:text-primary transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="mt-3 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-[#0ebf84] active:scale-[0.98] text-[#111816] text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-[0_2px_8px_rgba(17,212,147,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2 text-[20px]">refresh</span>
                    <span className="truncate">Signing in...</span>
                  </>
                ) : (
                  <>
                    <span className="truncate">Sign In</span>
                    <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-[#fcfdfd] dark:bg-[#12221d] border-t border-[#f0f2f5] dark:border-[#2a3e36] px-8 py-4 flex justify-center">
            <p className="text-[#637588] dark:text-[#6b7280] text-xs font-medium">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-bold text-primary hover:text-primary-hover hover:underline transition-colors"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default UserLogin

