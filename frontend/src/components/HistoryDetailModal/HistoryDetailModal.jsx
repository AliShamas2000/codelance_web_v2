import React from 'react'
import Modal from '../Modal/Modal'

const HistoryDetailModal = ({
  isOpen = false,
  onClose,
  activity = null,
  className = ""
}) => {
  if (!isOpen || !activity) return null

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString, endTime) => {
    if (!timeString) return 'N/A'
    if (endTime) {
      return `${formatTimeOnly(timeString)} - ${formatTimeOnly(endTime)}`
    }
    return formatTimeOnly(timeString)
  }

  const formatTimeOnly = (timeString) => {
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

  const getStatusIcon = (status) => {
    if (status === 'completed') return 'check'
    if (status === 'cancelled') return 'close'
    return 'info'
  }

  const getStatusColor = (status) => {
    if (status === 'completed') return 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400'
    if (status === 'cancelled') return 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400'
    return 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
  }

  // Only show detail modal for appointments
  if (activity.type !== 'appointment') {
    return null
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Appointment Details"
      maxWidth="max-w-lg"
      footer={
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
          >
            Report Issue
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-[#111816] shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors"
          >
            View Receipt
          </button>
        </div>
      }
    >
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 -mx-6 -mt-6 mb-6 flex justify-between items-center bg-gray-50 dark:bg-black/20">
        <div className="flex items-center gap-3">
          <span className={`${getStatusColor(activity.status)} p-1.5 rounded-lg`}>
            <span className="material-symbols-outlined text-[20px]">{getStatusIcon(activity.status)}</span>
          </span>
          <div>
            <h3 className="text-lg font-bold text-[#111816] dark:text-white leading-tight">Appointment Details</h3>
            <span className="text-xs text-gray-500 uppercase tracking-wide">Ref: #{activity.id || 'N/A'}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6 -mx-6 -mb-6">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm flex-shrink-0">
            {activity.clientAvatar ? (
              <img
                alt="Client"
                className="w-full h-full object-cover"
                src={activity.clientAvatar}
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">
                  {activity.clientName ? activity.clientName.charAt(0).toUpperCase() : '?'}
                </span>
              </div>
            )}
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#111816] dark:text-white">
              {activity.clientName || 'Unknown Client'}
            </h4>
            <div className="flex gap-2 mt-1">
              {activity.clientRating && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  <span className="material-symbols-outlined text-[14px]">star</span>
                  {activity.clientRating}
                </span>
              )}
              {activity.clientVisits && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                  {activity.clientVisits} Visits
                </span>
              )}
            </div>
            {activity.clientPhone && (
              <div className="flex gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                <a
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                  href={`tel:${activity.clientPhone}`}
                >
                  <span className="material-symbols-outlined text-[16px]">call</span>
                  {activity.clientPhone}
                </a>
              </div>
            )}
          </div>
        </div>

        <hr className="border-gray-100 dark:border-gray-800 border-dashed" />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Service</p>
            <p className="font-medium text-[#111816] dark:text-white">
              {activity.serviceName || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Duration</p>
            <p className="font-medium text-[#111816] dark:text-white">
              {activity.duration || 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Date</p>
            <p className="font-medium text-[#111816] dark:text-white">
              {formatDate(activity.date)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-1">Time</p>
            <p className="font-medium text-[#111816] dark:text-white">
              {formatTime(activity.time, activity.endTime)}
            </p>
          </div>
        </div>

        {activity.amount !== null && activity.amount !== undefined && (
          <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">Service Cost</span>
              <span className="text-sm font-medium text-[#111816] dark:text-white">
                ${activity.amount.toFixed(2)}
              </span>
            </div>
            {activity.tax && (
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600 dark:text-gray-300">Tax</span>
                <span className="text-sm font-medium text-[#111816] dark:text-white">
                  ${activity.tax.toFixed(2)}
                </span>
              </div>
            )}
            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
            <div className="flex justify-between items-center">
              <span className="text-base font-bold text-[#111816] dark:text-white">Total Paid</span>
              <span className="text-xl font-bold text-primary">
                ${((activity.amount || 0) + (activity.tax || 0)).toFixed(2)}
              </span>
            </div>
          </div>
        )}

        {activity.notes && (
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold mb-2">Notes</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              "{activity.notes}"
            </p>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default HistoryDetailModal


