import React from 'react'
import './TodaySchedule.css'

const TodaySchedule = ({
  schedule,
  onEditAvailability,
  className = ""
}) => {
  const getSlotStatus = (slot) => {
    if (slot.status === 'occupied') {
      return {
        bg: 'bg-gray-100 dark:bg-gray-800',
        text: 'text-gray-500 line-through decoration-gray-400',
        dot: 'bg-red-400',
        label: 'Occupied',
        opacity: 'opacity-60'
      }
    } else if (slot.status === 'booked') {
      return {
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        border: 'border-blue-100 dark:border-blue-900/30',
        text: 'text-blue-800 dark:text-blue-300',
        dot: 'bg-blue-500',
        label: slot.client,
        opacity: ''
      }
    } else if (slot.status === 'break') {
      return {
        bg: 'bg-gray-50 dark:bg-black/20',
        border: 'border-transparent',
        text: 'text-gray-400',
        icon: 'toggle_off',
        label: 'Break',
        opacity: ''
      }
    } else {
      return {
        bg: 'bg-white dark:bg-surface-dark',
        border: 'border-gray-200 dark:border-gray-700',
        text: 'text-primary',
        icon: 'toggle_on',
        label: 'Available',
        opacity: '',
        hover: 'group-hover:border-primary'
      }
    }
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 ${className}`}>
      <h3 className="font-bold text-lg mb-4">Today's Schedule</h3>
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
        <span>{schedule.date}</span>
        <span className="text-green-500 font-medium">{schedule.openSlots} Slots Open</span>
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
        {schedule.slots.map((slot, index) => {
          const statusConfig = getSlotStatus(slot)
          const isClickable = slot.status === 'available'

          return (
            <div key={index} className="flex items-center gap-3">
              <span className={`w-14 text-sm font-medium text-right flex-shrink-0 ${
                slot.status === 'available' ? 'text-[#111816] dark:text-white' : 'text-gray-500'
              }`}>
                {slot.time}
              </span>
              <div
                className={`flex-grow rounded-lg p-2.5 flex items-center justify-between ${
                  statusConfig.bg
                } ${statusConfig.border || ''} ${statusConfig.opacity || ''} ${
                  isClickable ? 'group cursor-pointer shadow-sm transition-colors ' + statusConfig.hover : ''
                }`}
              >
                <span className={`text-sm font-medium ${statusConfig.text}`}>
                  {statusConfig.label}
                </span>
                {statusConfig.dot ? (
                  <span className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></span>
                ) : statusConfig.icon ? (
                  <span className={`material-symbols-outlined text-gray-300 ${
                    isClickable ? 'group-hover:text-primary' : ''
                  } text-[18px]`}>
                    {statusConfig.icon}
                  </span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        <button
          onClick={onEditAvailability}
          className="w-full py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          Edit Availability
        </button>
      </div>
    </div>
  )
}

export default TodaySchedule


