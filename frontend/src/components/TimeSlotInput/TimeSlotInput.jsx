import React from 'react'

const TimeSlotInput = ({
  startTime,
  endTime,
  onChange,
  className = ""
}) => {
  const handleStartTimeChange = (e) => {
    if (onChange) {
      onChange({
        start: e.target.value,
        end: endTime
      })
    }
  }

  const handleEndTimeChange = (e) => {
    if (onChange) {
      onChange({
        start: startTime,
        end: e.target.value
      })
    }
  }

  return (
    <div className={`flex items-center gap-3 flex-1 w-full sm:w-auto ${className}`}>
      <div className="relative w-full sm:w-40">
        <input
          type="time"
          value={startTime}
          onChange={handleStartTimeChange}
          className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:border-primary focus:ring-primary text-sm shadow-sm py-2.5 px-3"
        />
      </div>
      <span className="text-gray-400 font-medium">to</span>
      <div className="relative w-full sm:w-40">
        <input
          type="time"
          value={endTime}
          onChange={handleEndTimeChange}
          className="block w-full rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-black/20 focus:border-primary focus:ring-primary text-sm shadow-sm py-2.5 px-3"
        />
      </div>
    </div>
  )
}

export default TimeSlotInput


