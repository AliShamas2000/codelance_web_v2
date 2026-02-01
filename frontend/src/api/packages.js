/**
 * Packages API Service
 * 
 * Handles all API calls related to packages management
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const packagesApi = {
  /**
   * Get public packages (no authentication required)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Limit number of packages
   * @param {string} params.billing_period - Filter by billing period
   * @param {boolean} params.is_featured - Filter by featured status
   * @returns {Promise} API response
   */
  getPublicPackages: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/packages`, {
        params: {
          limit: params.limit,
          billing_period: params.billing_period || 'all',
          is_featured: params.is_featured,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching public packages:', error)
      throw error
    }
  },

  /**
   * Get all packages (admin - requires authentication)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {string} params.billing_period - Filter by billing period
   * @param {boolean} params.is_active - Filter by active status
   * @param {boolean} params.is_featured - Filter by featured status
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getPackages: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/packages`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          billing_period: params.billing_period || 'all',
          is_active: params.is_active,
          is_featured: params.is_featured,
          sort: params.sort || 'order',
          order: params.order || 'asc',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching packages:', error)
      throw error
    }
  },

  /**
   * Get single package by ID
   * @param {number} id - Package ID
   * @returns {Promise} API response
   */
  getPackage: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching package:', error)
      throw error
    }
  },

  /**
   * Create a new package
   * @param {Object} packageData - Package data
   * @param {string} packageData.name - Package name
   * @param {string} packageData.description - Description
   * @param {number} packageData.price - Price
   * @param {number} packageData.original_price - Original price (for discount)
   * @param {string} packageData.currency - Currency code
   * @param {string} packageData.billing_period - Billing period (monthly, yearly, one-time)
   * @param {Array} packageData.features - Array of feature strings
   * @param {string} packageData.badge - Badge text
   * @param {boolean} packageData.is_featured - Is featured
   * @param {boolean} packageData.is_active - Is active
   * @param {number} packageData.order - Display order
   * @param {File} packageData.icon - Icon image file
   * @returns {Promise} API response
   */
  createPackage: async (packageData) => {
    try {
      const formData = new FormData()
      formData.append('name', packageData.name)
      if (packageData.description !== undefined) {
        formData.append('description', packageData.description || '')
      }
      formData.append('price', packageData.price)
      if (packageData.original_price !== undefined && packageData.original_price !== null && packageData.original_price !== '') {
        formData.append('original_price', packageData.original_price)
      }
      if (packageData.currency) {
        formData.append('currency', packageData.currency)
      }
      if (packageData.billing_period) {
        formData.append('billing_period', packageData.billing_period)
      }
      if (packageData.features && Array.isArray(packageData.features)) {
        formData.append('features', JSON.stringify(packageData.features))
      }
      if (packageData.badge !== undefined) {
        formData.append('badge', packageData.badge || '')
      }
      if (packageData.is_featured !== undefined) {
        formData.append('is_featured', packageData.is_featured ? '1' : '0')
      }
      if (packageData.is_active !== undefined) {
        formData.append('is_active', packageData.is_active ? '1' : '0')
      }
      if (packageData.order !== undefined) {
        formData.append('order', packageData.order)
      }
      if (packageData.icon) {
        formData.append('icon', packageData.icon)
      }

      const token = localStorage.getItem('auth_token')
      const url = `${API_BASE_URL}/admin/packages`

      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      
      return response.data
    } catch (error) {
      console.error('Error creating package:', error)
      throw error
    }
  },

  /**
   * Update a package
   * @param {number} id - Package ID
   * @param {Object} packageData - Package data (same structure as create)
   * @returns {Promise} API response
   */
  updatePackage: async (id, packageData) => {
    try {
      const formData = new FormData()
      if (packageData.name) formData.append('name', packageData.name)
      if (packageData.description !== undefined) {
        formData.append('description', packageData.description || '')
      }
      if (packageData.price !== undefined) formData.append('price', packageData.price)
      if (packageData.original_price !== undefined && packageData.original_price !== null && packageData.original_price !== '') {
        formData.append('original_price', packageData.original_price)
      } else if (packageData.original_price === null || packageData.original_price === '') {
        formData.append('original_price', '')
      }
      if (packageData.currency !== undefined) {
        formData.append('currency', packageData.currency)
      }
      if (packageData.billing_period !== undefined) {
        formData.append('billing_period', packageData.billing_period)
      }
      if (packageData.features !== undefined && Array.isArray(packageData.features)) {
        formData.append('features', JSON.stringify(packageData.features))
      }
      if (packageData.badge !== undefined) {
        formData.append('badge', packageData.badge || '')
      }
      if (packageData.is_featured !== undefined) {
        formData.append('is_featured', packageData.is_featured ? '1' : '0')
      }
      if (packageData.is_active !== undefined) {
        formData.append('is_active', packageData.is_active ? '1' : '0')
      }
      if (packageData.order !== undefined) {
        formData.append('order', packageData.order)
      }
      if (packageData.icon) {
        formData.append('icon', packageData.icon)
      }
      if (packageData.remove_icon) {
        formData.append('remove_icon', '1')
      }

      const token = localStorage.getItem('auth_token')
      formData.append('_method', 'PUT')
      const response = await axios.post(`${API_BASE_URL}/admin/packages/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating package:', error)
      throw error
    }
  },

  /**
   * Delete a package
   * @param {number} id - Package ID
   * @returns {Promise} API response
   */
  deletePackage: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting package:', error)
      throw error
    }
  },

  /**
   * Update package order (for drag and drop reordering)
   * @param {Array} packages - Array of {id, order} objects
   * @returns {Promise} API response
   */
  updateOrder: async (packages) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/packages/update-order`,
        { packages },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating package order:', error)
      throw error
    }
  },
}

export default packagesApi

