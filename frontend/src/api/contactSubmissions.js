/**
 * Contact Submissions API Service
 * 
 * Handles all API calls related to contact form submissions
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const contactSubmissionsApi = {
  /**
   * Submit a contact form (public, no authentication required)
   * @param {Object} formData - Form data
   * @param {string} formData.name - Full name
   * @param {string} formData.email - Email address
   * @param {number} formData.project_id - Selected project ID
   * @param {string} formData.message - Message content
   * @returns {Promise} API response
   */
  submitContactForm: async (formData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/contact`, {
        name: formData.name,
        email: formData.email,
        project_id: formData.project_id || null,
        message: formData.message,
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get all contact submissions (admin)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 10)
   * @param {string} params.search - Search query
   * @param {string} params.status - Filter by status (new, read, replied, archived)
   * @param {number} params.project_id - Filter by project ID
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getContactSubmissions: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/contact-submissions`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 10,
          search: params.search || '',
          status: params.status || 'all',
          project_id: params.project_id || 'all',
          sort: params.sort || 'created_at',
          order: params.order || 'desc',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
      throw error
    }
  },

  /**
   * Get single contact submission by ID
   * @param {number} id - Submission ID
   * @returns {Promise} API response
   */
  getContactSubmission: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/contact-submissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching contact submission:', error)
      throw error
    }
  },

  /**
   * Update a contact submission
   * @param {number} id - Submission ID
   * @param {Object} submissionData - Submission data
   * @returns {Promise} API response
   */
  updateContactSubmission: async (id, submissionData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/admin/contact-submissions/${id}`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating contact submission:', error)
      throw error
    }
  },

  /**
   * Delete a contact submission
   * @param {number} id - Submission ID
   * @returns {Promise} API response
   */
  deleteContactSubmission: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/contact-submissions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting contact submission:', error)
      throw error
    }
  },
}

export default contactSubmissionsApi

