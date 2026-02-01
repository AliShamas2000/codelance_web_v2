/**
 * Reviews API Service
 * 
 * Handles all API calls related to customer reviews and ratings
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const reviewsApi = {
  /**
   * Get public reviews for homepage (latest 3 five-star reviews)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of reviews to return (default: 3)
   * @param {number} params.rating - Rating filter (default: 5)
   * @returns {Promise} API response
   */
  getPublicReviews: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/public`, {
        params: {
          limit: params.limit || 3,
          rating: params.rating || 5,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching public reviews:', error)
      throw error
    }
  },

  /**
   * Get all reviews
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of reviews to return (default: 10)
   * @param {number} params.offset - Number of reviews to skip (default: 0)
   * @param {number} params.minRating - Minimum rating filter (default: 0)
   * @param {boolean} params.featured - Get only featured reviews (default: false)
   * @returns {Promise} API response
   */
  getReviews: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews`, {
        params: {
          limit: params.limit || 10,
          offset: params.offset || 0,
          min_rating: params.minRating || 0,
          featured: params.featured !== undefined ? params.featured : false,
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
      const response = await axios.get(`${API_BASE_URL}/reviews/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching review:', error)
      throw error
    }
  },

  /**
   * Get average rating
   * @returns {Promise} API response with average rating
   */
  getAverageRating: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/average-rating`)
      return response.data
    } catch (error) {
      console.error('Error fetching average rating:', error)
      throw error
    }
  },

  /**
   * Create a new review (for authenticated users)
   * @param {Object} reviewData - Review data
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {string} reviewData.quote - Review text
   * @param {string} reviewData.serviceType - Type of service reviewed
   * @returns {Promise} API response
   */
  createReview: async (reviewData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/reviews`, {
        rating: reviewData.rating,
        quote: reviewData.quote,
        service_type: reviewData.serviceType || null,
      })
      return response.data
    } catch (error) {
      console.error('Error creating review:', error)
      throw error
    }
  },
}

export default reviewsApi

