import React from 'react'

const AppointmentTable = ({
  appointments = [],
  onViewAll,
  onActionClick,
  className = ""
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      accepted: {
        bg: "bg-green-100 dark:bg-green-900",
        text: "text-green-800 dark:text-green-300",
        label: "Accepted"
      },
      pending: {
        bg: "bg-yellow-100 dark:bg-yellow-900",
        text: "text-yellow-800 dark:text-yellow-300",
        label: "Pending"
      },
      rejected: {
        bg: "bg-red-100 dark:bg-red-900",
        text: "text-red-800 dark:text-red-300",
        label: "Rejected"
      },
      completed: {
        bg: "bg-blue-100 dark:bg-blue-900",
        text: "text-blue-800 dark:text-blue-300",
        label: "Completed"
      }
    }

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending

    return (
      <span className={`${config.bg} ${config.text} text-xs font-medium px-2.5 py-0.5 rounded`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Today's Appointments</h2>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-gray-900 dark:text-blue-400 font-medium hover:underline"
          >
            View All Appointments
          </button>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50/50 dark:bg-gray-800/50 dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-bold" scope="col">ID</th>
              <th className="px-6 py-4 font-bold" scope="col">Client Name</th>
              <th className="px-6 py-4 font-bold" scope="col">Date/Time</th>
              <th className="px-6 py-4 font-bold" scope="col">Service</th>
              <th className="px-6 py-4 font-bold" scope="col">Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  No appointments found
                </td>
              </tr>
            ) : (
              appointments.map((appointment, index) => (
                <tr
                  key={appointment.id || index}
                  className="bg-white dark:bg-card-dark border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                    {appointment.id}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {appointment.clientName}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {appointment.dateTime}
                  </td>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                    {appointment.service}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(appointment.status)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AppointmentTable

