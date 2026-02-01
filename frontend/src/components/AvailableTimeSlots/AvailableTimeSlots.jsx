import React, { useState, useRef, useEffect } from 'react'
import BarberAvailabilityCard from '../BarberAvailabilityCard/BarberAvailabilityCard'

const AvailableTimeSlots = ({
  title = "Today's Available Time Slots",
  description = "Quick reference for walk-ins or rescheduling",
  barbers = [],
  defaultOpen = true,
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef(null)
  const [maxHeight, setMaxHeight] = useState(defaultOpen ? 'none' : '0px')

  // Handle open/close transitions
  useEffect(() => {
    if (contentRef.current) {
      if (isOpen) {
        // Set to actual height for smooth transition
        const height = contentRef.current.scrollHeight
        setMaxHeight(`${height}px`)
        // After transition, set to 'none' to allow content to grow
        const timer = setTimeout(() => {
          setMaxHeight('none')
        }, 300) // Match transition duration
        return () => clearTimeout(timer)
      } else {
        // Get current height before closing
        const height = contentRef.current.scrollHeight
        setMaxHeight(`${height}px`)
        // Force reflow
        requestAnimationFrame(() => {
          setMaxHeight('0px')
        })
      }
    }
  }, [isOpen])

  // Update height when content changes while open
  useEffect(() => {
    if (isOpen && contentRef.current && maxHeight === 'none') {
      // Content changed while open, smoothly update height
      const height = contentRef.current.scrollHeight
      setMaxHeight(`${height}px`)
      const timer = setTimeout(() => {
        setMaxHeight('none')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [barbers, isOpen, maxHeight])

  const toggleOpen = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 mb-8 overflow-hidden ${className}`}>
      <button
        onClick={toggleOpen}
        className="w-full flex items-center justify-between p-5 cursor-pointer bg-gray-50/50 dark:bg-gray-800/30 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
            <span className="material-symbols-outlined text-green-600 dark:text-green-400">event_available</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 dark:text-white text-sm uppercase tracking-wide">{title}</h2>
            {description && (
              <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
            )}
          </div>
        </div>
        <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: maxHeight,
          opacity: isOpen ? 1 : 0
        }}
      >
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 grid gap-6">
          {barbers.length > 0 ? (
            barbers.map((barber, index) => (
              <BarberAvailabilityCard
                key={barber.id || index}
                barberName={barber.name}
                barberAvatar={barber.avatar}
                availableSlots={barber.availableSlots || []}
                isFull={barber.isFull || false}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-4">
              No barbers available today
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AvailableTimeSlots



