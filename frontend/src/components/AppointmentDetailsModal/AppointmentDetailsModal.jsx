import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import barberApi from '../../api/barber'

const AppointmentDetailsModal = ({
  isOpen = false,
  onClose,
  appointmentId = null,
  appointment = null,
  className = ""
}) => {
  const [appointmentData, setAppointmentData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (isOpen && appointmentId && !appointment) {
      fetchAppointmentDetails()
    } else if (isOpen && appointment) {
      setAppointmentData(appointment)
    }
  }, [isOpen, appointmentId, appointment])

  const fetchAppointmentDetails = async () => {
    setIsLoading(true)
    try {
      const data = await barberApi.getAppointmentDetails(appointmentId)
      setAppointmentData(data)
    } catch (error) {
      console.error('Error fetching appointment details:', error)
      // Use provided appointment or default data
      setAppointmentData(appointment || getDefaultAppointment())
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A'
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString
    }
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  const formatDateTime = (dateString, timeString) => {
    const date = formatDate(dateString)
    const time = formatTime(timeString)
    return `${date} at ${time}`
  }

  const formatDuration = (duration) => {
    if (!duration) return 'N/A'
    if (typeof duration === 'number') {
      const hours = Math.floor(duration / 60)
      const minutes = duration % 60
      if (hours > 0 && minutes > 0) {
        return `${hours}h ${minutes}m`
      } else if (hours > 0) {
        return `${hours}h`
      } else {
        return `${minutes}m`
      }
    }
    return duration
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: 'bg-green-100 dark:bg-green-900/40',
        text: 'text-green-800 dark:text-green-300',
        dot: 'bg-green-500',
        label: 'Completed'
      },
      confirmed: {
        bg: 'bg-green-100 dark:bg-green-900/40',
        text: 'text-green-800 dark:text-green-300',
        dot: 'bg-green-500',
        label: 'Confirmed'
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/40',
        text: 'text-yellow-800 dark:text-yellow-300',
        dot: 'bg-yellow-500',
        label: 'Pending'
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900/40',
        text: 'text-red-800 dark:text-red-300',
        dot: 'bg-red-500',
        label: 'Cancelled'
      }
    }

    const config = statusConfig[status] || statusConfig.completed

    return (
      <span className={`inline-flex items-center gap-1.5 py-1 px-2.5 rounded-lg text-xs font-semibold ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    )
  }

  const getStatusIcon = (status) => {
    if (status === 'completed' || status === 'confirmed') return 'check_circle'
    if (status === 'cancelled') return 'cancel'
    return 'schedule'
  }

  const getStatusIconColor = (status) => {
    if (status === 'completed' || status === 'confirmed') return 'text-green-600'
    if (status === 'cancelled') return 'text-red-600'
    return 'text-yellow-600'
  }

  if (!isOpen) return null

  const displayAppointment = appointmentData || appointment || getDefaultAppointment()

  const statusIcon = getStatusIcon(displayAppointment.status)
  const statusIconColor = getStatusIconColor(displayAppointment.status)

  return (
      <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      titleIcon={statusIcon}
      maxWidth="max-w-lg"
      customHeader={
        <div className="pt-10 pr-10 pl-10 border-b border-gray-100 dark:border-gray-700 px-6 py-4 flex justify-between items-center bg-gray-50/50 dark:bg-white/5 -mx-6 -mt-6 mb-0">
          <h3 className="text-lg font-bold text-[#111816] dark:text-white flex items-center gap-2">
            <span className={`material-symbols-outlined ${statusIconColor}`}>{statusIcon}</span>
            Appointment Details
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg p-1 hover:bg-gray-100 dark:hover:bg-white/10"
              type="button"
              aria-label="Close modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          )}
        </div>
      }
      footer={
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-primary hover:bg-[#0fb37d] text-[#111816] text-sm font-bold shadow-lg shadow-primary/20 transition-colors"
          >
            Close Details
          </button>
        </div>
      }
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading appointment details...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 -mx-6 px-6">
          {/* Client Info */}
          <div className="flex items-center gap-4 bg-gray-50 dark:bg-black/20 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden border border-gray-300 dark:border-gray-600 flex-shrink-0">
              {displayAppointment.clientAvatar ? (
                <img
                  alt="Client"
                  className="h-full w-full object-cover"
                  src={displayAppointment.clientAvatar}
                />
              ) : (
                <div className="h-full w-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-400">
                    {displayAppointment.clientName ? displayAppointment.clientName.charAt(0).toUpperCase() : '?'}
                  </span>
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-base text-[#111816] dark:text-white">
                {displayAppointment.clientName || 'Unknown Client'}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Client since {displayAppointment.clientSince || 'N/A'} • {displayAppointment.clientVisits || 0} visits
              </p>
            </div>
            <div className="ml-auto">
              {getStatusBadge(displayAppointment.status || 'completed')}
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-4">
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Service</p>
              <p className="text-sm font-semibold text-[#111816] dark:text-white">
                {displayAppointment.serviceName || displayAppointment.service || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Barber</p>
              <p className="text-sm font-semibold text-[#111816] dark:text-white">
                {displayAppointment.barberName || displayAppointment.barber || 'N/A'}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Date & Time</p>
              <p className="text-sm font-semibold text-[#111816] dark:text-white">
                {formatDateTime(displayAppointment.date, displayAppointment.time)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</p>
              <p className="text-sm font-semibold text-[#111816] dark:text-white">
                {formatDuration(displayAppointment.duration)}
              </p>
            </div>
            {displayAppointment.amount !== null && displayAppointment.amount !== undefined && (
              <div className="col-span-2 space-y-1 pt-2 border-t border-gray-100 dark:border-gray-800 mt-2">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mt-2">Payment</p>
                <div className="flex justify-between items-center">
                  <p className="text-sm font-semibold text-[#111816] dark:text-white">Total Paid</p>
                  <p className="text-lg font-bold text-[#111816] dark:text-white">
                    ${displayAppointment.amount.toFixed(2)}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Barber Notes */}
          {displayAppointment.barberNotes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 p-4 rounded-xl border border-yellow-100 dark:border-yellow-900/20">
              <div className="flex gap-2 items-start">
                <span className="material-symbols-outlined text-yellow-600 text-[18px] mt-0.5">sticky_note_2</span>
                <div>
                  <p className="text-xs font-bold text-yellow-800 dark:text-yellow-500 mb-1">Barber Notes</p>
                  <p className="text-sm text-yellow-900/80 dark:text-yellow-200/80 leading-relaxed">
                    {displayAppointment.barberNotes}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}

// Default data (fallback when API is not available)
const getDefaultAppointment = () => ({
  id: 'APT-001',
  clientName: 'Marcus Johnson',
  clientAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDVSV886SLw3hcSlQZ227aEJWQlbM52YMr6WlaKIqi6653jLjpdvQ7Nb-xzu54l6piWbhNHJDTZN0OgJecsuM3k7BqbtzL2HJSbW99FEMxcVTmA3WunwwSa4MZSaQKgJSAfU-i5f2dDFrCYUeijwiigiOXiMm4VEa-iBmRJ4aZ5MDJ8s-ePPVpsWIYoWIQFkdc0-7JGmrR2dpemNUL0vbB8COBsKppIYmoeSOgq7qE43Qjv6fb3YM2H6oMgdAcfzyIth6V129yPHNw',
  clientSince: '2021',
  clientVisits: 15,
  serviceName: 'Fade & Beard Trim',
  barberName: 'Alex Sterling',
  date: '2023-10-23',
  time: '14:30',
  duration: 60,
  amount: 45.00,
  status: 'completed',
  barberNotes: 'Client prefers a slightly longer length on top this time. Used guard #2 on sides.'
})

export default AppointmentDetailsModal
