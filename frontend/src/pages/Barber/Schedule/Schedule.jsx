import React, { useState, useEffect } from 'react'
import ScheduleHeader from '../../../components/ScheduleHeader/ScheduleHeader'
import CalendarWeekView from '../../../components/CalendarWeekView/CalendarWeekView'
import CalendarMonthView from '../../../components/CalendarMonthView/CalendarMonthView'
import CalendarDayView from '../../../components/CalendarDayView/CalendarDayView'
import NewSlotModal from '../../../components/NewSlotModal/NewSlotModal'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import ViewDetailsModal from '../../../components/ViewDetailsModal/ViewDetailsModal'
import appointmentsApi from '../../../api/appointments'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'

const Schedule = () => {
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [viewType, setViewType] = useState('week') // 'week', 'month', 'day'
  const [isNewSlotModalOpen, setIsNewSlotModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [services, setServices] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useBarberUserContext()

  useEffect(() => {
    fetchAcceptedAppointments()
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWeek, viewType])

  useEffect(() => {
    fetchServices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchServices = async () => {
    try {
      const data = await appointmentsApi.getServices()
      const servicesData = data.data || data.services || []
      // Transform services to match expected format
      setServices(servicesData.map(service => ({
        id: service.id,
        name: service.name_en || service.name || service.title,
        title: service.name_en || service.name || service.title,
        name_en: service.name_en || service.name || service.title,
        price: service.price,
        duration: service.duration
      })))
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    }
  }

  const fetchAcceptedAppointments = async () => {
    setIsLoading(true)
    try {
      // Get date range based on view type
      const dateRange = getDateRange()
      const startDate = dateRange.start
      const endDate = dateRange.end
      
      // Fetch all accepted appointments (we'll filter by date on frontend)
      const data = await appointmentsApi.getBarberAppointments({
        status: 'accepted',
        per_page: 1000 // Large number to get all appointments
      })
      
      const appointmentsData = data.data || data.appointments || []
      
      // Filter appointments within the week range and transform to calendar format
      const weekStartStr = startDate.toISOString().split('T')[0]
      const weekEndStr = endDate.toISOString().split('T')[0]
      
      const transformedAppointments = appointmentsData
        .filter(apt => {
          // Get appointment date from various possible fields
          let aptDate = apt.appointment_date || apt.date
          
          // If dateTime exists, extract date part
          if (!aptDate && apt.dateTime) {
            const datePart = apt.dateTime.split(',')[0].trim()
            // Try to parse it (format: "Jan 01" or "Jan 01, 2024")
            try {
              const year = new Date().getFullYear()
              aptDate = new Date(`${datePart} ${year}`).toISOString().split('T')[0]
            } catch (e) {
              console.warn('Could not parse date from dateTime:', apt.dateTime)
            }
          }
          
          if (!aptDate) return false
          
          // Normalize date to YYYY-MM-DD format
          let aptDateStr = aptDate
          if (aptDate instanceof Date) {
            aptDateStr = aptDate.toISOString().split('T')[0]
          } else if (typeof aptDate === 'string') {
            // If it's already in YYYY-MM-DD format, use it
            if (!aptDateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
              // Try to parse it
              const parsed = new Date(aptDate)
              if (!isNaN(parsed.getTime())) {
                aptDateStr = parsed.toISOString().split('T')[0]
              }
            }
          }
          
          // Check if within week range
          return aptDateStr >= weekStartStr && aptDateStr <= weekEndStr
        })
        .map(appointment => {
          // Parse appointment time
          let appointmentTime = appointment.appointment_time || appointment.time || '00:00:00'
          
          // If time is in 12-hour format (e.g., "04:00 PM"), convert to 24-hour
          if (appointmentTime.includes('AM') || appointmentTime.includes('PM')) {
            const timeMatch = appointmentTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
            if (timeMatch) {
              let hours = parseInt(timeMatch[1])
              const minutes = timeMatch[2]
              const period = timeMatch[3].toUpperCase()
              if (period === 'PM' && hours !== 12) {
                hours += 12
              } else if (period === 'AM' && hours === 12) {
                hours = 0
              }
              appointmentTime = `${String(hours).padStart(2, '0')}:${minutes}:00`
            }
          }
          
          const timeParts = appointmentTime.split(':')
          const hours = parseInt(timeParts[0]) || 0
          const minutes = parseInt(timeParts[1]) || 0
          
          // Calculate end time (use service duration or default 30 minutes)
          let serviceDuration = 30
          if (appointment.services && appointment.services.length > 0) {
            // Sum up all service durations
            serviceDuration = appointment.services.reduce((total, s) => {
              return total + (parseInt(s.duration) || 30)
            }, 0)
          } else if (appointment.service && typeof appointment.service === 'object' && appointment.service.duration) {
            serviceDuration = parseInt(appointment.service.duration) || 30
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
            if (typeof appointment.service === 'string') {
              serviceNames = appointment.service
            } else if (appointment.service.name_en || appointment.service.name) {
              serviceNames = appointment.service.name_en || appointment.service.name
            }
          }
          
          // Get appointment date in YYYY-MM-DD format
          let aptDate = appointment.appointment_date || appointment.date
          if (!aptDate && appointment.dateTime) {
            const datePart = appointment.dateTime.split(',')[0].trim()
            try {
              const year = new Date().getFullYear()
              aptDate = new Date(`${datePart} ${year}`).toISOString().split('T')[0]
            } catch (e) {
              aptDate = new Date().toISOString().split('T')[0]
            }
          }
          if (aptDate instanceof Date) {
            aptDate = aptDate.toISOString().split('T')[0]
          } else if (typeof aptDate === 'string' && !aptDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
            const parsed = new Date(aptDate)
            if (!isNaN(parsed.getTime())) {
              aptDate = parsed.toISOString().split('T')[0]
            }
          }
          
          return {
            id: appointment.id,
            date: aptDate,
            startTime: startTimeStr,
            endTime: endTimeStr,
            clientName: appointment.clientName || appointment.full_name || 'Client',
            service: serviceNames,
            status: appointment.status || 'accepted',
            type: 'appointment',
            phone: appointment.phone,
            email: appointment.email,
            notes: appointment.notes
          }
        })
      
      setAppointments(transformedAppointments)
    } catch (error) {
      console.error('Error fetching accepted appointments:', error)
      setAppointments([])
    } finally {
      setIsLoading(false)
    }
  }

  const getWeekStart = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day
    return new Date(d.setDate(diff))
  }

  const getWeekEnd = (date) => {
    const start = getWeekStart(date)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    return end
  }

  const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1)
  }

  const getMonthEnd = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0)
  }

  const getDateRange = () => {
    if (viewType === 'month') {
      const monthStart = getMonthStart(currentWeek)
      const monthEnd = getMonthEnd(currentWeek)
      return { start: monthStart, end: monthEnd }
    } else if (viewType === 'day') {
      return { start: currentWeek, end: currentWeek }
    } else {
      // week view
      return { start: getWeekStart(currentWeek), end: getWeekEnd(currentWeek) }
    }
  }

  const handlePrevious = () => {
    const newDate = new Date(currentWeek)
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() - 1)
    } else if (viewType === 'day') {
      newDate.setDate(newDate.getDate() - 1)
    } else {
      // week view
      newDate.setDate(newDate.getDate() - 7)
    }
    setCurrentWeek(newDate)
  }

  const handleNext = () => {
    const newDate = new Date(currentWeek)
    if (viewType === 'month') {
      newDate.setMonth(newDate.getMonth() + 1)
    } else if (viewType === 'day') {
      newDate.setDate(newDate.getDate() + 1)
    } else {
      // week view
      newDate.setDate(newDate.getDate() + 7)
    }
    setCurrentWeek(newDate)
  }

  const handleToday = () => {
    setCurrentWeek(new Date())
  }

  const handleViewChange = (view) => {
    setViewType(view)
  }

  const handleNewAppointment = () => {
    setIsNewSlotModalOpen(true)
  }

  const handleCloseNewSlotModal = () => {
    setIsNewSlotModalOpen(false)
  }

  const handleNewSlotSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      // Use the public appointment creation endpoint (same as appointments page)
      await appointmentsApi.createAppointment({
        fullName: formData.clientName,
        phone: formData.phone,
        email: formData.email || null,
        selectedDate: formData.date,
        selectedTime: formData.time,
        notes: formData.notes || null,
        services: formData.services || [], // Array of service IDs from multi-select
        barberId: formData.barberId || user?.id // Use logged-in barber's ID
      })
      // Refresh appointments list
      await fetchAcceptedAppointments()
      handleCloseNewSlotModal()
      
      // Show success message
      setSuccessMessage(`Appointment for ${formData.clientName} has been scheduled successfully.`)
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error creating appointment:', error)
      const errorMessage = error.response?.data?.message || 'Failed to create appointment. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAppointmentClick = (appointment) => {
    // Format appointment data for ViewDetailsModal
    // The appointment from schedule view has: id, date, startTime, endTime, clientName, service, status, phone, email, notes
    // ViewDetailsModal expects: clientName, service, dateTime, barberName, phone, email, notes, status, id, clientInitials
    
    // Generate client initials from clientName
    const clientName = appointment.clientName || 'Client'
    const nameParts = clientName.split(' ')
    let clientInitials = ''
    if (nameParts.length >= 2) {
      clientInitials = (nameParts[0][0] + nameParts[1][0]).toUpperCase()
    } else if (nameParts.length === 1) {
      clientInitials = nameParts[0].substring(0, 2).toUpperCase()
    }
    
    // Format dateTime from date and startTime
    let dateTime = ''
    if (appointment.date && appointment.startTime) {
      const date = new Date(appointment.date)
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const day = date.getDate()
      
      // Convert 24-hour time to 12-hour format
      const [hours, minutes] = appointment.startTime.split(':')
      const hour12 = parseInt(hours) % 12 || 12
      const period = parseInt(hours) >= 12 ? 'PM' : 'AM'
      const timeStr = `${hour12}:${minutes} ${period}`
      
      dateTime = `${month} ${day}, ${timeStr}`
    }
    
    // Format appointment for ViewDetailsModal
    const formattedAppointment = {
      id: appointment.id,
      clientName: clientName,
      clientInitials: clientInitials,
      clientAvatar: null,
      clientType: 'Client',
      service: appointment.service || 'Service',
      barberName: user?.name || user?.first_name || 'Barber',
      dateTime: dateTime,
      phone: appointment.phone || null,
      email: appointment.email || null,
      notes: appointment.notes || 'No notes provided.',
      status: appointment.status || 'accepted'
    }
    
    setSelectedAppointment(formattedAppointment)
    setIsViewDetailsModalOpen(true)
  }

  const handleCloseViewDetailsModal = () => {
    setIsViewDetailsModalOpen(false)
    setSelectedAppointment(null)
  }

  const dateRange = getDateRange()
  const weekStart = dateRange.start
  const weekEnd = dateRange.end

  return (
    <>
      <main className="flex-grow flex flex-col p-6 lg:p-8 h-full overflow-hidden lg:ml-64 w-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background-light/80 dark:bg-background-dark/80 z-10 rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading schedule...</p>
              </div>
            </div>
          )}
          <ScheduleHeader
            weekStart={weekStart}
            weekEnd={weekEnd}
            viewType={viewType}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onToday={handleToday}
            onViewChange={handleViewChange}
            onNewAppointment={handleNewAppointment}
          />

          {/* Render appropriate calendar view based on viewType */}
          {viewType === 'month' ? (
            <CalendarMonthView
              currentMonth={currentWeek}
              appointments={appointments}
              blockedSlots={[]}
              unavailableSlots={[]}
              onAppointmentClick={handleAppointmentClick}
            />
          ) : viewType === 'day' ? (
            <CalendarDayView
              currentDay={currentWeek}
              appointments={appointments}
              blockedSlots={[]}
              unavailableSlots={[]}
              onAppointmentClick={handleAppointmentClick}
            />
          ) : (
            <CalendarWeekView
              weekStart={weekStart}
              appointments={appointments}
              blockedSlots={[]}
              unavailableSlots={[]}
              onAppointmentClick={handleAppointmentClick}
            />
          )}
      </main>

      {/* New Slot Modal - Same as appointments page */}
      <NewSlotModal
        isOpen={isNewSlotModalOpen}
        onClose={handleCloseNewSlotModal}
        services={services}
        barbers={[]}
        onSubmit={handleNewSlotSubmit}
        isLoading={isSubmitting}
        hideBarberSelect={true}
        barberId={user?.id} // Always use the logged-in barber's ID
      />

      {/* Success Message Modal */}
      <SuccessMessageModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Appointment Scheduled!"
        message={successMessage}
      />

      {/* View Details Modal */}
      <ViewDetailsModal
        isOpen={isViewDetailsModalOpen}
        onClose={handleCloseViewDetailsModal}
        appointment={selectedAppointment}
      />
    </>
  )
}


export default Schedule

