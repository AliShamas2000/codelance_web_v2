import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ContactSection from '../../components/ContactSection/ContactSection'
import AppointmentSuccessModal from '../../components/AppointmentSuccessModal/AppointmentSuccessModal'
import appointmentApi from '../../api/appointments'

const ContactPage = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [barbers, setBarbers] = useState([])
  const [services, setServices] = useState([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [unavailableTimeSlots, setUnavailableTimeSlots] = useState([])
  const [availableDates, setAvailableDates] = useState([])
  const [unavailableDates, setUnavailableDates] = useState([])
  const [selectedBarberId, setSelectedBarberId] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null) // Track selected date
  const [selectedServices, setSelectedServices] = useState([]) // Track selected services
  const [contactInfo, setContactInfo] = useState(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [createdAppointment, setCreatedAppointment] = useState(null)
  const [isLoadingBarbers, setIsLoadingBarbers] = useState(true)
  const [isLoadingServices, setIsLoadingServices] = useState(true)

  // Fetch barbers
  const fetchBarbers = async () => {
    setIsLoadingBarbers(true)
    try {
      const response = await appointmentApi.getBarbers()
      // API returns {success: true, data: [...]}
      // appointmentApi.getBarbers() already returns response.data from axios
      // So response is {success: true, data: [...]}
      const barbersData = (response && response.data) ? response.data : (response || [])
      console.log('Fetched barbers:', barbersData)
      setBarbers(Array.isArray(barbersData) ? barbersData : [])
    } catch (error) {
      console.error('Error fetching barbers:', error)
      setBarbers([])
    } finally {
      setIsLoadingBarbers(false)
    }
  }

  // Fetch services
  const fetchServices = async () => {
    setIsLoadingServices(true)
    try {
      const response = await appointmentApi.getServices()
      // API returns {success: true, data: [...]}
      // appointmentApi.getServices() already returns response.data from axios
      // So response is {success: true, data: [...]}
      const servicesData = (response && response.data) ? response.data : (response || [])
      console.log('Fetched services:', servicesData)
      setServices(Array.isArray(servicesData) ? servicesData : [])
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    } finally {
      setIsLoadingServices(false)
    }
  }

  // Fetch available dates for selected barber
  const fetchAvailableDates = async (barberId) => {
    if (!barberId) {
      setAvailableDates([])
      setUnavailableDates([])
      return
    }

    try {
      const response = await appointmentApi.getAvailableDates({ barberId })
      // Convert date strings to Date objects for calendar
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
      console.log('Available dates:', available.map(d => d.toISOString().split('T')[0]))
      console.log('Unavailable dates:', unavailable.map(d => d.toISOString().split('T')[0]))
      setAvailableDates(available)
      setUnavailableDates(unavailable)
    } catch (error) {
      console.error('Error fetching available dates:', error)
      setAvailableDates([])
      setUnavailableDates([])
    }
  }

  // Fetch available time slots for selected barber and date
  const fetchTimeSlots = async (date, barberId, serviceIds = []) => {
    if (!date || !barberId) {
      console.log('fetchTimeSlots: Missing date or barberId', { date, barberId })
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
      return
    }

    try {
      // Format date as YYYY-MM-DD in local timezone (not UTC)
      let dateString
      if (typeof date === 'string') {
        dateString = date
      } else {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        dateString = `${year}-${month}-${day}`
      }
      console.log('fetchTimeSlots: Fetching slots for', { dateString, barberId, serviceIds, originalDate: date })
      const response = await appointmentApi.getAvailableTimeSlots(dateString, barberId, serviceIds)
      console.log('fetchTimeSlots: Response received', { 
        availableCount: response.available?.length || 0, 
        unavailableCount: response.unavailable?.length || 0,
        available: response.available,
        unavailable: response.unavailable
      })
      setAvailableTimeSlots(response.available || [])
      setUnavailableTimeSlots(response.unavailable || [])
    } catch (error) {
      console.error('Error fetching time slots:', error)
      console.error('Error details:', error.response?.data || error.message)
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
    }
  }

  // Fetch contact information
  const fetchContactInfo = async () => {
    try {
      const data = await appointmentApi.getContactInfo()
      // getContactInfo returns formatted data or default, so it won't throw
      setContactInfo(data)
    } catch (error) {
      console.error('Error fetching contact info:', error)
      // Use default contact info on error
      setContactInfo(null)
    }
  }

  useEffect(() => {
    fetchBarbers()
    fetchServices()
    fetchContactInfo()
  }, [])

  // Fetch dates when barber changes
  useEffect(() => {
    if (selectedBarberId) {
      fetchAvailableDates(selectedBarberId)
    }
  }, [selectedBarberId])

  // Handle barber selection change
  const handleBarberChange = (barberId) => {
    setSelectedBarberId(barberId)
    // Clear time slots when barber changes
    setAvailableTimeSlots([])
    setUnavailableTimeSlots([])
    
    // If a date was already selected, refetch time slots for the new barber
    if (selectedDate && barberId) {
      fetchTimeSlots(selectedDate, barberId, selectedServices)
    }
  }

  // Handle services selection change
  const handleServicesChange = (services) => {
    setSelectedServices(services)
    // Refetch time slots if date and barber are already selected
    if (selectedDate && selectedBarberId) {
      fetchTimeSlots(selectedDate, selectedBarberId, services)
    }
  }

  // Handle date selection to fetch time slots
  const handleDateSelect = (date) => {
    console.log('handleDateSelect called', { date, selectedBarberId, selectedServices })
    setSelectedDate(date) // Store the selected date
    
    // Clear time slots when date is cleared
    if (!date) {
      console.log('handleDateSelect: Date cleared, clearing time slots')
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
      return
    }
    
    // Only fetch time slots if both date and barber are selected
    if (date && selectedBarberId) {
      console.log('handleDateSelect: Fetching time slots for date and barber', { date, selectedBarberId, selectedServices })
      fetchTimeSlots(date, selectedBarberId, selectedServices)
    } else {
      // Clear time slots if barber is not selected
      console.log('handleDateSelect: Barber not selected, clearing time slots')
      setAvailableTimeSlots([])
      setUnavailableTimeSlots([])
    }
  }

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsLoading(true)
    try {
      const response = await appointmentApi.createAppointment({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email || null,
        barberId: formData.barberId,
        services: formData.services,
        selectedDate: formData.selectedDate,
        selectedTime: formData.selectedTime,
        notes: formData.notes || null
      })
      
      setCreatedAppointment(response.data)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error creating appointment:', error)
      const errorMessage = error.response?.data?.message || 'Failed to book appointment. Please try again.'
      alert(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Default contact info (fallback)
  const defaultContactInfo = {
    title: "Premium Experience",
    description: "Relax in our modern studio while our master stylists take care of your look.",
    address: {
      title: "Our Studio",
      line1: "123 Fashion Ave, Suite 101",
      line2: "New York, NY 10012"
    },
    contact: {
      title: "Contact Us",
      phone: "+1 (555) 000-0000",
      email: "hello@luxecuts.com"
    }
  }

  const infoPanelProps = contactInfo || defaultContactInfo

  return (
    <>
      <ContactSection
        infoPanelProps={infoPanelProps}
        formProps={{
          onSubmit: handleSubmit,
          isLoading,
          availableTimeSlots,
          unavailableTimeSlots,
          availableDates,
          unavailableDates,
          onDateSelect: handleDateSelect,
          barbers,
          services,
          onBarberChange: handleBarberChange,
          isLoadingBarbers,
          isLoadingServices,
          selectedBarberId
        }}
      />
      
      <AppointmentSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          // Optionally reset form or navigate
        }}
        onBackToHome={() => {
          setShowSuccessModal(false)
          navigate('/')
        }}
        appointment={createdAppointment}
      />
    </>
  )
}

export default ContactPage

