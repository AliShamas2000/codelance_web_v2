/**
 * Process Steps API Service
 * 
 * Handles all API calls related to process steps management
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const processStepsApi = {
  /**
   * Get all process steps
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {string} params.position - Filter by position (left, right)
   * @param {boolean} params.is_active - Filter by active status
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getProcessSteps: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/process-steps`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          position: params.position || 'all',
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
      console.error('Error fetching process steps:', error)
      throw error
    }
  },

  /**
   * Get single process step by ID
   * @param {number} id - Process step ID
   * @returns {Promise} API response
   */
  getProcessStep: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/process-steps/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching process step:', error)
      throw error
    }
  },

  /**
   * Create a new process step
   * @param {Object} stepData - Process step data
   * @returns {Promise} API response
   */
  createProcessStep: async (stepData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/process-steps`,
        stepData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error creating process step:', error)
      throw error
    }
  },

  /**
   * Update a process step
   * @param {number} id - Process step ID
   * @param {Object} stepData - Process step data
   * @returns {Promise} API response
   */
  updateProcessStep: async (id, stepData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/admin/process-steps/${id}`,
        stepData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating process step:', error)
      throw error
    }
  },

  /**
   * Delete a process step
   * @param {number} id - Process step ID
   * @returns {Promise} API response
   */
  deleteProcessStep: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/process-steps/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting process step:', error)
      throw error
    }
  },

  /**
   * Update process step order (for drag and drop reordering)
   * @param {Array} steps - Array of {id, order} objects
   * @returns {Promise} API response
   */
  updateOrder: async (steps) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/process-steps/update-order`,
        { steps },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating process step order:', error)
      throw error
    }
  },

  /**
   * Get public process steps (no authentication required)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Limit number of steps
   * @returns {Promise} API response
   */
  getPublicProcessSteps: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/process-steps`, {
        params: {
          limit: params.limit,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching public process steps:', error)
      throw error
    }
  },
}

export default processStepsApi



