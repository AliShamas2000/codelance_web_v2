import React from 'react'
import CalendarDayColumn from '../CalendarDayColumn/CalendarDayColumn'
import TimeSlotColumn from '../TimeSlotColumn/TimeSlotColumn'

const CalendarMonthView = ({
  currentMonth,
  appointments = [],
  blockedSlots = [],
  unavailableSlots = [],
  onAppointmentClick,
  className = ""
}) => {
  // Get first day of month and number of days
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = firstDay.getDay()
  
  // Generate array of all days in the month
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)
    return date
  })
  
  // Add empty cells for days before the first day of the month
  const emptyCells = Array.from({ length: firstDayOfWeek }, (_, i) => null)
  const allDays = [...emptyCells, ...days]
  
  // Group days into weeks (7 days per week)
  const weeks = []
  for (let i = 0; i < allDays.length; i += 7) {
    weeks.push(allDays.slice(i, i + 7))
  }
  
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
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return appointments.filter(apt => apt.date === dateStr)
  }
  
  // Get blocked slots for a specific day
  const getBlockedSlotsForDay = (date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return blockedSlots.filter(block => block.date === dateStr)
  }
  
  // Get unavailable slots for a specific day
  const getUnavailableSlotsForDay = (date) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return unavailableSlots.filter(slot => slot.date === dateStr)
  }
  
  // Check if a date is today
  const isToday = (date) => {
    if (!date) return false
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }
  
  // Day names
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Day names header */}
      <div className="grid grid-cols-7 gap-1 mb-2 flex-shrink-0">
        {dayNames.map((dayName, index) => (
          <div
            key={index}
            className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2"
          >
            {dayName}
          </div>
        ))}
      </div>
      
      {/* Calendar grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 gap-1">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date, dayIndex) => (
                <div
                  key={dayIndex}
                  className={`min-h-[120px] border border-gray-200 dark:border-gray-700 rounded-lg p-2 ${
                    !date ? 'bg-gray-50 dark:bg-gray-900/50' : 'bg-white dark:bg-gray-800'
                  } ${isToday(date) ? 'ring-2 ring-primary' : ''}`}
                >
                  {date && (
                    <>
                      {/* Date number */}
                      <div className={`text-sm font-semibold mb-1 ${
                        isToday(date)
                          ? 'text-primary'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}>
                        {date.getDate()}
                      </div>
                      
                      {/* Appointments for this day */}
                      <div className="space-y-1">
                        {getAppointmentsForDay(date).slice(0, 3).map((appointment) => (
                          <div
                            key={appointment.id}
                            onClick={() => onAppointmentClick && onAppointmentClick(appointment)}
                            className="text-xs p-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                            title={`${appointment.clientName} - ${appointment.service} (${appointment.startTime})`}
                          >
                            <div className="font-medium truncate">{appointment.clientName}</div>
                            <div className="text-primary/70 truncate">{appointment.startTime}</div>
                          </div>
                        ))}
                        {getAppointmentsForDay(date).length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                            +{getAppointmentsForDay(date).length - 3} more
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CalendarMonthView

