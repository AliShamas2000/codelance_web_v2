import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppointmentDetailsModal from '../AppointmentDetailsModal/AppointmentDetailsModal'

const ActivityHistory = ({
  activities = [],
  onViewAll,
  className = ""
}) => {
  const navigate = useNavigate()
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll()
    } else {
      navigate('/barber/history')
    }
  }

  const handleActivityClick = (activity) => {
    // Only open modal for appointment activities
    if (activity.type === 'appointment' && activity.appointmentId) {
      setSelectedActivity(activity)
      setIsDetailsModalOpen(true)
    }
  }

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setSelectedActivity(null)
  }
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const getActivityIcon = (type) => {
    const iconConfig = {
      completed: {
        icon: 'check',
        bg: 'bg-green-50 dark:bg-green-900/20',
        color: 'text-green-600'
      },
      cancelled: {
        icon: 'close',
        bg: 'bg-red-50 dark:bg-red-900/20',
        color: 'text-red-500'
      },
      system: {
        icon: 'edit_calendar',
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        color: 'text-blue-600'
      }
    }

    const config = iconConfig[type] || iconConfig.completed
    return (
      <div className={`w-10 h-10 rounded-full ${config.bg} ${config.color} flex items-center justify-center`}>
        <span className="material-symbols-outlined text-[20px]">{config.icon}</span>
      </div>
    )
  }

  const filteredActivities = activities.filter(activity => {
    const matchesFilter = filter === 'all' || activity.status === filter
    const matchesSearch = searchQuery === '' || 
      activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-lg font-bold">History & Activity</h2>
        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <span className="material-symbols-outlined text-[18px]">search</span>
            </span>
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs rounded-lg bg-gray-50 dark:bg-gray-800 border-none focus:ring-1 focus:ring-primary w-32 sm:w-40 text-gray-600 dark:text-gray-300 placeholder-gray-400"
            />
          </div>
          <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-white dark:bg-surface-dark shadow-sm text-primary'
                  : 'font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filter === 'completed'
                  ? 'bg-white dark:bg-surface-dark shadow-sm text-primary font-semibold'
                  : 'font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
              }`}
            >
              Done
            </button>
          </div>
        </div>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {filteredActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No activities found
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              onClick={() => handleActivityClick(activity)}
              className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors flex flex-col sm:flex-row gap-4 items-start sm:items-center group cursor-pointer"
            >
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-bold text-[#111816] dark:text-white truncate">
                      {activity.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {activity.description}
                    </p>
                  </div>
                  {activity.amount !== null && (
                    <span className="text-sm font-bold text-[#111816] dark:text-white sm:hidden">
                      {activity.status === 'cancelled' ? (
                        <span className="line-through text-gray-400">${activity.amount.toFixed(2)}</span>
                      ) : (
                        `$${activity.amount.toFixed(2)}`
                      )}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                    {activity.date}
                  </span>
                </div>
              </div>
              <div className="hidden sm:block text-right flex-shrink-0">
                {activity.amount !== null ? (
                  <>
                    <span className={`block text-sm font-bold ${
                      activity.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-[#111816] dark:text-white'
                    }`}>
                      ${activity.amount.toFixed(2)}
                    </span>
                    <span className={`block text-xs font-medium mt-0.5 ${
                      activity.status === 'completed' ? 'text-green-600' :
                      activity.status === 'cancelled' ? 'text-red-500' : 'text-gray-500'
                    }`}>
                      {activity.status === 'completed' ? 'Completed' :
                       activity.status === 'cancelled' ? 'Cancelled' : 'System'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="block text-sm font-bold text-[#111816] dark:text-white">-</span>
                    <span className="block text-xs text-gray-500 font-medium mt-0.5">System</span>
                  </>
                )}
              </div>
              <button className="p-2 text-gray-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100 hidden sm:block">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          ))
        )}
      </div>
      {filteredActivities.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <button
            onClick={handleViewAll}
            className="text-sm font-semibold text-primary hover:text-[#0fb37d] transition-colors"
          >
            View All History
          </button>
        </div>
      )}

      {/* Appointment Details Modal */}
      <AppointmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        appointmentId={selectedActivity?.appointmentId}
        appointment={selectedActivity?.type === 'appointment' ? {
          id: selectedActivity.appointmentId || selectedActivity.id,
          clientName: selectedActivity.clientName,
          clientAvatar: selectedActivity.clientAvatar,
          clientSince: selectedActivity.clientSince,
          clientVisits: selectedActivity.clientVisits,
          serviceName: selectedActivity.serviceName,
          barberName: selectedActivity.barberName,
          date: selectedActivity.date,
          time: selectedActivity.time,
          duration: selectedActivity.duration,
          amount: selectedActivity.amount,
          status: selectedActivity.status,
          barberNotes: selectedActivity.barberNotes
        } : null}
      />
    </div>
  )
}

export default ActivityHistory
