/**
 * Settings API Service
 * 
 * Handles all API calls related to admin settings and profile management
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const settingsApi = {
  /**
   * Get current user profile and settings
   * @returns {Promise} API response with user profile data
   */
  getProfile: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/profile`, {
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
   * Update user profile information
   * @param {Object} profileData - Profile data to update
   * @param {string} profileData.first_name - First name
   * @param {string} profileData.last_name - Last name
   * @param {string} profileData.email - Email address
   * @param {string} profileData.job_title - Job title
   * @param {File} profileData.photo - Profile photo file (optional)
   * @returns {Promise} API response
   */
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const formData = new FormData()
      
      if (profileData.first_name) formData.append('first_name', profileData.first_name)
      if (profileData.last_name) formData.append('last_name', profileData.last_name)
      if (profileData.email) formData.append('email', profileData.email)
      if (profileData.job_title) formData.append('job_title', profileData.job_title)
      if (profileData.photo) formData.append('photo', profileData.photo)
      if (profileData.remove_photo !== undefined) formData.append('remove_photo', profileData.remove_photo ? '1' : '0')

      const response = await axios.put(
        `${API_BASE_URL}/admin/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Update profile error:', error)
      throw error
    }
  },

  /**
   * Update user preferences
   * @param {Object} preferences - Preferences data
   * @param {string} preferences.language - Language preference
   * @returns {Promise} API response
   */
  updatePreferences: async (preferences) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/admin/settings/preferences`,
        preferences,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Update preferences error:', error)
      throw error
    }
  },

  /**
   * Change password
   * @param {Object} passwordData - Password change data
   * @param {string} passwordData.current_password - Current password
   * @param {string} passwordData.new_password - New password
   * @param {string} passwordData.new_password_confirmation - Password confirmation
   * @returns {Promise} API response
   */
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/admin/password`,
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
      console.error('Change password error:', error)
      throw error
    }
  },

  /**
   * Remove profile photo
   * @returns {Promise} API response
   */
  removePhoto: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/admin/profile`,
        { remove_photo: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Remove photo error:', error)
      throw error
    }
  }
}

export default settingsApi


