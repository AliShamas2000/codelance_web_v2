import React, { useState, useEffect, useRef, useCallback } from 'react'
import bannersApi from '../../api/banners'
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch'

const AddEditBannerModal = ({
  isOpen,
  onClose,
  banner = null, // If provided, we're in edit mode
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    desktopImage: null,
    desktopImagePreview: null,
    mobileImage: null,
    mobileImagePreview: null,
    title: '',
    buttonTextEn: '',
    buttonTextAr: '',
    buttonUrl: '',
    isActive: true
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const desktopFileInputRef = useRef(null)
  const mobileFileInputRef = useRef(null)
  const desktopDragCounter = useRef(0)
  const mobileDragCounter = useRef(0)
  const [isDesktopDragging, setIsDesktopDragging] = useState(false)
  const [isMobileDragging, setIsMobileDragging] = useState(false)

  // Initialize form data when banner is provided (edit mode)
  useEffect(() => {
    if (banner) {
      setFormData({
        desktopImage: null,
        desktopImagePreview: banner.desktopImage || banner.desktop_image || banner.image_desktop || null,
        mobileImage: null,
        mobileImagePreview: banner.mobileImage || banner.mobile_image || banner.image_mobile || null,
        title: banner.title || banner.name || '',
        buttonTextEn: banner.buttonTextEn || banner.button_text_en || banner.buttonText || '',
        buttonTextAr: banner.buttonTextAr || banner.button_text_ar || '',
        buttonUrl: banner.buttonUrl || banner.button_url || banner.target_url || '',
        isActive: banner.isActive !== undefined ? banner.isActive : (banner.is_active !== undefined ? banner.is_active : banner.status === 'active')
      })
    } else {
      // Reset form for add mode
      setFormData({
        desktopImage: null,
        desktopImagePreview: null,
        mobileImage: null,
        mobileImagePreview: null,
        title: '',
        buttonTextEn: '',
        buttonTextAr: '',
        buttonUrl: '',
        isActive: true
      })
    }
    setErrors({})
  }, [banner, isOpen])

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

  const handleFileSelect = (file, type) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [type]: 'Please upload a valid image file (PNG, JPG)'
        }))
        return
      }

      // Validate file size (5MB max)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [type]: 'File size must be less than 5MB'
        }))
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        if (type === 'desktopImage') {
          setFormData(prev => ({
            ...prev,
            desktopImage: file,
            desktopImagePreview: reader.result
          }))
        } else {
          setFormData(prev => ({
            ...prev,
            mobileImage: file,
            mobileImagePreview: reader.result
          }))
        }
      }
      reader.readAsDataURL(file)

      // Clear error
      if (errors[type]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[type]
          return newErrors
        })
      }
    }
  }

  const handleDesktopFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file, 'desktopImage')
    }
  }

  const handleMobileFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file, 'mobileImage')
    }
  }

  const handleDesktopDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    desktopDragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDesktopDragging(true)
    }
  }

  const handleDesktopDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    desktopDragCounter.current--
    if (desktopDragCounter.current === 0) {
      setIsDesktopDragging(false)
    }
  }

  const handleDesktopDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDesktopDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDesktopDragging(false)
    desktopDragCounter.current = 0

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file, 'desktopImage')
    }
  }

  const handleMobileDragEnter = (e) => {
    e.preventDefault()
    e.stopPropagation()
    mobileDragCounter.current++
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsMobileDragging(true)
    }
  }

  const handleMobileDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    mobileDragCounter.current--
    if (mobileDragCounter.current === 0) {
      setIsMobileDragging(false)
    }
  }

  const handleMobileDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleMobileDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsMobileDragging(false)
    mobileDragCounter.current = 0

    const file = e.dataTransfer.files?.[0]
    if (file) {
      handleFileSelect(file, 'mobileImage')
    }
  }

  const handleRemoveImage = (type) => {
    if (type === 'desktop') {
      setFormData(prev => ({
        ...prev,
        desktopImage: null,
        desktopImagePreview: null
      }))
      if (desktopFileInputRef.current) {
        desktopFileInputRef.current.value = ''
      }
    } else {
      setFormData(prev => ({
        ...prev,
        mobileImage: null,
        mobileImagePreview: null
      }))
      if (mobileFileInputRef.current) {
        mobileFileInputRef.current.value = ''
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!banner && !formData.desktopImage && !formData.desktopImagePreview) {
      newErrors.desktopImage = 'Desktop image is required'
    }

    if (!banner && !formData.mobileImage && !formData.mobileImagePreview) {
      newErrors.mobileImage = 'Mobile image is required'
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Banner title is required'
    }

    if (!formData.buttonTextEn.trim()) {
      newErrors.buttonTextEn = 'Button text (EN) is required'
    }

    if (!formData.buttonUrl.trim()) {
      newErrors.buttonUrl = 'Button URL is required'
    } else {
      // Basic URL validation
      try {
        new URL(formData.buttonUrl)
      } catch (e) {
        newErrors.buttonUrl = 'Please enter a valid URL'
      }
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
      const bannerData = {
        desktopImage: formData.desktopImage,
        mobileImage: formData.mobileImage,
        title: formData.title.trim(),
        buttonTextEn: formData.buttonTextEn.trim(),
        buttonTextAr: formData.buttonTextAr.trim(),
        buttonUrl: formData.buttonUrl.trim(),
        isActive: formData.isActive
      }

      if (banner) {
        // Edit mode
        await bannersApi.updateBanner(banner.id, bannerData)
      } else {
        // Add mode - images are required
        if (!formData.desktopImage && !formData.desktopImagePreview) {
          setErrors({ desktopImage: 'Desktop image is required' })
          setIsSubmitting(false)
          return
        }
        if (!formData.mobileImage && !formData.mobileImagePreview) {
          setErrors({ mobileImage: 'Mobile image is required' })
          setIsSubmitting(false)
          return
        }
        await bannersApi.createBanner(bannerData)
      }

      // Success - close modal and refresh
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      console.error('Error saving banner:', error)
      setErrors({
        submit: error.response?.data?.message || 'Failed to save banner. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      desktopImage: null,
      desktopImagePreview: null,
      mobileImage: null,
      mobileImagePreview: null,
      title: '',
      buttonTextEn: '',
      buttonTextAr: '',
      buttonUrl: '',
      isActive: true
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-[#152a23] shadow-2xl transition-all flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-white dark:bg-[#152a23]">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white" id="modal-title">
              {banner ? 'Edit Banner' : 'Add New Banner'}
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {banner ? 'Update image assets and call-to-action details.' : 'Create a new promotional banner.'}
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="rounded-full p-2 text-slate-400 hover:text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
            type="button"
          >
            <span className="sr-only">Close</span>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-white dark:bg-[#152a23] custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Images Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Desktop Image */}
              <div className="md:col-span-2 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Desktop Image <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">Ratio 3:1</span>
                </div>
                {formData.desktopImagePreview ? (
                  <div className="group relative w-full aspect-[3/1] bg-slate-50 dark:bg-black/20 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-white/10">
                    <img
                      alt="Desktop Preview"
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      src={formData.desktopImagePreview}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('desktop')}
                        className="bg-white/90 dark:bg-[#10221c]/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform"
                      >
                        <span className="material-symbols-outlined text-primary text-sm">delete</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">Remove</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => desktopFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
                    >
                      <div className="bg-white/90 dark:bg-[#10221c]/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <span className="material-symbols-outlined text-primary text-sm">upload_file</span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">Replace Image</span>
                      </div>
                    </button>
                    <input
                      ref={desktopFileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleDesktopFileInputChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDesktopDragEnter}
                    onDragOver={handleDesktopDragOver}
                    onDragLeave={handleDesktopDragLeave}
                    onDrop={handleDesktopDrop}
                    onClick={() => desktopFileInputRef.current?.click()}
                    className={`group relative w-full aspect-[3/1] bg-slate-50 dark:bg-black/20 rounded-xl overflow-hidden border-2 border-dashed ${
                      isDesktopDragging
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50'
                    } transition-all cursor-pointer`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
                        <p className="text-xs text-slate-500">Click or drag to upload</p>
                      </div>
                    </div>
                    <input
                      ref={desktopFileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleDesktopFileInputChange}
                      className="hidden"
                    />
                  </div>
                )}
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Recommended dimensions: 1920 x 640 px
                </p>
                {errors.desktopImage && (
                  <p className="text-sm text-red-500">{errors.desktopImage}</p>
                )}
              </div>

              {/* Mobile Image */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Mobile Image <span className="text-red-500">*</span>
                  </label>
                  <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/5 px-2 py-0.5 rounded">Ratio 1:1</span>
                </div>
                {formData.mobileImagePreview ? (
                  <div className="group relative w-full aspect-square bg-slate-50 dark:bg-black/20 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-white/10">
                    <img
                      alt="Mobile Preview"
                      className="w-full h-full object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                      src={formData.mobileImagePreview}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                      <button
                        type="button"
                        onClick={() => handleRemoveImage('mobile')}
                        className="bg-white/90 dark:bg-[#10221c]/90 backdrop-blur-sm p-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform"
                      >
                        <span className="material-symbols-outlined text-primary">delete</span>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => mobileFileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300"
                    >
                      <div className="bg-white/90 dark:bg-[#10221c]/90 backdrop-blur-sm p-2 rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                        <span className="material-symbols-outlined text-primary">upload_file</span>
                      </div>
                    </button>
                    <input
                      ref={mobileFileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleMobileFileInputChange}
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div
                    onDragEnter={handleMobileDragEnter}
                    onDragOver={handleMobileDragOver}
                    onDragLeave={handleMobileDragLeave}
                    onDrop={handleMobileDrop}
                    onClick={() => mobileFileInputRef.current?.click()}
                    className={`group relative w-full aspect-square bg-slate-50 dark:bg-black/20 rounded-xl overflow-hidden border-2 border-dashed ${
                      isMobileDragging
                        ? 'border-primary/50 bg-primary/10'
                        : 'border-slate-200 dark:border-white/10 hover:border-primary/50 dark:hover:border-primary/50'
                    } transition-all cursor-pointer`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">cloud_upload</span>
                        <p className="text-xs text-slate-500">Click or drag to upload</p>
                      </div>
                    </div>
                    <input
                      ref={mobileFileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleMobileFileInputChange}
                      className="hidden"
                    />
                  </div>
                )}
                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">info</span>
                  Rec: 800 x 800 px
                </p>
                {errors.mobileImage && (
                  <p className="text-sm text-red-500">{errors.mobileImage}</p>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Button Text EN */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  htmlFor="btn-en"
                >
                  Button Text (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full rounded-lg border ${
                    errors.buttonTextEn ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  } bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 transition-shadow`}
                  id="btn-en"
                  type="text"
                  value={formData.buttonTextEn}
                  onChange={(e) => handleInputChange('buttonTextEn', e.target.value)}
                  placeholder="Book Appointment"
                />
                {errors.buttonTextEn && (
                  <p className="text-sm text-red-500">{errors.buttonTextEn}</p>
                )}
              </div>

              {/* Button Text AR */}
              <div className="space-y-2">
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300 flex justify-between"
                  htmlFor="btn-ar"
                >
                  Button Text (AR) <span className="text-xs text-slate-400 font-normal">Arabic</span>
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 transition-shadow"
                  dir="rtl"
                  id="btn-ar"
                  type="text"
                  value={formData.buttonTextAr}
                  onChange={(e) => handleInputChange('buttonTextAr', e.target.value)}
                  placeholder="حجز موعد"
                />
              </div>

              {/* Button URL */}
              <div className="md:col-span-2 space-y-2">
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  htmlFor="btn-url"
                >
                  Button URL <span className="text-red-500">*</span>
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-gray-400 text-[18px]">link</span>
                  </div>
                  <input
                    className={`block w-full rounded-lg border ${
                      errors.buttonUrl ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                    } bg-slate-50 dark:bg-black/20 pl-10 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 transition-shadow`}
                    id="btn-url"
                    type="text"
                    value={formData.buttonUrl}
                    onChange={(e) => handleInputChange('buttonUrl', e.target.value)}
                    placeholder="https://example.com/book-now"
                  />
                </div>
                {errors.buttonUrl && (
                  <p className="text-sm text-red-500">{errors.buttonUrl}</p>
                )}
              </div>

              {/* Banner Title */}
              <div className="md:col-span-2 space-y-2">
                <label
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                  htmlFor="banner-title"
                >
                  Banner Title <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full rounded-lg border ${
                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
                  } bg-slate-50 dark:bg-black/20 text-slate-900 dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm py-2.5 px-4 transition-shadow`}
                  id="banner-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Grand Opening Promo"
                />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title}</p>
                )}
              </div>
            </div>

            {/* Active Status Toggle */}
            <div className="rounded-xl border border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-white/5 p-4 flex items-center justify-between">
              <div className="flex gap-3 items-center">
                <div className="size-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center shadow-sm text-primary">
                  <span className="material-symbols-outlined">visibility</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">Active Status</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Make this banner visible to the public.</p>
                </div>
              </div>
              <ToggleSwitch
                checked={formData.isActive}
                onChange={(checked) => handleInputChange('isActive', checked)}
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
        <div className="bg-gray-50 dark:bg-black/10 px-6 py-5 flex items-center justify-end gap-3 border-t border-gray-100 dark:border-white/5">
          <button
            onClick={handleCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 py-2.5 text-sm font-bold text-white bg-slate-900 dark:bg-primary dark:text-black rounded-lg hover:bg-slate-800 dark:hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg shadow-slate-900/10 dark:shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
                {banner ? 'Saving...' : 'Adding...'}
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">save</span>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditBannerModal


