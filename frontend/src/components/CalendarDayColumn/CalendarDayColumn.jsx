import React from 'react'
import AppointmentBlock from '../AppointmentBlock/AppointmentBlock'

const CalendarDayColumn = ({
  day,
  timeSlots = [],
  appointments = [],
  blockedSlots = [],
  unavailableSlots = [],
  onAppointmentClick,
  className = ""
}) => {
  // Calculate position and height for an appointment/block
  const calculatePosition = (startTime, endTime) => {
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const duration = endMinutes - startMinutes
    
    // Each hour slot is 80px, so each minute is 80/60 = 1.33px
    const top = (startMinutes - 540) * (80 / 60) // 540 = 9 AM in minutes
    const height = duration * (80 / 60)
    
    return { top, height }
  }

  // Render unavailable slots (full hour blocks)
  const renderUnavailableSlots = () => {
    return unavailableSlots.map((slot) => {
      const position = calculatePosition(slot.startTime, slot.endTime)
      return (
        <div
          key={slot.id}
          className="absolute top-0 left-0 right-0 h-20 bg-gray-100/50 dark:bg-black/40 border-b border-gray-200 dark:border-gray-700 flex items-center justify-center z-0"
          style={{ top: `${position.top}px`, height: `${position.height}px` }}
        >
          <span className="text-xs font-medium text-gray-400 tracking-wider uppercase">
            {slot.reason || 'Unavailable'}
          </span>
        </div>
      )
    })
  }

  // Render appointment blocks
  const renderAppointments = () => {
    return appointments.map((appointment) => {
      const position = calculatePosition(appointment.startTime, appointment.endTime)
      return (
        <AppointmentBlock
          key={appointment.id}
          appointment={appointment}
          top={position.top}
          height={position.height}
          onClick={() => onAppointmentClick && onAppointmentClick(appointment)}
        />
      )
    })
  }

  // Render blocked time slots
  const renderBlockedSlots = () => {
    return blockedSlots.map((block) => {
      const position = calculatePosition(block.startTime, block.endTime)
      return (
        <div
          key={block.id}
          className="absolute left-1 right-1 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 cursor-pointer hover:shadow-md transition-all z-10 opacity-70"
          style={{ top: `${position.top}px`, height: `${position.height}px` }}
          onClick={() => onAppointmentClick && onAppointmentClick(block)}
        >
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-gray-500">block</span>
            <span className="text-xs font-bold text-gray-500">{block.reason}</span>
          </div>
        </div>
      )
    })
  }

  return (
    <div className={`relative group ${className}`}>
      {renderUnavailableSlots()}
      {renderAppointments()}
      {renderBlockedSlots()}
    </div>
  )
}

export default CalendarDayColumn


