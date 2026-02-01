/**
 * Banners API Service
 * 
 * Handles all API calls related to banners management
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const bannersApi = {
  /**
   * Get all banners
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.status - Filter by status (active, inactive, all)
   * @returns {Promise} API response
   */
  getBanners: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/banners`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          status: params.status || 'all',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching banners:', error)
      throw error
    }
  },

  /**
   * Get single banner by ID
   * @param {number} id - Banner ID
   * @returns {Promise} API response
   */
  getBanner: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching banner:', error)
      throw error
    }
  },

  /**
   * Create a new banner
   * @param {Object} bannerData - Banner data
   * @param {File} bannerData.desktopImage - Desktop image file
   * @param {File} bannerData.mobileImage - Mobile image file
   * @param {string} bannerData.title - Banner title
   * @param {string} bannerData.buttonTextEn - Button text in English
   * @param {string} bannerData.buttonTextAr - Button text in Arabic
   * @param {string} bannerData.buttonUrl - Button URL
   * @param {boolean} bannerData.isActive - Active status
   * @returns {Promise} API response
   */
  createBanner: async (bannerData) => {
    try {
      const formData = new FormData()
      if (bannerData.desktopImage) {
        formData.append('desktop_image', bannerData.desktopImage)
      }
      if (bannerData.mobileImage) {
        formData.append('mobile_image', bannerData.mobileImage)
      }
      formData.append('title', bannerData.title || '')
      formData.append('button_text_en', bannerData.buttonTextEn || '')
      formData.append('button_text_ar', bannerData.buttonTextAr || '')
      formData.append('button_url', bannerData.buttonUrl || '')
      formData.append('is_active', bannerData.isActive ? '1' : '0')

      const token = localStorage.getItem('auth_token')
      const response = await axios.post(`${API_BASE_URL}/admin/banners`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating banner:', error)
      throw error
    }
  },

  /**
   * Update a banner
   * @param {number} id - Banner ID
   * @param {Object} bannerData - Banner data
   * @returns {Promise} API response
   */
  updateBanner: async (id, bannerData) => {
    try {
      const formData = new FormData()
      if (bannerData.desktopImage) {
        formData.append('desktop_image', bannerData.desktopImage)
      }
      if (bannerData.mobileImage) {
        formData.append('mobile_image', bannerData.mobileImage)
      }
      if (bannerData.title !== undefined) {
        formData.append('title', bannerData.title)
      }
      if (bannerData.buttonTextEn !== undefined) {
        formData.append('button_text_en', bannerData.buttonTextEn)
      }
      if (bannerData.buttonTextAr !== undefined) {
        formData.append('button_text_ar', bannerData.buttonTextAr)
      }
      if (bannerData.buttonUrl !== undefined) {
        formData.append('button_url', bannerData.buttonUrl)
      }
      if (bannerData.isActive !== undefined) {
        formData.append('is_active', bannerData.isActive ? '1' : '0')
      }

      const token = localStorage.getItem('auth_token')
      formData.append('_method', 'PUT')
      const response = await axios.post(`${API_BASE_URL}/admin/banners/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating banner:', error)
      throw error
    }
  },

  /**
   * Delete a banner
   * @param {number} id} - Banner ID
   * @returns {Promise} API response
   */
  deleteBanner: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/banners/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting banner:', error)
      throw error
    }
  },

  /**
   * Get active banners for public display (homepage)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Limit number of results
   * @returns {Promise} API response
   */
  getActiveBanners: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/banners`, {
        params: {
          limit: params.limit,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching active banners:', error)
      throw error
    }
  },
}

export default bannersApi


