import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'

const RejectAppointmentModal = ({
  isOpen = false,
  onClose,
  appointment = null,
  onConfirm,
  isLoading = false,
  className = ""
}) => {
  const [reason, setReason] = useState('')

  // Reset reason when modal opens/closes or appointment changes
  useEffect(() => {
    if (!isOpen) {
      setReason('')
    }
  }, [isOpen, appointment])

  if (!appointment) return null

  // Parse appointment details for display
  const clientName = appointment.clientName || 'Client'
  const clientInitials = appointment.clientInitials || clientName.charAt(0)
  const dateTime = appointment.dateTime || ''
  
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
    onConfirm && onConfirm(appointment, reason)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      className={className}
    >
      <div className="bg-white dark:bg-card-dark">
        <div className="sm:flex sm:items-start">
          {/* Icon */}
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-50 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10 ring-8 ring-red-50/50 dark:ring-red-900/10">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">gpp_maybe</span>
          </div>

          {/* Content */}
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white" id="modal-title">
              Reject Appointment
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Are you sure you want to reject this appointment? This action cannot be undone and the client will be notified.
              </p>
            </div>

            {/* Appointment Details Card */}
            <div className="mt-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700 flex items-center gap-3">
              {appointment.clientAvatar ? (
                <img
                  alt={clientName}
                  className="h-10 w-10 rounded-full object-cover shadow-sm shrink-0"
                  src={appointment.clientAvatar}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shadow-sm shrink-0">
                  {clientInitials}
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{clientName}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  <span className="material-symbols-outlined text-[14px] mr-1">calendar_today</span>
                  {displayDate && displayTime ? `${displayDate}, ${displayTime}` : dateTime}
                </div>
              </div>
            </div>

            {/* Reason Textarea */}
            <div className="mt-5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="reason">
                Reason for Rejection <span className="text-gray-400 font-normal ml-1">(Optional)</span>
              </label>
              <textarea
                id="reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="E.g., Barber is unavailable due to emergency..."
                rows="3"
                className="block w-full rounded-xl border-gray-300 dark:border-gray-600 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-500 py-3 px-3 resize-none"
              ></textarea>
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
          className="w-full inline-flex justify-center rounded-xl border border-transparent shadow-md px-4 py-2.5 bg-red-600 text-base font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isLoading ? 'Rejecting...' : 'Reject Appointment'}
        </button>
        <button
          onClick={onClose}
          disabled={isLoading}
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-xl border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2.5 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default RejectAppointmentModal



