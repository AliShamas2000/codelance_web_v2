/**
 * Footer & Contact API Service
 * 
 * Handles all API calls related to footer and contact information management
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const footerApi = {
  /**
   * Get footer and contact data (admin - requires authentication)
   * @returns {Promise} API response
   */
  getFooterData: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/footer`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching footer data:', error)
      throw error
    }
  },

  /**
   * Get footer data for public display (no authentication required)
   * @returns {Promise} API response
   */
  getPublicFooterData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/footer`)
      return response.data
    } catch (error) {
      // Silently handle 404s - footer endpoint may not exist
      if (error.response?.status === 404) {
        return null
      }
      throw error
    }
  },

  /**
   * Update footer and contact data
   * @param {Object} footerData - Footer data
   * @param {File} footerData.logo - Footer logo file
   * @param {string} footerData.aboutEn - About text in English
   * @param {string} footerData.aboutAr - About text in Arabic
   * @param {Array} footerData.socialLinks - Array of social link objects
   * @param {string} footerData.phone - Phone number
   * @param {string} footerData.email - Email address
   * @param {string} footerData.address - Physical address
   * @param {Array} footerData.workingHours - Array of working hours objects
   * @param {Array} footerData.footerLinks - Array of footer link column objects
   * @param {string} footerData.mapEmbed - Map embed code/URL
   * @returns {Promise} API response
   */
  updateFooterData: async (footerData) => {
    try {
      const formData = new FormData()
      
      if (footerData.logo) {
        formData.append('logo', footerData.logo)
      }
      if (footerData.aboutEn !== undefined) {
        formData.append('about_en', footerData.aboutEn)
      }
      if (footerData.aboutAr !== undefined) {
        formData.append('about_ar', footerData.aboutAr)
      }
      if (footerData.socialLinks) {
        formData.append('social_links', JSON.stringify(footerData.socialLinks))
      }
      if (footerData.phone !== undefined) {
        formData.append('phone', footerData.phone)
      }
      if (footerData.email !== undefined) {
        formData.append('email', footerData.email)
      }
      if (footerData.address !== undefined) {
        formData.append('address', footerData.address)
      }
      if (footerData.workingHours) {
        formData.append('working_hours', JSON.stringify(footerData.workingHours))
      }
      if (footerData.footerLinks) {
        formData.append('footer_links', JSON.stringify(footerData.footerLinks))
      }
      if (footerData.mapEmbed !== undefined) {
        formData.append('map_embed', footerData.mapEmbed)
      }

      const token = localStorage.getItem('auth_token')
      formData.append('_method', 'PUT')
      const response = await axios.post(`${API_BASE_URL}/admin/footer`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating footer data:', error)
      throw error
    }
  },
}

export default footerApi


