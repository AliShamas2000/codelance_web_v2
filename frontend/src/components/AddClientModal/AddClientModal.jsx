import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'
import PhoneInput from '../PhoneInput/PhoneInput'

const AddClientModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  isLoading = false,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: ''
  })
  const [errors, setErrors] = useState({})
  const initialFocusRef = useRef(null)

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: '',
        phone: ''
      })
      setErrors({})
    }
  }, [isOpen])

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

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
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
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isLoading}
        className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-transparent px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        type="submit"
        form="add-client-form"
        disabled={isLoading}
        className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-[#111816] shadow-lg shadow-primary/25 hover:bg-[#0fb37d] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <span className="material-symbols-outlined animate-spin mr-2 text-[18px] inline-block">refresh</span>
            Adding...
          </>
        ) : (
          'Add Client'
        )}
      </button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Client"
      maxWidth="max-w-lg"
      footer={footerContent}
      className={className}
    >
      <form id="add-client-form" className="space-y-5" onSubmit={handleSubmit}>
        {/* Client Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="client-name">
            Client Name
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-gray-400 text-[20px]">person</span>
            </div>
            <input
              ref={initialFocusRef}
              className={`block w-full rounded-xl border ${
                errors.name ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'
              } bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white pl-10 focus:border-primary focus:ring-primary sm:text-sm py-3 transition-colors`}
              id="client-name"
              name="name"
              placeholder="Full name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/* Phone Number */}
        <PhoneInput
          label="Phone Number"
          name="phone"
          id="phone-number"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="Enter phone number"
          error={errors.phone}
        />

      </form>
    </Modal>
  )
}

export default AddClientModal


