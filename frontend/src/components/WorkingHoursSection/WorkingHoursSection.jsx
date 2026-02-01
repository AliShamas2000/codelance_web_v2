import React from 'react'
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch'

const WorkingHoursSection = ({
  workingHours = [],
  onUpdateHours,
  className = ""
}) => {
  const defaultDays = [
    { day: 'Mon-Fri', label: 'Mon-Fri', enabled: true, startTime: '9:00 AM', endTime: '8:00 PM' },
    { day: 'Saturday', label: 'Saturday', enabled: true, startTime: '10:00 AM', endTime: '6:00 PM' },
    { day: 'Sunday', label: 'Sunday', enabled: false, startTime: '--', endTime: '--' }
  ]

  const hours = workingHours.length > 0 ? workingHours : defaultDays

  const handleTimeChange = (index, field, value) => {
    const updated = [...hours]
    updated[index] = { ...updated[index], [field]: value }
    onUpdateHours && onUpdateHours(updated)
  }

  const handleToggle = (index, enabled) => {
    const updated = [...hours]
    updated[index] = { ...updated[index], enabled }
    onUpdateHours && onUpdateHours(updated)
  }

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="material-symbols-outlined text-gray-400 mr-2">schedule</span>
        Working Hours
      </h2>
      <div className="space-y-3">
        {hours.map((day, index) => (
          <div
            key={day.day || index}
            className={`flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-gray-700 ${
              !day.enabled ? 'opacity-60' : ''
            }`}
          >
            <div className="w-16">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {day.label || day.day}
              </span>
            </div>
            <input
              className={`w-20 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:border-primary dark:text-white ${
                !day.enabled ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 cursor-not-allowed' : ''
              }`}
              type="text"
              value={day.startTime || ''}
              onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
              disabled={!day.enabled}
              placeholder="9:00 AM"
            />
            <span className="text-gray-400">-</span>
            <input
              className={`w-20 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded px-2 py-1.5 text-xs text-center focus:outline-none focus:border-primary dark:text-white ${
                !day.enabled ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 cursor-not-allowed' : ''
              }`}
              type="text"
              value={day.endTime || ''}
              onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
              disabled={!day.enabled}
              placeholder="8:00 PM"
            />
            <div className="ml-auto">
              <ToggleSwitch
                checked={day.enabled}
                onChange={(checked) => handleToggle(index, checked)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default WorkingHoursSection


