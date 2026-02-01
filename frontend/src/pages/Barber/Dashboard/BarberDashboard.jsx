import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BarberStatCard from '../../../components/BarberStatCard/BarberStatCard'
import UpNextCard from '../../../components/UpNextCard/UpNextCard'
import AppointmentsList from '../../../components/AppointmentsList/AppointmentsList'
import ActivityHistory from '../../../components/ActivityHistory/ActivityHistory'
import TodaySchedule from '../../../components/TodaySchedule/TodaySchedule'
import QuickActions from '../../../components/QuickActions/QuickActions'
import AddClientModal from '../../../components/AddClientModal/AddClientModal'
import BlockTimeModal from '../../../components/BlockTimeModal/BlockTimeModal'
import NewSlotModal from '../../../components/NewSlotModal/NewSlotModal'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import appointmentsApi from '../../../api/appointments'
import AppointmentDetailsModal from '../../../components/AppointmentDetailsModal/AppointmentDetailsModal'
import barberApi from '../../../api/barber'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'

const BarberDashboard = () => {
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false)
  const [isBlockTimeModalOpen, setIsBlockTimeModalOpen] = useState(false)
  const [isNewSlotModalOpen, setIsNewSlotModalOpen] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [isAppointmentDetailsModalOpen, setIsAppointmentDetailsModalOpen] = useState(false)
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const [services, setServices] = useState([])
  const [clients, setClients] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useBarberUserContext()

  useEffect(() => {
    fetchDashboardData()
    fetchServices()
    fetchClients()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchServices = async () => {
    try {
      const data = await appointmentsApi.getServices()
      // Transform services to match expected format
      const servicesData = data.data || data || []
      setServices(servicesData.map(service => ({
        id: service.id,
        name: service.name_en || service.name || service.title,
        name_en: service.name_en || service.name || service.title,
        title: service.name_en || service.name || service.title,
        price: service.price,
        duration: service.duration,
        discount_percentage: service.discount_percentage || 0
      })))
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    }
  }

  const fetchClients = async () => {
    try {
      const data = await barberApi.getClients()
      setClients(data.clients || data || [])
    } catch (error) {
      console.error('Error fetching clients:', error)
      setClients([])
    }
  }

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const response = await barberApi.getDashboardData()
      // API returns {success: true, data: {...}}
      const data = response.data || response
      setDashboardData(data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Use default data for now
      setDashboardData(getDefaultDashboardData())
    } finally {
      setIsLoading(false)
    }
  }

  const handleCheckIn = async (appointmentId) => {
    try {
      await barberApi.checkInAppointment(appointmentId)
      fetchDashboardData()
    } catch (error) {
      console.error('Error checking in appointment:', error)
      alert('Failed to check in appointment. Please try again.')
    }
  }

  const handleViewDetails = (appointmentId) => {
    // Find appointment in dashboard data
    const appointment = dashboardData?.upNext || dashboardData?.appointments?.find(apt => apt.id === appointmentId)
    setSelectedAppointmentId(appointmentId)
    setSelectedAppointment(appointment)
    setIsAppointmentDetailsModalOpen(true)
  }

  const handleCloseAppointmentDetailsModal = () => {
    setIsAppointmentDetailsModalOpen(false)
    setSelectedAppointmentId(null)
    setSelectedAppointment(null)
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
        services: formData.services,
        notes: formData.notes || null,
        barberId: user?.id // Use logged-in barber's ID
      })
      
      // Refresh dashboard data
      fetchDashboardData()
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

  const handleUpdateProfile = () => {
    navigate('/barber/profile')
  }


  const handleOpenAddClientModal = () => {
    setIsAddClientModalOpen(true)
  }

  const handleCloseAddClientModal = () => {
    setIsAddClientModalOpen(false)
  }

  const handleAddClient = async (formData) => {
    setIsSubmitting(true)
    try {
      await barberApi.addClient({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null
      })
      // Refresh dashboard data
      fetchDashboardData()
      handleCloseAddClientModal()
      setSuccessMessage('Client added successfully!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error adding client:', error)
      alert('Failed to add client. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenBlockTimeModal = () => {
    setIsBlockTimeModalOpen(true)
  }

  const handleCloseBlockTimeModal = () => {
    setIsBlockTimeModalOpen(false)
  }

  const handleBlockTime = async (formData) => {
    setIsSubmitting(true)
    try {
      await barberApi.blockTime({
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        reason: formData.reason || null
      })
      // Refresh dashboard data
      fetchDashboardData()
      handleCloseBlockTimeModal()
      setSuccessMessage('Time blocked successfully!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error blocking time:', error)
      alert('Failed to block time. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Use dashboard data if available, otherwise fallback to default
  const data = dashboardData ? {
    stats: dashboardData.stats || getDefaultDashboardData().stats,
    upNext: dashboardData.upNext ?? null, // Use null if no upNext (don't fallback to fake data)
    upcomingAppointments: dashboardData.upcomingAppointments || getDefaultDashboardData().upcomingAppointments,
    activityHistory: dashboardData.activityHistory || getDefaultDashboardData().activityHistory,
    todaySchedule: dashboardData.todaySchedule || getDefaultDashboardData().todaySchedule
  } : getDefaultDashboardData()

  return (
    <>
      <main className="flex-grow lg:ml-64 p-6 lg:p-10 overflow-y-auto h-screen w-full">
        <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <span className="text-primary font-semibold tracking-wider uppercase text-xs mb-1 block">
                  Your Dashboard
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-[#111816] dark:text-white">
                  Welcome back, {user?.first_name || user?.name?.split(' ')[0] || 'Barber'}!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Here's what's happening in your chair today.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateProfile}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:border-primary/50 text-sm font-medium transition-colors shadow-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                  Update Profile
                </button>
                <button
                  onClick={handleNewAppointment}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-[#111816] text-sm font-bold shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span>
                  New Appointment
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <BarberStatCard
                icon="event_available"
                iconBg="bg-blue-50 dark:bg-blue-900/20"
                iconColor="text-blue-600"
                value={data.stats.appointmentsThisWeek}
                label="Appointments this week"
                change="+12%"
                changeType="positive"
              />
              <BarberStatCard
                icon="payments"
                iconBg="bg-purple-50 dark:bg-purple-900/20"
                iconColor="text-purple-600"
                value={`$${data.stats.estimatedEarnings.toLocaleString()}`}
                label="Estimated Earnings"
                change="+5%"
                changeType="positive"
              />
              <BarberStatCard
                icon="star"
                iconBg="bg-yellow-50 dark:bg-yellow-900/20"
                iconColor="text-yellow-600"
                value={data.stats.averageRating}
                label="Average Rating"
                change={`${data.stats.totalReviews} reviews`}
                changeType="neutral"
              />
              <BarberStatCard
                icon="person"
                iconBg="bg-green-50 dark:bg-green-900/20"
                iconColor="text-green-600"
                value={data.stats.newClients}
                label="New Clients"
                change="+3 new"
                changeType="positive"
              />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - 2/3 width */}
              <div className="lg:col-span-2 space-y-8">
                <UpNextCard
                  appointment={data.upNext}
                  onCheckIn={handleCheckIn}
                  onViewDetails={handleViewDetails}
                />
                <AppointmentsList
                  appointments={data.upcomingAppointments}
                  onViewDetails={handleViewDetails}
                />
                <ActivityHistory
                  activities={data.activityHistory}
                />
              </div>

              {/* Right Column - 1/3 width */}
              <div className="lg:col-span-1 space-y-8">
                <TodaySchedule
                  schedule={data.todaySchedule}
                  onEditAvailability={() => navigate('/barber/availability')}
                />
                <QuickActions 
                  onAddClient={handleOpenAddClientModal}
                  onBlockTime={handleOpenBlockTimeModal}
                />
              </div>
            </div>
        </div>
      </main>

      {/* Add Client Modal */}
      <AddClientModal
        isOpen={isAddClientModalOpen}
        onClose={handleCloseAddClientModal}
        onSubmit={handleAddClient}
        isLoading={isSubmitting}
      />

      {/* Block Time Modal */}
      <BlockTimeModal
        isOpen={isBlockTimeModalOpen}
        onClose={handleCloseBlockTimeModal}
        onSubmit={handleBlockTime}
        isLoading={isSubmitting}
      />

      {/* New Appointment Modal */}
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
        message={successMessage}
      />

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isAppointmentDetailsModalOpen}
        onClose={handleCloseAppointmentDetailsModal}
        appointmentId={selectedAppointmentId}
        appointment={selectedAppointment ? {
          id: selectedAppointment.id,
          clientName: selectedAppointment.clientName,
          clientAvatar: selectedAppointment.clientAvatar,
          clientSince: selectedAppointment.clientSince,
          clientVisits: selectedAppointment.visitCount || selectedAppointment.clientVisits,
          serviceName: selectedAppointment.service || selectedAppointment.serviceName,
          barberName: selectedAppointment.barberName || (user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.name || 'Barber'),
          date: selectedAppointment.date,
          time: selectedAppointment.time,
          duration: selectedAppointment.duration,
          amount: selectedAppointment.amount,
          status: selectedAppointment.status || 'confirmed',
          barberNotes: selectedAppointment.barberNotes
        } : null}
      />
    </>
  )
}

// Default data (fallback when API is not available)
const getDefaultDashboardData = () => ({
  stats: {
    appointmentsThisWeek: 24,
    estimatedEarnings: 1250,
    averageRating: 4.9,
    totalReviews: 48,
    newClients: 8
  },
  upNext: {
    id: 'APT-001',
    clientName: 'Marcus Johnson',
    clientAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVSV886SLw3hcSlQZ227aEJWQlbM52YMr6WlaKIqi6653jLjpdvQ7Nb-xzu54l6piWbhNHJDTZN0OgJecsuM3k7BqbtzL2HJSbW99FEMxcVTmA3WunwwSa4MZSaQKgJSAfU-i5f2dDFrCYUeijwiigiOXiMm4VEa-iBmRJ4aZ5MDJ8s-ePPVpsWIYoWIQFkdc0-7JGmrR2dpemNUL0vbB8COBsKppIYmoeSOgq7qE43Qjv6fb3YM2H6oMgdAcfzyIth6V129yPHNw',
    visitCount: 15,
    service: 'Fade & Beard Trim',
    duration: '1h',
    timeUntil: '15 mins'
  },
  upcomingAppointments: [
    {
      id: 'APT-002',
      date: 'Today',
      time: '2:30 PM',
      clientName: 'David Chen',
      service: 'Classic Haircut',
      status: 'confirmed'
    },
    {
      id: 'APT-003',
      date: 'Today',
      time: '4:00 PM',
      clientName: 'Sarah Williams',
      service: 'Hair Coloring & Style',
      status: 'pending'
    },
    {
      id: 'APT-004',
      date: 'Tomorrow',
      time: '10:00 AM',
      clientName: 'Michael Ross',
      service: 'Beard Grooming',
      status: 'confirmed'
    }
  ],
  todaySchedule: {
    date: 'Oct 24, 2023',
    openSlots: 4,
    slots: [
      { time: '1:00 PM', status: 'occupied', client: null },
      { time: '2:00 PM', status: 'available', client: null },
      { time: '2:30 PM', status: 'booked', client: 'David Chen' },
      { time: '3:30 PM', status: 'available', client: null },
      { time: '4:00 PM', status: 'booked', client: 'Sarah W.' },
      { time: '5:00 PM', status: 'break', client: null }
    ]
  },
  activityHistory: [
    {
      id: 'ACT-001',
      type: 'completed',
      title: 'Finished appointment with Marcus Johnson',
      description: 'Fade & Beard Trim • 1h',
      amount: 45.00,
      date: 'Oct 23, 2:30 PM',
      status: 'completed'
    },
    {
      id: 'ACT-002',
      type: 'cancelled',
      title: 'Cancellation by Robert Fox',
      description: 'Classic Haircut • Late Cancellation',
      amount: 30.00,
      date: 'Oct 22, 11:00 AM',
      status: 'cancelled'
    },
    {
      id: 'ACT-003',
      type: 'system',
      title: 'Availability Updated',
      description: 'Modified slots for Nov 1st',
      amount: null,
      date: 'Oct 21, 9:15 AM',
      status: 'system'
    },
    {
      id: 'ACT-004',
      type: 'completed',
      title: 'Finished appointment with Sam K.',
      description: 'Hair Coloring • 2h',
      amount: 120.00,
      date: 'Oct 20, 3:00 PM',
      status: 'completed'
    }
  ]
})

export default BarberDashboard


