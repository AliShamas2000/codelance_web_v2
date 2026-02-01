/**
 * Philosophy API Service
 * 
 * Handles all API calls related to philosophy/features section
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const philosophyApi = {
  /**
   * Get philosophy section data
   * @returns {Promise} API response with philosophy content and features
   */
  getPhilosophyData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/philosophy`)
      return response.data
    } catch (error) {
      console.error('Error fetching philosophy data:', error)
      throw error
    }
  },

  /**
   * Get features list
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of features to return (default: 10)
   * @param {boolean} params.featured - Get only featured features (default: false)
   * @returns {Promise} API response
   */
  getFeatures: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/philosophy/features`, {
        params: {
          limit: params.limit || 10,
          featured: params.featured !== undefined ? params.featured : false,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching features:', error)
      throw error
    }
  },
}

export default philosophyApi

