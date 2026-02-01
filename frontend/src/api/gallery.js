/**
 * Gallery API Service
 * 
 * Handles all API calls related to gallery management
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const galleryApi = {
  /**
   * Get all gallery images
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 12)
   * @param {string} params.search - Search query
   * @param {string} params.category - Filter by category
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getGalleryImages: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/gallery`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 12,
          search: params.search || '',
          service: params.service || params.category || 'all', // Support both service and category for backward compatibility
          sort: params.sort || 'created_at',
          order: params.order || 'desc',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      throw error
    }
  },

  /**
   * Get single gallery image by ID
   * @param {number} id - Image ID
   * @returns {Promise} API response
   */
  getGalleryImage: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching gallery image:', error)
      throw error
    }
  },

  /**
   * Create a new gallery image
   * @param {Object} imageData - Image data
   * @param {File} imageData.image - Image file
   * @param {string} imageData.title - Image title/service note
   * @param {string} imageData.category - Category
   * @param {string} imageData.description - Description (optional)
   * @returns {Promise} API response
   */
  createGalleryImage: async (imageData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const formData = new FormData()
      formData.append('image', imageData.image)
      formData.append('title', imageData.title || '')
      if (imageData.service_id) {
        formData.append('service_id', imageData.service_id)
      }
      if (imageData.description) {
        formData.append('description', imageData.description)
      }

      const response = await axios.post(`${API_BASE_URL}/admin/gallery`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating gallery image:', error)
      throw error
    }
  },

  /**
   * Update a gallery image
   * @param {number} id - Image ID
   * @param {Object} imageData - Image data
   * @returns {Promise} API response
   */
  updateGalleryImage: async (id, imageData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const formData = new FormData()
      formData.append('_method', 'PUT')
      if (imageData.image) {
        formData.append('image', imageData.image)
      }
      if (imageData.title !== undefined) {
        formData.append('title', imageData.title)
      }
      if (imageData.service_id !== undefined) {
        formData.append('service_id', imageData.service_id || '')
      }
      if (imageData.description !== undefined) {
        formData.append('description', imageData.description)
      }

      const response = await axios.post(`${API_BASE_URL}/admin/gallery/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating gallery image:', error)
      throw error
    }
  },

  /**
   * Delete a gallery image
   * @param {number} id - Image ID
   * @returns {Promise} API response
   */
  deleteGalleryImage: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/gallery/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting gallery image:', error)
      throw error
    }
  },

  /**
   * Get active gallery items for public display
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 8)
   * @param {string|number} params.service - Filter by service ID (default: 'all')
   * @returns {Promise} API response
   */
  getPublicGalleryItems: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 8,
          service: params.service || params.filter || 'all',
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching public gallery items:', error)
      throw error
    }
  },

  /**
   * Get services that have gallery items (for filter chips)
   * @returns {Promise} API response
   */
  getGalleryServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/gallery/services`)
      return response.data
    } catch (error) {
      console.error('Error fetching gallery services:', error)
      throw error
    }
  },
}

export default galleryApi
