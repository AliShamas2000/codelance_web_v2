import React from 'react'

const ScheduleHeader = ({
  weekStart,
  weekEnd,
  viewType = 'week',
  onPrevious,
  onNext,
  onToday,
  onViewChange,
  onNewAppointment,
  className = ""
}) => {
  const formatDateRange = (start, end, viewType) => {
    if (viewType === 'month') {
      // For month view, show month and year
      const month = start.toLocaleDateString('en-US', { month: 'long' })
      const year = start.getFullYear()
      return `${month} ${year}`
    } else if (viewType === 'day') {
      // For day view, show full date
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      return start.toLocaleDateString('en-US', options)
    } else {
      // For week view, show date range
      const startMonth = start.toLocaleDateString('en-US', { month: 'short' })
      const startDay = start.getDate()
      const endMonth = end.toLocaleDateString('en-US', { month: 'short' })
      const endDay = end.getDate()
      const year = start.getFullYear()

      if (startMonth === endMonth) {
        return `${startMonth} ${startDay} - ${endDay}, ${year}`
      }
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`
    }
  }

  const viewTypes = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: 'day', label: 'Day' }
  ]

  return (
    <div className={`flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 flex-shrink-0 ${className}`}>
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-[#111816] dark:text-white flex items-center gap-3">
            My Schedule
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Manage your appointments and availability.
          </p>
        </div>
        <div className="hidden md:flex h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
        <div className="hidden md:flex items-center bg-white dark:bg-surface-dark rounded-lg border border-gray-200 dark:border-gray-700 p-1 shadow-sm">
          <button
            onClick={onPrevious}
            className="p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="px-3 py-1 text-sm font-semibold min-w-[140px] text-center">
            {formatDateRange(weekStart, weekEnd, viewType)}
          </span>
          <button
            onClick={onNext}
            className="p-1 hover:bg-gray-50 dark:hover:bg-gray-800 rounded text-gray-500 dark:text-gray-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
        <button
          onClick={onToday}
          className="hidden md:block text-sm font-medium text-primary hover:text-[#0fb37d] transition-colors"
        >
          Today
        </button>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-gray-800">
          {viewTypes.map((view) => (
            <button
              key={view.value}
              onClick={() => onViewChange(view.value)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                viewType === view.value
                  ? 'font-semibold bg-white dark:bg-surface-dark shadow-sm text-gray-900 dark:text-white'
                  : 'font-medium text-gray-500 dark:text-gray-400 hover:bg-white/50 dark:hover:bg-white/5'
              }`}
            >
              {view.label}
            </button>
          ))}
        </div>
        <button
          onClick={onNewAppointment}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-primary text-[#111816] text-sm font-bold shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors ml-auto md:ml-0"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span className="hidden sm:inline">New Appointment</span>
          <span className="sm:hidden">New</span>
        </button>
      </div>
    </div>
  )
}

export default ScheduleHeader


