import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import barberApi from '../../api/barber'

const ViewClientHistoryModal = ({
  isOpen = false,
  onClose,
  clientId,
  client = null,
  className = ""
}) => {
  const [clientData, setClientData] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [stats, setStats] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && clientId) {
      fetchClientHistory()
    }
  }, [isOpen, clientId])

  const fetchClientHistory = async () => {
    setIsLoading(true)
    try {
      // Pass phone number as query parameter, limit to 5 appointments
      const params = {
        phone: client?.phone,
        limit: 5
      }
      const response = await barberApi.getClientHistory(clientId, params)
      // API returns {success: true, data: [...], totalSpent: ..., totalVisits: ...}
      const historyData = response.data || response.appointments || []
      const totalSpent = response.totalSpent || 0
      const totalVisits = response.totalVisits || historyData.length
      
      setClientData(client)
      setAppointments(historyData) // Already limited to 5 from backend
      setStats({
        totalVisits: totalVisits, // Total visits from all appointments
        totalSpent: totalSpent,
        averageVisit: totalVisits > 0 ? Math.round(totalSpent / totalVisits * 100) / 100 : 0
      })
    } catch (error) {
      console.error('Error fetching client history:', error)
      // Set empty data on error
      if (client) {
        setClientData(client)
        setAppointments([])
        setStats({ totalVisits: 0, totalSpent: 0, averageVisit: 0 })
      }
    } finally {
      setIsLoading(false)
    }
  }


  if (!isOpen) return null

  const displayClient = clientData || client
  const displayAppointments = appointments.length > 0 ? appointments : []
  const displayStats = stats || {
    totalVisits: 0,
    totalSpent: 0,
    averageVisit: 0
  }

  const getInitials = (name) => {
    if (!name) return '??'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name) => {
    if (!name) return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    // Handle both "M d, Y" format from backend and other formats
    if (dateString.includes(',')) {
      // Already formatted as "M d, Y" from backend
      const parts = dateString.split(',')
      if (parts.length >= 2) {
        const monthDay = parts[0].trim()
        return monthDay // Return "M d" part
      }
    }
    // Try to parse as date
    try {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }
    } catch (e) {
      // If parsing fails, return as is
    }
    return dateString
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    // Handle both "HH:MM" and "HH:MM AM/PM" formats
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString
    }
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        icon: 'check_circle',
        label: 'Done'
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        icon: 'cancel',
        label: 'Cancelled'
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        icon: 'schedule',
        label: 'Pending'
      }
    }

    const config = statusConfig[status] || statusConfig.completed

    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${config.bg} ${config.text}`}>
        <span className="material-symbols-outlined text-[14px]">{config.icon}</span>
        {config.label}
      </span>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Client History"
      titleIcon="history"
      maxWidth="max-w-5xl"
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Close
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading client history...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Client Info */}
          <div className="lg:col-span-4 space-y-6">
            {/* Client Profile Card */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center">
              <div className="relative mb-4">
                {displayClient?.avatar ? (
                  <div className="w-24 h-24 rounded-full p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                    <img
                      alt={displayClient.name}
                      className="w-full h-full object-cover rounded-full"
                      src={displayClient.avatar}
                    />
                  </div>
                ) : (
                  <div className={`w-24 h-24 rounded-full p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center ${getAvatarColor(displayClient?.name)}`}>
                    <span className="text-2xl font-bold">
                      {displayClient?.initials || getInitials(displayClient?.name)}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-surface-dark rounded-full"></div>
              </div>
              <h3 className="font-bold text-xl text-[#111816] dark:text-white">
                {displayClient?.name || 'Unknown Client'}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Client since {displayClient?.sinceDate || 'N/A'}
              </p>
            </div>

            {/* Contact Info */}
            <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h4 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Contact Info</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 group">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-[18px]">phone</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400">Phone</span>
                    <span className="text-sm font-medium text-[#111816] dark:text-gray-200">
                      {displayClient?.phone || 'N/A'}
                    </span>
                  </div>
                </li>
                {displayClient?.birthday && (
                  <li className="flex items-center gap-3 group">
                    <div className="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-500 group-hover:text-primary transition-colors">
                      <span className="material-symbols-outlined text-[18px]">cake</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400">Birthday</span>
                      <span className="text-sm font-medium text-[#111816] dark:text-gray-200">
                        {displayClient.birthday}
                      </span>
                    </div>
                  </li>
                )}
              </ul>
            </div>

          </div>

          {/* Right Column - Stats & Appointments */}
          <div className="lg:col-span-8 flex flex-col h-full">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">content_cut</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Visits</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#111816] dark:text-white">
                    {displayStats.totalVisits || 0}
                  </span>
                  <span className="text-xs text-green-500 font-medium">
                    {displayStats.visitStatus || 'Regular'}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">event_busy</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">No-Shows</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#111816] dark:text-white">
                    {displayStats.noShows || 0}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">
                    {displayStats.reliability || 'Reliable'}
                  </span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-green-50 dark:bg-green-900/20 text-green-600 rounded-lg">
                    <span className="material-symbols-outlined text-[20px]">payments</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Total Spent</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#111816] dark:text-white">
                    ${(parseFloat(displayStats.totalSpent || 0)).toFixed(2)}
                  </span>
                  <span className="text-xs text-green-500 font-medium">
                    {displayStats.valueStatus || 'High Value'}
                  </span>
                </div>
              </div>
            </div>

            {/* Appointments List */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm flex-1 overflow-hidden flex flex-col">
              <div className="p-5 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-surface-dark">
                <h3 className="font-bold text-lg text-[#111816] dark:text-white">Latest Appointments</h3>
              </div>
              <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar max-h-[500px]">
                {displayAppointments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    No appointments found
                  </div>
                ) : (
                  displayAppointments.map((appointment, index) => (
                    <div
                      key={appointment.id || index}
                      className={`group flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl border transition-all ${
                        appointment.status === 'cancelled'
                          ? 'border-red-200 dark:border-red-900 bg-white dark:bg-black/10 opacity-75 hover:opacity-100'
                          : 'border-gray-100 dark:border-gray-800 hover:border-primary/50 bg-white dark:bg-black/10 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl text-center border ${
                            appointment.status === 'cancelled'
                              ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30'
                              : 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                          }`}
                        >
                          {(() => {
                            const formattedDate = formatDate(appointment.date)
                            const dateParts = formattedDate.split(' ')
                            return (
                              <>
                                <span
                                  className={`text-[10px] font-bold uppercase tracking-wider ${
                                    appointment.status === 'cancelled'
                                      ? 'text-red-400'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {dateParts[0] || 'N/A'}
                                </span>
                                <span
                                  className={`text-xl font-bold ${
                                    appointment.status === 'cancelled'
                                      ? 'text-red-700 dark:text-red-400'
                                      : 'text-[#111816] dark:text-white'
                                  }`}
                                >
                                  {dateParts[1] || 'N/A'}
                                </span>
                              </>
                            )
                          })()}
                        </div>
                        <div>
                          <h4
                            className={`font-bold text-base ${
                              appointment.status === 'cancelled'
                                ? 'text-gray-500 dark:text-gray-400 line-through'
                                : 'text-[#111816] dark:text-white'
                            }`}
                          >
                            {appointment.serviceName || appointment.service || 'Service'}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-[14px]">schedule</span>
                              {formatTime(appointment.time)}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            <span>{appointment.duration || 'N/A'} min</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-48 pt-3 sm:pt-0 border-t sm:border-0 border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col items-end">
                          <span
                            className={`font-bold ${
                              appointment.status === 'cancelled'
                                ? 'text-gray-400'
                                : 'text-[#111816] dark:text-white'
                            }`}
                          >
                            ${(parseFloat(appointment.price || appointment.amount || 0)).toFixed(2)}
                          </span>
                          <span className="text-xs text-gray-400">
                            {appointment.paymentMethod || '-'}
                          </span>
                        </div>
                        {getStatusBadge(appointment.status || 'completed')}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  )
}

