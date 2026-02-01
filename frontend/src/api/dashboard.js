/**
 * Dashboard API Service
 * 
 * Handles all API calls related to the admin dashboard
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const dashboardApi = {
  /**
   * Get dashboard data
   * @param {Object} filters - Filter parameters
   * @param {string} filters.fromDate - Start date
   * @param {string} filters.toDate - End date
   * @param {string} filters.department - Department filter
   * @returns {Promise} API response with dashboard data
   */
  getDashboardData: async (filters = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard`, {
        params: {
          from_date: filters.fromDate,
          to_date: filters.toDate
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw error
    }
  },

  /**
   * Get dashboard statistics
   * @param {Object} filters - Filter parameters
   * @returns {Promise} API response with statistics
   */
  getStats: async (filters = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`, {
        params: filters,
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching stats:', error)
      throw error
    }
  },

  /**
   * Get recent appointments
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of appointments to return
   * @returns {Promise} API response
   */
  getRecentAppointments: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/appointments`, {
        params: {
          limit: params.limit || 5
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching recent appointments:', error)
      throw error
    }
  },

  /**
   * Get activity log
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of activities to return
   * @returns {Promise} API response
   */
  getActivityLog: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/activities`, {
        params: {
          limit: params.limit || 10
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching activity log:', error)
      throw error
    }
  },
}

export default dashboardApi



