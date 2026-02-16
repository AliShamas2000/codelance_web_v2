/**
 * Pricing API Service
 * 
 * Handles all API calls related to pricing plans
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const pricingApi = {
  /**
   * Get all pricing plans with optional filtering
   * @param {Object} params - Query parameters
   * @param {string} params.filter - Filter by category (all, haircuts, shaves, beard, treatments)
   * @param {boolean} params.active - Filter by active status (default: true)
   * @returns {Promise} API response
   */
  getPricingPlans: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pricing`, {
        params: {
          filter: params.filter || 'all',
          active: params.active !== undefined ? params.active : true,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
      throw error
    }
  },

  /**
   * Get single pricing plan by ID
   * @param {number} id - Pricing plan ID
   * @returns {Promise} API response
   */
  getPricingPlan: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pricing/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching pricing plan:', error)
      throw error
    }
  },

  /**
   * Get available filters
   * @returns {Promise} API response with filter list
   */
  getFilters: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pricing/filters`)
      return response.data
    } catch (error) {
      console.error('Error fetching filters:', error)
      throw error
    }
  },
}

export default pricingApi



