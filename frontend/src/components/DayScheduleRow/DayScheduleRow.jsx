import React from 'react'
import TimeSlotInput from '../TimeSlotInput/TimeSlotInput'

const DayScheduleRow = ({
  day,
  onChange,
  className = ""
}) => {
  const handleToggle = (enabled) => {
    if (onChange) {
      onChange({
        ...day,
        enabled,
        slots: enabled ? (day.slots || []) : [] // Ensure slots is always an array
      })
    }
  }

  const handleSlotChange = (slotIndex, updatedSlot) => {
    const updatedSlots = day.slots.map((slot, index) =>
      index === slotIndex ? updatedSlot : slot
    )
    if (onChange) {
      onChange({
        ...day,
        slots: updatedSlots
      })
    }
  }

  const handleAddSlot = () => {
    const newSlot = { start: '09:00', end: '17:00' }
    if (onChange) {
      onChange({
        ...day,
        slots: [...day.slots, newSlot]
      })
    }
  }

  const handleRemoveSlot = (slotIndex) => {
    if (onChange) {
      onChange({
        ...day,
        slots: day.slots.filter((_, index) => index !== slotIndex)
      })
    }
  }

  const handleCopyToOtherDays = () => {
    // This will be handled by parent component
    // For now, we'll emit an event or use a callback
    if (window.confirm(`Copy ${day.label} schedule to all other enabled days?`)) {
      // This would need to be handled at a higher level
      // For now, we'll just show a message
      alert('This feature will copy the schedule to other days. Implementation pending.')
    }
  }

  const calculateBreakDuration = (slot1, slot2) => {
    if (!slot1 || !slot2) return null
    const [start1, start2] = [slot1.end, slot2.start].map(time => {
      const [hours, minutes] = time.split(':').map(Number)
      return hours * 60 + minutes
    })
    const diff = start2 - start1
    const hours = Math.floor(diff / 60)
    const minutes = diff % 60
    if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h`
    if (minutes > 0) return `${minutes}m`
    return null
  }

  return (
    <div
      className={`p-6 transition-colors ${
        day.enabled
          ? 'hover:bg-gray-50/30 dark:hover:bg-white/[0.01]'
          : 'bg-gray-50/80 dark:bg-white/[0.02] opacity-80'
      } ${className}`}
    >
      <div className="flex flex-col lg:flex-row gap-6 lg:items-start">
        {/* Day Label and Toggle */}
        <div className="w-full lg:w-48 flex items-center justify-between lg:justify-start gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleToggle(!day.enabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                day.enabled
                  ? 'bg-primary'
                  : 'bg-gray-200 dark:bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  day.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              ></span>
            </button>
            <span
              className={`font-bold text-lg ${
                day.enabled
                  ? 'text-[#111816] dark:text-white'
                  : 'text-gray-400'
              }`}
            >
              {day.label}
            </span>
          </div>
          {day.enabled && (
            <span className="lg:hidden text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
              Active
            </span>
          )}
          {!day.enabled && (
            <span className="lg:hidden text-xs font-medium text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              Off
            </span>
          )}
        </div>

        {/* Time Slots */}
        <div className="flex-grow space-y-4">
          {day.enabled ? (
            <>
              {day.slots.map((slot, slotIndex) => (
                <div key={slotIndex}>
                  <div className="group flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <TimeSlotInput
                      startTime={slot.start}
                      endTime={slot.end}
                      onChange={(updatedSlot) => handleSlotChange(slotIndex, updatedSlot)}
                    />
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                      <button
                        type="button"
                        onClick={() => handleRemoveSlot(slotIndex)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove slot"
                      >
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                      {slotIndex === 0 && day.slots.length > 0 && (
                        <button
                          type="button"
                          onClick={handleCopyToOtherDays}
                          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Copy to other days"
                        >
                          <span className="material-symbols-outlined text-[20px]">content_copy</span>
                        </button>
                      )}
                    </div>
                  </div>
                  {/* Break indicator between slots */}
                  {slotIndex < day.slots.length - 1 && (
                    <div className="flex items-center gap-3 pl-4 sm:pl-0 mt-2">
                      <div className="h-8 border-l-2 border-dashed border-gray-300 dark:border-gray-700 ml-5 sm:ml-20"></div>
                      <span className="text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                        {calculateBreakDuration(slot, day.slots[slotIndex + 1]) || 'Break'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddSlot}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-[#0fb37d] transition-colors mt-1"
              >
                <span className="material-symbols-outlined text-[20px]">add_circle</span>
                Add Break / Shift
              </button>
            </>
          ) : (
            <div className="p-3 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex items-center gap-2 text-gray-400 justify-center sm:justify-start">
              <span className="material-symbols-outlined text-[20px]">event_busy</span>
              <span className="text-sm font-medium">Unavailable</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DayScheduleRow


