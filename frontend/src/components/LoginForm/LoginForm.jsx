import React, { useState } from 'react'
import FormInput from '../FormInput/FormInput'
import PasswordInput from '../PasswordInput/PasswordInput'

const LoginForm = ({
  onSubmit,
  isLoading = false,
  initialEmail = "",
  className = ""
}) => {
  const [formData, setFormData] = useState({
    email: initialEmail,
    password: ''
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit && onSubmit({
        email: formData.email,
        password: formData.password,
        rememberMe: false
      })
    }
  }

  return (
    <form className={`flex flex-col gap-5 ${className}`} onSubmit={handleSubmit}>
      {/* Email Input */}
      <div className="flex flex-col gap-2">
        <FormInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="admin@company.com"
          icon="mail"
          required
          error={errors.email}
        />
      </div>

      {/* Password Input */}
      <PasswordInput
        label="Password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        placeholder="••••••••••••"
        required
        error={errors.password}
      />


      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="mt-3 flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-5 bg-primary hover:bg-[#0ebf84] active:scale-[0.98] text-[#111816] text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-[0_2px_8px_rgba(17,212,147,0.25)] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin mr-2 text-[20px]">refresh</span>
            <span className="truncate">Logging in...</span>
          </>
        ) : (
          <>
            <span className="truncate">Login to Dashboard</span>
            <span className="material-symbols-outlined ml-2 text-[20px]">arrow_forward</span>
          </>
        )}
      </button>
    </form>
  )
}

export default LoginForm

