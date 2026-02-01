import React from 'react'
import Modal from '../Modal/Modal'

const CompleteAppointmentModal = ({
  isOpen = false,
  onClose,
  appointment = null,
  onConfirm,
  isLoading = false,
  className = ""
}) => {
  if (!appointment) return null

  // Parse appointment details for display
  const clientName = appointment.clientName || 'Client'

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
      <div className="text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-green-100 dark:border-green-800">
          <span className="material-symbols-outlined text-3xl">check</span>
        </div>

        {/* Title */}
        <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Appointment Completed?
        </h4>

        {/* Message */}
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-6">
          Are you sure you want to mark the appointment for{' '}
          <span className="font-bold text-gray-900 dark:text-white">{clientName}</span> as completed? This action cannot be undone.
        </p>

        {/* Buttons */}
        <div className="flex items-center justify-center space-x-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 transition-all w-full disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            type="button"
            className="px-5 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-xl shadow-lg shadow-green-200 dark:shadow-none focus:ring-4 focus:ring-green-100 dark:focus:ring-green-900 transition-all w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm mr-2">refresh</span>
                Completing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm mr-2">check_circle</span>
                Mark Completed
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default CompleteAppointmentModal



