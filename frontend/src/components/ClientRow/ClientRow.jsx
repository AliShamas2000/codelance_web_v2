import React from 'react'

const ClientRow = ({
  client,
  onViewProfile,
  onMessage,
  onDelete,
  onAddNote,
  className = ""
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      active: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-300',
        dot: 'bg-green-500',
        label: 'Active'
      },
      new: {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-300',
        dot: 'bg-yellow-500',
        label: 'New'
      },
      inactive: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-300',
        dot: 'bg-red-500',
        label: 'Inactive'
      }
    }

    const config = statusConfig[status] || statusConfig.active

    return (
      <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    )
  }

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const getAvatarColor = (name) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      'bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400',
      'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <tr className={`group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors ${className}`}>
      {/* Client Name */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          {client.avatar ? (
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <img
                alt="Client"
                className="w-full h-full object-cover"
                src={client.avatar}
              />
            </div>
          ) : (
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(client.name)}`}>
              {client.initials || getInitials(client.name)}
            </div>
          )}
          <div>
            <h4 className="font-bold text-[#111816] dark:text-white group-hover:text-primary transition-colors">
              {client.name}
            </h4>
            <span className="text-xs text-gray-500">Since {client.sinceDate || 'N/A'}</span>
          </div>
        </div>
      </td>

      {/* Contact Info */}
      <td className="px-6 py-4">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-[#111816] dark:text-gray-200">
            {client.phone || 'N/A'}
          </span>
        </div>
      </td>

      {/* Total Visits */}
      <td className="px-6 py-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
          {client.totalVisits || 0} Appointments
        </span>
      </td>

      {/* Last Visit */}
      <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
        {client.lastVisit || 'N/A'}
        {client.lastVisitService && (
          <div className="text-xs text-gray-400">{client.lastVisitService}</div>
        )}
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        {getStatusBadge(client.status || 'active')}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onAddNote && onAddNote(client.id)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="Add Note"
          >
            <span className="material-symbols-outlined text-[20px]">note_add</span>
          </button>
          <button
            onClick={() => onViewProfile && onViewProfile(client.id)}
            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
            title="View Profile"
          >
            <span className="material-symbols-outlined text-[20px]">visibility</span>
          </button>
          <button
            onClick={() => onDelete && onDelete(client.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-[20px]">delete</span>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default ClientRow

