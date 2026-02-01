import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import CalendarPicker from '../CalendarPicker/CalendarPicker'
import TimeSlotSelector from '../TimeSlotSelector/TimeSlotSelector'
import MultiSelect from '../MultiSelect/MultiSelect'
import PhoneInput from '../PhoneInput/PhoneInput'
import FormInput from '../FormInput/FormInput'
import FormSelect from '../FormSelect/FormSelect'
import appointmentsApi from '../../api/appointments'

const NewSlotModal = ({
  isOpen = false,
  onClose,
  services = [],
  barbers = [],
  onSubmit,
  isLoading = false,
  hideBarberSelect = true, // For barber dashboard, hide barber select (always uses logged-in barber)
  barberId = null, // Barber ID for fetching availability
  className = ""
}) => {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    services: [], // Changed to array for multi-select like edit modal
    selectedBarber: '', // Barber ID for admin (empty string means not selected)
    selectedDate: null, // Changed to Date object like edit modal
    selectedTime: '', // Changed to string in 12-hour format like edit modal
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [availableDates, setAvailableDates] = useState([])
  const [unavailableDates, setUnavailableDates] = useState([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([])
  const [isLoadingDates, setIsLoadingDates] = useState(false)
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)

  // Fetch available dates for the barber (same as edit modal)
  const fetchAvailableDates = async (currentBarberId) => {
    if (!currentBarberId) {
      setAvailableDates([])
      setUnavailableDates([])
      return
    }

    setIsLoadingDates(true)
    try {
      const response = await appointmentsApi.getAvailableDates({ barberId: currentBarberId })
      
      const available = (response.available || []).map(date => {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        return d
      })
      const unavailable = (response.unavailable || []).map(date => {
        const d = new Date(date)
        d.setHours(0, 0, 0, 0)
        return d
      })
      
      setAvailableDates(available)
      setUnavailableDates(unavailable)
    } catch (error) {
      console.error('NewSlotModal: Error fetching available dates:', error)
      setAvailableDates([])
      setUnavailableDates([])
    } finally {
      setIsLoadingDates(false)
    }
  }

  // Fetch available time slots for selected date (same as edit modal)
  const fetchTimeSlots = async (date, currentBarberId) => {
    if (!date || !currentBarberId) {
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
      return
    }

    setIsLoadingTimeSlots(true)
    try {
      // Format date as YYYY-MM-DD in local timezone (not UTC) - same as edit modal
      let dateString
      if (typeof date === 'string') {
        dateString = date
      } else {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        dateString = `${year}-${month}-${day}`
      }
      // Use same API call signature as edit modal
      const response = await appointmentsApi.getAvailableTimeSlots(dateString, currentBarberId)
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

  // Get the current barber ID (either from prop or selected barber)
  const currentBarberId = hideBarberSelect ? barberId : (formData.selectedBarber ? parseInt(formData.selectedBarber) : null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        clientName: '',
        phone: '',
        services: [],
        selectedBarber: '',
        selectedDate: null,
        selectedTime: '',
        notes: ''
      })
      setErrors({})
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
      setAvailableDates([])
      setUnavailableDates([])
      
      // Fetch available dates when modal opens (only if barber is already known)
      if (hideBarberSelect && barberId) {
        fetchAvailableDates(barberId)
      }
    }
  }, [isOpen, barberId, hideBarberSelect])

  // Fetch available dates when barber is selected (for admin)
  useEffect(() => {
    if (!hideBarberSelect && formData.selectedBarber) {
      const selectedBarberId = parseInt(formData.selectedBarber)
      fetchAvailableDates(selectedBarberId)
      // Reset date and time when barber changes
      setFormData(prev => ({
        ...prev,
        selectedDate: null,
        selectedTime: ''
      }))
    }
  }, [formData.selectedBarber, hideBarberSelect])

  // Fetch time slots when date is selected
  useEffect(() => {
    if (formData.selectedDate && currentBarberId) {
      fetchTimeSlots(formData.selectedDate, currentBarberId)
    } else {
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
    }
  }, [formData.selectedDate, currentBarberId])

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

  const handlePhoneChange = (event) => {
    // PhoneInput passes an event object with target.value, extract the value
    // Ensure we always get a string value
    let phoneValue = ''
    if (event && typeof event === 'object' && event.target) {
      phoneValue = event.target.value || ''
    } else if (typeof event === 'string') {
      phoneValue = event
    } else {
      phoneValue = ''
    }
    
    // Ensure phoneValue is always a string (never an object)
    phoneValue = String(phoneValue || '')
    
    setFormData(prev => ({
      ...prev,
      phone: phoneValue
    }))
    if (errors.phone) {
      setErrors(prev => ({
        ...prev,
        phone: ''
      }))
    }
  }

  const handleDateSelect = (date) => {
    // Same as edit modal - store Date object and reset time
    setFormData(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: '' // Reset time when date changes
    }))
    // Clear errors
    if (errors.selectedDate) {
      setErrors(prev => ({
        ...prev,
        selectedDate: ''
      }))
    }
    if (errors.selectedTime) {
      setErrors(prev => ({
        ...prev,
        selectedTime: ''
      }))
    }
  }

  const handleTimeSelect = (time) => {
    // Same as edit modal - store time as 12-hour format string
    setFormData(prev => ({
      ...prev,
      selectedTime: time
    }))
    // Clear time error when time is selected
    if (errors.selectedTime) {
      setErrors(prev => ({
        ...prev,
        selectedTime: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.services || formData.services.length === 0) {
      newErrors.services = 'Please select at least one service'
    }

    // Barber selection is required for admin
    if (!hideBarberSelect && !formData.selectedBarber) {
      newErrors.selectedBarber = 'Please select a barber'
    }

    if (!formData.selectedDate) {
      newErrors.selectedDate = 'Date is required'
    }

    if (!formData.selectedTime) {
      newErrors.selectedTime = 'Time is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      // Format date as YYYY-MM-DD in local timezone (same as edit modal)
      let formattedDate = null
      if (formData.selectedDate) {
        const year = formData.selectedDate.getFullYear()
        const month = String(formData.selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(formData.selectedDate.getDate()).padStart(2, '0')
        formattedDate = `${year}-${month}-${day}`
      }
      
      // Convert 12-hour time to 24-hour format for backend
      let formattedTime = null
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
          formattedTime = `${String(hours).padStart(2, '0')}:${minutes}:00`
        } else {
          formattedTime = formData.selectedTime // Already in 24-hour format
        }
      }
      
      onSubmit && onSubmit({
        clientName: formData.clientName,
        phone: formData.phone,
        email: null, // Email not required for barber appointments
        services: formData.services.map(Number), // Ensure service IDs are numbers
        date: formattedDate,
        time: formattedTime,
        notes: formData.notes || null,
        barberId: currentBarberId // Use current barber ID (from prop or selected)
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      clientName: '',
      phone: '',
      services: [],
      selectedBarber: '',
      selectedDate: null,
      selectedTime: '',
      notes: ''
    })
    setErrors({})
    setAvailableDates([])
    setUnavailableDates([])
    setAvailableTimeSlots([])
    setUnavailableTimeSlots([])
    onClose && onClose()
  }

  // Service options for MultiSelect (same format as edit modal)
  const serviceOptions = React.useMemo(() => {
    if (!Array.isArray(services) || services.length === 0) {
      return []
    }
    return services.map(service => ({
      value: service.id,
      label: service.name_en || service.name || service.title || 'Unnamed Service'
    }))
  }, [services])

  // Barber options for FormSelect (admin only)
  const barberOptions = React.useMemo(() => {
    if (hideBarberSelect || !Array.isArray(barbers) || barbers.length === 0) {
      return []
    }
    return barbers.map(barber => ({
      value: barber.id.toString(),
      label: barber.name || `${barber.first_name || ''} ${barber.last_name || ''}`.trim() || 'Barber'
    }))
  }, [barbers, hideBarberSelect])

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      title="Schedule New Appointment"
      maxWidth="max-w-3xl"
      footer={
        <div className="sm:flex sm:flex-row-reverse">
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            type="button"
            className="w-full inline-flex justify-center rounded-lg border border-transparent shadow-sm px-4 py-2.5 bg-black dark:bg-white text-base font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Booking...' : 'Book Appointment'}
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
            <FormInput
              label="Client Name"
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleInputChange}
              placeholder="Enter client name"
              icon="person"
              required
              error={errors.clientName}
            />
          </div>

          {/* Phone Number - Using reusable PhoneInput component */}
          <div className="col-span-2 sm:col-span-1">
            <PhoneInput
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handlePhoneChange}
              placeholder="Enter phone number"
              required
              error={errors.phone}
              defaultCountry="LB"
            />
          </div>

          {/* Barber Select (Admin only) */}
          {!hideBarberSelect && (
            <div className="col-span-2">
              <FormSelect
                label="Barber"
                name="selectedBarber"
                value={formData.selectedBarber}
                onChange={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    selectedBarber: value,
                    selectedDate: null, // Reset date when barber changes
                    selectedTime: '' // Reset time when barber changes
                  }))
                  if (errors.selectedBarber) {
                    setErrors(prev => ({
                      ...prev,
                      selectedBarber: ''
                    }))
                  }
                }}
                options={barberOptions}
                placeholder={barberOptions.length === 0 ? "No barbers available" : "Select a barber"}
                required
                error={errors.selectedBarber}
                icon="person"
              />
              {errors.selectedBarber && (
                <p className="mt-1 text-sm text-red-500">{errors.selectedBarber}</p>
              )}
            </div>
          )}

          {/* Services - MultiSelect (same as edit modal) */}
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

          {/* Date & Time Section - Same layout and behavior as edit modal */}
          <div className="col-span-2">
            {!currentBarberId ? (
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 rounded-lg text-sm flex items-center">
                <span className="material-symbols-outlined mr-2">schedule</span>
                {hideBarberSelect 
                  ? "Loading barber availability..."
                  : "Please select a barber to see available dates and times"}
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
                  {errors.selectedDate && (
                    <p className="mt-1 text-sm text-red-500">{errors.selectedDate}</p>
                  )}
                </div>

                {/* Time Slot Selector */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
                    htmlFor="time"
                  >
                    Time
                  </label>
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
                  {errors.selectedTime && (
                    <p className="mt-1 text-sm text-red-500">{errors.selectedTime}</p>
                  )}
                </div>
              </div>
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

export default NewSlotModal
