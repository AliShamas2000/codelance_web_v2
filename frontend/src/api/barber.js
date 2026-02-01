/**
 * Barber API Service
 * 
 * Handles all API calls related to barber dashboard and operations
 */

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'

const barberApi = {
  /**
   * Get barber dashboard data
   * @returns {Promise} API response with dashboard stats, appointments, etc.
   */
  getDashboardData: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching barber dashboard data:', error)
      throw error
    }
  },

  /**
   * Check in an appointment
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} API response
   */
  checkInAppointment: async (appointmentId) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/barber/appointments/${appointmentId}/check-in`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error checking in appointment:', error)
      throw error
    }
  },

  /**
   * Get barber's appointments
   * @param {Object} params - Query parameters
   * @param {string} params.date - Filter by date (YYYY-MM-DD)
   * @param {string} params.status - Filter by status
   * @returns {Promise} API response
   */
  getAppointments: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/appointments`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching barber appointments:', error)
      throw error
    }
  },

  /**
   * Get barber's schedule for a specific date or date range
   * @param {Object} params - Query parameters
   * @param {string} params.date - Single date in YYYY-MM-DD format (optional)
   * @param {string} params.start_date - Start date in YYYY-MM-DD format (optional)
   * @param {string} params.end_date - End date in YYYY-MM-DD format (optional)
   * @param {string} params.view - View type: 'week', 'month', 'day' (optional)
   * @returns {Promise} API response with appointments, blockedSlots, unavailableSlots
   */
  getSchedule: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/schedule`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching barber schedule:', error)
      throw error
    }
  },

  /**
   * Get barber availability
   * @returns {Promise} API response with availability data
   */
  getAvailability: async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/barber/availability`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      // Return the data object directly
      return response.data.data || response.data
    } catch (error) {
      console.error('Error fetching availability:', error)
      throw error
    }
  },

  /**
   * Update barber availability
   * @param {Object} availabilityData - Availability data
   * @param {string} availabilityData.timezone - Timezone
   * @param {string} availabilityData.timezoneLabel - Timezone label
   * @param {Array} availabilityData.days - Array of day objects with slots
   * @returns {Promise} API response
   */
  updateAvailability: async (availabilityData) => {
    try {
      console.log('=== API SERVICE - BEFORE NORMALIZATION ===')
      console.log('Input data:', JSON.stringify(availabilityData, null, 2))
      
      // CRITICAL: Final safety check - ensure all days have slots array
      if (availabilityData.days && Array.isArray(availabilityData.days)) {
        availabilityData.days = availabilityData.days.map((day, index) => {
          const normalizedDay = {
            ...day,
            slots: Array.isArray(day.slots) ? day.slots : []
          }
          
          // Verify slots exists
          if (!('slots' in normalizedDay)) {
            console.error(`❌ Day ${index} (${normalizedDay.day}) MISSING slots property!`)
            normalizedDay.slots = []
          }
          
          if (!Array.isArray(normalizedDay.slots)) {
            console.error(`❌ Day ${index} (${normalizedDay.day}) slots is NOT an array!`, normalizedDay.slots)
            normalizedDay.slots = []
          }
          
          console.log(`API Day ${index} (${normalizedDay.day}):`, {
            hasSlots: 'slots' in normalizedDay,
            slotsIsArray: Array.isArray(normalizedDay.slots),
            slotsValue: normalizedDay.slots
          })
          
          return normalizedDay
        })
      }
      
      console.log('=== API SERVICE - FINAL PAYLOAD ===')
      console.log(JSON.stringify(availabilityData, null, 2))
      
      // Verify all days have slots
      const missingSlots = availabilityData.days?.filter((day, index) => !('slots' in day) || !Array.isArray(day.slots))
      if (missingSlots && missingSlots.length > 0) {
        console.error('❌ DAYS WITH MISSING/INVALID SLOTS:', missingSlots)
        throw new Error('Data validation failed: Some days are missing slots array')
      }
      
      const response = await axios.put(
        `${API_BASE_URL}/barber/availability`,
        availabilityData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data.data || response.data
    } catch (error) {
      console.error('=== API SERVICE ERROR ===')
      console.error('Error:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  /**
   * Get barber's clients
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getClients: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/clients`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching barber clients:', error)
      throw error
    }
  },


  /**
   * Get services available for booking
   * @returns {Promise} API response with services list
   */
  getServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/services`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  },

  /**
   * Get barber activity history
   * @param {Object} params - Query parameters
   * @returns {Promise} API response
   */
  getActivityHistory: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/activity`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching activity history:', error)
      throw error
    }
  },

  /**
   * Add a new client
   * @param {Object} clientData - Client data
   * @param {string} clientData.name - Client name
   * @param {string} clientData.phone - Phone number
   * @param {string} clientData.email - Email address (optional)
   * @returns {Promise} API response
   */
  addClient: async (clientData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/barber/clients`,
        clientData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error adding client:', error)
      throw error
    }
  },

  /**
   * Block time slot
   * @param {Object} blockData - Block time data
   * @param {string} blockData.date - Date (YYYY-MM-DD)
   * @param {string} blockData.start_time - Start time (HH:MM)
   * @param {string} blockData.end_time - End time (HH:MM)
   * @param {string} blockData.reason - Reason for blocking (optional)
   * @returns {Promise} API response
   */
  blockTime: async (blockData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/barber/availability/block-time`,
        {
          date: blockData.date,
          startTime: blockData.startTime,
          endTime: blockData.endTime,
          reason: blockData.reason || null
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error blocking time:', error)
      throw error
    }
  },

  /**
   * Get available time slots for booking
   * @param {Object} params - Query parameters
   * @param {string} params.date - Date in YYYY-MM-DD format
   * @param {number} params.service_id - Service ID
   * @returns {Promise} API response with available time slots
   */
  getAvailableTimeSlots: async (params) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/available-time-slots`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching available time slots:', error)
      throw error
    }
  },

  /**
   * Book a new appointment (barber)
   * @param {Object} appointmentData - Appointment data
   * @param {number} appointmentData.client_id - Client ID (if existing client)
   * @param {string} appointmentData.client_name - Client name (if new client)
   * @param {string} appointmentData.client_phone - Client phone (if new client)
   * @param {number} appointmentData.service_id - Service ID
   * @param {string} appointmentData.date - Date (YYYY-MM-DD)
   * @param {string} appointmentData.time - Time (HH:MM)
   * @param {string} appointmentData.notes - Notes (optional)
   * @returns {Promise} API response
   */
  bookAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/barber/appointments`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error booking appointment:', error)
      throw error
    }
  },

  /**
   * Get client statistics
   * @returns {Promise} API response with client stats
   */
  getClientStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/clients/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching client stats:', error)
      throw error
    }
  },

  /**
   * Delete a client
   * @param {number} clientId - Client ID
   * @returns {Promise} API response
   */
  deleteClient: async (clientId, params = {}) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/barber/clients/${clientId}`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting client:', error)
      throw error
    }
  },

  /**
   * Export clients to CSV
   * @returns {Promise} API response with CSV download
   */
  exportClientsCSV: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/clients/export`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        responseType: 'blob'
      })
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `clients_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      return response.data
    } catch (error) {
      console.error('Error exporting CSV:', error)
      throw error
    }
  },

  /**
   * Get client history and details
   * @param {number} clientId - Client ID
   * @param {Object} params - Query parameters
   * @param {string} params.time_filter - Time filter (all_time, this_year, last_year, etc.)
   * @returns {Promise} API response with client history
   */
  getClientHistory: async (clientId, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/clients/${clientId}/history`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching client history:', error)
      throw error
    }
  },

  /**
   * Update client notes
   * @param {number} clientId - Client ID
   * @param {Object} data - Notes data
   * @param {string} data.notes - Notes content
   * @returns {Promise} API response
   */
  updateClientNotes: async (clientId, data) => {
    try {
      // Extract phone from data and pass as query parameter
      const { phone, ...notesData } = data
      const response = await axios.patch(
        `${API_BASE_URL}/barber/clients/${clientId}/notes`,
        notesData,
        {
          params: { phone },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating client notes:', error)
      throw error
    }
  },

  /**
   * Get client notes
   * @param {number} clientId - Client ID
   * @returns {Promise} API response with client notes
   */
  getClientNotes: async (clientId, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/clients/${clientId}/notes`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching client notes:', error)
      throw error
    }
  },

  /**
   * Get activity history
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.activity_type - Activity type filter (all, appointments, cancellations, system)
   * @param {string} params.time_period - Time period filter (last_30_days, this_week, this_month, custom)
   * @returns {Promise} API response with activity history
   */
  getActivityHistory: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/activity-history`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching activity history:', error)
      throw error
    }
  },

  /**
   * Export activity report
   * @param {Object} params - Query parameters
   * @param {string} params.activity_type - Activity type filter
   * @param {string} params.time_period - Time period filter
   * @returns {Promise} API response with report download
   */
  exportActivityReport: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/activity-history/export`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        responseType: 'blob'
      })
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `activity_report_${new Date().toISOString().split('T')[0]}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      return response.data
    } catch (error) {
      console.error('Error exporting activity report:', error)
      throw error
    }
  },

  /**
   * Get appointment details
   * @param {number} appointmentId - Appointment ID
   * @returns {Promise} API response with appointment details
   */
  getAppointmentDetails: async (appointmentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/appointments/${appointmentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching appointment details:', error)
      throw error
    }
  },

  /**
   * Get barber reviews with filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.rating - Rating filter (all, 5, 4, 3, 2, 1)
   * @param {string} params.sort_by - Sort option (newest, oldest, highest, lowest)
   * @returns {Promise} API response with reviews
   */
  getReviews: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/reviews`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching reviews:', error)
      throw error
    }
  },

  /**
   * Get review statistics
   * @returns {Promise} API response with review stats
   */
  getReviewStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/reviews/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching review stats:', error)
      throw error
    }
  },

  /**
   * Reply to a review
   * @param {number} reviewId - Review ID
   * @param {Object} data - Reply data
   * @param {string} data.reply - Reply text
   * @returns {Promise} API response
   */
  replyToReview: async (reviewId, data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/barber/reviews/${reviewId}/reply`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error replying to review:', error)
      throw error
    }
  },

  /**
   * Update review reply
   * @param {number} reviewId - Review ID
   * @param {Object} data - Reply data
   * @param {string} data.reply - Reply text
   * @returns {Promise} API response
   */
  updateReviewReply: async (reviewId, data) => {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/barber/reviews/${reviewId}/reply`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating review reply:', error)
      throw error
    }
  },

  /**
   * Delete a review
   * @param {number} reviewId - Review ID
   * @returns {Promise} API response
   */
  deleteReview: async (reviewId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/barber/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error deleting review:', error)
      throw error
    }
  },

  /**
   * Export reviews to CSV
   * @param {Object} params - Query parameters
   * @param {string} params.rating - Rating filter
   * @param {string} params.sort_by - Sort option
   * @returns {Promise} API response with CSV download
   */
  exportReviewsCSV: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/reviews/export`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        responseType: 'blob'
      })
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `reviews_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      return response.data
    } catch (error) {
      console.error('Error exporting reviews CSV:', error)
      throw error
    }
  },

  /**
   * Get barber settings
   * @returns {Promise} API response with settings data
   */
  getSettings: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/settings`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  },

  /**
   * Update barber settings
   * @param {Object} settings - Settings data
   * @returns {Promise} API response
   */
  updateSettings: async (settings) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/barber/settings`,
        settings,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  },

  /**
   * Update barber password
   * @param {Object} passwordData - Password data
   * @param {string} passwordData.current_password - Current password
   * @param {string} passwordData.new_password - New password
   * @returns {Promise} API response
   */
  updatePassword: async (passwordData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/barber/password`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('auth_token')}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating password:', error)
      throw error
    }
  },

  /**
   * Get barber profile
   * @returns {Promise} API response with profile data
   */
  getProfile: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/barber/profile`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching profile:', error)
      throw error
    }
  },

  /**
   * Update barber profile
   * @param {Object|FormData} profileData - Profile data
   * @param {boolean} isFormData - Whether the data is FormData (for file upload)
   * @returns {Promise} API response
   */
  updateProfile: async (profileData, isFormData = false) => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }

      // If FormData, don't set Content-Type (browser will set it with boundary)
      if (!isFormData) {
        headers['Content-Type'] = 'application/json'
      }

      const response = await axios.put(
        `${API_BASE_URL}/barber/profile`,
        profileData,
        { headers }
      )
      return response.data
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }
}

export default barberApi

