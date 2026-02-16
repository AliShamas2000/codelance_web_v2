/**
 * About Us API Service
 * 
 * Handles all API calls related to About Us sections management
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const aboutUsApi = {
  /**
   * Get all About Us sections
   * @param {Object} params - Query parameters (page, limit, search, status)
   * @returns {Promise} API response
   */
  getAboutUsSections: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/about-us`, {
        params,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching About Us sections:', error)
      throw error
    }
  },

  /**
   * Get a single About Us section by ID
   * @param {string|number} id - Section ID
   * @returns {Promise} API response
   */
  getAboutUsSection: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/about-us/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching About Us section:', error)
      throw error
    }
  },

  /**
   * Create a new About Us section
   * @param {Object} sectionData - Section data
   * @param {File} sectionData.image - Main image file
   * @param {string} sectionData.titleEn - Title in English
   * @param {string} sectionData.titleAr - Title in Arabic
   * @param {string} sectionData.descriptionEn - Description in English
   * @param {string} sectionData.descriptionAr - Description in Arabic
   * @param {Array} sectionData.features - Array of feature objects with textEn and textAr
   * @param {string} sectionData.type - Section type (e.g., 'Content Block', 'Header')
   * @param {boolean} sectionData.status - Active status
   * @returns {Promise} API response
   */
  createAboutUsSection: async (sectionData) => {
    try {
      const formData = new FormData()
      
      if (sectionData.image) {
        formData.append('image', sectionData.image)
      }
      if (sectionData.titleEn !== undefined) {
        formData.append('title_en', sectionData.titleEn)
      }
      if (sectionData.titleAr !== undefined) {
        formData.append('title_ar', sectionData.titleAr)
      }
      if (sectionData.descriptionEn !== undefined) {
        formData.append('description_en', sectionData.descriptionEn)
      }
      if (sectionData.descriptionAr !== undefined) {
        formData.append('description_ar', sectionData.descriptionAr)
      }
      if (sectionData.features) {
        formData.append('features', JSON.stringify(sectionData.features))
      }
      if (sectionData.type !== undefined) {
        formData.append('type', sectionData.type)
      }
      if (sectionData.status !== undefined) {
        formData.append('status', sectionData.status)
      }

      const token = localStorage.getItem('auth_token')
      const response = await axios.post(`${API_BASE_URL}/admin/about-us`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating About Us section:', error)
      throw error
    }
  },

  /**
   * Update an existing About Us section
   * @param {string|number} id - Section ID
   * @param {Object} sectionData - Section data (same structure as create)
   * @returns {Promise} API response
   */
  updateAboutUsSection: async (id, sectionData) => {
    try {
      const formData = new FormData()
      
      if (sectionData.image) {
        formData.append('image', sectionData.image)
      }
      if (sectionData.titleEn !== undefined) {
        formData.append('title_en', sectionData.titleEn)
      }
      if (sectionData.titleAr !== undefined) {
        formData.append('title_ar', sectionData.titleAr)
      }
      if (sectionData.descriptionEn !== undefined) {
        formData.append('description_en', sectionData.descriptionEn)
      }
      if (sectionData.descriptionAr !== undefined) {
        formData.append('description_ar', sectionData.descriptionAr)
      }
      if (sectionData.features) {
        formData.append('features', JSON.stringify(sectionData.features))
      }
      if (sectionData.type !== undefined) {
        formData.append('type', sectionData.type)
      }
      if (sectionData.status !== undefined) {
        formData.append('status', sectionData.status)
      }

      const token = localStorage.getItem('auth_token')
      const formDataWithMethod = new FormData()
      formDataWithMethod.append('_method', 'PUT')
      
      // Copy all fields from formData to formDataWithMethod
      for (const [key, value] of formData.entries()) {
        formDataWithMethod.append(key, value)
      }
      
      const response = await axios.post(`${API_BASE_URL}/admin/about-us/${id}`, formDataWithMethod, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating About Us section:', error)
      throw error
    }
  },

  /**
   * Delete an About Us section
   * @param {string|number} id - Section ID
   * @returns {Promise} API response
   */
  deleteAboutUsSection: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/about-us/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting About Us section:', error)
      throw error
    }
  },

  /**
   * Get public About Us sections (no authentication required)
   * @param {Object} params - Query parameters (limit, type)
   * @returns {Promise} API response
   */
  getPublicAboutUs: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/about-us`, {
        params: {
          limit: params.limit || 10,
          type: params.type || null,
          ...params
        }
      })
      return response.data
    } catch (error) {
      // Silently handle 404s - about-us endpoint may not exist
      // Return empty array on error instead of throwing
      return { success: false, data: [] }
    }
  },
}

export default aboutUsApi




