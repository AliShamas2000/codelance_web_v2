/**
 * Project Categories API Service
 * 
 * Handles all API calls related to project categories management
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const projectCategoriesApi = {
  /**
   * Get all project categories
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {boolean} params.is_active - Filter by active status
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getProjectCategories: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/project-categories`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
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
      console.error('Error fetching project categories:', error)
      throw error
    }
  },

  /**
   * Get single project category by ID
   * @param {number} id - Category ID
   * @returns {Promise} API response
   */
  getProjectCategory: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/project-categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching project category:', error)
      throw error
    }
  },

  /**
   * Create a new project category
   * @param {Object} categoryData - Category data
   * @returns {Promise} API response
   */
  createProjectCategory: async (categoryData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/project-categories`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error creating project category:', error)
      throw error
    }
  },

  /**
   * Update a project category
   * @param {number} id - Category ID
   * @param {Object} categoryData - Category data
   * @returns {Promise} API response
   */
  updateProjectCategory: async (id, categoryData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/admin/project-categories/${id}`,
        categoryData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating project category:', error)
      throw error
    }
  },

  /**
   * Delete a project category
   * @param {number} id - Category ID
   * @returns {Promise} API response
   */
  deleteProjectCategory: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/project-categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting project category:', error)
      throw error
    }
  },

  /**
   * Update project category order (for drag and drop reordering)
   * @param {Array} categories - Array of {id, order} objects
   * @returns {Promise} API response
   */
  updateOrder: async (categories) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/project-categories/update-order`,
        { categories },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating project category order:', error)
      throw error
    }
  },
}

export default projectCategoriesApi

