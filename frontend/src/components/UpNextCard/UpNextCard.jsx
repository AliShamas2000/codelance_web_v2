import React from 'react'

const UpNextCard = ({
  appointment,
  onCheckIn,
  onViewDetails,
  className = ""
}) => {
  if (!appointment) {
    return (
      <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">notifications_active</span>
            Up Next
          </h2>
        </div>
        <div className="p-6">
          <p className="text-gray-500 dark:text-gray-400 text-center">No upcoming appointments</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden ${className}`}>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">notifications_active</span>
          Up Next
        </h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
          In {appointment.timeUntil}
        </span>
      </div>
      <div className="p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary/20 flex-shrink-0 bg-primary/10 flex items-center justify-center">
          {(() => {
            // Get initials from client name
            const nameParts = (appointment.clientName || '').trim().split(' ')
            let initials = ''
            if (nameParts.length >= 2) {
              // First letter of first name + first letter of last name
              initials = (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
            } else if (nameParts.length === 1) {
              // Just first letter of the name
              initials = nameParts[0].charAt(0).toUpperCase()
            } else {
              initials = 'C'
            }
            return (
              <span className="text-2xl font-bold text-primary">{initials}</span>
            )
          })()}
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h3 className="text-xl font-bold">{appointment.clientName}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">
            Loyal Client • {appointment.visitCount}th Visit
          </p>
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              {appointment.service}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              {appointment.duration} Duration
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full sm:w-auto">
          <button
            onClick={() => onViewDetails && onViewDetails(appointment.id)}
            className="bg-transparent border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-xl transition-colors w-full"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpNextCard


