import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AppointmentsHeader from '../../../components/AppointmentsHeader/AppointmentsHeader'
import AvailableTimeSlots from '../../../components/AvailableTimeSlots/AvailableTimeSlots'
import AppointmentsFilters from '../../../components/AppointmentsFilters/AppointmentsFilters'
import AppointmentCard from '../../../components/AppointmentCard/AppointmentCard'
import NewSlotCard from '../../../components/NewSlotCard/NewSlotCard'
import AppointmentsPagination from '../../../components/AppointmentsPagination/AppointmentsPagination'
import EditAppointmentModal from '../../../components/EditAppointmentModal/EditAppointmentModal'
import AcceptAppointmentModal from '../../../components/AcceptAppointmentModal/AcceptAppointmentModal'
import RejectAppointmentModal from '../../../components/RejectAppointmentModal/RejectAppointmentModal'
import CompleteAppointmentModal from '../../../components/CompleteAppointmentModal/CompleteAppointmentModal'
import ViewDetailsModal from '../../../components/ViewDetailsModal/ViewDetailsModal'
import NewSlotModal from '../../../components/NewSlotModal/NewSlotModal'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import appointmentsApi from '../../../api/appointments'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'

const BarberAppointments = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [services, setServices] = useState([])
  const [availableBarbers, setAvailableBarbers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false)
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false)
  const [isViewDetailsModalOpen, setIsViewDetailsModalOpen] = useState(false)
  const [isNewSlotModalOpen, setIsNewSlotModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useBarberUserContext()
  const [filters, setFilters] = useState({
    search: "",
    date: "" // Empty by default to show all appointments
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  })

  // Fetch appointments
  const fetchAppointments = async () => {
    try {
      setIsLoading(true)
      const data = await appointmentsApi.getBarberAppointments({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        date: filters.date
      })
      
      // Debug: Log the full API response
      if (process.env.NODE_ENV === 'development') {
        console.log('Full API response:', data)
        console.log('Appointments array:', data.data || data.appointments || [])
      }
      
      // Transform backend data to match frontend format
      const transformedAppointments = (data.data || data.appointments || []).map(appointment => {
        // Debug: Log raw appointment data
        if (process.env.NODE_ENV === 'development') {
          console.log('Raw appointment from API:', appointment)
          console.log('Appointment phone:', appointment.phone)
          console.log('Appointment email:', appointment.email)
          console.log('All appointment keys:', Object.keys(appointment))
        }
        
        // Extract serviceIds and services from the appointment
        let serviceIds = []
        let servicesArray = []
        
        if (appointment.serviceIds && Array.isArray(appointment.serviceIds)) {
          serviceIds = appointment.serviceIds
        } else if (appointment.services && Array.isArray(appointment.services)) {
          // Extract IDs from service objects
          serviceIds = appointment.services.map(s => {
            if (typeof s === 'object' && s.id) {
              return s.id
            }
            return typeof s === 'number' ? s : parseInt(s)
          }).filter(id => !isNaN(id))
          servicesArray = appointment.services
        }
        
        const transformed = {
          id: appointment.id,
          clientName: appointment.clientName || appointment.full_name,
          clientInitials: appointment.clientInitials || (appointment.clientName || appointment.full_name || '').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
          clientAvatar: appointment.clientAvatar || null,
          clientType: appointment.clientType || 'Client',
          service: appointment.service || 'Service',
          serviceIds: serviceIds, // Array of service IDs for edit modal
          services: servicesArray, // Array of service objects for edit modal
          barberName: appointment.barberName || user?.name || 'Barber',
          dateTime: appointment.dateTime || `${new Date(appointment.date || appointment.appointment_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${appointment.time || appointment.appointment_time}`,
          notes: appointment.notes || null,
          status: appointment.status || 'pending',
          isVIP: appointment.isVIP || false,
          isPast: appointment.isPast !== undefined ? appointment.isPast : (new Date(appointment.date || appointment.appointment_date) < new Date()),
          // Ensure phone and email are properly extracted - check multiple possible field names
          phone: appointment.phone || appointment.clientPhone || (appointment.data && appointment.data.phone) || null,
          email: appointment.email || appointment.clientEmail || (appointment.data && appointment.data.email) || null,
          // Include date and time separately for edit modal
          date: appointment.date || appointment.appointment_date,
          time: appointment.time || appointment.appointment_time
        }
        
        // Debug log to verify data
        if (process.env.NODE_ENV === 'development') {
          console.log('Transformed appointment for edit:', {
            id: transformed.id,
            serviceIds: transformed.serviceIds,
            services: transformed.services,
            phone: transformed.phone
          })
        }
        
        // Debug: Log transformed appointment
        if (process.env.NODE_ENV === 'development') {
          console.log('Transformed appointment:', transformed)
        }
        
        return transformed
      })
      
      // Sort appointments: pending first, completed last
      const sortedAppointments = transformedAppointments.sort((a, b) => {
        // Define status priority: pending = 0 (first), completed = 999 (last)
        const getStatusPriority = (status) => {
          switch (status?.toLowerCase()) {
            case 'pending':
              return 0
            case 'accepted':
              return 1
            case 'rejected':
              return 2
            case 'confirmed':
              return 3
            case 'cancelled':
              return 4
            case 'completed':
              return 999 // Last
            default:
              return 100 // Unknown statuses go in the middle
          }
        }
        
        const priorityA = getStatusPriority(a.status)
        const priorityB = getStatusPriority(b.status)
        
        // If same priority, sort by date/time
        if (priorityA === priorityB) {
          const dateA = new Date(a.date || a.dateTime || 0)
          const dateB = new Date(b.date || b.dateTime || 0)
          
          // For pending appointments, sort by nearest date first (ascending - earliest first)
          if (a.status?.toLowerCase() === 'pending' && b.status?.toLowerCase() === 'pending') {
            return dateA - dateB // Nearest date first (ascending)
          }
          
          // For other statuses, sort by newest first (descending)
          return dateB - dateA
        }
        
        return priorityA - priorityB
      })
      
      setAppointments(sortedAppointments)
      setPagination(prev => ({
        ...prev,
        totalPages: data.total_pages || data.last_page || 1,
        totalItems: data.total || data.total_items || 0
      }))
    } catch (error) {
      console.error('Error fetching appointments:', error)
      setAppointments([])
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalItems: 0
      }))
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch services
  const fetchServices = async () => {
    try {
      const data = await appointmentsApi.getServices()
      const servicesData = data.data || data.services || []
      // Transform services to match expected format
      setServices(servicesData.map(service => ({
        id: service.id,
        name: service.name_en || service.name || service.title,
        title: service.name_en || service.name || service.title,
        price: service.price,
        duration: service.duration
      })))
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    }
  }

  // Fetch today's available time slots (always for today, not filtered date)
  const fetchAvailableTimeSlots = async () => {
    try {
      // Always use today's date for "Today's Available Time Slots"
      const today = new Date().toISOString().split('T')[0]
      const data = await appointmentsApi.getBarberAvailableTimeSlots({
        date: today
      })
      // Transform backend data
      const barberData = data.data?.barber || data.barber || {}
      setAvailableBarbers([{
        id: barberData.id || user?.id,
        name: barberData.name || user?.name || user?.first_name || 'Barber',
        avatar: barberData.avatar || user?.profile_photo || null,
        availableSlots: barberData.availableSlots || [],
        isFull: barberData.isFull || false
      }])
    } catch (error) {
      console.error('Error fetching available time slots:', error)
      // Set empty state but still show the barber info
      setAvailableBarbers([{
        id: user?.id,
        name: user?.name || user?.first_name || 'Barber',
        avatar: user?.profile_photo || null,
        availableSlots: [],
        isFull: true
      }])
    }
  }

  useEffect(() => {
    fetchServices()
    fetchAvailableTimeSlots()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    fetchAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.search, filters.date, pagination.currentPage])

  useEffect(() => {
    if (filters.date) {
      fetchAvailableTimeSlots()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.date])

  // No need to fetch time slots here - NewSlotModal handles it internally

  const handleBookNew = () => {
    setIsNewSlotModalOpen(true)
  }

  const handleCloseNewSlotModal = () => {
    setIsNewSlotModalOpen(false)
  }

  // Removed handleNewSlotDateChange - NewSlotModal handles date/time fetching internally

  const handleNewSlotSubmit = async (formData) => {
    setIsSubmitting(true)
    try {
      // Use the public appointment creation endpoint (same as contact page)
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
      // Refresh appointments list and today's slots
      await fetchAppointments()
      await fetchAvailableTimeSlots()
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

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleDateChange = (value) => {
    setFilters(prev => ({ ...prev, date: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleRefresh = () => {
    fetchAppointments()
    fetchAvailableTimeSlots() // Refresh today's slots
  }

  const handleAccept = (appointment) => {
    setSelectedAppointment(appointment)
    setIsAcceptModalOpen(true)
  }

  const handleCloseAcceptModal = () => {
    setIsAcceptModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleConfirmAccept = async () => {
    if (!selectedAppointment) return
    
    setIsSubmitting(true)
    try {
      const response = await appointmentsApi.acceptBarberAppointment(selectedAppointment.id)
      
      // Show success message
      setSuccessMessage(response.message || `Appointment for ${selectedAppointment.clientName} has been accepted successfully.`)
      setIsSuccessModalOpen(true)
      
      // Refresh data
      await fetchAppointments()
      await fetchAvailableTimeSlots() // Refresh today's slots
      
      // Close accept modal
      handleCloseAcceptModal()
    } catch (error) {
      console.error('Error accepting appointment:', error)
      const errorMessage = error.response?.data?.message || 'Failed to accept appointment. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = (appointment) => {
    setSelectedAppointment(appointment)
    setIsRejectModalOpen(true)
  }

  const handleCloseRejectModal = () => {
    setIsRejectModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleConfirmReject = async (appointment, reason) => {
    if (!appointment) return
    
    setIsSubmitting(true)
    try {
      await appointmentsApi.rejectBarberAppointment(appointment.id, { reason })
      await fetchAppointments()
      await fetchAvailableTimeSlots() // Refresh today's slots
      handleCloseRejectModal()
    } catch (error) {
      console.error('Error rejecting appointment:', error)
      alert('Failed to reject appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (appointment) => {
    // Appointment already has all necessary data (serviceIds, services, phone, date, time) from the transformation
    setSelectedAppointment(appointment)
    setIsEditModalOpen(true)
  }

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleUpdateAppointment = async (formData) => {
    setIsSubmitting(true)
    try {
      // Prepare update data - only include fields that are actually provided
      const updateData = {}
      
      // Client name
      if (formData.clientName || selectedAppointment?.clientName) {
        updateData.client_name = formData.clientName || selectedAppointment?.clientName
      }
      
      // Phone number
      if (formData.phone !== undefined) {
        updateData.phone = formData.phone || null
      }
      
      // Date
      if (formData.date) {
        updateData.date = formData.date
      }
      
      // Time - ensure it's in HH:MM format
      if (formData.time) {
        // If time is in HH:MM:SS format, extract just HH:MM
        let timeValue = formData.time
        if (timeValue.length > 5) {
          timeValue = timeValue.substring(0, 5)
        }
        updateData.time = timeValue
      }
      
      // Status
      if (formData.status) {
        updateData.status = formData.status
      }
      
      // Notes
      if (formData.notes !== undefined) {
        updateData.notes = formData.notes || null
      }
      
      // Services - handle array of service IDs (same as contact page)
      if (formData.services && Array.isArray(formData.services) && formData.services.length > 0) {
        // Ensure all service IDs are numbers
        const serviceIds = formData.services.map(id => {
          const numId = typeof id === 'number' ? id : parseInt(id)
          return isNaN(numId) ? null : numId
        }).filter(id => id !== null)
        
        if (serviceIds.length > 0) {
          updateData.services = serviceIds
        }
      }
      
      console.log('Updating appointment with data:', updateData)
      
      await appointmentsApi.updateBarberAppointment(formData.id, updateData)
      // Refresh appointments list and today's slots
      await fetchAppointments()
      await fetchAvailableTimeSlots()
      handleCloseEditModal()
    } catch (error) {
      console.error('Error updating appointment:', error)
      console.error('Error response:', error.response?.data)
      
      // Extract validation errors if present
      let errorMessage = 'Failed to update appointment. Please try again.'
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors
        const errorList = Object.entries(errors).map(([field, messages]) => {
          return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
        }).join('\n')
        errorMessage = `Validation errors:\n${errorList}`
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message
      }
      
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleComplete = (appointment) => {
    setSelectedAppointment(appointment)
    setIsCompleteModalOpen(true)
  }

  const handleCloseCompleteModal = () => {
    setIsCompleteModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleConfirmComplete = async () => {
    if (!selectedAppointment) return
    
    setIsSubmitting(true)
    try {
      await appointmentsApi.completeBarberAppointment(selectedAppointment.id)
      await fetchAppointments()
      await fetchAvailableTimeSlots() // Refresh today's slots
      handleCloseCompleteModal()
    } catch (error) {
      console.error('Error completing appointment:', error)
      alert('Failed to complete appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewDetails = (appointment) => {
    // Debug: Log the appointment being passed
    if (process.env.NODE_ENV === 'development') {
      console.log('handleViewDetails - Appointment received:', appointment)
      console.log('handleViewDetails - Appointment keys:', Object.keys(appointment || {}))
      console.log('handleViewDetails - Phone:', appointment?.phone)
      console.log('handleViewDetails - Email:', appointment?.email)
    }
    
    // Ensure we're passing the full appointment object with all fields
    const fullAppointment = {
      ...appointment,
      // Explicitly include phone and email if they exist in the appointments array
      phone: appointment?.phone || appointments.find(a => a.id === appointment?.id)?.phone || null,
      email: appointment?.email || appointments.find(a => a.id === appointment?.id)?.email || null
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log('handleViewDetails - Full appointment to set:', fullAppointment)
    }
    
    setSelectedAppointment(fullAppointment)
    setIsViewDetailsModalOpen(true)
  }

  const handleCloseViewDetailsModal = () => {
    setIsViewDetailsModalOpen(false)
    setSelectedAppointment(null)
  }

  const handleNewSlot = () => {
    setIsNewSlotModalOpen(true)
  }

  const handlePrevious = () => {
    if (pagination.currentPage > 1) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))
    }
  }

  const handleNext = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))
    }
  }


  return (
    <>
      <main className="flex-grow lg:ml-64 p-6 lg:p-10 overflow-y-auto h-screen w-full">
        <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark relative">
            <AppointmentsHeader
              onBookNew={handleBookNew}
            />

            <AvailableTimeSlots
              barbers={availableBarbers}
            />

            <AppointmentsFilters
              searchQuery={filters.search}
              selectedBarber={""}
              selectedDate={filters.date}
              barbers={[]}
              onSearchChange={handleSearchChange}
              onBarberChange={() => {}} // No barber filter for barbers
              onDateChange={handleDateChange}
              onRefresh={handleRefresh}
              hideBarberFilter={true}
            />

            {isLoading ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                Loading appointments...
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {appointments.map((appointment) => (
                    <AppointmentCard
                      key={appointment.id}
                      id={appointment.id}
                      clientName={appointment.clientName}
                      clientInitials={appointment.clientInitials}
                      clientAvatar={appointment.clientAvatar}
                      clientType={appointment.clientType}
                      service={appointment.service}
                      barberName={appointment.barberName}
                      dateTime={appointment.dateTime}
                      notes={appointment.notes}
                      status={appointment.status}
                      isVIP={appointment.isVIP}
                      isPast={appointment.isPast}
                      phone={appointment.phone}
                      email={appointment.email}
                      serviceIds={appointment.serviceIds}
                      services={appointment.services}
                      date={appointment.date}
                      time={appointment.time}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      onEdit={handleEdit}
                      onComplete={handleComplete}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                  <NewSlotCard onClick={handleNewSlot} />
                </div>

                <AppointmentsPagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.totalItems}
                  itemsPerPage={pagination.itemsPerPage}
                  onPrevious={handlePrevious}
                  onNext={handleNext}
                />
              </>
            )}

            {/* Edit Appointment Modal */}
            <EditAppointmentModal
              isOpen={isEditModalOpen}
              onClose={handleCloseEditModal}
              appointment={selectedAppointment}
              services={services}
              barbers={[]}
              onSubmit={handleUpdateAppointment}
              isLoading={isSubmitting}
              hideBarberSelect={true}
              barberId={user?.id} // Always use the logged-in barber's ID
            />

            {/* Accept Appointment Modal */}
            <AcceptAppointmentModal
              isOpen={isAcceptModalOpen}
              onClose={handleCloseAcceptModal}
              appointment={selectedAppointment}
              onConfirm={handleConfirmAccept}
              isLoading={isSubmitting}
            />

            {/* Success Message Modal */}
            <SuccessMessageModal
              isOpen={isSuccessModalOpen}
              onClose={() => setIsSuccessModalOpen(false)}
              title="Appointment Accepted!"
              message={successMessage}
            />

            {/* Reject Appointment Modal */}
            <RejectAppointmentModal
              isOpen={isRejectModalOpen}
              onClose={handleCloseRejectModal}
              appointment={selectedAppointment}
              onConfirm={handleConfirmReject}
              isLoading={isSubmitting}
            />

            {/* Complete Appointment Modal */}
            <CompleteAppointmentModal
              isOpen={isCompleteModalOpen}
              onClose={handleCloseCompleteModal}
              appointment={selectedAppointment}
              onConfirm={handleConfirmComplete}
              isLoading={isSubmitting}
            />

            {/* View Details Modal */}
            <ViewDetailsModal
              isOpen={isViewDetailsModalOpen}
              onClose={handleCloseViewDetailsModal}
              appointment={selectedAppointment}
            />

            {/* New Slot Modal */}
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
        </div>
      </main>
    </>
  )
}

// Default data (fallback when API is not available)
const getDefaultAppointments = () => [
  {
    id: "APT-302",
    clientName: "John Doe",
    clientInitials: "JD",
    clientAvatar: null,
    clientType: "New Client",
    service: "Haircut & Beard",
    barberName: "Alex Sterling",
    dateTime: "Dec 24, 10:00 AM",
    notes: "Client prefers scissors cut on top, fade on sides. Allergic to certain oils.",
    status: "pending",
    isVIP: false,
    isPast: false
  },
  {
    id: "APT-301",
    clientName: "Mike Ross",
    clientInitials: "MR",
    clientAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOBmrsxfynUR0w_7yRqmCmLiQZ9L7k5KqdPz8w4XvFjdkq3vXXhUTy7VstyvnoBQ3_XciEDqko0hqKxNMX7JQsrQsDCFlvHoLZl1BU6cjivWZnT-tBkD74iwYT94l99qFSn-5hVDG2bNh0o2IL7QRGJS3fd47l4Cz8xCjugnrrla3mcvUVUMSFzpp_NX2YXqgaQnUD3liaoabeQYAIF_eWTHC_jqvZo8viv7nHz-wQbbjCLy-wCzf2etwL0kOKlhnGD9i8jQR9l5A",
    clientType: "Regular",
    service: "Hot Towel Shave",
    barberName: "Alex Sterling",
    dateTime: "Dec 24, 11:30 AM",
    notes: null,
    status: "accepted",
    isVIP: false,
    isPast: false
  },
  {
    id: "APT-300",
    clientName: "Sarah Parker",
    clientInitials: "SP",
    clientAvatar: null,
    clientType: "VIP Client",
    service: "Hair Coloring",
    barberName: "Alex Sterling",
    dateTime: "Dec 24, 01:00 PM",
    notes: "Wants ash blonde highlights.",
    status: "accepted",
    isVIP: true,
    isPast: false
  },
  {
    id: "APT-299",
    clientName: "David Kim",
    clientInitials: "DK",
    clientAvatar: null,
    clientType: "Returning",
    service: "Standard Cut",
    barberName: "Alex Sterling",
    dateTime: "Dec 23, 2025",
    notes: null,
    status: "completed",
    isVIP: false,
    isPast: true
  }
]

const getDefaultServices = () => [
  { id: 1, name: "Haircut & Beard", title: "Haircut & Beard" },
  { id: 2, name: "Hot Towel Shave", title: "Hot Towel Shave" },
  { id: 3, name: "Hair Coloring", title: "Hair Coloring" },
  { id: 4, name: "Standard Cut", title: "Standard Cut" }
]

const getDefaultAvailableBarbers = () => [
  {
    id: "alex",
    name: "Alex Sterling",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA23VfiVo4RC9FLZwS6xJhWLQ426hp2Vu-eMKnlKNN8d3iDnny3GjorYGBvaGuoPVbzEw9D53UqBjtF_KY9nDqGQ_V6JPvHAURR1LxP-aMDyBP3WoN23aoRQ6omLmugQGjqgu2cvjrv4Zr9L_GzK6nfmzGLQSoDRPTBXHiF2cOZ2TJtReuvRP4HJFIm5_OEva15qMTuYX7Ia7cROYPek1e0V-5Vyro0M08qu90SM_bXVeOiAVmq7pcpnp-0bqasneZ_q-rF0cdVjO4",
    availableSlots: ["10:00 AM", "11:30 AM", "02:15 PM", "04:45 PM"],
    isFull: false
  }
]

export default BarberAppointments

