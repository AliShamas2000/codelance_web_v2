import React from 'react'

const AppointmentBlock = ({
  appointment,
  top,
  height,
  onClick,
  className = ""
}) => {
  const getStatusConfig = () => {
    if (appointment.type === 'walkin') {
      return {
        bg: 'bg-yellow-50 dark:bg-yellow-900/10',
        border: 'border-yellow-400 border-dashed',
        text: 'text-yellow-700 dark:text-yellow-500',
        icon: 'pending',
        iconColor: 'text-yellow-600'
      }
    }

    if (appointment.status === 'confirmed') {
      if (appointment.isVip) {
        return {
          bg: 'bg-purple-50 dark:bg-purple-900/20',
          border: 'border-purple-500',
          text: 'text-purple-700 dark:text-purple-300',
          icon: 'star',
          iconColor: 'text-purple-600'
        }
      }
      return {
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-500',
        text: 'text-green-700 dark:text-green-300',
        icon: 'check_circle',
        iconColor: 'text-green-600'
      }
    }

    if (appointment.status === 'pending') {
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-500',
        text: 'text-blue-700 dark:text-blue-300',
        icon: 'schedule',
        iconColor: 'text-blue-600'
      }
    }

    return {
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-300',
      text: 'text-gray-700 dark:text-gray-300',
      icon: 'event',
      iconColor: 'text-gray-600'
    }
  }

  const formatTime = (time) => {
    const [hour, minute] = time.split(':')
    const h = parseInt(hour)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const displayHour = h > 12 ? h - 12 : h === 0 ? 12 : h
    return `${displayHour}:${minute} ${ampm}`
  }

  const statusConfig = getStatusConfig()

  return (
    <div
      className={`absolute left-1 right-1 rounded-lg ${statusConfig.bg} border-l-4 ${statusConfig.border} p-2 cursor-pointer hover:shadow-md transition-all z-10 ${className}`}
      style={{ top: `${top}px`, height: `${height}px` }}
      onClick={onClick}
    >
      <div className="flex justify-between items-start h-full">
        <div className="flex-grow min-w-0">
          <span className={`text-xs font-bold ${statusConfig.text} block`}>
            {formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}
          </span>
          <h4 className="text-sm font-bold text-[#111816] dark:text-white mt-1 truncate">
            {appointment.clientName}
          </h4>
          {appointment.service && (
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {appointment.service}
            </p>
          )}
        </div>
        <span className={`material-symbols-outlined text-[14px] ${statusConfig.iconColor} flex-shrink-0 ml-1`}>
          {statusConfig.icon}
        </span>
      </div>
    </div>
  )
}

export default AppointmentBlock


