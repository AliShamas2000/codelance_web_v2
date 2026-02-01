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
import authApi from '../../../api/auth'

const AppointmentsPage = () => {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [barbers, setBarbers] = useState([])
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
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filters, setFilters] = useState({
    search: "",
    barber: "",
    date: "" // No date filter by default - show all appointments
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
      const data = await appointmentsApi.getAppointments({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        barber: filters.barber,
        date: filters.date
      })
      
      // Get appointments array
      const appointmentsArray = data.data || data.appointments || []
      
      // Sort appointments in logical order:
      // 1. Pending (needs attention) - sorted by nearest date first
      // 2. Accepted (confirmed but not done) - sorted by date
      // 3. Confirmed (ready to go) - sorted by date
      // 4. Rejected (declined) - sorted by newest first
      // 5. Cancelled (cancelled) - sorted by newest first
      // 6. Completed (done) - sorted by newest first (last)
      const sortedAppointments = [...appointmentsArray].sort((a, b) => {
        // Define status priority
        const getStatusPriority = (status) => {
          switch (status?.toLowerCase()) {
            case 'pending':
              return 0 // First - needs attention
            case 'accepted':
              return 1 // Second - confirmed but not done
            case 'confirmed':
              return 2 // Third - ready to go
            case 'rejected':
              return 3 // Fourth - declined
            case 'cancelled':
              return 4 // Fifth - cancelled
            case 'completed':
              return 999 // Last - done
            default:
              return 100 // Unknown statuses go in the middle
          }
        }
        
        const priorityA = getStatusPriority(a.status)
        const priorityB = getStatusPriority(b.status)
        
        // If same priority, sort by date/time
        if (priorityA === priorityB) {
          const dateA = a.date ? new Date(a.date) : (a.dateTime ? new Date(a.dateTime.split(',')[0]) : new Date(0))
          const dateB = b.date ? new Date(b.date) : (b.dateTime ? new Date(b.dateTime.split(',')[0]) : new Date(0))
          
          // For pending appointments, sort by nearest date first (ascending - earliest first)
          if (a.status?.toLowerCase() === 'pending' && b.status?.toLowerCase() === 'pending') {
            return dateA - dateB // Nearest date first (ascending)
          }
          
          // For accepted and confirmed, also sort by nearest date first
          if ((a.status?.toLowerCase() === 'accepted' || a.status?.toLowerCase() === 'confirmed') &&
              (b.status?.toLowerCase() === 'accepted' || b.status?.toLowerCase() === 'confirmed')) {
            return dateA - dateB // Nearest date first (ascending)
          }
          
          // For other statuses (rejected, cancelled, completed), sort by newest first (descending)
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
      // Set empty state on error
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

  // Fetch barbers
  const fetchBarbers = async () => {
    try {
      const data = await appointmentsApi.getBarbers()
      setBarbers(data.data || data.barbers || [])
    } catch (error) {
      console.error('Error fetching barbers:', error)
      setBarbers(getDefaultBarbers())
    }
  }

  // Fetch services
  const fetchServices = async () => {
    try {
      const data = await appointmentsApi.getServices()
      setServices(data.data || data.services || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices(getDefaultServices())
    }
  }

  // Fetch today's available time slots for all barbers
  const fetchAvailableTimeSlots = async () => {
    try {
      const data = await appointmentsApi.getTodayAvailableSlots()
      // Transform backend data to match component expectations
      const barbers = (data.data || []).map(barber => ({
        id: barber.id,
        name: barber.name,
        avatar: barber.avatar,
        availableSlots: barber.availableSlots || [],
        isFull: barber.isFull || false
      }))
      setAvailableBarbers(barbers)
    } catch (error) {
      console.error('Error fetching available time slots:', error)
      setAvailableBarbers([])
    }
  }

  useEffect(() => {
    fetchBarbers()
    fetchServices()
    fetchAvailableTimeSlots()
  }, [])

  useEffect(() => {
    fetchAppointments()
  }, [filters, pagination.currentPage])

  // Refresh available slots when appointments change (after accept/reject/complete)
  useEffect(() => {
    // Only refresh if we're viewing today's date or no date filter
    const today = new Date().toISOString().split('T')[0]
    if (!filters.date || filters.date === today) {
      fetchAvailableTimeSlots()
    }
  }, [appointments.length]) // Refresh when appointments list changes

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
      // Use the public appointment creation endpoint (same as barber dashboard)
      await appointmentsApi.createAppointment({
        fullName: formData.clientName,
        phone: formData.phone,
        email: formData.email || null,
        selectedDate: formData.date,
        selectedTime: formData.time,
        services: formData.services, // Array of service IDs
        notes: formData.notes || null,
        barberId: formData.barberId // Selected barber ID
      })
      // Refresh appointments list
      fetchAppointments()
      fetchAvailableTimeSlots() // Refresh available slots
      handleCloseNewSlotModal()
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

  const handleBarberChange = (value) => {
    setFilters(prev => ({ ...prev, barber: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleDateChange = (value) => {
    setFilters(prev => ({ ...prev, date: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleRefresh = () => {
    fetchAppointments()
    fetchAvailableTimeSlots()
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
      const response = await appointmentsApi.acceptAppointment(selectedAppointment.id)
      
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
      await appointmentsApi.rejectAppointment(appointment.id, { reason })
      await fetchAppointments()
      await fetchAvailableTimeSlots() // Refresh today's slots
      handleCloseRejectModal()
    } catch (error) {
      console.error('Error rejecting appointment:', error)
      const errorMessage = error.response?.data?.message || 'Failed to reject appointment. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (appointment) => {
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
      // Prepare update data - match the structure expected by the backend
      const updateData = {
        client_name: formData.clientName,
        phone: formData.phone || null,
        services: formData.services || [], // Array of service IDs
        date: formData.date,
        time: formData.time,
        status: formData.status,
        notes: formData.notes || null
      }

      // Include barber_id if provided (admin can change barber)
      if (formData.barber_id) {
        updateData.barber_id = formData.barber_id
      }

      await appointmentsApi.updateAppointment(formData.id, updateData)
      
      // Show success message
      setSuccessMessage(`Appointment for ${formData.clientName} has been updated successfully.`)
      setIsSuccessModalOpen(true)
      
      // Refresh appointments list
      await fetchAppointments()
      await fetchAvailableTimeSlots() // Refresh available slots
      handleCloseEditModal()
    } catch (error) {
      console.error('Error updating appointment:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update appointment. Please try again.'
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
      await appointmentsApi.completeAppointment(selectedAppointment.id)
      fetchAppointments()
      fetchAvailableTimeSlots() // Refresh available slots
      handleCloseCompleteModal()
    } catch (error) {
      console.error('Error completing appointment:', error)
      alert('Failed to complete appointment. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment)
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
    <div className="flex-1 overflow-y-auto bg-background-light dark:bg-background-dark relative">
        <AppointmentsHeader
          onBookNew={handleBookNew}
        />

        <AvailableTimeSlots
          barbers={availableBarbers}
        />

        <AppointmentsFilters
          searchQuery={filters.search}
          selectedBarber={filters.barber}
          selectedDate={filters.date}
          barbers={barbers}
          onSearchChange={handleSearchChange}
          onBarberChange={handleBarberChange}
          onDateChange={handleDateChange}
          onRefresh={handleRefresh}
        />

        {isLoading ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
              <span className="material-symbols-outlined text-gray-400 text-3xl">event_busy</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No Appointments Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {filters.search || filters.barber || filters.date
                ? "Try adjusting your filters to see more results."
                : "No appointments have been scheduled yet."}
            </p>
            <button
              onClick={handleBookNew}
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <span className="material-symbols-outlined text-sm mr-2">add</span>
              Schedule New Appointment
            </button>
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
                  barberId={appointment.barberId}
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
          barbers={barbers}
          onSubmit={handleUpdateAppointment}
          isLoading={isSubmitting}
          hideBarberSelect={false} // Admin can select barber
          barberId={null} // No default barber for admin
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
          barbers={barbers}
          onSubmit={handleNewSlotSubmit}
          isLoading={isSubmitting}
          hideBarberSelect={false} // Admin can select barber
          barberId={null} // No default barber for admin
        />
      </div>
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
    barberName: "Alex Fade",
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
    barberName: "Sam Cut",
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
    barberName: "Alex Fade",
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
    barberName: "Mike Razor",
    dateTime: "Dec 23, 2025",
    notes: null,
    status: "completed",
    isVIP: false,
    isPast: true
  }
]

const getDefaultBarbers = () => [
  { id: "alex", name: "Alex Fade" },
  { id: "sam", name: "Sam Cut" },
  { id: "mike", name: "Mike Razor" }
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
    name: "Alex Fade",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCwTxv0wJ7SdOyrOoWVfUdOPwqurVhqTh0PxIslcOpIzkGl2NX_lhQld0ne2D38mTJBk4ctbHpr3qyOywpaWluTCeigjsId9k4gqNm7YAEyxQFCK9tTIJMz_i_umgy3c5DfKsIV61uXy61fIt_B8kXkMTUD4Ix4gy4mOJBDECscWh5XsdvCgK3TQX97XHANovSCwRay_Zec39XrCSdqNs08mZ61jRVedXmnOy0BitdOyOF0XAgfhJPZfi0ydkhEgXxNsS_Vc8TZwbM",
    availableSlots: ["10:00 AM", "11:30 AM", "02:15 PM", "04:45 PM"],
    isFull: false
  },
  {
    id: "sam",
    name: "Sam Cut",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFOm0i5Zoo2dO8bofPR4bOQvsW8kopFn-oBieXmXOG_OFystJoz1vfGdS67T8ecyUumSs9PdNlygb73ugIT0d4Lw55TxxIizhLYGtVmX7Cn9oyZzOlWutovt5pPzRqRX9wsEEZIE40a_iTIQ1E02Z0FBrOQaYx3DZAz-nl4xpWx4vTV9vvpa4FxOWdwBhxbBVdjkjrTcisN0QoUhC7xCgKEVLPp7sbf-9xNNddT3orcX8koL3PpuhNenurwAXn4CQ00Wr0HGApl0M",
    availableSlots: [],
    isFull: true
  },
  {
    id: "mike",
    name: "Mike Razor",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuASoGYTDtAMXUVcZXUyetjVtYAVTTU_isTyKWhdkNzaSjcF3Uzb1LjZvDlA1mpHAQ4eozx5GtBtB5ecUJ04bnQ31CrFbUzzFC-igt9xw9uPfxcwuLcfmr-vXAi9yMGKk2ixYZ_rl9kQ1kEXUE8BWuAaefoDpX-XhYc88wnfM3GhtiyAUyiYgQqFdZd3ROapaBpqpjQFMuEg5ANBo4Ltj-tU8Jc54fcMSH3GbR32Sllks7s7cpQd4mJn0C1k29n_iTt8mQGbarBIx3k",
    availableSlots: ["01:00 PM"],
    isFull: false
  }
]

export default AppointmentsPage

