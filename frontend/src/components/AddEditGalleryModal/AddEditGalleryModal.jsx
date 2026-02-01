import React, { useState, useEffect, useRef, useCallback } from 'react'
import galleryApi from '../../api/gallery'
import servicesApi from '../../api/services'

const AddEditGalleryModal = ({
  isOpen,
  onClose,
  image = null, // If provided, we're in edit mode
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    title: '',
    service_id: '',
    description: ''
  })
  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)
  const [isDragging, setIsDragging] = useState(false)

  // Fetch services for dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true)
        const token = localStorage.getItem('auth_token')
        if (token) {
          const response = await servicesApi.getServices({ per_page: 100 })
          setServices(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        setServices([])
      } finally {
        setIsLoadingServices(false)
      }
    }
    if (isOpen) {
      fetchServices()
    }
  }, [isOpen])

  // Initialize form data when image is provided (edit mode)
  useEffect(() => {
    if (image) {
      setFormData({
        image: null,
        imagePreview: image.image || image.image_url || image.url || null,
        title: image.title || image.name || '',
        service_id: image.service_id || image.service?.id || '',
        description: image.description || ''
      })
    } else {
      // Reset form for add mode
      setFormData({
        image: null,
        imagePreview: null,
        title: '',
        service_id: '',
        description: ''
      })
    }
    setErrors({})
  }, [image, isOpen])

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
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload a valid image file (PNG, JPG)'
        }))
        return
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          image: 'File size must be less than 5MB'
        }))
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }))
      }
      reader.readAsDataURL(file)

      // Clear error
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.image
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
      image: null,
      imagePreview: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!image && !formData.image && !formData.imagePreview) {
      newErrors.image = 'Please upload an image'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Service note is required'
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
      const imageData = {
        image: formData.image,
        title: formData.title.trim(),
        service_id: formData.service_id || null,
        description: formData.description.trim()
      }

      if (image) {
        // Edit mode
        await galleryApi.updateGalleryImage(image.id, imageData)
      } else {
        // Add mode - image is required
        if (!formData.image) {
          setErrors({ image: 'Please upload an image' })
          setIsSubmitting(false)
          return
        }
        await galleryApi.createGalleryImage(imageData)
      }

      // Success - close modal and refresh
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      console.error('Error saving gallery image:', error)
      setErrors({
        submit: error.response?.data?.message || 'Failed to save image. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      image: null,
      imagePreview: null,
      title: '',
      service_id: '',
      description: ''
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
        className="relative w-full max-w-xl transform overflow-hidden rounded-2xl bg-white dark:bg-card-dark text-left shadow-2xl transition-all border border-gray-100 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white" id="modal-title">
              {image ? 'Edit Gallery Image' : 'Add New Gallery Image'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {image ? 'Update image details.' : 'Upload a new photo to your showcase.'}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image Upload <span className="text-red-500">*</span>
              </label>
              {formData.imagePreview ? (
                <div className="relative">
                  <div className="relative rounded-xl overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <img
                      src={formData.imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
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
                  className={`flex flex-col justify-center items-center rounded-xl border-2 border-dashed ${
                    isDragging
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-300 dark:border-gray-600'
                  } px-6 py-10 hover:border-primary dark:hover:border-gray-400 transition-colors bg-gray-50 dark:bg-gray-800/50 cursor-pointer group relative overflow-hidden`}
                >
                  <div className="text-center relative z-10">
                    <span className={`material-symbols-outlined text-5xl mb-3 transition-colors ${
                      isDragging
                        ? 'text-primary'
                        : 'text-gray-400 group-hover:text-primary dark:group-hover:text-white'
                    }`}>
                      cloud_upload
                    </span>
                    <div className="mt-2 flex text-sm leading-6 text-gray-600 dark:text-gray-400 justify-center">
                      <label
                        className="relative cursor-pointer rounded-md font-semibold text-primary dark:text-white focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-gray-500"
                        htmlFor="file-upload"
                      >
                        <span>Click to upload</span>
                        <input
                          ref={fileInputRef}
                          className="sr-only"
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleFileInputChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-500 dark:text-gray-500 mt-2">
                      PNG, JPG up to 5MB
                    </p>
                  </div>
                </div>
              )}
              {errors.image && (
                <p className="text-sm text-red-500 mt-1">{errors.image}</p>
              )}
            </div>

            {/* Service Note */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                htmlFor="service-note"
              >
                Service Note <span className="text-red-500">*</span>
              </label>
              <input
                className={`w-full bg-gray-50 dark:bg-gray-800 border ${
                  errors.title ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 transition-colors`}
                id="service-note"
                placeholder="e.g. Fresh Fade with Beard Trim"
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                A brief description of the style or service shown.
              </p>
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            {/* Service */}
            <div>
              <label
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5"
                htmlFor="service"
              >
                Service
              </label>
              <div className="relative">
                <select
                  className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white transition-colors appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                  id="service"
                  value={formData.service_id}
                  onChange={(e) => handleInputChange('service_id', e.target.value)}
                  disabled={isLoadingServices}
                >
                  <option value="">Select a service (optional)</option>
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.nameEn || service.name_en || 'Unnamed Service'}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                  <span className="material-symbols-outlined text-sm">expand_more</span>
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Link this image to a specific service (optional).
              </p>
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
        <div className="bg-gray-50 dark:bg-gray-800/50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex justify-center items-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="material-symbols-outlined animate-spin mr-2 text-sm">refresh</span>
                {image ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              image ? 'Update Image' : 'Add Image'
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="inline-flex justify-center items-center rounded-lg bg-white dark:bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-900 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditGalleryModal


