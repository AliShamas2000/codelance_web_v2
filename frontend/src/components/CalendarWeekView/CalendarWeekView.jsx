import React from 'react'
import TimeSlotColumn from '../TimeSlotColumn/TimeSlotColumn'
import CalendarDayColumn from '../CalendarDayColumn/CalendarDayColumn'

const CalendarWeekView = ({
  weekStart,
  appointments = [],
  blockedSlots = [],
  unavailableSlots = [],
  onAppointmentClick,
  className = ""
}) => {
  // Generate array of 7 days starting from weekStart
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart)
    date.setDate(weekStart.getDate() + i)
    return date
  })

  // Time slots from 9 AM to 9 PM (13 slots, each 1 hour)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = 9 + i
    return {
      hour,
      label: hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
      time: `${hour.toString().padStart(2, '0')}:00`
    }
  })

  // Get appointments for a specific day
  const getAppointmentsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return appointments.filter(apt => apt.date === dateStr)
  }

  // Get blocked slots for a specific day
  const getBlockedSlotsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return blockedSlots.filter(block => block.date === dateStr)
  }

  // Get unavailable slots for a specific day
  const getUnavailableSlotsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    return unavailableSlots.filter(slot => slot.date === dateStr)
  }

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  return (
    <div className={`flex-grow bg-surface-light dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col overflow-hidden ${className}`}>
      {/* Day Headers */}
      <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-white/5">
        <div className="w-16 flex-shrink-0 border-r border-gray-200 dark:border-gray-800"></div>
        <div className="flex-grow grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-800">
          {days.map((day, index) => {
            const dayName = day.toLocaleDateString('en-US', { weekday: 'short' })
            const dayNumber = day.getDate()
            const isTodayDate = isToday(day)

            return (
              <div
                key={index}
                className={`p-3 text-center ${isTodayDate ? 'bg-primary/5' : ''}`}
              >
                <span className={`block text-xs font-bold uppercase tracking-wide ${
                  isTodayDate ? 'text-primary' : 'text-gray-400'
                }`}>
                  {dayName}
                </span>
                <div className={`mt-1 w-8 h-8 mx-auto flex items-center justify-center rounded-full text-sm font-semibold ${
                  isTodayDate
                    ? 'bg-primary text-white shadow-md shadow-primary/30 font-bold'
                    : day.getDay() === 0 || day.getDay() === 6
                    ? 'text-gray-500'
                    : 'text-gray-900 dark:text-white'
                }`}>
                  {dayNumber}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-grow overflow-y-auto relative no-scrollbar">
        <div className="flex min-h-[1040px]">
          <TimeSlotColumn timeSlots={timeSlots} />
          
          <div className="flex-grow grid grid-cols-7 divide-x divide-gray-200 dark:divide-gray-800 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-rows-[repeat(13,80px)] pointer-events-none z-0">
              {Array.from({ length: 13 }).map((_, i) => (
                <div key={i} className="border-b border-gray-100 dark:border-gray-800/50"></div>
              ))}
            </div>

            {/* Day Columns */}
            {days.map((day, dayIndex) => (
              <CalendarDayColumn
                key={dayIndex}
                day={day}
                timeSlots={timeSlots}
                appointments={getAppointmentsForDay(day)}
                blockedSlots={getBlockedSlotsForDay(day)}
                unavailableSlots={getUnavailableSlotsForDay(day)}
                onAppointmentClick={onAppointmentClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarWeekView


