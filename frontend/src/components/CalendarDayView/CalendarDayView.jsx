import React from 'react'
import CalendarDayColumn from '../CalendarDayColumn/CalendarDayColumn'
import TimeSlotColumn from '../TimeSlotColumn/TimeSlotColumn'

const CalendarDayView = ({
  currentDay,
  appointments = [],
  blockedSlots = [],
  unavailableSlots = [],
  onAppointmentClick,
  className = ""
}) => {
  // Time slots from 9 AM to 9 PM (13 slots, each 1 hour)
  const timeSlots = Array.from({ length: 13 }, (_, i) => {
    const hour = 9 + i
    return {
      hour,
      label: hour === 12 ? '12 PM' : hour > 12 ? `${hour - 12} PM` : `${hour} AM`,
      time: `${hour.toString().padStart(2, '0')}:00`
    }
  })
  
  // Get appointments for the day
  const getAppointmentsForDay = () => {
    const dateStr = currentDay.toISOString().split('T')[0]
    return appointments.filter(apt => apt.date === dateStr)
  }
  
  // Get blocked slots for the day
  const getBlockedSlotsForDay = () => {
    const dateStr = currentDay.toISOString().split('T')[0]
    return blockedSlots.filter(block => block.date === dateStr)
  }
  
  // Get unavailable slots for the day
  const getUnavailableSlotsForDay = () => {
    const dateStr = currentDay.toISOString().split('T')[0]
    return unavailableSlots.filter(slot => slot.date === dateStr)
  }
  
  // Check if the day is today
  const isToday = () => {
    const today = new Date()
    return currentDay.toDateString() === today.toDateString()
  }
  
  // Format day header
  const formatDayHeader = () => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return currentDay.toLocaleDateString('en-US', options)
  }
  
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Day header */}
      <div className="mb-4 flex-shrink-0">
        <h2 className={`text-xl font-bold ${
          isToday() ? 'text-primary' : 'text-gray-900 dark:text-white'
        }`}>
          {formatDayHeader()}
        </h2>
      </div>
      
      {/* Calendar with time slots */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex gap-4">
          {/* Time column */}
          <TimeSlotColumn timeSlots={timeSlots} />
          
          {/* Day column */}
          <div className="flex-1">
            <CalendarDayColumn
              day={currentDay}
              appointments={getAppointmentsForDay()}
              blockedSlots={getBlockedSlotsForDay()}
              unavailableSlots={getUnavailableSlotsForDay()}
              timeSlots={timeSlots}
              onAppointmentClick={onAppointmentClick}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CalendarDayView

