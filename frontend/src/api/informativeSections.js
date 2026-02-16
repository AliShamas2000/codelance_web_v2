/**
 * Informative Sections API Service
 * 
 * Handles all API calls related to informative sections management
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const informativeSectionsApi = {
  /**
   * Get all informative sections
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {string} params.status - Filter by status (published, draft, hidden, all)
   * @returns {Promise} API response
   */
  getSections: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/informative-sections`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          status: params.status || 'all',
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching informative sections:', error)
      throw error
    }
  },

  /**
   * Get single section by ID
   * @param {number} id - Section ID
   * @returns {Promise} API response
   */
  getSection: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/informative-sections/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching informative section:', error)
      throw error
    }
  },

  /**
   * Create a new informative section
   * @param {Object} sectionData - Section data
   * @param {string} sectionData.name - Section name/key
   * @param {string} sectionData.titleEn - Title in English
   * @param {string} sectionData.titleAr - Title in Arabic
   * @param {string} sectionData.descriptionEn - Description in English
   * @param {string} sectionData.descriptionAr - Description in Arabic
   * @param {Array} sectionData.features - Array of feature objects
   * @param {string} sectionData.status - Status (published, draft, hidden)
   * @returns {Promise} API response
   */
  createSection: async (sectionData) => {
    try {
      const formData = new FormData()
      formData.append('name', sectionData.name || '')
      formData.append('title_en', sectionData.titleEn || '')
      formData.append('title_ar', sectionData.titleAr || '')
      formData.append('description_en', sectionData.descriptionEn || '')
      formData.append('description_ar', sectionData.descriptionAr || '')
      formData.append('status', sectionData.status || 'draft')
      
      // Handle features with images
      if (sectionData.features && Array.isArray(sectionData.features)) {
        sectionData.features.forEach((feature, index) => {
          formData.append(`features[${index}][name_en]`, feature.nameEn || '')
          formData.append(`features[${index}][name_ar]`, feature.nameAr || '')
          if (feature.icon && feature.icon instanceof File) {
            formData.append(`features[${index}][icon]`, feature.icon)
          }
        })
      }

      const token = localStorage.getItem('auth_token')
      const response = await axios.post(`${API_BASE_URL}/admin/informative-sections`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating informative section:', error)
      throw error
    }
  },

  /**
   * Update an informative section
   * @param {number} id - Section ID
   * @param {Object} sectionData - Section data
   * @returns {Promise} API response
   */
  updateSection: async (id, sectionData) => {
    try {
      const formData = new FormData()
      if (sectionData.name !== undefined) {
        formData.append('name', sectionData.name)
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
      if (sectionData.status) {
        formData.append('status', sectionData.status)
      }
      
      // Handle features with images
      if (sectionData.features && Array.isArray(sectionData.features)) {
        sectionData.features.forEach((feature, index) => {
          formData.append(`features[${index}][id]`, feature.id || '')
          formData.append(`features[${index}][name_en]`, feature.nameEn || '')
          formData.append(`features[${index}][name_ar]`, feature.nameAr || '')
          if (feature.icon && feature.icon instanceof File) {
            formData.append(`features[${index}][icon]`, feature.icon)
          }
        })
      }

      const token = localStorage.getItem('auth_token')
      const response = await axios.post(`${API_BASE_URL}/admin/informative-sections/${id}`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating informative section:', error)
      throw error
    }
  },

  /**
   * Delete an informative section
   * @param {number} id - Section ID
   * @returns {Promise} API response
   */
  deleteSection: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/informative-sections/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting informative section:', error)
      throw error
    }
  },
}

export default informativeSectionsApi