// Default data (fallback when API is not available)
const getDefaultAppointments = () => [
  {
    id: 'APT-001',
    date: '2023-10-10',
    time: '10:00',
    serviceName: 'Fade & Beard Trim',
    duration: 60,
    price: 45.00,
    paymentMethod: 'Cash',
    status: 'completed'
  },
  {
    id: 'APT-002',
    date: '2023-09-12',
    time: '14:00',
    serviceName: 'Regular Cut',
    duration: 30,
    price: 30.00,
    paymentMethod: 'Card',
    status: 'completed'
  },
  {
    id: 'APT-003',
    date: '2023-08-15',
    time: '11:30',
    serviceName: 'Fade & Beard Trim',
    duration: 60,
    price: 45.00,
    paymentMethod: 'Card',
    status: 'completed'
  },
  {
    id: 'APT-004',
    date: '2023-07-20',
    time: '16:00',
    serviceName: 'Haircut & Hot Towel',
    duration: 45,
    price: 40.00,
    paymentMethod: 'Card',
    status: 'cancelled'
  }
]

const getDefaultStats = () => ({
  totalVisits: 15,
  visitStatus: 'Regular',
  noShows: 0,
  reliability: 'Reliable',
  totalSpent: 650,
  valueStatus: 'High Value'
})

export default ViewClientHistoryModal

