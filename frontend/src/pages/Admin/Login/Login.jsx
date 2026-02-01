import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginCard from '../../../components/LoginCard/LoginCard'
import authApi from '../../../api/auth'

const LoginPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState(null)

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
          // User is already logged in, redirect to appropriate dashboard
          if (user.role === 'barber') {
            navigate('/barber/dashboard', { replace: true })
          } else {
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

  const handleLogin = async (formData) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await authApi.login({
        email: formData.email,
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
      const userRole = response.user?.role || response.role || 'admin'
      if (userRole === 'barber') {
        navigate('/barber/dashboard')
      } else {
        navigate('/admin/dashboard')
      }
    } catch (error) {
      console.error('Login error:', error)
      // Check for specific error messages from backend
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.email?.[0] ||
                          'Invalid email or password. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading spinner while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col items-center justify-center p-4">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex flex-col items-center justify-center p-4 selection:bg-primary/30 selection:text-black">
      {/* Main Content Container */}
      <div className="w-full max-w-[440px] flex flex-col gap-8 animate-fade-in-up">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* Login Card */}
        <LoginCard
          onSubmit={handleLogin}
          isLoading={isLoading}
        />

        {/* Page Footer */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-[#637588] dark:text-[#6b7280] text-sm">
            Need help?{' '}
            <a
              href="#"
              className="text-primary hover:underline font-medium"
            >
              Contact Support
            </a>
          </p>
          <p className="text-[#9ca3af] dark:text-[#4b5563] text-xs">
            © 2024 CMS Admin Panel. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

