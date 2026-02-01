/**
 * Location API Service
 * 
 * Handles all API calls related to location and contact information
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const locationApi = {
  /**
   * Get location and contact information
   * @returns {Promise} API response with location data
   */
  getLocationData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/location`)
      return response.data
    } catch (error) {
      console.error('Error fetching location data:', error)
      throw error
    }
  },
}

export default locationApi

