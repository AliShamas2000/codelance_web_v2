import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'

const BlockTimeModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  isLoading = false,
  selectedDate = '',
  className = ""
}) => {
  const [formData, setFormData] = useState({
    date: selectedDate || new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    reason: ''
  })
  const [errors, setErrors] = useState({})
  const initialFocusRef = useRef(null)

  const quickReasons = ['Lunch Break', 'Personal', 'Meeting']

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: selectedDate || new Date().toISOString().split('T')[0],
        startTime: '',
        endTime: '',
        reason: ''
      })
      setErrors({})
    }
  }, [isOpen, selectedDate])

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

  const handleQuickReasonClick = (reason) => {
    setFormData(prev => ({
      ...prev,
      reason: reason
    }))
    if (errors.reason) {
      setErrors(prev => ({
        ...prev,
        reason: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
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
    
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required'
    }
    
    if (!formData.endTime) {
      newErrors.endTime = 'End time is required'
    }
    
    if (formData.startTime && formData.endTime) {
      const start = new Date(`2000-01-01T${formData.startTime}`)
      const end = new Date(`2000-01-01T${formData.endTime}`)
      if (end <= start) {
        newErrors.endTime = 'End time must be after start time'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit && onSubmit(formData)
    }
  }

  const footerContent = (
    <div className="flex items-center justify-end gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:border-gray-700 dark:bg-surface-dark dark:text-gray-300 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="block-time-form"
        disabled={isLoading}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-[#111816] shadow-lg shadow-primary/20 hover:bg-[#0fb37d] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin mr-2 text-[18px] inline-block">refresh</span>
            Blocking...
          </>
        ) : (
          'Block Time'
        )}
      </button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Block Time"
      titleIcon="block"
      maxWidth="max-w-lg"
      footer={footerContent}
      className={className}
    >
      <form id="block-time-form" className="space-y-5" onSubmit={handleSubmit}>
        {/* Select Date */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="date">
            Select Date
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">
              calendar_today
            </span>
            <input
              ref={initialFocusRef}
              className={`w-full rounded-xl border ${
                errors.date ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              } bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-gray-200 transition-colors`}
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleInputChange}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>
          {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
        </div>

        {/* Start Time and End Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="start-time">
              Start Time
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">
                schedule
              </span>
              <input
                className={`w-full rounded-xl border ${
                  errors.startTime ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-gray-200 transition-colors`}
                id="start-time"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleInputChange}
              />
            </div>
            {errors.startTime && <p className="mt-1 text-xs text-red-500">{errors.startTime}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="end-time">
              End Time
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">
                schedule
              </span>
              <input
                className={`w-full rounded-xl border ${
                  errors.endTime ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
                } bg-gray-50 pl-10 pr-4 py-2.5 text-sm focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-gray-200 transition-colors`}
                id="end-time"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                min={formData.startTime || undefined}
              />
            </div>
            {errors.endTime && <p className="mt-1 text-xs text-red-500">{errors.endTime}</p>}
          </div>
        </div>

        {/* Reason for Blocking */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300" htmlFor="reason">
            Reason for Blocking <span className="text-gray-400 font-normal ml-1">(Optional)</span>
          </label>
          <textarea
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 px-4 py-3 text-sm focus:border-primary focus:ring-primary dark:bg-gray-900 dark:text-gray-200 transition-colors resize-none"
            id="reason"
            name="reason"
            placeholder="e.g. Personal Appointment, Lunch Break..."
            rows="3"
            value={formData.reason}
            onChange={handleInputChange}
          ></textarea>
        </div>

        {/* Quick Reason Buttons */}
        <div className="flex flex-wrap gap-2">
          {quickReasons.map((reason) => (
            <button
              key={reason}
              type="button"
              onClick={() => handleQuickReasonClick(reason)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                formData.reason === reason
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      </form>
    </Modal>
  )
}

export default BlockTimeModal


