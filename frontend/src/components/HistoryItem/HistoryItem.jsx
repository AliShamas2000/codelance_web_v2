import React from 'react'

const HistoryItem = ({
  activity,
  onClick,
  className = ""
}) => {
  const getIconColor = (color) => {
    const colors = {
      green: 'bg-green-50 dark:bg-green-900/20 text-green-600',
      red: 'bg-red-50 dark:bg-red-900/20 text-red-500',
      blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
      yellow: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600'
    }
    return colors[color] || colors.green
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        bg: 'bg-green-50 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        label: 'Completed'
      },
      cancelled: {
        bg: 'bg-red-50 dark:bg-red-900/30',
        text: 'text-red-600 dark:text-red-400',
        label: 'Cancelled'
      },
      system: {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-600 dark:text-gray-300',
        label: 'System'
      }
    }

    const config = statusConfig[status] || statusConfig.completed

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${config.bg} ${config.text} text-[10px] font-semibold uppercase tracking-wide`}>
        {config.label}
      </span>
    )
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

  const formatTime = (timeString, endTime) => {
    if (!timeString) return 'N/A'
    if (endTime) {
      return `${formatTimeOnly(timeString)} - ${formatTimeOnly(endTime)}`
    }
    return formatTimeOnly(timeString)
  }

  const formatTimeOnly = (timeString) => {
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

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined) return '-'
    return `$${amount.toFixed(2)}`
  }

  return (
    <div
      onClick={onClick}
      className={`p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full ${getIconColor(activity.iconColor || 'green')} flex items-center justify-center ring-4 ring-white dark:ring-surface-dark shadow-sm`}>
            <span className="material-symbols-outlined text-[24px]">{activity.icon || 'check'}</span>
          </div>
        </div>
        <div className="flex-grow min-w-0 grid grid-cols-1 sm:grid-cols-12 gap-4 w-full">
          <div className="sm:col-span-5">
            <p className="text-sm font-bold text-[#111816] dark:text-white truncate group-hover:text-primary transition-colors">
              {activity.clientName || activity.title || 'Unknown'}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">
                {activity.type === 'system' ? 'info' : 'content_cut'}
              </span>
              {activity.serviceName || activity.description || 'N/A'}
            </p>
          </div>
          <div className="sm:col-span-4 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              {formatDate(activity.date)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              {formatTime(activity.time, activity.endTime)}
            </div>
          </div>
          <div className="sm:col-span-3 text-left sm:text-right flex flex-row sm:flex-col justify-between items-center sm:items-end sm:justify-center">
            <span className={`block text-sm font-bold ${activity.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-[#111816] dark:text-white'}`}>
              {formatAmount(activity.amount)}
            </span>
            {getStatusBadge(activity.status || 'completed')}
          </div>
        </div>
        <div className="flex-shrink-0 hidden sm:block text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
          <span className="material-symbols-outlined">chevron_right</span>
        </div>
      </div>
    </div>
  )
}

export default HistoryItem


