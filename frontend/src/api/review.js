import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api'))

const reviewApi = {
  /**
   * Get appointment data for review
   * @param {string} hashedId - Hashed appointment ID
   * @returns {Promise} API response with appointment data
   */
  getAppointmentForReview: async (hashedId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/v1/reviews/appointment/${hashedId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching appointment for review:', error)
      throw error
    }
  },

  /**
   * Submit a review
   * @param {Object} reviewData - Review data
   * @param {string} reviewData.appointment_id - Hashed appointment ID
   * @param {number} reviewData.rating - Rating (1-5)
   * @param {Array} reviewData.services - Array of service IDs
   * @param {string} reviewData.phone - Phone number
   * @param {string} reviewData.feedback - Review text
   * @param {boolean} reviewData.recommend - Whether to recommend
   * @returns {Promise} API response
   */
  submitReview: async (reviewData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/v1/reviews`,
        reviewData
      )
      return response.data
    } catch (error) {
      console.error('Error submitting review:', error)
      throw error
    }
  }
}

export default reviewApi




