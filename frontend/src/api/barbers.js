/**
 * Barbers API Service
 * 
 * Handles all API calls related to barbers/team
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const barbersApi = {
  /**
   * Get all barbers
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Limit number of results
   * @param {string} params.role - Filter by role
   * @returns {Promise} API response
   */
  getBarbers: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barbers`, {
        params: {
          limit: params.limit,
          role: params.role,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching barbers:', error)
      throw error
    }
  },

  /**
   * Get single barber by ID
   * @param {number} id - Barber ID
   * @returns {Promise} API response
   */
  getBarber: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barbers/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching barber:', error)
      throw error
    }
  },
}

export default barbersApi



