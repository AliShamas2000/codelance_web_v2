import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AvailabilityHeader from '../../../components/AvailabilityHeader/AvailabilityHeader'
import WeeklySchedule from '../../../components/WeeklySchedule/WeeklySchedule'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import barberApi from '../../../api/barber'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'

const Availability = () => {
  const navigate = useNavigate()
  const [availability, setAvailability] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { user } = useBarberUserContext()

  useEffect(() => {
    fetchAvailability()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAvailability = async () => {
    setIsLoading(true)
    try {
      const data = await barberApi.getAvailability()
      // Ensure data has the correct structure and all days have slots
      if (data && (data.days || data.timezone)) {
        // Normalize the data to ensure all days have slots array and force timezone to Beirut
        const normalizedData = {
          ...data,
          timezone: 'Asia/Beirut', // Always force to Beirut
          timezoneLabel: 'Lebanon (Beirut)', // Always force to Beirut label
          timezone_label: 'Lebanon (Beirut)', // Also set the alternative field name
          days: (data.days || []).map(day => ({
            ...day,
            slots: Array.isArray(day.slots) ? day.slots : []
          }))
        }
        setAvailability(normalizedData)
      } else {
        // If data structure is unexpected, use default
        setAvailability(getDefaultAvailability())
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
      // Use default availability structure
      setAvailability(getDefaultAvailability())
    } finally {
      setIsLoading(false)
    }
  }

  const handleAvailabilityChange = (updatedAvailability) => {
    setAvailability(updatedAvailability)
    setHasChanges(true)
  }

  const handleSave = async () => {
    if (!availability || !availability.days) return
    
    setIsSaving(true)
    try {
      console.log('=== STARTING SAVE ===')
      console.log('Original availability:', JSON.stringify(availability, null, 2))
      
      // COMPLETELY rebuild the data structure to ensure everything is correct
      const formattedAvailability = {
        timezone: availability.timezone || 'Asia/Beirut',
        timezoneLabel: availability.timezoneLabel || availability.timezone_label || 'Lebanon (Beirut)',
        days: availability.days.map((day, index) => {
          console.log(`Processing day ${index}:`, day)
          
          // Start with a clean slate - ALWAYS include slots
          const formattedDay = {
            day: String(day.day || ''),
            label: String(day.label || ''),
            enabled: Boolean(day.enabled !== undefined ? day.enabled : true),
            slots: [] // ALWAYS start with empty array
          }
          
          // Only add slots if day is enabled AND has valid slots
          if (formattedDay.enabled) {
            if (day.slots && Array.isArray(day.slots) && day.slots.length > 0) {
              formattedDay.slots = day.slots
                .filter(slot => slot && slot.start && slot.end) // Filter out invalid slots
                .map(slot => ({
                  start: String(slot.start || '09:00'),
                  end: String(slot.end || '17:00')
                }))
            }
          }
          
          // GUARANTEE slots is an array - CRITICAL CHECK
          if (!Array.isArray(formattedDay.slots)) {
            console.error(`Day ${index} (${formattedDay.day}) slots is NOT an array!`, formattedDay.slots)
            formattedDay.slots = []
          }
          
          console.log(`Formatted day ${index} (${formattedDay.day}):`, {
            enabled: formattedDay.enabled,
            slots: formattedDay.slots,
            slotsIsArray: Array.isArray(formattedDay.slots),
            slotsLength: formattedDay.slots.length,
            hasSlotsProperty: 'slots' in formattedDay
          })
          
          return formattedDay
        })
      }
      
      // FINAL VERIFICATION: Check every single day
      console.log('=== FINAL VERIFICATION ===')
      formattedAvailability.days.forEach((day, index) => {
        const isValid = 
          day.day && 
          day.label && 
          typeof day.enabled === 'boolean' &&
          'slots' in day &&
          Array.isArray(day.slots)
        
        console.log(`Day ${index} (${day.day}) verification:`, {
          isValid,
          hasDay: !!day.day,
          hasLabel: !!day.label,
          hasEnabled: typeof day.enabled === 'boolean',
          hasSlotsProperty: 'slots' in day,
          slotsIsArray: Array.isArray(day.slots),
          slotsValue: day.slots
        })
        
        if (!isValid) {
          console.error(`❌ INVALID day at index ${index}:`, day)
        }
      })
      
      // Log final payload
      console.log('=== FINAL PAYLOAD BEING SENT ===')
      console.log(JSON.stringify(formattedAvailability, null, 2))
      
      await barberApi.updateAvailability(formattedAvailability)
      setHasChanges(false)
      // Show success modal
      setShowSuccessModal(true)
    } catch (error) {
      console.error('=== ERROR SAVING ===')
      console.error('Error:', error)
      console.error('Error response:', error.response?.data)
      const errorMessage = error.response?.data?.message || error.response?.data?.errors 
        ? JSON.stringify(error.response.data.errors) 
        : 'Failed to save availability. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/barber/dashboard')
      }
    } else {
      navigate('/barber/dashboard')
    }
  }

  return (
    <>
      <main className="flex-grow p-6 lg:p-10 lg:ml-64">
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading availability...</p>
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="mx-auto">
              <AvailabilityHeader
                onCancel={handleCancel}
                onSave={handleSave}
                isSaving={isSaving}
                hasChanges={hasChanges}
              />

              {availability && (
                <WeeklySchedule
                  availability={availability}
                  onChange={handleAvailabilityChange}
                />
              )}

              {/* Info Message */}
              <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 text-sm">
                <span className="material-symbols-outlined flex-shrink-0">info</span>
                <p>
                  Changes to your weekly availability will apply to all future weeks. Existing appointments will not be affected. To block specific dates, please use the{' '}
                  <button
                    onClick={() => navigate('/barber/schedule')}
                    className="underline font-semibold hover:text-blue-600 dark:hover:text-blue-100"
                  >
                    Calendar view
                  </button>
                  .
                </p>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Success Modal */}
      <SuccessMessageModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Successfully Saved!"
        message="Your availability has been updated successfully."
      />
    </>
  )
}

// Default availability structure
const getDefaultAvailability = () => ({
  timezone: 'Asia/Beirut',
  timezoneLabel: 'Lebanon (Beirut)',
  days: [
    {
      day: 'monday',
      label: 'Monday',
      enabled: true,
      slots: [{ start: '09:00', end: '17:00' }]
    },
    {
      day: 'tuesday',
      label: 'Tuesday',
      enabled: true,
      slots: [
        { start: '09:00', end: '13:00' },
        { start: '14:00', end: '18:00' }
      ]
    },
    {
      day: 'wednesday',
      label: 'Wednesday',
      enabled: true,
      slots: [{ start: '09:00', end: '17:00' }]
    },
    {
      day: 'thursday',
      label: 'Thursday',
      enabled: true,
      slots: [{ start: '10:00', end: '19:00' }]
    },
    {
      day: 'friday',
      label: 'Friday',
      enabled: true,
      slots: [{ start: '10:00', end: '19:00' }]
    },
    {
      day: 'saturday',
      label: 'Saturday',
      enabled: true,
      slots: [{ start: '09:00', end: '14:00' }]
    },
    {
      day: 'sunday',
      label: 'Sunday',
      enabled: false,
      slots: []
    }
  ]
})

export default Availability


