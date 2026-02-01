import React from 'react'
import { useNavigate } from 'react-router-dom'

const AppointmentsList = ({
  appointments = [],
  onViewDetails,
  className = ""
}) => {
  const navigate = useNavigate()

  const getStatusBadge = (status) => {
    const statusConfig = {
      confirmed: {
        bg: 'bg-green-100 dark:bg-green-900',
        text: 'text-green-800 dark:text-green-300',
        dot: 'bg-green-500',
        label: 'Confirmed'
      },
      pending: {
        bg: 'bg-yellow-100 dark:bg-yellow-900',
        text: 'text-yellow-800 dark:text-yellow-300',
        dot: 'bg-yellow-500',
        label: 'Pending'
      },
      cancelled: {
        bg: 'bg-red-100 dark:bg-red-900',
        text: 'text-red-800 dark:text-red-300',
        dot: 'bg-red-500',
        label: 'Cancelled'
      }
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span className={`inline-flex items-center gap-1.5 py-1 px-2 rounded text-xs font-medium ${config.bg} ${config.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
        {config.label}
      </span>
    )
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}>
      <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
        <h2 className="text-lg font-bold">My Upcoming Appointments</h2>
        <button
          onClick={() => navigate('/barber/schedule')}
          className="text-sm text-primary hover:underline font-medium"
        >
          View Calendar
        </button>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {appointments.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            No upcoming appointments
          </div>
        ) : (
          appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
            >
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-100 dark:bg-gray-800 rounded-xl flex-shrink-0">
                  <span className="text-xs font-bold text-gray-500 uppercase">{appointment.date}</span>
                  <span className="text-lg font-bold text-[#111816] dark:text-white">
                    {appointment.time.split(' ')[0]}
                  </span>
                  <span className="text-xs font-medium text-gray-400">
                    {appointment.time.split(' ')[1]}
                  </span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-[#111816] dark:text-white group-hover:text-primary transition-colors">
                    {appointment.clientName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{appointment.service}</p>
                </div>
                <div className="hidden sm:block text-right">
                  {getStatusBadge(appointment.status)}
                </div>
                <button
                  onClick={() => onViewDetails && onViewDetails(appointment.id)}
                  className="p-2 text-gray-400 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {appointments.length > 0 && (
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center">
          <button
            onClick={() => navigate('/barber/schedule')}
            className="text-sm font-semibold text-primary hover:text-[#0fb37d] transition-colors"
          >
            View All Appointments
          </button>
        </div>
      )}
    </div>
  )
}

export default AppointmentsList


