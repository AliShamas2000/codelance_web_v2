import React, { useState, useEffect, useMemo } from 'react'
import Modal from '../Modal/Modal'
import CalendarPicker from '../CalendarPicker/CalendarPicker'
import TimeSlotSelector from '../TimeSlotSelector/TimeSlotSelector'
import MultiSelect from '../MultiSelect/MultiSelect'
import PhoneInput from '../PhoneInput/PhoneInput'
import FormSelect from '../FormSelect/FormSelect'
import appointmentsApi from '../../api/appointments'

const EditAppointmentModal = ({
  isOpen = false,
  onClose,
  appointment = null,
  services = [],
  barbers = [],
  onSubmit,
  isLoading = false,
  hideBarberSelect = false,
  barberId = null, // Barber ID for fetching availability
  className = ""
}) => {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '', // Added phone number field
    services: [], // Changed to array for multi-select like contact page
    barber: '',
    selectedDate: null, // Changed to Date object like contact page
    selectedTime: '', // Changed to string in 12-hour format like contact page
    status: 'pending',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [availableDates, setAvailableDates] = useState([])
  const [unavailableDates, setUnavailableDates] = useState([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([])
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)

  // Fetch available dates for the barber (same as contact page)
  const fetchAvailableDates = async (barberId) => {
    if (!barberId) {
      setAvailableDates([])
      setUnavailableDates([])
      return
    }

    setIsLoadingDates(true)
    try {
      const response = await appointmentsApi.getAvailableDates({ barberId })
      // Convert date strings to Date objects for calendar (same as contact page)
      const available = (response.available || []).map(date => {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0) // Normalize to midnight
        return d
      })
      const unavailable = (response.unavailable || []).map(date => {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0) // Normalize to midnight
        return d
      })
      setAvailableDates(available)
      setUnavailableDates(unavailable)
    } catch (error) {
      console.error('Error fetching available dates:', error)
      setAvailableDates([])
      setUnavailableDates([])
    } finally {
      setIsLoadingDates(false)
    }
  }

  // Fetch available time slots for selected date (same as contact page)
  const fetchTimeSlots = async (date, barberId) => {
    if (!date || !barberId) {
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
      return
    }

    setIsLoadingTimeSlots(true)
    try {
      // Format date as YYYY-MM-DD in local timezone (not UTC) - same as contact page
      let dateString
      if (typeof date === 'string') {
        dateString = date
      } else {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        dateString = `${year}-${month}-${day}`
      }
      // Use same API call signature as contact page
      const response = await appointmentsApi.getAvailableTimeSlots(dateString, barberId)
      setAvailableTimeSlots(response.available || [])
      setUnavailableTimeSlots(response.unavailable || [])
    } catch (error) {
      console.error('Error fetching time slots:', error)
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
    } finally {
      setIsLoadingTimeSlots(false)
    }
  }

  // Initialize form data when appointment changes (same pattern as contact page)
  useEffect(() => {
    if (appointment) {
      // Parse date - convert to Date object like contact page
      let parsedDate = null
      if (appointment.date) {
        // If date is in YYYY-MM-DD format
        const dateParts = appointment.date.split('-')
        if (dateParts.length === 3) {
          parsedDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
        }
      } else if (appointment.dateTime) {
        // Try to parse from dateTime string
        const dateMatch = appointment.dateTime.match(/(\d{4}-\d{2}-\d{2})/)
        if (dateMatch) {
          const dateParts = dateMatch[1].split('-')
          parsedDate = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]))
        }
      }
      
      // Parse time - convert to 12-hour format string like contact page
      let parsedTime = ''
      if (appointment.time) {
        // If time is in 24-hour format (HH:MM), convert to 12-hour format
        const timeMatch = appointment.time.match(/(\d{1,2}):(\d{2})/)
        if (timeMatch) {
          let hours = parseInt(timeMatch[1])
          const minutes = timeMatch[2]
          const period = hours >= 12 ? 'PM' : 'AM'
          const hour12 = hours % 12 || 12
          parsedTime = `${hour12}:${minutes} ${period}`
        } else {
          parsedTime = appointment.time // Already in 12-hour format
        }
      } else if (appointment.dateTime) {
        // Try to extract time from dateTime string
        const timeMatch = appointment.dateTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (timeMatch) {
          parsedTime = `${timeMatch[1]}:${timeMatch[2]} ${timeMatch[3].toUpperCase()}`
        }
      }

      // Parse services - appointment may have serviceIds array or services array
      // IMPORTANT: Ensure all IDs are numbers to match serviceOptions values
      let parsedServices = []
      if (appointment.serviceIds && Array.isArray(appointment.serviceIds) && appointment.serviceIds.length > 0) {
        // If serviceIds array is provided directly (preferred)
        parsedServices = appointment.serviceIds
          .map(id => {
            // Convert to number
            const numId = typeof id === 'number' ? id : parseInt(id, 10)
            return isNaN(numId) ? null : numId
          })
          .filter(id => id !== null)
      } else if (appointment.services && Array.isArray(appointment.services) && appointment.services.length > 0) {
        // If it's an array of service objects, extract IDs
        parsedServices = appointment.services
          .map(s => {
            if (typeof s === 'object' && s.id !== undefined) {
              const numId = typeof s.id === 'number' ? s.id : parseInt(s.id, 10)
              return isNaN(numId) ? null : numId
            } else if (typeof s === 'number') {
              return s
            } else {
              const numId = parseInt(s, 10)
              return isNaN(numId) ? null : numId
            }
          })
          .filter(id => id !== null)
      } else if (appointment.service) {
        // If it's a single service string/ID (backward compatibility)
        const serviceId = typeof appointment.service === 'number' 
          ? appointment.service 
          : parseInt(appointment.service, 10)
        if (!isNaN(serviceId)) {
          parsedServices = [serviceId]
        }
      }

      // Parse barber ID - prefer barberId, then barber_id, then try to find by name
      let parsedBarberId = ''
      if (appointment.barberId) {
        parsedBarberId = String(appointment.barberId)
      } else if (appointment.barber_id) {
        parsedBarberId = String(appointment.barber_id)
      } else if (!hideBarberSelect && barbers.length > 0 && appointment.barberName) {
        // Try to find barber by name (fallback)
        const foundBarber = barbers.find(b => b.name === appointment.barberName || b.id === appointment.barberName)
        if (foundBarber) {
          parsedBarberId = String(foundBarber.id)
        }
      } else if (hideBarberSelect && barberId) {
        // For barber dashboard, use the logged-in barber ID
        parsedBarberId = String(barberId)
      }

      console.log('EditAppointmentModal - Parsing appointment:', {
        appointment,
        serviceIds: appointment.serviceIds,
        services: appointment.services,
        parsedServices,
        phone: appointment.phone || appointment.clientPhone,
        parsedBarberId
      })

      setFormData({
        clientName: appointment.clientName || '',
        phone: appointment.phone || appointment.clientPhone || '', // Added phone number
        services: parsedServices, // Changed to array - should be array of service IDs
        barber: parsedBarberId, // Store barber ID as string
        selectedDate: parsedDate,
        selectedTime: parsedTime,
        status: appointment.status || 'pending',
        notes: appointment.notes || ''
      })
      
      console.log('EditAppointmentModal - Form data set:', {
        services: parsedServices,
        phone: appointment.phone || appointment.clientPhone || '',
        serviceIds: appointment.serviceIds,
        servicesArray: appointment.services,
        barberId: parsedBarberId
      })
      setErrors({})
      
      // If we have a date and barber, fetch time slots (same as contact page - only after date is set)
      const barberIdForFetch = hideBarberSelect ? barberId : (parsedBarberId ? parseInt(parsedBarberId) : null)
      if (parsedDate && barberIdForFetch) {
        // Use setTimeout to ensure state is updated first
        setTimeout(() => {
          fetchTimeSlots(parsedDate, barberIdForFetch)
        }, 100)
      }
    } else {
      // Reset form when no appointment
      setFormData({
        clientName: '',
        phone: '',
        services: [],
        barber: '',
        selectedDate: null,
        selectedTime: '',
        status: 'pending',
        notes: ''
      })
      setErrors({})
    }
  }, [appointment, isOpen, barberId, hideBarberSelect, barbers])

  // Get the current barber ID (either from prop or selected barber)
  const currentBarberId = hideBarberSelect ? barberId : (formData.barber ? parseInt(formData.barber) : null)

  // Fetch available dates when modal opens or barber changes
  useEffect(() => {
    if (isOpen) {
      if (hideBarberSelect && barberId) {
        // For barber dashboard: use the logged-in barber
        fetchAvailableDates(barberId)
        // Reset time slots when modal opens
        setAvailableTimeSlots([])
        setUnavailableTimeSlots([])
      } else if (!hideBarberSelect && formData.barber) {
        // For admin: use the selected barber
        const selectedBarberId = parseInt(formData.barber)
        if (!isNaN(selectedBarberId)) {
          fetchAvailableDates(selectedBarberId)
          // Reset time slots when barber changes
          setAvailableTimeSlots([])
          setUnavailableTimeSlots([])
        }
      } else {
        // No barber selected yet
        setAvailableDates([])
        setUnavailableDates([])
        setAvailableTimeSlots([])
        setUnavailableTimeSlots([])
      }
    }
  }, [isOpen, barberId, formData.barber, hideBarberSelect])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleBarberChange = (value) => {
    setFormData(prev => ({
      ...prev,
      barber: value,
      selectedDate: null, // Reset date when barber changes
      selectedTime: '' // Reset time when barber changes
    }))
    if (errors.barber) {
      setErrors(prev => ({
        ...prev,
        barber: ''
      }))
    }
    // Fetch new dates for the newly selected barber
    if (value) {
      const selectedBarberId = parseInt(value)
      if (!isNaN(selectedBarberId)) {
        fetchAvailableDates(selectedBarberId)
      }
    } else {
      setAvailableDates([])
      setUnavailableDates([])
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
    }
  }

  const handleDateSelect = (date) => {
    // Same as contact page - store Date object and reset time
    setFormData(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: '' // Reset time when date changes
    }))
    // Clear errors
    if (errors.date) {
      setErrors(prev => ({
        ...prev,
        date: ''
      }))
    }
    if (errors.time) {
      setErrors(prev => ({
        ...prev,
        time: ''
      }))
    }
    // Fetch time slots for the selected date (same as contact page)
    if (date && currentBarberId) {
      fetchTimeSlots(date, currentBarberId)
    } else {
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
    }
  }

  const handleTimeSelect = (time) => {
    // Same as contact page - store time as 12-hour format string
    setFormData(prev => ({
      ...prev,
      selectedTime: time
    }))
    // Clear time error when time is selected
    if (errors.time) {
      setErrors(prev => ({
        ...prev,
        time: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required'
    }

    if (!formData.services || formData.services.length === 0) {
      newErrors.services = 'Please select at least one service'
    }

    if (!hideBarberSelect && !formData.barber) {
      newErrors.barber = 'Barber is required'
    }

    if (!formData.selectedDate) {
      newErrors.date = 'Date is required'
    }

    if (!formData.selectedTime) {
      newErrors.time = 'Time is required'
    }

    if (!formData.status) {
      newErrors.status = 'Status is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Format date as YYYY-MM-DD in local timezone (same as contact page)
      let formattedDate = null
      if (formData.selectedDate) {
        const year = formData.selectedDate.getFullYear()
        const month = String(formData.selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(formData.selectedDate.getDate()).padStart(2, '0')
        formattedDate = `${year}-${month}-${day}`
      }
      
      // Convert time from 12-hour format to 24-hour format for backend
      let formattedTime = ''
      if (formData.selectedTime) {
        const timeMatch = formData.selectedTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
        if (timeMatch) {
          let hours = parseInt(timeMatch[1])
          const minutes = timeMatch[2]
          const period = timeMatch[3].toUpperCase()
          if (period === 'PM' && hours !== 12) {
            hours += 12
          } else if (period === 'AM' && hours === 12) {
            hours = 0
          }
          formattedTime = `${hours.toString().padStart(2, '0')}:${minutes}`
        } else {
          formattedTime = formData.selectedTime // Already in 24-hour format
        }
      }
      
      const submitData = {
        id: appointment?.id,
        clientName: formData.clientName,
        phone: formData.phone, // Include phone number
        services: formData.services.map(id => typeof id === 'number' ? id : parseInt(id)).filter(id => !isNaN(id)), // Ensure service IDs are numbers
        date: formattedDate,
        time: formattedTime,
        status: formData.status,
        notes: formData.notes
      }

      // Include barber_id if admin is editing (hideBarberSelect is false)
      if (!hideBarberSelect && formData.barber) {
        submitData.barber_id = parseInt(formData.barber)
      }

      onSubmit && onSubmit(submitData)
    }
  }

  const handleCancel = () => {
    setFormData({
      clientName: '',
      phone: '',
      services: [],
      barber: '',
      selectedDate: null,
      selectedTime: '',
      status: 'pending',
      notes: ''
    })
    setErrors({})
    onClose && onClose()
  }

  // Service options for MultiSelect (same format as contact page)
  const serviceOptions = useMemo(() => {
    if (!Array.isArray(services) || services.length === 0) {
      return []
    }
    return services.map(service => ({
      value: service.id,
      label: service.name_en || service.name || service.title || 'Unnamed Service'
    }))
  }, [services])

  // Barber options for FormSelect (admin mode)
  const barberOptions = useMemo(() => {
    if (!Array.isArray(barbers) || barbers.length === 0) {
      return []
    }
    return barbers.map(barber => ({
      value: String(barber.id), // Store as string to match formData.barber
      label: barber.name || 'Unnamed Barber'
    }))
  }, [barbers])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Edit Appointment"
      maxWidth="max-w-3xl"
      footer={
        <div className="sm:flex sm:flex-row-reverse">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            type="button"
            className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-black dark:bg-white text-base font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            onClick={handleCancel}
            type="button"
            disabled={isLoading}
            className="mt-3 w-full inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2.5 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      }
      className={className}
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-5">
          {/* Client Name */}
          <div className="col-span-2 sm:col-span-1">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="client-name"
            >
              Client Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
              </div>
              <input
                id="client-name"
                name="clientName"
                type="text"
                value={formData.clientName}
                onChange={handleInputChange}
                className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm border ${
                  errors.clientName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary shadow-sm`}
                placeholder="Enter client name"
              />
            </div>
            {errors.clientName && (
              <p className="mt-1 text-sm text-red-500">{errors.clientName}</p>
            )}
          </div>

          {/* Phone Number - Using reusable PhoneInput component */}
          <div className="col-span-2 sm:col-span-1">
            <PhoneInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Enter phone number"
              error={errors.phone}
            />
          </div>

          {/* Services - MultiSelect (same as contact page) */}
          <div className="col-span-2">
            <MultiSelect
              label="Services"
              name="services"
              value={formData.services}
              onChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  services: value
                }))
                if (errors.services) {
                  setErrors(prev => ({
                    ...prev,
                    services: ''
                  }))
                }
              }}
              options={serviceOptions}
              placeholder={serviceOptions.length === 0 ? "No services available" : "Select services"}
              required
              error={errors.services}
              icon="content_cut"
            />
            {errors.services && (
              <p className="mt-1 text-sm text-red-500">{errors.services}</p>
            )}
          </div>

          {/* Barber Select (only for admin) */}
          {!hideBarberSelect && (
            <div className="col-span-2">
              <FormSelect
                label="Barber"
                name="barber"
                value={formData.barber}
                onChange={handleBarberChange}
                options={barberOptions}
                placeholder={barberOptions.length === 0 ? "No barbers available" : "Select a barber"}
                required
                error={errors.barber}
                icon="person"
              />
              {errors.barber && (
                <p className="mt-1 text-sm text-red-500">{errors.barber}</p>
              )}
            </div>
          )}

          {/* Date & Time Section - Same layout and behavior as contact page */}
          <div className="col-span-2">
            {!currentBarberId ? (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm flex items-center">
                <span className="material-symbols-outlined mr-2">schedule</span>
                {hideBarberSelect 
                  ? "Barber information is required to see available dates and times."
                  : "Please select a barber to view available dates and times."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Calendar Picker - Shows only available dates based on barber availability */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                    htmlFor="date"
                  >
                    Date
                  </label>
                  {isLoadingDates ? (
                    <div className="flex items-center justify-center py-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <CalendarPicker
                      selectedDate={formData.selectedDate}
                      onDateSelect={handleDateSelect}
                      availableDates={availableDates}
                      unavailableDates={unavailableDates}
                    />
                  )}
                  {errors.date && (
                    <p className="mt-2 text-sm text-red-500">{errors.date}</p>
                  )}
                </div>

                {/* Time Slots - Only shows after date is selected */}
                <div>
                  {isLoadingTimeSlots ? (
                    <div className="flex items-center justify-center py-8 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <TimeSlotSelector
                      timeSlots={availableTimeSlots}
                      selectedTime={formData.selectedTime}
                      onTimeSelect={handleTimeSelect}
                      unavailableSlots={unavailableTimeSlots}
                      columns={2}
                    />
                  )}
                  {errors.time && (
                    <p className="mt-2 text-sm text-red-500">{errors.time}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Status */}
          <div className="col-span-2">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="status"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className={`block w-full py-2.5 px-3 border ${
                errors.status ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              } bg-white dark:bg-gray-800 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm shadow-sm`}
            >
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">{errors.status}</p>
            )}
          </div>

          {/* Notes */}
          <div className="col-span-2">
            <label
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              htmlFor="notes"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="block w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary focus:border-primary sm:text-sm shadow-sm resize-none"
              placeholder="Add any special instructions or notes here..."
              rows="3"
            ></textarea>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default EditAppointmentModal


