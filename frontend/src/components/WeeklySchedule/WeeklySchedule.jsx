import React from 'react'
import DayScheduleRow from '../DayScheduleRow/DayScheduleRow'

const WeeklySchedule = ({
  availability,
  onChange,
  className = ""
}) => {
  const handleDayChange = (dayIndex, updatedDay) => {
    const updatedAvailability = {
      ...availability,
      days: availability.days.map((day, index) =>
        index === dayIndex ? updatedDay : day
      )
    }
    if (onChange) {
      onChange(updatedAvailability)
    }
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-white/[0.02]">
        <h3 className="font-bold text-lg">Weekly Schedule</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Timezone:</span>
          <span className="text-sm font-medium bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-gray-700 dark:text-gray-300">
            {availability?.timezoneLabel || 'Lebanon (Beirut)'}
          </span>
        </div>
      </div>

      {/* Days */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {availability?.days?.map((day, index) => (
          <DayScheduleRow
            key={day.day}
            day={day}
            onChange={(updatedDay) => handleDayChange(index, updatedDay)}
          />
        ))}
      </div>

      {/* Mobile Save Button */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-800 lg:hidden">
        <button
          onClick={() => onChange && onChange(availability)}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-[#111816] font-bold text-sm shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">check</span>
          Save All Changes
        </button>
      </div>
    </div>
  )
}

export default WeeklySchedule


