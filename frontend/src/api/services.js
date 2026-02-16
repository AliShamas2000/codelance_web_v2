/**
 * Services API Service
 * 
 * Handles all API calls related to services management
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const servicesApi = {
  /**
   * Get all services
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {string} params.category - Filter by category
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getServices: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/services`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          category: params.category || 'all',
          sort: params.sort || 'created_at',
          order: params.order || 'desc',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  },

  /**
   * Get single service by ID
   * @param {number} id - Service ID
   * @returns {Promise} API response
   */
  getService: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching service:', error)
      throw error
    }
  },

  /**
   * Create a new service
   * @param {Object} serviceData - Service data
   * @param {string} serviceData.nameEn - Service name in English
   * @param {string} serviceData.nameAr - Service name in Arabic
   * @param {string} serviceData.descriptionEn - Description in English
   * @param {string} serviceData.descriptionAr - Description in Arabic
   * @param {number} serviceData.price - Price
   * @param {number} serviceData.duration - Duration in minutes
   * @param {string} serviceData.category - Category
   * @param {File} serviceData.icon - Service icon file
   * @returns {Promise} API response
   */
  createService: async (serviceData) => {
    try {
      const formData = new FormData()
      formData.append('name_en', serviceData.nameEn)
      formData.append('name_ar', serviceData.nameAr || '')
      formData.append('description_en', serviceData.descriptionEn || '')
      formData.append('description_ar', serviceData.descriptionAr || '')
      formData.append('price', serviceData.price)
      if (serviceData.discountPercentage !== undefined && serviceData.discountPercentage !== null && serviceData.discountPercentage !== '') {
        formData.append('discount_percentage', serviceData.discountPercentage)
      }
      formData.append('duration', serviceData.duration || 30)
      formData.append('category', serviceData.category || 'haircut')
      if (serviceData.icon) {
        formData.append('icon', serviceData.icon)
      }

      const token = localStorage.getItem('auth_token')
      const response = await axios.post(`${API_BASE_URL}/admin/services`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating service:', error)
      throw error
    }
  },

  /**
   * Update a service
   * @param {number} id - Service ID
   * @param {Object} serviceData - Service data
   * @returns {Promise} API response
   */
  updateService: async (id, serviceData) => {
    try {
      const formData = new FormData()
      if (serviceData.nameEn) formData.append('name_en', serviceData.nameEn)
      if (serviceData.nameAr !== undefined) formData.append('name_ar', serviceData.nameAr)
      if (serviceData.descriptionEn !== undefined) formData.append('description_en', serviceData.descriptionEn)
      if (serviceData.descriptionAr !== undefined) formData.append('description_ar', serviceData.descriptionAr)
      if (serviceData.price !== undefined) formData.append('price', serviceData.price)
      if (serviceData.discountPercentage !== undefined && serviceData.discountPercentage !== null && serviceData.discountPercentage !== '') {
        formData.append('discount_percentage', serviceData.discountPercentage)
      } else if (serviceData.discountPercentage === null || serviceData.discountPercentage === '') {
        // Explicitly set to null to clear discount
        formData.append('discount_percentage', '')
      }
      if (serviceData.duration !== undefined) formData.append('duration', serviceData.duration)
      if (serviceData.category) formData.append('category', serviceData.category)
      if (serviceData.icon) {
        formData.append('icon', serviceData.icon)
      }

      const token = localStorage.getItem('auth_token')
      formData.append('_method', 'PUT')
      const response = await axios.post(`${API_BASE_URL}/admin/services/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating service:', error)
      throw error
    }
  },

  /**
   * Delete a service
   * @param {number} id - Service ID
   * @returns {Promise} API response
   */
  deleteService: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting service:', error)
      throw error
    }
  },

  /**
   * Get active services for public display
   * @param {Object} params - Query parameters
   * @param {string} params.category - Filter by category
   * @param {number} params.limit - Limit number of results
   * @returns {Promise} API response
   */
  getPublicServices: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/services`, {
        params: {
          category: params.category || 'all',
          limit: params.limit,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching public services:', error)
      throw error
    }
  },
}

export default servicesApi


