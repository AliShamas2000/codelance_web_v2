import React, { useState, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import PhoneInput from '../../../components/PhoneInput/PhoneInput'
import PasswordInput from '../../../components/PasswordInput/PasswordInput'
import FormInput from '../../../components/FormInput/FormInput'
import authApi from '../../../api/auth'

const Register = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    password: '',
    confirmPassword: '',
    avatar: null
  })
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

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

  const handlePhoneChange = (e) => {
    const value = e?.target?.value || e || ''
    setFormData(prev => ({ ...prev, phone: value }))
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }))
    }
    if (error) {
      setError('')
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB')
        return
      }
      setFormData(prev => ({ ...prev, avatar: file }))
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of birth is required'
    }

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
      // Prepare form data for API
      const submitData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth,
        password: formData.password,
        password_confirmation: formData.confirmPassword
      }

      // If avatar is selected, we'll need to send it as FormData
      let response
      if (formData.avatar) {
        const formDataToSend = new FormData()
        Object.keys(submitData).forEach(key => {
          formDataToSend.append(key, submitData[key])
        })
        formDataToSend.append('avatar', formData.avatar)
        
        response = await authApi.register(formDataToSend)
      } else {
        response = await authApi.register(submitData)
      }

      if (response.success) {
        // If registration requires OTP verification
        if (response.requires_verification) {
          // Store phone in localStorage as fallback
          localStorage.setItem('register_phone', formData.phone)
          
          // Store expiration time if provided
          if (response.expires_at) {
            localStorage.setItem('otp_expires_at', response.expires_at)
          }
          
          // Navigate to OTP page with phone number and expiration time
          // OTP is already created during registration
          navigate('/otp', {
            state: {
              phone: formData.phone,
              type: 'registration',
              expires_at: response.expires_at,
              created_at: response.created_at
            }
          })
        } else {
          // Store token if provided
          if (response.token) {
            localStorage.setItem('auth_token', response.token)
          }

          // Store user data if provided
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user))
          }

          // Navigate to home or dashboard
          navigate('/')
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      
      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors
        const errorMessages = []
        
        // Collect all validation error messages
        Object.keys(validationErrors).forEach(key => {
          if (Array.isArray(validationErrors[key]) && validationErrors[key].length > 0) {
            errorMessages.push(validationErrors[key][0])
          }
        })
        
        // Set field-specific errors
        const fieldErrors = {}
        Object.keys(validationErrors).forEach(key => {
          if (Array.isArray(validationErrors[key]) && validationErrors[key].length > 0) {
            // Map backend field names to frontend field names
            const frontendKey = key === 'first_name' ? 'firstName' :
                               key === 'last_name' ? 'lastName' :
                               key === 'date_of_birth' ? 'dateOfBirth' :
                               key === 'password_confirmation' ? 'confirmPassword' : key
            fieldErrors[frontendKey] = validationErrors[key][0]
          }
        })
        setErrors(fieldErrors)
        
        // Set general error message
        if (errorMessages.length > 0) {
          setError(errorMessages.join(', '))
        } else {
          setError(error.response?.data?.message || 'Registration failed. Please check the form and try again.')
        }
      } else {
        setError(error.response?.data?.message || 'Registration failed. Please try again.')
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
      <div className="w-full max-w-[520px] flex flex-col gap-8 animate-fade-in-up">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Register Card */}
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
              <span className="material-symbols-outlined text-white text-[32px]">person_add</span>
            </div>
            <h1 className="text-[#111816] dark:text-white text-2xl font-bold leading-tight tracking-tight">
              Complete Profile
            </h1>
            <p className="text-[#637588] dark:text-[#8d9ba8] text-sm font-medium mt-2 max-w-[260px]">
              Finish setting up your account details.
            </p>
          </div>

          {/* Card Body / Form */}
          <div className="p-8 flex flex-col gap-5">
            {/* Avatar Upload Section */}
            <div className="flex flex-col items-center justify-center mb-2">
              <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
                <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-sm overflow-hidden">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600">person</span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 flex items-center justify-center shadow-md transition-transform group-hover:scale-110">
                  <span className="material-symbols-outlined text-white text-sm">photo_camera</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <button
                type="button"
                onClick={handleAvatarClick}
                className="text-primary text-[10px] font-bold uppercase tracking-wider mt-3 cursor-pointer hover:text-primary-hover transition-colors"
              >
                Upload Avatar
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {/* First Name and Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <FormInput
                    label="First Name"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    required
                    error={errors.firstName}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <FormInput
                    label="Last Name"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    required
                    error={errors.lastName}
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="flex flex-col gap-2">
                <PhoneInput
                  label="Phone Number"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter your phone number"
                  required
                  error={errors.phone}
                  defaultCountry="LB"
                  className="[&>div]:gap-0"
                />
              </div>

              {/* Date of Birth */}
              <div className="flex flex-col gap-2">
                <FormInput
                  label="Date of Birth"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  error={errors.dateOfBirth}
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-2">
                <PasswordInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create password"
                  required
                  error={errors.password}
                />
                {!errors.password && (
                  <p className="text-xs text-[#637588] dark:text-[#8d9ba8] ml-1">
                    Must be at least 8 characters.
                  </p>
                )}
              </div>

              {/* Confirm Password */}
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
                disabled={isLoading}
                className="mt-3 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-[#0ebf84] active:scale-[0.98] text-[#111816] text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-[0_2px_8px_rgba(17,212,147,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin mr-2 text-[20px]">refresh</span>
                    <span className="truncate">Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span className="truncate">Complete & Sign In</span>
                    <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Card Footer */}
          <div className="bg-[#fcfdfd] dark:bg-[#12221d] border-t border-[#f0f2f5] dark:border-[#2a3e36] px-8 py-4 flex justify-center">
            <p className="text-[#637588] dark:text-[#6b7280] text-xs font-medium">
              Already have an account?{' '}
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

export default Register

