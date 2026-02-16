/**
 * Projects API Service
 * 
 * Handles all API calls related to projects management
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const projectsApi = {
  /**
   * Get all projects
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {number} params.category_id - Filter by category ID
   * @param {boolean} params.is_active - Filter by active status
   * @param {boolean} params.is_featured - Filter by featured status
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getProjects: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/projects`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          category_id: params.category_id || 'all',
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
      console.error('Error fetching projects:', error)
      throw error
    }
  },

  /**
   * Get single project by ID
   * @param {number} id - Project ID
   * @returns {Promise} API response
   */
  getProject: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching project:', error)
      throw error
    }
  },

  /**
   * Create a new project
   * @param {Object} projectData - Project data
   * @returns {Promise} API response
   */
  createProject: async (projectData) => {
    try {
      const formData = new FormData()
      formData.append('title', projectData.title)
      if (projectData.description !== undefined) {
        formData.append('description', projectData.description || '')
      }
      if (projectData.project_category_id !== undefined && projectData.project_category_id !== null) {
        formData.append('project_category_id', projectData.project_category_id)
      }
      if (projectData.tags && Array.isArray(projectData.tags)) {
        formData.append('tags', JSON.stringify(projectData.tags))
      }
      if (projectData.client_name !== undefined) {
        formData.append('client_name', projectData.client_name || '')
      }
      if (projectData.project_date) {
        formData.append('project_date', projectData.project_date)
      }
      if (projectData.project_url !== undefined) {
        formData.append('project_url', projectData.project_url || '')
      }
      if (projectData.github_url !== undefined) {
        formData.append('github_url', projectData.github_url || '')
      }
      if (projectData.is_featured !== undefined) {
        formData.append('is_featured', projectData.is_featured ? '1' : '0')
      }
      if (projectData.is_active !== undefined) {
        formData.append('is_active', projectData.is_active ? '1' : '0')
      }
      if (projectData.order !== undefined) {
        formData.append('order', projectData.order)
      }
      if (projectData.image) {
        formData.append('image', projectData.image)
      }

      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/projects`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error creating project:', error)
      throw error
    }
  },

  /**
   * Update a project
   * @param {number} id - Project ID
   * @param {Object} projectData - Project data
   * @returns {Promise} API response
   */
  updateProject: async (id, projectData) => {
    try {
      const formData = new FormData()
      if (projectData.title) formData.append('title', projectData.title)
      if (projectData.description !== undefined) {
        formData.append('description', projectData.description || '')
      }
      if (projectData.project_category_id !== undefined) {
        formData.append('project_category_id', projectData.project_category_id || '')
      }
      if (projectData.tags !== undefined && Array.isArray(projectData.tags)) {
        formData.append('tags', JSON.stringify(projectData.tags))
      }
      if (projectData.client_name !== undefined) {
        formData.append('client_name', projectData.client_name || '')
      }
      if (projectData.project_date !== undefined) {
        formData.append('project_date', projectData.project_date || '')
      }
      if (projectData.project_url !== undefined) {
        formData.append('project_url', projectData.project_url || '')
      }
      if (projectData.github_url !== undefined) {
        formData.append('github_url', projectData.github_url || '')
      }
      if (projectData.is_featured !== undefined) {
        formData.append('is_featured', projectData.is_featured ? '1' : '0')
      }
      if (projectData.is_active !== undefined) {
        formData.append('is_active', projectData.is_active ? '1' : '0')
      }
      if (projectData.order !== undefined) {
        formData.append('order', projectData.order)
      }
      if (projectData.image) {
        formData.append('image', projectData.image)
      }
      if (projectData.remove_image) {
        formData.append('remove_image', '1')
      }

      const token = localStorage.getItem('auth_token')
      formData.append('_method', 'PUT')
      const response = await axios.post(
        `${API_BASE_URL}/admin/projects/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating project:', error)
      throw error
    }
  },

  /**
   * Delete a project
   * @param {number} id - Project ID
   * @returns {Promise} API response
   */
  deleteProject: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  },

  /**
   * Update project order (for drag and drop reordering)
   * @param {Array} projects - Array of {id, order} objects
   * @returns {Promise} API response
   */
  updateOrder: async (projects) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.post(
        `${API_BASE_URL}/admin/projects/update-order`,
        { projects },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating project order:', error)
      throw error
    }
  },

  /**
   * Get public projects (no authentication required)
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Limit number of projects
   * @param {string} params.category - Filter by category slug
   * @param {boolean} params.is_featured - Filter by featured status
   * @returns {Promise} API response
   */
  getPublicProjects: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects`, {
        params: {
          limit: params.limit,
          category: params.category || 'all',
          is_featured: params.is_featured,
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching public projects:', error)
      throw error
    }
  },

  /**
   * Get public project categories (no authentication required)
   * @returns {Promise} API response
   */
  getPublicCategories: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/projects/categories`)
      return response.data
    } catch (error) {
      console.error('Error fetching project categories:', error)
      throw error
    }
  },
}

export default projectsApi



