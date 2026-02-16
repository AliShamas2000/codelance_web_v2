/**
 * About API Service
 * 
 * Handles all API calls related to the about page
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const aboutApi = {
  /**
   * Get about page data
   * @returns {Promise} API response with about data
   */
  getAboutData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/about-us`)
      return response.data.data || response.data
    } catch (error) {
      console.error('Error fetching about data:', error)
      throw error
    }
  },
}

export default aboutApi



