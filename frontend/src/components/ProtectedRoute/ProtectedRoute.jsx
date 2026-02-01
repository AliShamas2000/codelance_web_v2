import React, { useEffect, useState, useRef } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import authApi from '../../api/auth'

// Cache authentication state to prevent re-checking on every route change
let authCache = {
  isAuthenticated: false,
  userRole: null,
  timestamp: 0,
  cacheDuration: 5 * 60 * 1000 // 5 minutes
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes that require authentication and specific roles
 * 
 * @param {React.ReactNode} children - The component to render if authenticated
 * @param {string} requiredRole - The required role ('admin', 'barber', or 'client')
 * @param {string} redirectTo - The path to redirect to if not authenticated (default: '/admin/login')
 */
const ProtectedRoute = ({ children, requiredRole = null, redirectTo = '/admin/login' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        
        if (!token) {
          authCache.isAuthenticated = false
          authCache.userRole = null
          setIsAuthenticated(false)
          setIsLoading(false)
          return
        }

        // Use cached auth if it's still valid and matches the required role
        const now = Date.now()
        if (
          authCache.isAuthenticated &&
          authCache.userRole === requiredRole &&
          (now - authCache.timestamp) < authCache.cacheDuration &&
          hasCheckedRef.current
        ) {
          setIsAuthenticated(true)
          setUserRole(authCache.userRole)
          setIsLoading(false)
          return
        }

        // Verify token and get user info
        const response = await authApi.getCurrentUser()
        const user = response.user || response
        
        if (user) {
          const role = user.role
          setUserRole(role)
          
          // Check if role is required and matches
          if (requiredRole && role !== requiredRole) {
            // Redirect based on user's actual role
            authCache.isAuthenticated = false
            authCache.userRole = role
            authCache.timestamp = now
            setIsAuthenticated(false)
            setIsLoading(false)
            return
          }
          
          // Update cache
          authCache.isAuthenticated = true
          authCache.userRole = role
          authCache.timestamp = now
          setIsAuthenticated(true)
          hasCheckedRef.current = true
        } else {
          authCache.isAuthenticated = false
          authCache.userRole = null
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        // Clear invalid token and cache
        localStorage.removeItem('auth_token')
        authCache.isAuthenticated = false
        authCache.userRole = null
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
    // Only re-check when requiredRole changes, not on every route change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requiredRole])

  if (isLoading) {
    // Show loading spinner while checking authentication
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    // Redirect to login or appropriate dashboard based on role
    if (userRole === 'barber' && requiredRole === 'admin') {
      return <Navigate to="/barber/dashboard" replace />
    } else if (userRole === 'admin' && requiredRole === 'barber') {
      return <Navigate to="/admin/dashboard" replace />
    } else if (userRole === 'client' && (requiredRole === 'admin' || requiredRole === 'barber')) {
      return <Navigate to="/" replace />
    } else if ((userRole === 'admin' || userRole === 'barber') && requiredRole === 'client') {
      // Admin/barber trying to access client route
      if (userRole === 'barber') {
        return <Navigate to="/barber/dashboard" replace />
      } else {
        return <Navigate to="/admin/dashboard" replace />
      }
    }
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute

