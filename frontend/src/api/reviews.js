/**
 * Reviews API Service
 * 
 * Handles all API calls related to reviews management
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const reviewsApi = {
  /**
   * Get all reviews
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {boolean} params.is_active - Filter by active status
   * @param {boolean} params.is_featured - Filter by featured status
   * @param {number} params.rating - Filter by rating (1-5)
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getReviews: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/reviews`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          is_active: params.is_active,
          is_featured: params.is_featured,
          rating: params.rating || 'all',
          sort: params.sort || 'order',
          order: params.order || 'asc',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  },

  /**
   * Get single review by ID
   * @param {number} id - Review ID
   * @returns {Promise} API response
   */
  getReview: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching review:', error)
      throw error
    }
  },

  /**
   * Create a new review
   * @param {Object} reviewData - Review data
   * @returns {Promise} API response
   */
  createReview: async (reviewData) => {
    try {
      const formData = new FormData()
      formData.append('quote', reviewData.quote)
      formData.append('author_name', reviewData.author_name)
      if (reviewData.author_title !== undefined) {
        formData.append('author_title', reviewData.author_title || '')
      }
      if (reviewData.author_company !== undefined) {
        formData.append('author_company', reviewData.author_company || '')
      }
      if (reviewData.rating !== undefined) {
        formData.append('rating', reviewData.rating)
      }
      if (reviewData.is_featured !== undefined) {
        formData.append('is_featured', reviewData.is_featured ? '1' : '0')
      }
      if (reviewData.is_active !== undefined) {
        formData.append('is_active', reviewData.is_active ? '1' : '0')
      }
      if (reviewData.order !== undefined) {
        formData.append('order', reviewData.order)
      }
      if (reviewData.author_image) {
        formData.append('author_image', reviewData.author_image)
      }

      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/reviews`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  },

  /**
   * Update a review
   * @param {number} id - Review ID
   * @param {Object} reviewData - Review data
   * @returns {Promise} API response
   */
  updateReview: async (id, reviewData) => {
    try {
      const formData = new FormData()
      if (reviewData.quote) formData.append('quote', reviewData.quote)
      if (reviewData.author_name) formData.append('author_name', reviewData.author_name)
      if (reviewData.author_title !== undefined) {
        formData.append('author_title', reviewData.author_title || '')
      }
      if (reviewData.author_company !== undefined) {
        formData.append('author_company', reviewData.author_company || '')
      }
      if (reviewData.rating !== undefined) {
        formData.append('rating', reviewData.rating)
      }
      if (reviewData.is_featured !== undefined) {
        formData.append('is_featured', reviewData.is_featured ? '1' : '0')
      }
      if (reviewData.is_active !== undefined) {
        formData.append('is_active', reviewData.is_active ? '1' : '0')
      }
      if (reviewData.order !== undefined) {
        formData.append('order', reviewData.order)
      }
      if (reviewData.author_image) {
        formData.append('author_image', reviewData.author_image)
      }
      if (reviewData.remove_image) {
        formData.append('remove_image', '1')
      }

      const token = localStorage.getItem('auth_token')
      formData.append('_method', 'PUT')
      const response = await axios.post(
        `${API_BASE_URL}/admin/reviews/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating review:', error)
      throw error
    }
  },

  /**
   * Delete a review
   * @param {number} id - Review ID
   * @returns {Promise} API response
   */
  deleteReview: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  },

  /**
   * Update review order (for drag and drop reordering)
   * @param {Array} reviews - Array of {id, order} objects
   * @returns {Promise} API response
   */
  updateOrder: async (reviews) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/reviews/update-order`,
        { reviews },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating review order:', error)
      throw error
    }
  },

  /**
   * Get public reviews (no authentication required)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Limit number of reviews
   * @param {boolean} params.is_featured - Filter by featured status
   * @returns {Promise} API response
   */
  getPublicReviews: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews`, {
        params: {
          limit: params.limit,
          is_featured: params.is_featured,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching public reviews:', error)
      throw error
    }
  },
}

export default reviewsApi
