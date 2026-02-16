/**
 * Dashboard API Service
 * 
 * Handles all API calls related to dashboard statistics
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const dashboardApi = {
  /**
   * Get dashboard statistics and overview data
   * @param {Object} params - Query parameters
   * @param {string} params.from_date - Start date (YYYY-MM-DD)
   * @param {string} params.to_date - End date (YYYY-MM-DD)
   * @returns {Promise} API response
   */
  getDashboardData: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        params: {
          from_date: params.from_date || params.fromDate,
          to_date: params.to_date || params.toDate,
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Dashboard API Error:', error)
      console.error('Error Response:', error.response?.data)
      throw error
    }
  },
}

export default dashboardApi


