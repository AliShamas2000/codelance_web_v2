/**
 * Authentication API Service
 * 
 * Handles all API calls related to authentication
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const authApi = {
  /**
   * Login user
   * @param {Object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @param {boolean} credentials.remember_me - Remember me flag
   * @returns {Promise} API response with token and user data
   */
  login: async (credentials) => {
    try {
      // Support both email (for admin/barber) and phone (for clients)
      const payload = {
        password: credentials.password,
        remember_me: credentials.remember_me || false,
      }
      
      // Add email or phone based on what's provided
      if (credentials.email) {
        payload.email = credentials.email
      } else if (credentials.phone) {
        payload.phone = credentials.phone
      }
      
      const response = await axios.post(`${API_BASE_URL}/auth/login`, payload)
      return response.data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  /**
   * Logout user
   * @returns {Promise} API response
   */
  logout: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      // Try admin endpoint first, then fallback to general auth endpoint
      try {
        await axios.post(
          `${API_BASE_URL}/admin/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      } catch (adminError) {
        // Fallback to general auth endpoint
        await axios.post(
          `${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
      }
      // Clear local storage
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('remember_me')
      return { success: true, message: 'Logged out successfully' }
    } catch (error) {
      console.error('Logout error:', error)
      // Clear local storage even if API call fails
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      localStorage.removeItem('remember_me')
      throw error
    }
  },

  /**
   * Get current authenticated user
   * @returns {Promise} API response with user data
   */
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No token found')
      }
      // Use the general auth endpoint that works for all user types
      const response = await axios.get(`${API_BASE_URL}/auth/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Get current user error:', error)
      throw error
    }
  },

  /**
   * Request password reset
   * @param {Object} data - Reset password data
   * @param {string} data.email - User email (optional)
   * @param {string} data.phone - User phone number (optional)
   * @returns {Promise} API response
   */
  forgotPassword: async (data) => {
    try {
      // Support both email and phone for password reset
      const payload = data.email ? { email: data.email } : { phone: data.phone }
      const response = await axios.post(`${API_BASE_URL}/auth/forgot-password`, payload)
      return response.data
    } catch (error) {
      console.error('Forgot password error:', error)
      throw error
    }
  },

  /**
   * Reset password with token
   * @param {Object} data - Reset password data
   * @param {string} data.token - Reset token
   * @param {string} data.email - User email
   * @param {string} data.password - New password
   * @param {string} data.password_confirmation - Password confirmation
   * @returns {Promise} API response
   */
  resetPassword: async (data) => {
    try {
      // Support both email and phone for password reset
      const payload = {
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      }
      
      // Add email or phone based on what's provided
      if (data.email) {
        payload.email = data.email
      } else if (data.phone) {
        payload.phone = data.phone
      }
      
      const response = await axios.post(`${API_BASE_URL}/auth/reset-password`, payload)
      return response.data
    } catch (error) {
      console.error('Reset password error:', error)
      throw error
    }
  },

  /**
   * Verify OTP code
   * @param {Object} data - OTP verification data
   * @param {string} data.phone - User phone number
   * @param {string} data.code - OTP code
   * @returns {Promise} API response
   */
  verifyOTP: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
        phone: data.phone,
        code: data.code,
        type: data.type || 'registration'
      })
      return response.data
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw error
    }
  },

  /**
   * Send OTP code
   * @param {Object} data - Send OTP data
   * @param {string} data.phone - User phone number
   * @param {string} data.type - OTP type ('registration' or 'password_reset')
   * @returns {Promise} API response
   */
  sendOTP: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phone: data.phone,
        type: data.type || 'registration'
      })
      return response.data
    } catch (error) {
      console.error('Send OTP error:', error)
      throw error
    }
  },

  /**
   * Get OTP info (expiration time) without sending a new OTP
   * @param {Object} data - OTP info data
   * @param {string} data.phone - User phone number
   * @param {string} data.type - OTP type ('registration' or 'password_reset')
   * @returns {Promise} API response
   */
  getOtpInfo: async (data) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/otp-info`, {
        params: {
          phone: data.phone,
          type: data.type || 'registration'
        }
      })
      return response.data
    } catch (error) {
      console.error('Get OTP info error:', error)
      throw error
    }
  },

  /**
   * Resend OTP code
   * @param {Object} data - Resend OTP data
   * @param {string} data.phone - User phone number
   * @param {string} data.type - OTP type ('registration' or 'password_reset')
   * @returns {Promise} API response
   */
  resendOTP: async (data) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/send-otp`, {
        phone: data.phone,
        type: data.type || 'registration'
      })
      return response.data
    } catch (error) {
      console.error('Resend OTP error:', error)
      throw error
    }
  },

  /**
   * Register new user
   * @param {Object|FormData} data - Registration data
   * @param {string} data.first_name - User first name
   * @param {string} data.last_name - User last name
   * @param {string} data.phone - User phone number
   * @param {string} data.date_of_birth - User date of birth
   * @param {string} data.password - User password
   * @param {string} data.password_confirmation - Password confirmation
   * @param {File} data.avatar - User avatar image (optional)
   * @returns {Promise} API response
   */
  register: async (data) => {
    try {
      const config = {
        headers: {
          'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json'
        }
      }
      const response = await axios.post(`${API_BASE_URL}/auth/register`, data, config)
      return response.data
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },
}

export default authApi



