import React from 'react'
import Modal from '../Modal/Modal'

const AcceptAppointmentModal = ({
  isOpen = false,
  onClose,
  appointment = null,
  onConfirm,
  isLoading = false,
  className = ""
}) => {
  if (!appointment) return null

  // Parse appointment details for display
  const clientName = appointment.clientName || appointment.full_name || 'Client'
  const service = appointment.service || 'Service'
  const dateTime = appointment.dateTime || ''
  const phone = appointment.phone || ''
  const email = appointment.email || ''
  
  // Extract date and time from dateTime string
  let displayDate = ''
  let displayTime = ''
  
  if (dateTime) {
    // Handle formats like "Dec 24, 10:00 AM" or "2025-12-24, 10:00"
    const parts = dateTime.split(',')
    if (parts.length >= 2) {
      displayDate = parts[0].trim()
      displayTime = parts[1].trim()
    } else {
      displayDate = dateTime
    }
  }

  const handleConfirm = () => {
    onConfirm && onConfirm(appointment)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      className={className}
    >
      <div className=" bg-white dark:bg-gray-800">
        <div className="sm:flex sm:items-start">
          {/* Icon */}
          <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full sm:mx-0 sm:h-10 sm:w-10">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400">check</span>
          </div>

          {/* Content */}
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white" id="modal-title">
              Accept Appointment
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to accept this appointment?
              </p>
              
              {/* Appointment Details */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-2">
                <div className="flex items-start">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Client:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white flex-1">{clientName}</span>
                </div>
                {service && (
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Service:</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{service}</span>
                  </div>
                )}
                {displayDate && (
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Date:</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{displayDate}</span>
                  </div>
                )}
                {displayTime && (
                  <div className="flex items-start">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-20">Time:</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300 flex-1">{displayTime}</span>
                  </div>
                )}
              </div>
              
              <p className="mt-3 text-xs text-gray-400">
                This action will confirm the slot and change the status to "Accepted".
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-5 sm:flex sm:flex-row-reverse">
        <button
          onClick={handleConfirm}
          disabled={isLoading}
          type="button"
          className="inline-flex justify-center w-full px-4 py-2 text-base font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Accepting...' : 'Confirm Accept'}
        </button>
        <button
          onClick={onClose}
          disabled={isLoading}
          type="button"
          className="mt-3 inline-flex justify-center w-full px-4 py-2 text-base font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default AcceptAppointmentModal



