/**
 * Team API Service
 * 
 * Handles all API calls related to team/barber management
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const teamApi = {
  /**
   * Get all team members
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.per_page - Items per page (default: 12)
   * @param {string} params.search - Search query
   * @param {string} params.status - Filter by status (active, inactive, leave)
   * @param {string} params.sort - Sort field
   * @param {string} params.order - Sort order (asc, desc)
   * @returns {Promise} API response
   */
  getTeamMembers: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/team`, {
        params: {
          page: params.page || 1,
          per_page: params.per_page || 12,
          search: params.search || '',
          status: params.status || 'all',
          sort: params.sort || 'created_at',
          order: params.order || 'desc',
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching team members:', error)
      throw error
    }
  },

  /**
   * Get single team member by ID
   * @param {number} id - Team member ID
   * @returns {Promise} API response
   */
  getTeamMember: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/team/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching team member:', error)
      throw error
    }
  },

  /**
   * Create a new team member
   * @param {Object} teamData - Team member data
   * @param {string} teamData.firstName - First name
   * @param {string} teamData.lastName - Last name
   * @param {string} teamData.jobTitle - Job title/role
   * @param {string} teamData.status - Status (active, inactive, leave)
   * @param {string} teamData.email - Email address
   * @param {string} teamData.instagramHandle - Instagram handle
   * @param {string} teamData.bio - Short bio
   * @param {File} teamData.profilePhoto - Profile photo file
   * @returns {Promise} API response
   */
  createTeamMember: async (teamData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const formData = new FormData()
      formData.append('first_name', teamData.firstName)
      formData.append('last_name', teamData.lastName)
      formData.append('job_title', teamData.jobTitle || '')
      formData.append('status', teamData.status || 'active')
      formData.append('email', teamData.email)
      formData.append('phone', teamData.phone || '')
      formData.append('password', teamData.password) // Password will be hashed as MD5 on backend
      if (teamData.bio) {
        formData.append('bio', teamData.bio)
      }
      if (teamData.profilePhoto) {
        formData.append('profile_photo', teamData.profilePhoto)
      }
      
      // Add social media links
      if (teamData.socialLinks && Array.isArray(teamData.socialLinks)) {
        teamData.socialLinks.forEach((link, index) => {
          formData.append(`social_links[${index}][platform]`, link.platform)
          formData.append(`social_links[${index}][url]`, link.url)
        })
      }

      const response = await axios.post(`${API_BASE_URL}/admin/team`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error creating team member:', error)
      throw error
    }
  },

  /**
   * Update a team member
   * @param {number} id - Team member ID
   * @param {Object} teamData - Team member data
   * @returns {Promise} API response
   */
  updateTeamMember: async (id, teamData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const formData = new FormData()
      if (teamData.firstName) formData.append('first_name', teamData.firstName)
      if (teamData.lastName) formData.append('last_name', teamData.lastName)
      if (teamData.jobTitle !== undefined) formData.append('job_title', teamData.jobTitle || '')
      if (teamData.status) formData.append('status', teamData.status)
      if (teamData.email !== undefined) formData.append('email', teamData.email)
      if (teamData.phone !== undefined) formData.append('phone', teamData.phone || '')
      if (teamData.bio !== undefined) formData.append('bio', teamData.bio || '')
      if (teamData.password) {
        formData.append('password', teamData.password) // Password will be hashed as MD5 on backend
      }
      if (teamData.profilePhoto) {
        formData.append('profile_photo', teamData.profilePhoto)
      }
      
      // Add social media links
      if (teamData.socialLinks && Array.isArray(teamData.socialLinks)) {
        teamData.socialLinks.forEach((link, index) => {
          formData.append(`social_links[${index}][platform]`, link.platform)
          formData.append(`social_links[${index}][url]`, link.url)
        })
      }

      const response = await axios.post(`${API_BASE_URL}/admin/team/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating team member:', error)
      throw error
    }
  },

  /**
   * Delete a team member
   * @param {number} id - Team member ID
   * @returns {Promise} API response
   */
  deleteTeamMember: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.delete(`${API_BASE_URL}/admin/team/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting team member:', error)
      throw error
    }
  },

  /**
   * Upload profile photo
   * @param {number} id - Team member ID
   * @param {File} photo - Photo file
   * @returns {Promise} API response
   */
  uploadProfilePhoto: async (id, photo) => {
    try {
      const token = localStorage.getItem('auth_token')
      const formData = new FormData()
      formData.append('profile_photo', photo)

      const response = await axios.post(`${API_BASE_URL}/admin/team/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error uploading profile photo:', error)
      throw error
    }
  },

  /**
   * Get team member details with stats and appointments
   * @param {number} id - Team member ID
   * @returns {Promise} API response with member details, stats, appointments, and availability
   */
  getTeamMemberDetails: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/team/${id}/details`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching team member details:', error)
      throw error
    }
  },

  /**
   * Get team member stats
   * @param {number} id - Team member ID
   * @returns {Promise} API response with stats
   */
  getTeamMemberStats: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/team/${id}/stats`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching team member stats:', error)
      throw error
    }
  },

  /**
   * Get team member upcoming appointments
   * @param {number} id - Team member ID
   * @param {Object} params - Query parameters
   * @param {number} params.limit - Number of appointments to return (default: 3)
   * @returns {Promise} API response
   */
  getTeamMemberAppointments: async (id, params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/team/${id}/appointments`, {
        params: {
          limit: params.limit || 3,
          status: 'upcoming',
          ...params
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching team member appointments:', error)
      throw error
    }
  },

  /**
   * Get team member availability
   * @param {number} id - Team member ID
   * @returns {Promise} API response with availability data
   */
  getTeamMemberAvailability: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/team/${id}/availability`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching team member availability:', error)
      throw error
    }
  },
}

export default teamApi

