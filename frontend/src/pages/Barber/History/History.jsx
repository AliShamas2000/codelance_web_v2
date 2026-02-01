import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import HistoryHeader from '../../../components/HistoryHeader/HistoryHeader'
import HistoryFilters from '../../../components/HistoryFilters/HistoryFilters'
import HistoryList from '../../../components/HistoryList/HistoryList'
import HistoryPagination from '../../../components/HistoryPagination/HistoryPagination'
import ViewDetailsModal from '../../../components/ViewDetailsModal/ViewDetailsModal'
import appointmentsApi from '../../../api/appointments'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'
import axios from 'axios'

const History = () => {
  const navigate = useNavigate()
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    activityType: 'all',
    timePeriod: 'last_30_days'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const { user } = useBarberUserContext()

  useEffect(() => {
    fetchHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.activityType, filters.timePeriod, pagination.currentPage])

  const fetchHistory = async () => {
    setIsLoading(true)
    try {
      // Calculate date range based on time period filter
      const dateRange = getDateRangeForTimePeriod(filters.timePeriod)
      
      // Build status filter based on activity type
      let statusFilter = ''
      if (filters.activityType === 'appointments') {
        // Get completed appointments
        statusFilter = 'completed'
      } else if (filters.activityType === 'cancellations') {
        // Get cancelled appointments
        statusFilter = 'cancelled'
      } else if (filters.activityType === 'all') {
        // Get completed and cancelled appointments
        statusFilter = '' // Will fetch all and filter
      }
      
      // Fetch appointments from backend
      // For history, we want to fetch all completed/cancelled appointments and filter on frontend
      // Don't pass date filter to backend - we'll filter on frontend after getting all data
      const data = await appointmentsApi.getBarberAppointments({
        page: 1, // Fetch all pages, we'll paginate on frontend
        per_page: 1000, // Large number to get all appointments
        search: filters.search || '', // Only pass search if provided
        status: '', // Don't filter by status on backend - we need all to filter properly
        date: '' // Don't filter by date on backend - we'll filter on frontend
      })
      
      // Handle different response formats from backend
      let appointmentsData = []
      if (Array.isArray(data.data)) {
        appointmentsData = data.data
      } else if (Array.isArray(data.appointments)) {
        appointmentsData = data.appointments
      } else if (Array.isArray(data)) {
        appointmentsData = data
      } else if (data.data && Array.isArray(data.data.data)) {
        // Nested pagination structure
        appointmentsData = data.data.data
      }
      
      // Debug: Log the fetched appointments
      console.log('History - Fetched appointments:', {
        total: appointmentsData.length,
        completed: appointmentsData.filter(a => a.status === 'completed').length,
        cancelled: appointmentsData.filter(a => a.status === 'cancelled').length,
        appointments: appointmentsData.map(a => ({
          id: a.id,
          status: a.status,
          date: a.appointment_date || a.date,
          client: a.clientName || a.full_name
        }))
      })
      
      // Filter by activity type and date range
      let filteredAppointments = appointmentsData
      
      // First, filter by status (only show completed and cancelled for history)
      filteredAppointments = filteredAppointments.filter(apt => 
        apt.status === 'completed' || apt.status === 'cancelled'
      )
      
      // Filter by activity type if specific
      if (filters.activityType === 'appointments') {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === 'completed')
      } else if (filters.activityType === 'cancellations') {
        filteredAppointments = filteredAppointments.filter(apt => apt.status === 'cancelled')
      }
      // 'all' shows both completed and cancelled (already filtered above)
      
      // Filter by date range if specified
      if (dateRange.start && dateRange.end) {
        filteredAppointments = filteredAppointments.filter(apt => {
          const aptDateStr = apt.appointment_date || apt.date || apt.dateTime?.split(',')[0]
          if (!aptDateStr) {
            console.warn('Appointment missing date:', apt.id)
            return false
          }
          
          try {
            // Parse the date string - handle YYYY-MM-DD format
            const aptDate = new Date(aptDateStr)
            if (isNaN(aptDate.getTime())) {
              console.warn('Invalid date format:', aptDateStr, 'for appointment:', apt.id)
              return false
            }
            
            aptDate.setHours(0, 0, 0, 0)
            const startDate = new Date(dateRange.start)
            startDate.setHours(0, 0, 0, 0)
            const endDate = new Date(dateRange.end)
            endDate.setHours(23, 59, 59, 999)
            
            const isInRange = aptDate >= startDate && aptDate <= endDate
            if (!isInRange) {
              console.log('Appointment filtered out by date range:', {
                id: apt.id,
                status: apt.status,
                aptDate: aptDate.toISOString().split('T')[0],
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
              })
            }
            return isInRange
          } catch (error) {
            console.error('Error filtering by date:', error, aptDateStr, apt)
            return false
          }
        })
      }
      
      console.log('History - After filtering:', {
        total: filteredAppointments.length,
        completed: filteredAppointments.filter(a => a.status === 'completed').length,
        cancelled: filteredAppointments.filter(a => a.status === 'cancelled').length,
        filteredAppointments: filteredAppointments.map(a => ({
          id: a.id,
          status: a.status,
          date: a.appointment_date || a.date
        }))
      })
      
      // Apply search filter if provided
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        filteredAppointments = filteredAppointments.filter(apt => {
          const clientName = (apt.clientName || apt.full_name || '').toLowerCase()
          const serviceNames = apt.services?.map(s => (s.name_en || s.name || '').toLowerCase()).join(' ') || ''
          const phone = (apt.phone || '').toLowerCase()
          return clientName.includes(searchLower) || 
                 serviceNames.includes(searchLower) || 
                 phone.includes(searchLower)
        })
      }
      
      // Transform appointments to history activities format
      const transformedHistory = filteredAppointments.map(appointment => {
        // Parse appointment time
        const appointmentTime = appointment.appointment_time || appointment.time || '00:00:00'
        const timeParts = appointmentTime.split(':')
        const hours = parseInt(timeParts[0]) || 0
        const minutes = parseInt(timeParts[1]) || 0
        
        // Calculate end time (use service duration or default 30 minutes)
        let serviceDuration = 30
        if (appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0) {
          serviceDuration = appointment.services.reduce((total, s) => {
            return total + (parseInt(s.duration) || 30)
          }, 0)
        }
        
        const endTime = new Date()
        endTime.setHours(hours, minutes + serviceDuration, 0, 0)
        
        const startTimeStr = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
        const endTimeStr = `${String(endTime.getHours()).padStart(2, '0')}:${String(endTime.getMinutes()).padStart(2, '0')}`
        
        // Get service names
        let serviceNames = 'Service'
        if (appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0) {
          serviceNames = appointment.services.map(s => s.name_en || s.name || 'Service').join(', ')
        } else if (appointment.service) {
          serviceNames = typeof appointment.service === 'string' ? appointment.service : (appointment.service.name_en || appointment.service.name || 'Service')
        }
        
        // Calculate amount (sum of service prices with discounts)
        let amount = 0
        if (appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0) {
          // Services array from backend
          amount = appointment.services.reduce((total, s) => {
            const price = parseFloat(s.price) || 0
            const discount = parseFloat(s.discount_percentage) || 0
            const discountedPrice = price * (1 - discount / 100)
            return total + discountedPrice
          }, 0)
        } else if (appointment.service && typeof appointment.service === 'object' && appointment.service.price) {
          // Single service object (backward compatibility)
          const price = parseFloat(appointment.service.price) || 0
          const discount = parseFloat(appointment.service.discount_percentage) || 0
          amount = price * (1 - discount / 100)
        }
        
        // Round to 2 decimal places
        amount = Math.round(amount * 100) / 100
        
        // Determine icon and color based on status
        let icon = 'check'
        let iconColor = 'green'
        if (appointment.status === 'cancelled') {
          icon = 'close'
          iconColor = 'red'
        } else if (appointment.status === 'completed') {
          icon = 'check'
          iconColor = 'green'
        }
        
        return {
          id: appointment.id,
          type: 'appointment',
          status: appointment.status,
          clientName: appointment.clientName || appointment.full_name || 'Client',
          serviceName: serviceNames,
          date: appointment.appointment_date || appointment.date || appointment.dateTime?.split(',')[0],
          time: startTimeStr,
          endTime: endTimeStr,
          amount: amount,
          icon: icon,
          iconColor: iconColor,
          // Store full appointment data for modal
          appointmentId: appointment.id,
          appointment: appointment
        }
      })
      
      // Sort by date and time (newest first)
      transformedHistory.sort((a, b) => {
        const dateA = new Date(a.date + ' ' + a.time)
        const dateB = new Date(b.date + ' ' + b.time)
        return dateB - dateA
      })
      
      // Apply frontend pagination
      const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage
      const endIndex = startIndex + pagination.itemsPerPage
      const paginatedHistory = transformedHistory.slice(startIndex, endIndex)
      
      setHistory(paginatedHistory)
      
      // Update pagination based on filtered results
      setPagination(prev => ({
        ...prev,
        totalPages: Math.ceil(transformedHistory.length / prev.itemsPerPage) || 1,
        totalItems: transformedHistory.length
      }))
    } catch (error) {
      console.error('Error fetching history:', error)
      setHistory([])
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalItems: 0
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to calculate date range based on time period
  const getDateRangeForTimePeriod = (timePeriod) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    let start = null
    let end = new Date(today)
    end.setHours(23, 59, 59, 999)
    
    switch (timePeriod) {
      case 'last_30_days':
        start = new Date(today)
        start.setDate(start.getDate() - 30)
        // Include future dates up to 30 days ahead for completed appointments
        end = new Date(today)
        end.setDate(end.getDate() + 30)
        end.setHours(23, 59, 59, 999)
        break
      case 'this_week':
        start = new Date(today)
        const dayOfWeek = start.getDay()
        start.setDate(start.getDate() - dayOfWeek)
        // Include the rest of the week
        end = new Date(start)
        end.setDate(end.getDate() + 6)
        end.setHours(23, 59, 59, 999)
        break
      case 'this_month':
        start = new Date(today.getFullYear(), today.getMonth(), 1)
        // Include the rest of the month
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
        end.setHours(23, 59, 59, 999)
        break
      case 'all_time':
        // Show all appointments regardless of date
        start = null
        end = null
        break
      default:
        start = new Date(today)
        start.setDate(start.getDate() - 30)
        // Include future dates for default as well
        end = new Date(today)
        end.setDate(end.getDate() + 30)
        end.setHours(23, 59, 59, 999)
    }
    
    return { start, end }
  }

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleActivityTypeChange = (value) => {
    setFilters(prev => ({ ...prev, activityType: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleTimePeriodChange = (value) => {
    setFilters(prev => ({ ...prev, timePeriod: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleActivityClick = (activity) => {
    // Only open modal for appointment activities
    if (activity.type === 'appointment' && activity.appointment) {
      // Format appointment for ViewDetailsModal (same format as appointments page)
      const appointment = activity.appointment
      
      // Generate client initials
      const clientName = appointment.clientName || appointment.full_name || 'Client'
      const nameParts = clientName.split(' ')
      let clientInitials = ''
      if (nameParts.length >= 2) {
        clientInitials = (nameParts[0][0] + nameParts[1][0]).toUpperCase()
      } else if (nameParts.length === 1) {
        clientInitials = nameParts[0].substring(0, 2).toUpperCase()
      }
      
      // Format dateTime (same format as appointments page)
      let dateTime = ''
      if (appointment.appointment_date || appointment.date) {
        const date = new Date(appointment.appointment_date || appointment.date)
        const month = date.toLocaleDateString('en-US', { month: 'short' })
        const day = date.getDate()
        
        // Parse time correctly
        const appointmentTime = appointment.appointment_time || appointment.time || '00:00:00'
        let hours = 0
        let minutes = 0
        
        if (typeof appointmentTime === 'string') {
          const timeParts = appointmentTime.split(':')
          hours = parseInt(timeParts[0]) || 0
          minutes = parseInt(timeParts[1]) || 0
        }
        
        const hour12 = hours % 12 || 12
        const period = hours >= 12 ? 'PM' : 'AM'
        const timeStr = `${hour12}:${String(minutes).padStart(2, '0')} ${period}`
        
        dateTime = `${month} ${day}, ${timeStr}`
      }
      
      // Get service names
      let serviceNames = 'Service'
      if (appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0) {
        serviceNames = appointment.services.map(s => s.name_en || s.name || 'Service').join(', ')
      } else if (appointment.service) {
        serviceNames = typeof appointment.service === 'string' ? appointment.service : (appointment.service.name_en || appointment.service.name || 'Service')
      }
      
      // Format appointment exactly as in appointments page
      const formattedAppointment = {
        id: appointment.id,
        clientName: clientName,
        clientInitials: clientInitials,
        clientAvatar: appointment.clientAvatar || null,
        clientType: 'Client',
        service: serviceNames,
        barberName: appointment.barberName || user?.name || user?.first_name || 'Barber',
        dateTime: dateTime,
        phone: appointment.phone || null,
        email: appointment.email || null,
        notes: appointment.notes || 'No notes provided.',
        status: appointment.status || 'completed',
        // Include all fields that ViewDetailsModal might need
        serviceIds: appointment.serviceIds || [],
        services: appointment.services || [],
        date: appointment.appointment_date || appointment.date || '',
        time: appointment.appointment_time || appointment.time || ''
      }
      
      setSelectedActivity(formattedAppointment)
      setIsDetailModalOpen(true)
    }
  }

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedActivity(null)
  }

  const handleExportReport = async () => {
    try {
      setIsLoading(true)
      
      // Call the export endpoint
      const token = localStorage.getItem('auth_token')
      // Use the same API base URL as appointmentsApi
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1'
      
      const response = await axios.get(`${API_BASE_URL}/barber/history/export`, {
        params: {
          search: filters.search || '',
          activity_type: filters.activityType || 'all',
          time_period: filters.timePeriod || 'last_30_days'
        },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'text/csv'
        },
        responseType: 'blob' // Important: get response as blob
      })

      // Get filename from Content-Disposition header or use default
      const contentDisposition = response.headers['content-disposition'] || response.headers['Content-Disposition'] || ''
      let filename = 'activity_history_' + new Date().toISOString().split('T')[0] + '.csv'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '')
        }
      }
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8;' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting report:', error)
      alert('Failed to export report. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return (
    <>
      <main className="flex-grow p-6 lg:p-10 overflow-y-auto h-screen lg:ml-64 w-full">
          <div className="mx-auto max-w-6xl relative">
            {isLoading && history.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 z-10 rounded-lg">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
                </div>
              </div>
            )}
            <HistoryHeader onExportReport={handleExportReport} />

            <HistoryFilters
              filters={filters}
              onSearchChange={handleSearchChange}
              onActivityTypeChange={handleActivityTypeChange}
              onTimePeriodChange={handleTimePeriodChange}
            />

            <HistoryList
              activities={history}
              onActivityClick={handleActivityClick}
            />

            <HistoryPagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              itemsPerPage={pagination.itemsPerPage}
              onPageChange={handlePageChange}
            />
          </div>
        </main>

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        appointment={selectedActivity}
      />
    </>
  )
}

export default History

