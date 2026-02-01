import React, { useState, useEffect } from 'react'
import FormSection from '../FormSection/FormSection'
import FormInput from '../FormInput/FormInput'
import PhoneInput from '../PhoneInput/PhoneInput'
import FormSelect from '../FormSelect/FormSelect'
import MultiSelect from '../MultiSelect/MultiSelect'
import CalendarPicker from '../CalendarPicker/CalendarPicker'
import TimeSlotSelector from '../TimeSlotSelector/TimeSlotSelector'

const AppointmentForm = ({
  initialData = {},
  onSubmit,
  isLoading = false,
  availableTimeSlots = [],
  unavailableTimeSlots = [],
  availableDates = [],
  unavailableDates = [],
  onDateSelect,
  barbers = [],
  services = [],
  onBarberChange,
  onServicesChange,
  isLoadingBarbers = false,
  isLoadingServices = false,
  selectedBarberId = null,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    phone: initialData.phone || '',
    email: initialData.email || '',
    barberId: initialData.barberId || '',
    services: initialData.services || [],
    selectedDate: initialData.selectedDate || null,
    selectedTime: initialData.selectedTime || '',
    notes: initialData.notes || ''
  })

  const [errors, setErrors] = useState({})

  // Reset date and time when barber changes
  useEffect(() => {
    if (formData.barberId) {
      setFormData(prev => ({
        ...prev,
        selectedDate: null,
        selectedTime: ''
      }))
      if (onBarberChange) {
        onBarberChange(formData.barberId)
      }
    }
  }, [formData.barberId])

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
      barberId: value,
      selectedDate: null,
      selectedTime: ''
    }))
    if (errors.barberId) {
      setErrors(prev => ({
        ...prev,
        barberId: ''
      }))
    }
    if (onBarberChange) {
      onBarberChange(value)
    }
  }

  const handleServicesChange = (value) => {
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
    // Notify parent component about services change (to refetch time slots)
    if (onServicesChange) {
      onServicesChange(value)
    }
  }

  const handleDateSelect = (date) => {
    setFormData(prev => ({
      ...prev,
      selectedDate: date,
      selectedTime: '' // Reset time when date changes
    }))
    if (errors.selectedDate) {
      setErrors(prev => ({
        ...prev,
        selectedDate: ''
      }))
    }
    // Clear time slot errors when date changes
    if (errors.selectedTime) {
      setErrors(prev => ({
        ...prev,
        selectedTime: ''
      }))
    }
    // Call parent callback if provided - this will fetch time slots for the selected date
    if (onDateSelect) {
      onDateSelect(date)
    }
  }

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      selectedTime: time
    }))
    if (errors.selectedTime) {
      setErrors(prev => ({
        ...prev,
        selectedTime: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    }

    if (!formData.barberId) {
      newErrors.barberId = 'Please select a barber'
    }

    if (!formData.services || formData.services.length === 0) {
      newErrors.services = 'Please select at least one service'
    }

    if (!formData.selectedDate) {
      newErrors.selectedDate = 'Please select a date'
    }

    if (!formData.selectedTime) {
      newErrors.selectedTime = 'Please select a time slot'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      // Format date as YYYY-MM-DD in local timezone (not UTC)
      let formattedDate = null
      if (formData.selectedDate) {
        const year = formData.selectedDate.getFullYear()
        const month = String(formData.selectedDate.getMonth() + 1).padStart(2, '0')
        const day = String(formData.selectedDate.getDate()).padStart(2, '0')
        formattedDate = `${year}-${month}-${day}`
      }
      
      onSubmit && onSubmit({
        ...formData,
        selectedDate: formattedDate,
        services: formData.services.map(Number) // Ensure service IDs are numbers
      })
    }
  }

  const barberOptions = React.useMemo(() => {
    if (!Array.isArray(barbers) || barbers.length === 0) {
      return []
    }
    return barbers.map(barber => ({
      value: barber.id,
      label: barber.name || 'Unnamed Barber'
    }))
  }, [barbers])

  const serviceOptions = React.useMemo(() => {
    if (!Array.isArray(services) || services.length === 0) {
      return []
    }
    return services.map(service => ({
      value: service.id,
      label: service.name_en || service.name || 'Unnamed Service'
    }))
  }, [services])

  return (
    <form className={`space-y-8 ${className}`} onSubmit={handleSubmit}>
      {/* Section 1: Contact Information */}
      <FormSection stepNumber={1} title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormInput
            label="Full Name"
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            placeholder="John Doe"
            icon="person"
            required
            error={errors.fullName}
          />
          <PhoneInput
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter phone number"
            required
            error={errors.phone}
          />
        </div>
      </FormSection>

      {/* Section 2: Barber & Services */}
      <FormSection stepNumber={2} title="Select Barber & Services" className="pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormSelect
              label="Barber"
              name="barberId"
              value={formData.barberId}
              onChange={handleBarberChange}
              options={barberOptions}
              placeholder={barberOptions.length === 0 ? "No barbers available" : "Select a barber"}
              required
              error={errors.barberId}
              disabled={isLoadingBarbers}
              icon="person"
            />
            {barberOptions.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading barbers...</p>
            )}
          </div>
          <div>
            <MultiSelect
              label="Services"
              name="services"
              value={formData.services}
              onChange={handleServicesChange}
              options={serviceOptions}
              placeholder={serviceOptions.length === 0 ? "No services available" : "Select services"}
              required
              error={errors.services}
              disabled={isLoadingServices}
              icon="content_cut"
            />
            {serviceOptions.length === 0 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Loading services...</p>
            )}
          </div>
        </div>
      </FormSection>

      {/* Section 3: Date & Time */}
      <FormSection stepNumber={3} title="Date & Time" className="pt-4 border-t border-gray-100 dark:border-white/5">
        {!formData.barberId ? (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 rounded-lg text-sm">
            Please select a barber first to see available dates and times.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Calendar Picker */}
            <CalendarPicker
              selectedDate={formData.selectedDate}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
              unavailableDates={unavailableDates}
            />
            {errors.selectedDate && (
              <p className="text-sm text-red-500 mt-2">{errors.selectedDate}</p>
            )}

            {/* Time Slots */}
            <TimeSlotSelector
              timeSlots={availableTimeSlots}
              selectedTime={formData.selectedTime}
              onTimeSelect={handleTimeSelect}
              unavailableSlots={unavailableTimeSlots}
              columns={2}
            />
            {errors.selectedTime && (
              <p className="text-sm text-red-500 mt-2">{errors.selectedTime}</p>
            )}
          </div>
        )}
      </FormSection>

      {/* Section 4: Notes */}
      <FormSection stepNumber={4} title="Additional Notes" className="pt-4 border-t border-gray-100 dark:border-white/5">
        <div className="group">
          <label className="block text-sm font-medium text-text-main dark:text-gray-200 mb-2">
            Additional Notes <span className="text-text-muted font-normal">(Optional)</span>
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Any specific styling requests or allergies?"
            rows="3"
            className="w-full p-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm resize-none"
          />
        </div>
      </FormSection>

      {/* Actions */}
      <div className="pt-2 flex flex-col gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 text-text-main text-base font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <span className="material-symbols-outlined animate-spin">refresh</span>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Confirm Appointment</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </>
          )}
        </button>
        <p className="text-center text-xs text-text-muted dark:text-gray-500">
          By booking, you agree to our Terms of Service. Cancellation is free up to 24h before.
        </p>
      </div>
    </form>
  )
}

export default AppointmentForm
