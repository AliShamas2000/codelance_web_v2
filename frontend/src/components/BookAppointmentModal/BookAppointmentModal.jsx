import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import barberApi from '../../api/barber'
import PhoneInput from '../PhoneInput/PhoneInput'

const BookAppointmentModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  services = [],
  clients = [],
  selectedDate = '',
  isLoading = false,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    clientId: '',
    clientName: '',
    clientPhone: '',
    service: '',
    date: selectedDate || new Date().toISOString().split('T')[0],
    time: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [clientMode, setClientMode] = useState('existing') // 'existing' or 'new'
  const [clientSearchQuery, setClientSearchQuery] = useState('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState([])
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false)
  const [filteredClients, setFilteredClients] = useState([])
  const initialFocusRef = useRef(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        clientId: '',
        clientName: '',
        clientPhone: '',
        service: '',
        date: selectedDate || new Date().toISOString().split('T')[0],
        time: '',
        notes: ''
      })
      setErrors({})
      setClientMode('existing')
      setClientSearchQuery('')
      setAvailableTimeSlots([])
    }
  }, [isOpen, selectedDate])

  // Filter clients based on search query
  useEffect(() => {
    if (clientSearchQuery.trim()) {
      const filtered = clients.filter(client => {
        const nameMatch = client.name?.toLowerCase().includes(clientSearchQuery.toLowerCase())
        const phoneMatch = client.phone?.includes(clientSearchQuery)
        return nameMatch || phoneMatch
      })
      setFilteredClients(filtered)
    } else {
      setFilteredClients([])
    }
  }, [clientSearchQuery, clients])

  // Fetch available time slots when date changes
  useEffect(() => {
    if (isOpen && formData.date && formData.service) {
      fetchAvailableTimeSlots()
    }
  }, [formData.date, formData.service, isOpen])

  const fetchAvailableTimeSlots = async () => {
    if (!formData.date || !formData.service) return

    setIsLoadingTimeSlots(true)
    try {
      const data = await barberApi.getAvailableTimeSlots({
        date: formData.date,
        service_id: formData.service
      })
      setAvailableTimeSlots(data.timeSlots || data.available_slots || [])
    } catch (error) {
      console.error('Error fetching time slots:', error)
      setAvailableTimeSlots([])
    } finally {
      setIsLoadingTimeSlots(false)
    }
  }

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
    // Clear time when date or service changes
    if (name === 'date' || name === 'service') {
      setFormData(prev => ({ ...prev, time: '' }))
    }
  }

  const handleClientSelect = (client) => {
    setFormData(prev => ({
      ...prev,
      clientId: client.id,
      clientName: client.name,
      clientPhone: client.phone
    }))
    setClientSearchQuery(client.name)
    setFilteredClients([])
    if (errors.clientId) {
      setErrors(prev => ({ ...prev, clientId: '' }))
    }
  }

  const handleClientModeChange = (mode) => {
    setClientMode(mode)
    setFormData(prev => ({
      ...prev,
      clientId: '',
      clientName: '',
      clientPhone: ''
    }))
    setClientSearchQuery('')
    setErrors(prev => ({
      ...prev,
      clientId: '',
      clientName: '',
      clientPhone: ''
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (clientMode === 'existing') {
      if (!formData.clientId) {
        newErrors.clientId = 'Please select a client'
      }
    } else {
      if (!formData.clientName.trim()) {
        newErrors.clientName = 'Client name is required'
      }
      if (!formData.clientPhone.trim()) {
        newErrors.clientPhone = 'Phone number is required'
      } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.clientPhone)) {
        newErrors.clientPhone = 'Please enter a valid phone number'
      }
    }
    
    if (!formData.service) {
      newErrors.service = 'Service is required'
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required'
    } else {
      const selectedDate = new Date(formData.date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (selectedDate < today) {
        newErrors.date = 'Date cannot be in the past'
      }
    }
    
    if (!formData.time) {
      newErrors.time = 'Time slot is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      const submitData = {
        client_id: clientMode === 'existing' ? formData.clientId : null,
        client_name: clientMode === 'new' ? formData.clientName : null,
        client_phone: clientMode === 'new' ? formData.clientPhone : null,
        service_id: formData.service,
        date: formData.date,
        time: formData.time,
        notes: formData.notes || null
      }
      onSubmit && onSubmit(submitData)
    }
  }

  const footerContent = (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="book-appointment-form"
        disabled={isLoading || isLoadingTimeSlots}
        className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-[#111816] font-bold shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
            Booking...
          </>
        ) : (
          <>
            <span className="material-symbols-outlined text-[20px]">check</span>
            Book Appointment
          </>
        )}
      </button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Appointment"
      titleIcon="calendar_add_on"
      maxWidth="max-w-2xl"
      footer={footerContent}
      className={className}
    >
      <form id="book-appointment-form" className="space-y-6" onSubmit={handleSubmit}>
        {/* Client Selection */}
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Client
            </label>
            <div className="flex gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleClientModeChange('existing')}
                className={`font-medium transition-colors ${
                  clientMode === 'existing'
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Select Existing
              </button>
              <span className="text-gray-300">|</span>
              <button
                type="button"
                onClick={() => handleClientModeChange('new')}
                className={`font-medium transition-colors ${
                  clientMode === 'new'
                    ? 'text-primary'
                    : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                Create New
              </button>
            </div>
          </div>

          {clientMode === 'existing' ? (
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
              </div>
              <input
                ref={initialFocusRef}
                className={`block w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border ${
                  errors.clientId ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder-gray-400`}
                placeholder="Search client by name or phone..."
                type="text"
                value={clientSearchQuery}
                onChange={(e) => setClientSearchQuery(e.target.value)}
              />
              {filteredClients.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredClients.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => handleClientSelect(client)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className="font-medium text-gray-900 dark:text-white">{client.name}</div>
                      <div className="text-xs text-gray-500">{client.phone}</div>
                    </button>
                  ))}
                </div>
              )}
              {formData.clientId && (
                <div className="mt-2 px-3 py-2 bg-primary/10 rounded-lg">
                  <span className="text-sm font-medium text-primary">
                    Selected: {formData.clientName} ({formData.clientPhone})
                  </span>
                </div>
              )}
              {errors.clientId && <p className="mt-1 text-xs text-red-500">{errors.clientId}</p>}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 p-4 border border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-black/10">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
                <input
                  className={`block w-full px-3 py-2 bg-white dark:bg-surface-dark border ${
                    errors.clientName ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                  } rounded-lg text-sm focus:border-primary focus:ring-0 transition-colors`}
                  placeholder="e.g. John Doe"
                  type="text"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange({ target: { name: 'clientName', value: e.target.value } })}
                />
                {errors.clientName && <p className="mt-1 text-xs text-red-500">{errors.clientName}</p>}
              </div>
              <div>
                <PhoneInput
                  label="Phone Number"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange({ target: { name: 'clientPhone', value: e.target.value } })}
                  placeholder="Enter phone number"
                  error={errors.clientPhone}
                  className="mb-0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Service */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Service
          </label>
          <div className="relative">
            <select
              className={`block w-full px-4 py-2.5 bg-gray-50 dark:bg-black/20 border ${
                errors.service ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              } rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all`}
              name="service"
              value={formData.service}
              onChange={handleInputChange}
            >
              <option value="">Select a service...</option>
              {services.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name} ({service.duration || 'N/A'}) - ${service.price || 'N/A'}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-gray-500">expand_more</span>
            </div>
          </div>
          {errors.service && <p className="mt-1 text-xs text-red-500">{errors.service}</p>}
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Date
            </label>
            <div className="relative">
              <input
                className={`block w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border ${
                  errors.date ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">calendar_today</span>
              </div>
            </div>
            {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Available Time
            </label>
            <div className="relative">
              <select
                className={`block w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-black/20 border ${
                  errors.time ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none transition-all`}
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                disabled={isLoadingTimeSlots || !formData.date || !formData.service}
              >
                <option value="">
                  {isLoadingTimeSlots ? 'Loading...' : !formData.date || !formData.service ? 'Select date and service first' : 'Select time...'}
                </option>
                {availableTimeSlots.map((slot, index) => (
                  <option
                    key={index}
                    value={slot.time}
                    disabled={slot.disabled}
                  >
                    {slot.label || slot.time} {slot.disabled ? '(Break)' : slot.squeeze ? '(Squeeze in)' : ''}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-400 text-[20px]">schedule</span>
              </div>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-gray-500">expand_more</span>
              </div>
            </div>
            {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time}</p>}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Notes <span className="text-gray-400 font-normal text-xs ml-1">(Optional)</span>
          </label>
          <textarea
            className="block w-full px-4 py-3 bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
            placeholder="Any special requests or details..."
            rows="3"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          ></textarea>
        </div>
      </form>
    </Modal>
  )
}

export default BookAppointmentModal


