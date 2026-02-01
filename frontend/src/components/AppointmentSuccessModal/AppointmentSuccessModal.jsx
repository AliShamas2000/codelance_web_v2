import React from 'react'
import Modal from '../Modal/Modal'

const AppointmentSuccessModal = ({
  isOpen = false,
  onClose,
  onBackToHome,
  appointment = null,
  className = ""
}) => {
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ''
    // Handle both "09:00" and "09:00 AM" formats
    if (timeString.includes('AM') || timeString.includes('PM')) {
      return timeString
    }
    // Convert 24-hour to 12-hour
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      className={className}
    >
      <div className="flex flex-col items-center justify-center text-center mt-2">
        <div className="mb-6 relative">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center ring-8 ring-primary/5">
            <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <span className="material-symbols-outlined text-surface-dark text-3xl font-bold">check</span>
            </div>
          </div>
        </div>
        <h3 className="text-2xl font-bold leading-6 text-text-main dark:text-white mb-3">
          Appointment Confirmed!
        </h3>
        <div className="mt-2 mb-8">
          <p className="text-sm text-text-muted dark:text-gray-400 leading-relaxed">
            Thank you for booking with us. You will receive a confirmation email shortly with your appointment details.
          </p>
        </div>
        {appointment && (
          <div className="w-full bg-background-light dark:bg-black/20 rounded-xl p-4 mb-8 border border-gray-100 dark:border-white/5 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
                <span className="text-sm font-medium text-text-main dark:text-gray-200">Date</span>
              </div>
              <span className="text-sm font-bold text-text-main dark:text-white">
                {formatDate(appointment.appointment_date)}
              </span>
            </div>
            <div className="h-px w-full bg-gray-200 dark:bg-white/10"></div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">schedule</span>
                <span className="text-sm font-medium text-text-main dark:text-gray-200">Time</span>
              </div>
              <span className="text-sm font-bold text-text-main dark:text-white">
                {formatTime(appointment.appointment_time)}
              </span>
            </div>
          </div>
        )}
        <div className="w-full grid gap-3">
          <button
            onClick={onClose}
            className="w-full inline-flex justify-center items-center rounded-xl bg-primary px-3 py-3.5 text-sm font-bold text-text-main shadow-lg shadow-primary/20 hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all active:scale-[0.98]"
            type="button"
          >
            Done
          </button>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="w-full inline-flex justify-center items-center rounded-xl bg-transparent px-3 py-3.5 text-sm font-medium text-text-muted hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
              type="button"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    </Modal>
  )
}

export default AppointmentSuccessModal

