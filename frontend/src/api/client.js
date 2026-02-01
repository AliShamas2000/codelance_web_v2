/**
 * Client API Service
 * 
 * Handles all API calls related to client profile management
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const clientApi = {
  /**
   * Get client profile
   * @returns {Promise} API response with profile data
   */
  getProfile: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/client/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Get profile error:', error)
      throw error
    }
  },

  /**
   * Update client profile
   * @param {Object|FormData} profileData - Profile data
   * @param {boolean} isFormData - Whether the data is FormData (for file upload)
   * @returns {Promise} API response
   */
  updateProfile: async (profileData, isFormData = false) => {
    try {
      const token = localStorage.getItem('auth_token')
      const headers = {
        Authorization: `Bearer ${token}`
      }

      // If FormData, don't set Content-Type (browser will set it with boundary)
      if (!isFormData) {
        headers['Content-Type'] = 'application/json'
      }

      const response = await axios.put(
        `${API_BASE_URL}/client/profile`,
        profileData,
        { headers }
      )
      return response.data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  },

  /**
   * Update client password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.current_password - Current password
   * @param {string} passwordData.new_password - New password
   * @param {string} passwordData.password_confirmation - Password confirmation
   * @returns {Promise} API response
   */
  updatePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/client/password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  },

  /**
   * Delete/deactivate client account
   * @returns {Promise} API response
   */
  deleteAccount: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/client/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting account:', error)
      throw error
    }
  }
}

export default clientApi

