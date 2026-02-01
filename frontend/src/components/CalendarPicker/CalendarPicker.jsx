import React, { useState } from 'react'

const CalendarPicker = ({
  selectedDate,
  onDateSelect,
  availableDates = [],
  unavailableDates = [],
  minDate,
  maxDate,
  className = ""
}) => {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = selectedDate ? new Date(selectedDate) : new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"]

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isDateAvailable = (date) => {
    const dateStr = date.toISOString().split('T')[0]
    
    // Don't allow past dates first
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    if (date < today) return false
    
    // Check min/max date constraints
    if (minDate && date < minDate) return false
    if (maxDate && date > maxDate) return false
    
    // CRITICAL: Check if date is in unavailable dates FIRST
    // This ensures Monday (enabled: false) is never available
    if (unavailableDates && unavailableDates.length > 0) {
      const isUnavailable = unavailableDates.some(d => {
        const unavailableDateStr = d instanceof Date 
          ? d.toISOString().split('T')[0] 
          : (typeof d === 'string' ? d : new Date(d).toISOString().split('T')[0])
        return unavailableDateStr === dateStr
      })
      if (isUnavailable) {
        return false // Date is unavailable (e.g., Monday with enabled: false)
      }
    }
    
    // Only show date if it's explicitly in available dates
    // If availableDates is provided, ONLY show those dates
    if (availableDates && availableDates.length > 0) {
      const isAvailable = availableDates.some(d => {
        const availableDateStr = d instanceof Date 
          ? d.toISOString().split('T')[0] 
          : (typeof d === 'string' ? d : new Date(d).toISOString().split('T')[0])
        return availableDateStr === dateStr
      })
      return isAvailable // Only return true if date is in available list
    }
    
    // If no available dates provided but unavailableDates is empty, show all future dates
    // This allows the calendar to work even if dates haven't loaded yet
    if (!unavailableDates || unavailableDates.length === 0) {
      return true // Show all future dates if no availability data yet
    }
    
    // If unavailableDates is provided but availableDates is empty, don't show any dates
    return false
  }

  const isDateSelected = (date) => {
    if (!selectedDate) return false
    const selected = new Date(selectedDate)
    return (
      date.getDate() === selected.getDate() &&
      date.getMonth() === selected.getMonth() &&
      date.getFullYear() === selected.getFullYear()
    )
  }

  const handleDateClick = (day) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    if (isDateAvailable(date)) {
      onDateSelect && onDateSelect(date)
    }
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    days.push({
      day,
      date,
      available: isDateAvailable(date),
      selected: isDateSelected(date)
    })
  }

  return (
    <div className={`bg-white dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/10 p-4 shadow-sm ${className}`}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-4 px-2">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-gray-500">chevron_left</span>
        </button>
        <span className="font-bold text-text-main dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </span>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-gray-500">chevron_right</span>
        </button>
      </div>

      {/* Week Days Header */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
        {weekDays.map((day, index) => (
          <span key={index} className="text-gray-400 font-medium py-2">
            {day}
          </span>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-sm">
        {days.map((dayData, index) => {
          if (dayData === null) {
            return <span key={index} className="aspect-square"></span>
          }

          const { day, date, available, selected } = dayData

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateClick(day)}
              disabled={!available}
              className={`aspect-square flex items-center justify-center rounded-full font-medium transition-all ${
                selected
                  ? 'bg-primary text-text-main font-bold shadow-md shadow-primary/30'
                  : available
                  ? 'text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                  : 'text-gray-400 cursor-not-allowed opacity-30'
              }`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default CalendarPicker

