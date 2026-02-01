/**
 * About Us Content API Service
 * 
 * Handles all API calls related to about us content management
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const aboutUsContentApi = {
  /**
   * Get active about us content (public, no authentication required)
   * @returns {Promise} API response
   */
  getPublicContent: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/about-us-content`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get all about us content (admin)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {boolean} params.is_active - Filter by active status
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getAboutUsContent: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/about-us-content`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          is_active: params.is_active,
          sort: params.sort || 'order',
          order: params.order || 'asc',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get single about us content by ID
   * @param {number} id - Content ID
   * @returns {Promise} API response
   */
  getAboutUsContentItem: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/about-us-content/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create a new about us content
   * @param {Object} contentData - Content data
   * @returns {Promise} API response
   */
  createAboutUsContent: async (contentData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/about-us-content`,
        contentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update an about us content
   * @param {number} id - Content ID
   * @param {Object} contentData - Content data
   * @returns {Promise} API response
   */
  updateAboutUsContent: async (id, contentData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/admin/about-us-content/${id}`,
        contentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete an about us content
   * @param {number} id - Content ID
   * @returns {Promise} API response
   */
  deleteAboutUsContent: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/about-us-content/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default aboutUsContentApi

