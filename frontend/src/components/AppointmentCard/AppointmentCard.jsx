import React from 'react'

const AppointmentCard = ({
  id,
  clientName,
  clientInitials,
  clientAvatar,
  clientType = "New Client", // New Client, Regular, VIP Client, Returning
  service,
  barberName,
  dateTime,
  notes,
  status = "pending", // pending, accepted, rejected, completed, cancelled
  isVIP = false,
  isPast = false,
  phone,
  email,
  serviceIds, // Array of service IDs for edit modal
  services, // Array of service objects for edit modal
  date, // Date in YYYY-MM-DD format for edit modal
  time, // Time in HH:MM format for edit modal
  barberId, // Barber ID for edit modal
  onAccept,
  onReject,
  onEdit,
  onComplete,
  onViewDetails,
  className = ""
}) => {
  const statusConfig = {
    pending: {
      bg: "bg-yellow-100 dark:bg-yellow-900/40",
      text: "text-yellow-800 dark:text-yellow-300",
      border: "border-yellow-200 dark:border-yellow-800",
      dot: "bg-yellow-500",
      label: "Pending"
    },
    accepted: {
      bg: "bg-blue-100 dark:bg-blue-900/40",
      text: "text-blue-800 dark:text-blue-300",
      border: "border-blue-200 dark:border-blue-800",
      dot: "bg-blue-500",
      label: "Accepted"
    },
    rejected: {
      bg: "bg-red-100 dark:bg-red-900/40",
      text: "text-red-800 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      dot: "bg-red-500",
      label: "Rejected"
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900/40",
      text: "text-green-800 dark:text-green-300",
      border: "border-green-200 dark:border-green-800",
      dot: "bg-green-500",
      label: "Completed"
    },
    cancelled: {
      bg: "bg-red-100 dark:bg-red-900/40",
      text: "text-red-800 dark:text-red-300",
      border: "border-red-200 dark:border-red-800",
      dot: "bg-red-500",
      label: "Cancelled"
    }
  }

  const statusStyle = statusConfig[status] || statusConfig.pending

  const getClientTypeColor = () => {
    switch (clientType) {
      case "VIP Client":
        return "bg-orange-100 text-orange-600"
      case "Regular":
        return "bg-blue-100 text-blue-600"
      case "Returning":
        return "bg-gray-200 text-gray-600"
      default:
        return "bg-purple-100 text-purple-600"
    }
  }

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-5 flex flex-col justify-between group hover:shadow-lg transition-all duration-200 relative overflow-hidden ${isPast ? 'opacity-75 hover:opacity-100' : ''} ${className}`}>
      {/* VIP Badge */}
      {isVIP && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rotate-45 bg-yellow-400 text-white text-[10px] font-bold py-1 w-24 text-center shadow-sm">
            VIP
          </div>
        </div>
      )}

      {/* Client Info */}
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            {clientAvatar ? (
              <img
                alt={clientName}
                className="h-10 w-10 rounded-full border border-gray-200 dark:border-gray-600 object-cover shadow-sm"
                src={clientAvatar}
              />
            ) : (
              <div className={`h-10 w-10 rounded-full ${getClientTypeColor()} flex items-center justify-center text-sm font-bold shadow-sm`}>
                {clientInitials || clientName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-gray-900 dark:text-white text-base">{clientName}</h3>
              <p className="text-xs text-gray-500">{clientType}</p>
            </div>
          </div>
          {/* Notes Tooltip */}
          <div className="relative group/tooltip">
            <span className={`material-symbols-outlined ${notes ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-300'} cursor-${notes ? 'help' : 'not-allowed'} text-lg`}>
              sticky_note_2
            </span>
            {notes && (
              <div className="absolute bottom-full right-0 mb-2 w-48 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50 text-center shadow-lg pointer-events-none">
                {notes}
                <div className="absolute top-full right-2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        </div>

        {/* Service & Details */}
        <div className="mb-4">
          <span className="inline-block bg-gray-100 dark:bg-gray-700 px-2.5 py-1 rounded-md text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {service}
          </span>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-1">
            <span className="material-symbols-outlined text-sm mr-2 text-gray-400">person</span>
            Barber: <span className="font-medium ml-1 text-gray-900 dark:text-gray-200">{barberName}</span>
          </div>
          <div className={`flex items-center text-sm ${isPast ? 'text-gray-500 dark:text-gray-500 line-through decoration-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
            <span className="material-symbols-outlined text-sm mr-2 text-gray-400">schedule</span>
            <span className="font-medium">{dateTime}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-medium text-gray-400">#{id}</span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border}`}>
            <span className={`w-1.5 h-1.5 mr-1.5 ${statusStyle.dot} rounded-full`}></span>
            {statusStyle.label}
          </span>
        </div>

        {/* Action Buttons */}
        {status === "pending" && (
          <div className="grid grid-cols-3 gap-2">
            {onAccept && (
              <button
                onClick={() => onAccept({ id, clientName, service, barberName, dateTime })}
                className="col-span-1 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/40 transition-colors flex items-center justify-center"
                title="Accept"
              >
                <span className="material-symbols-outlined text-lg">check</span>
              </button>
            )}
            {onReject && (
              <button
                onClick={() => onReject({ id, clientName, service, barberName, dateTime })}
                className="col-span-1 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center"
                title="Reject"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit({ id, clientName, clientInitials, clientAvatar, clientType, service, barberName, dateTime, notes, status, isVIP, isPast, phone, email, serviceIds, services, date, time, barberId })}
                className="col-span-1 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 transition-colors flex items-center justify-center"
                title="Edit"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            )}
          </div>
        )}

        {status === "accepted" && (
          <div className="grid grid-cols-3 gap-2">
            {onComplete && (
              <button
                onClick={() => onComplete({ id, clientName, service, barberName, dateTime })}
                className="col-span-2 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors flex items-center justify-center font-medium text-xs"
                title="Mark Complete"
              >
                <span className="material-symbols-outlined text-base mr-1">check_circle</span> Complete
              </button>
            )}
            {onEdit && (
              <button
                onClick={() => onEdit({ id, clientName, clientInitials, clientAvatar, clientType, service, barberName, dateTime, notes, status, isVIP, isPast, phone, email, serviceIds, services, date, time, barberId })}
                className="col-span-1 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 transition-colors flex items-center justify-center"
                title="Edit"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
              </button>
            )}
          </div>
        )}

        {status === "completed" && (
          <div className="grid grid-cols-1 gap-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails({ id, clientName, clientInitials, clientAvatar, clientType, service, barberName, dateTime, notes, status, isVIP, isPast, phone, email })}
                className="w-full py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 transition-colors flex items-center justify-center text-xs font-medium"
                title="View Details"
              >
                <span className="material-symbols-outlined text-base mr-2">visibility</span> View Details
              </button>
            )}
          </div>
        )}

        {status === "cancelled" && (
          <div className="grid grid-cols-1 gap-2">
            {onViewDetails && (
              <button
                onClick={() => onViewDetails({ id, clientName, clientInitials, clientAvatar, clientType, service, barberName, dateTime, notes, status, isVIP, isPast, phone, email })}
                className="w-full py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 transition-colors flex items-center justify-center text-xs font-medium"
                title="View Details"
              >
                <span className="material-symbols-outlined text-base mr-2">visibility</span> View Details
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard

