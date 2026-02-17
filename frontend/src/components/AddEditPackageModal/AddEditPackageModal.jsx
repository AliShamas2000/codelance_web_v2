import React, { useState, useEffect, useRef, useCallback } from 'react'
import packagesApi from '../../api/packages'

const AddEditPackageModal = ({
  isOpen,
  onClose,
  package: pkg = null,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    currency: 'USD',
    category: 'website',
    billing_period: 'monthly',
    features: [],
    badge: '',
    is_featured: false,
    is_active: true,
    order: 0,
    icon: null,
    iconPreview: null
  })
  const [featureInput, setFeatureInput] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (pkg) {
      setFormData({
        name: pkg.name || '',
        description: pkg.description || '',
        price: pkg.price || '',
        original_price: pkg.originalPrice || pkg.original_price || '',
        currency: pkg.currency || 'USD',
        category: pkg.category || pkg.packageCategory || 'website',
        billing_period: pkg.billingPeriod || pkg.billing_period || 'monthly',
        features: Array.isArray(pkg.features) ? pkg.features : [],
        badge: pkg.badge || '',
        is_featured: pkg.isFeatured !== undefined ? pkg.isFeatured : (pkg.is_featured !== undefined ? pkg.is_featured : false),
        is_active: pkg.isActive !== undefined ? pkg.isActive : (pkg.is_active !== undefined ? pkg.is_active : true),
        order: pkg.order || 0,
        icon: null,
        iconPreview: pkg.icon || pkg.icon_url || null
      })
    } else {
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        currency: 'USD',
        category: 'website',
        billing_period: 'monthly',
        features: [],
        badge: '',
        is_featured: false,
        is_active: true,
        order: 0,
        icon: null,
        iconPreview: null
      })
    }
    setFeatureInput('')
    setErrors({})
  }, [pkg, isOpen])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleAddFeature = () => {
    if (featureInput.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, featureInput.trim()]
      }))
      setFeatureInput('')
    }
  }

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleFileSelect = (file) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, icon: 'Please upload a valid image file (PNG, JPG, GIF)' }))
        return
      }
      const maxSize = 5 * 1024 * 1024
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, icon: 'File size must be less than 5MB' }))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, icon: file, iconPreview: reader.result }))
      }
      reader.readAsDataURL(file)
      if (errors.icon) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.icon
          return newErrors
        })
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, icon: null, iconPreview: null }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Package name is required'
    }
    if (!formData.price || isNaN(parseFloat(formData.price))) {
      newErrors.price = 'Price must be a valid number'
    }
    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'Price cannot be negative'
    }
    if (formData.original_price && isNaN(parseFloat(formData.original_price))) {
      newErrors.original_price = 'Original price must be a valid number'
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
      const packageData = {
        name: formData.name.trim(),
        description: formData.description.trim() || '',
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        currency: formData.currency,
        category: formData.category,
        billing_period: formData.billing_period,
        features: formData.features,
        badge: formData.badge.trim() || null,
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        order: parseInt(formData.order) || 0,
        icon: formData.icon
      }

      if (pkg) {
        await packagesApi.updatePackage(pkg.id, packageData)
      } else {
        await packagesApi.createPackage(packageData)
      }

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save package. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      name: '',
      description: '',
      price: '',
      original_price: '',
      currency: 'USD',
      category: 'website',
      billing_period: 'monthly',
      features: [],
      badge: '',
      is_featured: false,
      is_active: true,
      order: 0,
      icon: null,
      iconPreview: null
    })
    setFeatureInput('')
    setErrors({})
    onClose()
  }, [onClose])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) handleCancel()
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

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && handleCancel()}
    >
      <div
        className="relative w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e26] shadow-2xl transition-all border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-5">
          <h3 className="text-xl font-bold text-[#111816] dark:text-white">
            {pkg ? 'Edit Package' : 'Add New Package'}
          </h3>
          <button
            onClick={handleCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-[#10221c] dark:hover:text-gray-300 focus:outline-none transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Icon Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Package Icon
              </label>
              {formData.iconPreview ? (
                <div className="relative">
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-300 dark:border-gray-600">
                    <img src={formData.iconPreview} alt="Preview" className="w-full h-48 object-cover" />
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
                  onClick={() => fileInputRef.current?.click()}
                  className="flex justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 px-6 py-8 hover:bg-gray-50 dark:hover:bg-[#152721] transition-colors cursor-pointer"
                >
                  <div className="text-center">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-500">cloud_upload</span>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Click to upload icon</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif"
                onChange={(e) => handleFileSelect(e.target.files?.[0])}
                className="hidden"
              />
              {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Package Name <span className="text-red-500">*</span>
              </label>
              <input
                className={`block w-full rounded-lg border ${
                  errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g. Starter Plan"
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 resize-none"
                rows="3"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Briefly describe the package..."
              />
            </div>

            {/* Price Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    className={`block w-full rounded-lg border ${
                      errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-gray-50 dark:bg-[#10221c] pl-7 pr-12 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Original Price (for discount)
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    className={`block w-full rounded-lg border ${
                      errors.original_price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-gray-50 dark:bg-[#10221c] pl-7 pr-12 text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.original_price}
                    onChange={(e) => handleInputChange('original_price', e.target.value)}
                    placeholder="0.00"
                  />
                </div>
                {errors.original_price && <p className="text-sm text-red-500">{errors.original_price}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Currency
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.currency}
                  onChange={(e) => handleInputChange('currency', e.target.value)}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Category, Billing Period & Badge */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                >
                  <option value="website">Website</option>
                  <option value="mobile">Mobile</option>
                  <option value="pos">POS</option>
                  <option value="dashboard">Dashboard</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Billing Period
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.billing_period}
                  onChange={(e) => handleInputChange('billing_period', e.target.value)}
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="one-time">One-Time</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Badge (e.g. "Most Popular")
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.badge}
                  onChange={(e) => handleInputChange('badge', e.target.value)}
                  placeholder="Most Popular"
                />
              </div>
            </div>

            {/* Features */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Features
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder="Add a feature and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#0eb37d] transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.features.length > 0 && (
                <div className="mt-2 space-y-2">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-[#10221c] p-2 rounded-lg">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Checkboxes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_featured" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Featured Package
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => handleInputChange('is_active', e.target.checked)}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                  Active
                </label>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Display Order
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  type="number"
                  min="0"
                  value={formData.order}
                  onChange={(e) => handleInputChange('order', e.target.value)}
                />
              </div>
            </div>

            {errors.submit && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

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
            type="submit"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="material-symbols-outlined animate-spin mr-2">refresh</span>
                {pkg ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              pkg ? 'Update Package' : 'Add Package'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditPackageModal
