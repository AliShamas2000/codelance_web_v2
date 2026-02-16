/**
 * Newsletter Subscriptions API Service
 * 
 * Handles all API calls related to newsletter subscriptions
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const newsletterSubscriptionsApi = {
  /**
   * Subscribe to newsletter (public, no authentication required)
   * @param {string} email - Email address
   * @returns {Promise} API response
   */
  subscribe: async (email) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter/subscribe`, {
        email: email,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get all newsletter subscriptions (admin)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {string} params.status - Filter by status (active, unsubscribed)
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getSubscriptions: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/newsletter-subscriptions`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          status: params.status || 'all',
          sort: params.sort || 'subscribed_at',
          order: params.order || 'desc',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get single newsletter subscription by ID
   * @param {number} id - Subscription ID
   * @returns {Promise} API response
   */
  getSubscription: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/newsletter-subscriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update a newsletter subscription
   * @param {number} id - Subscription ID
   * @param {Object} subscriptionData - Subscription data
   * @returns {Promise} API response
   */
  updateSubscription: async (id, subscriptionData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/admin/newsletter-subscriptions/${id}`,
        subscriptionData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete a newsletter subscription
   * @param {number} id - Subscription ID
   * @returns {Promise} API response
   */
  deleteSubscription: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/newsletter-subscriptions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}

export default newsletterSubscriptionsApi



