/**
 * Appointments API Service
 * 
 * Handles all API calls related to appointments and booking
 */

import axios from 'axios'

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || (window.location.origin + '/api/v1'))

const appointmentApi = {
  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data
   * @param {string} appointmentData.fullName - Customer full name
   * @param {string} appointmentData.phone - Customer phone number
   * @param {string} appointmentData.selectedDate - Selected date (ISO string)
   * @param {string} appointmentData.selectedTime - Selected time slot
   * @param {string} appointmentData.notes - Additional notes (optional)
   * @param {number} appointmentData.serviceId - Service ID (optional, if booking from service page)
   * @param {number} appointmentData.barberId - Barber ID (optional, if booking specific barber)
   * @returns {Promise} API response
   */
  createAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, {
        full_name: appointmentData.fullName,
        phone: appointmentData.phone,
        email: appointmentData.email || null,
        appointment_date: appointmentData.selectedDate,
        appointment_time: appointmentData.selectedTime,
        notes: appointmentData.notes || null,
        services: appointmentData.services || [],
        barber_id: appointmentData.barberId || null,
      })
      return response.data
    } catch (error) {
      console.error('Error creating appointment:', error)
      throw error
    }
  },

  /**
   * Get available time slots for a specific date and barber
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {number} barberId - Barber ID
   * @returns {Promise} API response with available and unavailable slots
   */
  getAvailableTimeSlots: async (date, barberId, serviceIds = []) => {
    try {
      console.log('getAvailableTimeSlots API call:', { date, barberId, serviceIds, url: `${API_BASE_URL}/appointments/time-slots` })
      const params = { date, barber_id: barberId }
      // Add service_ids if provided (for calculating total duration)
      if (serviceIds && Array.isArray(serviceIds) && serviceIds.length > 0) {
        params.service_ids = serviceIds
      }
      const response = await axios.get(`${API_BASE_URL}/appointments/time-slots`, { params })
      console.log('getAvailableTimeSlots API response:', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching time slots:', error)
      console.error('Error response:', error.response?.data)
      throw error
    }
  },

  /**
   * Get available dates for booking
   * @param {Object} params - Query parameters
   * @param {number} params.barberId - Barber ID (required)
   * @param {number} params.days - Number of days ahead to fetch (default: 30)
   * @returns {Promise} API response with available and unavailable dates
   */
  getAvailableDates: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/available-dates`, {
        params: {
          barber_id: params.barberId,
          days: params.days || 30
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching available dates:', error)
      throw error
    }
  },

  /**
   * Get list of active barbers
   * @returns {Promise} API response with barbers list
   */
  getBarbers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/barbers`)
      return response.data
    } catch (error) {
      console.error('Error fetching barbers:', error)
      throw error
    }
  },

  /**
   * Get list of active services
   * @returns {Promise} API response with services list
   */
  getServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/services`)
      return response.data
    } catch (error) {
      console.error('Error fetching services:', error)
      throw error
    }
  },

  /**
   * Get contact information for the booking page
   * Uses the footer endpoint which contains contact information
   * @returns {Promise} API response with contact info (never throws, always returns data)
   */
  getContactInfo: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/footer`)
      const footerData = response.data?.data || response.data
      
      // Format footer data to match expected contact info structure
      if (footerData && (footerData.phone || footerData.email || footerData.address)) {
        // Split address if it exists
        const addressParts = footerData.address ? footerData.address.split(',').map(s => s.trim()) : []
        const line1 = addressParts[0] || footerData.address_line1 || "123 Fashion Ave, Suite 101"
        const line2 = addressParts.slice(1).join(', ') || footerData.address_line2 || "New York, NY 10012"
        
        return {
          title: "Premium Experience",
          description: "Relax in our modern studio while our master stylists take care of your look.",
          address: {
            title: "Our Studio",
            line1: line1,
            line2: line2
          },
          contact: {
            title: "Contact Us",
            phone: footerData.phone || "+1 (555) 000-0000",
            email: footerData.email || "hello@luxecuts.com"
          }
        }
      }
    } catch (error) {
      console.warn('Error fetching contact info from footer, using defaults:', error)
    }
    
    // Return default contact info (always succeeds)
    return {
      title: "Premium Experience",
      description: "Relax in our modern studio while our master stylists take care of your look.",
      address: {
        title: "Our Studio",
        line1: "123 Fashion Ave, Suite 101",
        line2: "New York, NY 10012"
      },
      contact: {
        title: "Contact Us",
        phone: "+1 (555) 000-0000",
        email: "hello@luxecuts.com"
      }
    }
  },

  /**
   * Get appointment by ID
   * @param {number} id - Appointment ID
   * @returns {Promise} API response
   */
  getAppointment: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/appointments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error fetching appointment:', error)
      throw error
    }
  },

  /**
   * Cancel an appointment
   * @param {number} id - Appointment ID
   * @returns {Promise} API response
   */
  cancelAppointment: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/appointments/${id}`)
      return response.data
    } catch (error) {
      console.error('Error canceling appointment:', error)
      throw error
    }
  },

  /**
   * Book a new appointment (admin)
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise} API response
   */
  bookAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/appointments`, appointmentData)
      return response.data
    } catch (error) {
      console.error('Error booking appointment:', error)
      throw error
    }
  },

  /**
   * Get all appointments (admin)
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.barber - Barber filter
   * @param {string} params.date - Date filter (YYYY-MM-DD)
   * @param {string} params.status - Status filter
   * @returns {Promise} API response
   */
  getAppointments: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/appointments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        params: {
          page: params.page || 1,
          per_page: params.per_page || 12,
          search: params.search || '',
          barber: params.barber || '',
          date: params.date || '',
          status: params.status || ''
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching appointments:', error)
      throw error
    }
  },

  /**
   * Get today's available time slots for all barbers (admin)
   * @returns {Promise} API response with barbers and their available slots
   */
  getTodayAvailableSlots: async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/admin/appointments/today-available-slots`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching today\'s available slots:', error)
      throw error
    }
  },

  /**
   * Get barbers list (admin) - DEPRECATED: Use getBarbers() for public endpoint
   * @returns {Promise} API response
   */
  getAdminBarbers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/team`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching admin barbers:', error)
      throw error
    }
  },

  /**
   * Get available time slots for barbers (admin) - DEPRECATED: Use getAvailableTimeSlots(date, barberId) for public endpoint
   * @param {Object} params - Query parameters
   * @param {string} params.date - Date in YYYY-MM-DD format
   * @returns {Promise} API response
   */
  getAdminAvailableTimeSlots: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/appointments/available-slots`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        params: {
          date: params.date || new Date().toISOString().split('T')[0]
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching admin available time slots:', error)
      throw error
    }
  },

  /**
   * Accept an appointment (admin)
   * @param {number} id - Appointment ID
   * @returns {Promise} API response
   */
  acceptAppointment: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.patch(`${API_BASE_URL}/admin/appointments/${id}/accept`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error accepting appointment:', error)
      throw error
    }
  },

  /**
   * Reject an appointment (admin)
   * @param {number} id - Appointment ID
   * @param {Object} data - Rejection data
   * @param {string} data.reason - Optional reason for rejection
   * @returns {Promise} API response
   */
  rejectAppointment: async (id, data = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.patch(`${API_BASE_URL}/admin/appointments/${id}/reject`, {
        reason: data.reason || null
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error rejecting appointment:', error)
      throw error
    }
  },

  /**
   * Complete an appointment (admin)
   * @param {number} id - Appointment ID
   * @returns {Promise} API response
   */
  completeAppointment: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.patch(`${API_BASE_URL}/admin/appointments/${id}/complete`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error completing appointment:', error)
      throw error
    }
  },

  /**
   * Update an appointment (admin)
   * @param {number} id - Appointment ID
   * @param {Object} appointmentData - Updated appointment data
   * @param {string} appointmentData.client_name - Client name
   * @param {string} appointmentData.service - Service name
   * @param {string} appointmentData.barber - Barber name
   * @param {string} appointmentData.date - Date (YYYY-MM-DD)
   * @param {string} appointmentData.time - Time (HH:MM)
   * @param {string} appointmentData.status - Status (pending, accepted, rejected, completed, cancelled)
   * @param {string} appointmentData.notes - Notes (optional)
   * @returns {Promise} API response
   */
  updateAppointment: async (id, appointmentData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(`${API_BASE_URL}/admin/appointments/${id}`, appointmentData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      })
      return response.data
    } catch (error) {
      console.error('Error updating appointment:', error)
      throw error
    }
  },

  /**
   * Get services list (admin) - DEPRECATED: Use getServices() for public endpoint
   * @returns {Promise} API response
   */
  getAdminServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/services`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching admin services:', error)
      throw error
    }
  },

  /**
   * Create a new appointment (admin)
   * @param {Object} appointmentData - Appointment data
   * @param {string} appointmentData.client_name - Client name
   * @param {string} appointmentData.phone - Phone number
   * @param {string} appointmentData.email - Email address (optional)
   * @param {number} appointmentData.service_id - Service ID
   * @param {number} appointmentData.barber_id - Barber ID (optional, null for any available)
   * @param {string} appointmentData.date - Date (YYYY-MM-DD)
   * @param {string} appointmentData.time - Time (HH:MM)
   * @param {string} appointmentData.notes - Notes (optional)
   * @returns {Promise} API response
   */
  createAdminAppointment: async (appointmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/admin/appointments`, appointmentData)
      return response.data
    } catch (error) {
      console.error('Error creating admin appointment:', error)
      throw error
    }
  },

  /**
   * Get barber's appointments
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.per_page - Items per page
   * @param {string} params.search - Search query
   * @param {string} params.date - Date filter (YYYY-MM-DD)
   * @param {string} params.status - Status filter
   * @returns {Promise} API response
   */
  getBarberAppointments: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(`${API_BASE_URL}/barber/appointments`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        params: {
          page: params.page || 1,
          per_page: params.per_page || 12,
          search: params.search || '',
          date: params.date || '',
          status: params.status || ''
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching barber appointments:', error)
      throw error
    }
  },

  /**
   * Accept an appointment (barber)
   * @param {number} id - Appointment ID
   * @returns {Promise} API response
   */
  acceptBarberAppointment: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.patch(
        `${API_BASE_URL}/barber/appointments/${id}/accept`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error accepting appointment:', error)
      throw error
    }
  },

  /**
   * Reject an appointment (barber)
   * @param {number} id - Appointment ID
   * @param {Object} data - Rejection data
   * @param {string} data.reason - Optional reason for rejection
   * @returns {Promise} API response
   */
  rejectBarberAppointment: async (id, data = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.patch(
        `${API_BASE_URL}/barber/appointments/${id}/reject`,
        {
          reason: data.reason || null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error rejecting appointment:', error)
      throw error
    }
  },

  /**
   * Complete an appointment (barber)
   * @param {number} id - Appointment ID
   * @returns {Promise} API response
   */
  completeBarberAppointment: async (id) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.patch(
        `${API_BASE_URL}/barber/appointments/${id}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error completing appointment:', error)
      throw error
    }
  },

  /**
   * Update an appointment (barber)
   * @param {number} id - Appointment ID
   * @param {Object} appointmentData - Updated appointment data
   * @returns {Promise} API response
   */
  updateBarberAppointment: async (id, appointmentData) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.put(
        `${API_BASE_URL}/barber/appointments/${id}`,
        appointmentData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error updating appointment:', error)
      throw error
    }
  },

  /**
   * Get barber's available time slots
   * @param {Object} params - Query parameters
   * @param {string} params.date - Date in YYYY-MM-DD format
   * @returns {Promise} API response
   */
  getBarberAvailableTimeSlots: async (params = {}) => {
    try {
      const token = localStorage.getItem('auth_token')
      const response = await axios.get(
        `${API_BASE_URL}/barber/appointments/available-slots`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            date: params.date || new Date().toISOString().split('T')[0]
          }
        }
      )
      return response.data
    } catch (error) {
      console.error('Error fetching barber available time slots:', error)
      throw error
    }
  },
}

export default appointmentApi


