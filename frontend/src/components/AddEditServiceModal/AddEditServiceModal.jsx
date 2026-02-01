import React, { useState, useEffect, useRef, useCallback } from 'react'
import servicesApi from '../../api/services'

const AddEditServiceModal = ({
  isOpen,
  onClose,
  service = null, // If provided, we're in edit mode
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    nameEn: '',
    nameAr: '',
    descriptionEn: '',
    descriptionAr: '',
    price: '',
    discountPercentage: '',
    duration: '',
    icon: null,
    iconPreview: null
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  // Initialize form data when service is provided (edit mode)
  useEffect(() => {
    if (service) {
      setFormData({
        nameEn: service.nameEn || service.name_en || '',
        nameAr: service.nameAr || service.name_ar || '',
        descriptionEn: service.descriptionEn || service.description_en || '',
        descriptionAr: service.descriptionAr || service.description_ar || '',
        price: service.price || '',
        discountPercentage: service.discountPercentage || service.discount_percentage || '',
        duration: service.duration || '',
        icon: null,
        iconPreview: service.icon || service.icon_url || null
      })
    } else {
      // Reset form for add mode
      setFormData({
        nameEn: '',
        nameAr: '',
        descriptionEn: '',
        descriptionAr: '',
        price: '',
        discountPercentage: '',
        duration: '',
        icon: null,
        iconPreview: null
      })
    }
    setErrors({})
  }, [service, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          icon: 'Please upload a valid image file (PNG, JPG, GIF)'
        }))
        return
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          icon: 'File size must be less than 5MB'
        }))
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          icon: file,
          iconPreview: reader.result
        }))
      }
      reader.readAsDataURL(file)

      // Clear error
      if (errors.icon) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.icon
          return newErrors
        })
      }
    }
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true)
    }
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current--
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    dragCounter.current = 0

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      icon: null,
      iconPreview: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nameEn.trim()) {
      newErrors.nameEn = 'Service name (EN) is required'
    }

    if (!formData.nameAr.trim()) {
      newErrors.nameAr = 'Service name (AR) is required'
    }

    if (formData.price && isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number'
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative'
    }

    if (formData.discountPercentage && isNaN(parseFloat(formData.discountPercentage))) {
      newErrors.discountPercentage = 'Discount must be a valid number'
    }

    if (formData.discountPercentage && (parseFloat(formData.discountPercentage) < 0 || parseFloat(formData.discountPercentage) > 100)) {
      newErrors.discountPercentage = 'Discount must be between 0 and 100'
    }

    if (formData.duration && isNaN(parseInt(formData.duration))) {
      newErrors.duration = 'Duration must be a valid number'
    }

    if (formData.duration && parseInt(formData.duration) < 0) {
      newErrors.duration = 'Duration cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const serviceData = {
        nameEn: formData.nameEn.trim(),
        nameAr: formData.nameAr.trim() || '',
        descriptionEn: formData.descriptionEn.trim() || '',
        descriptionAr: formData.descriptionAr.trim() || '',
        price: formData.price ? parseFloat(formData.price) : 0,
        discountPercentage: formData.discountPercentage ? parseFloat(formData.discountPercentage) : null,
        duration: formData.duration ? parseInt(formData.duration) : 30, // Use provided duration or default to 30
        category: 'haircut', // Default category
        icon: formData.icon
      }

      if (service) {
        // Edit mode
        await servicesApi.updateService(service.id, serviceData)
      } else {
        // Add mode
        await servicesApi.createService(serviceData)
      }

      // Success - close modal and refresh
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      console.error('Error saving service:', error)
      setErrors({
        submit: error.response?.data?.message || 'Failed to save service. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      nameEn: '',
      nameAr: '',
      descriptionEn: '',
      descriptionAr: '',
      price: '',
      discountPercentage: '',
      duration: '',
      icon: null,
      iconPreview: null
    })
    setErrors({})
    onClose()
  }, [onClose])

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleCancel()
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleCancel])

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e26] shadow-2xl transition-all border border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-5">
          <h3 className="text-xl font-bold text-[#111816] dark:text-white">
            {service ? 'Edit Service' : 'Add New Service'}
          </h3>
          <button
            onClick={handleCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-[#10221c] dark:hover:text-gray-300 focus:outline-none transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-y-auto custom-scrollbar px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Thumbnail Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Thumbnail Image
              </label>
              {formData.iconPreview ? (
                <div className="relative">
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <img
                      src={formData.iconPreview}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex justify-center rounded-lg border-2 border-dashed ${
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 dark:border-gray-600'
                  } px-6 py-8 hover:bg-gray-50 dark:hover:bg-[#152721] transition-colors cursor-pointer group`}
                >
                  <div className="text-center">
                    <div className={`mx-auto h-12 w-12 ${
                      isDragging
                        ? 'text-primary'
                        : 'text-gray-300 dark:text-gray-500 group-hover:text-primary'
                    } transition-colors`}>
                      <span className="material-symbols-outlined text-5xl">cloud_upload</span>
                    </div>
                    <div className="mt-4 flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label
                        className="relative cursor-pointer rounded-md font-medium text-primary hover:text-[#0eb37d] focus-within:outline-none"
                        htmlFor="file-upload"
                      >
                        <span>Upload a file</span>
                        <input
                          ref={fileInputRef}
                          className="sr-only"
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/gif"
                          onChange={handleFileInputChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                </div>
              )}
              {errors.icon && (
                <p className="text-sm text-red-500 mt-1">{errors.icon}</p>
              )}
            </div>

            {/* Service Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="service_name_en"
                >
                  Service Name (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full rounded-lg border ${
                    errors.nameEn
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                  id="service_name_en"
                  placeholder="e.g. Classic Cut"
                  type="text"
                  value={formData.nameEn}
                  onChange={(e) => handleInputChange('nameEn', e.target.value)}
                />
                {errors.nameEn && (
                  <p className="text-sm text-red-500 mt-1">{errors.nameEn}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  dir="rtl"
                  htmlFor="service_name_ar"
                >
                  اسم الخدمة (AR) <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full rounded-lg border ${
                    errors.nameAr
                      ? 'border-red-500'
                      : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 text-right`}
                  dir="rtl"
                  id="service_name_ar"
                  placeholder="مثال: قصة كلاسيكية"
                  type="text"
                  value={formData.nameAr}
                  onChange={(e) => handleInputChange('nameAr', e.target.value)}
                />
                {errors.nameAr && (
                  <p className="text-sm text-red-500 mt-1">{errors.nameAr}</p>
                )}
              </div>
            </div>

            {/* Price, Discount, and Duration Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="price"
                >
                  Price (Optional)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    className={`block w-full rounded-lg border ${
                      errors.price
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-gray-50 dark:bg-[#10221c] pl-7 pr-12 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                    id="price"
                    name="price"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">USD</span>
                  </div>
                </div>
                {errors.price && (
                  <p className="text-sm text-red-500 mt-1">{errors.price}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="discountPercentage"
                >
                  Discount % (Optional)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    className={`block w-full rounded-lg border ${
                      errors.discountPercentage
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-gray-50 dark:bg-[#10221c] px-4 pr-12 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                    id="discountPercentage"
                    name="discountPercentage"
                    placeholder="0"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.discountPercentage}
                    onChange={(e) => handleInputChange('discountPercentage', e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                {errors.discountPercentage && (
                  <p className="text-sm text-red-500 mt-1">{errors.discountPercentage}</p>
                )}
              </div>
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  htmlFor="duration"
                >
                  Duration (Minutes)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    className={`block w-full rounded-lg border ${
                      errors.duration
                        ? 'border-red-500'
                        : 'border-gray-300 dark:border-gray-600'
                    } bg-gray-50 dark:bg-[#10221c] px-4 pr-12 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                    id="duration"
                    name="duration"
                    placeholder="30"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.duration}
                    onChange={(e) => handleInputChange('duration', e.target.value)}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 sm:text-sm">min</span>
                  </div>
                </div>
                {errors.duration && (
                  <p className="text-sm text-red-500 mt-1">{errors.duration}</p>
                )}
              </div>
            </div>

            {/* Description Fields */}
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                htmlFor="desc_en"
              >
                Description (EN)
              </label>
              <textarea
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 resize-none"
                id="desc_en"
                placeholder="Briefly describe the service..."
                rows="3"
                value={formData.descriptionEn}
                onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                dir="rtl"
                htmlFor="desc_ar"
              >
                الوصف (AR)
              </label>
              <textarea
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 text-right resize-none"
                dir="rtl"
                id="desc_ar"
                placeholder="وصف موجز للخدمة..."
                rows="3"
                value={formData.descriptionAr}
                onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
              />
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#152721] px-6 py-4">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="rounded-lg bg-white dark:bg-[#10221c] border border-gray-300 dark:border-gray-600 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-[#111816] shadow-sm hover:bg-[#0eb37d] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
                {service ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              service ? 'Update Service' : 'Add Service'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditServiceModal

