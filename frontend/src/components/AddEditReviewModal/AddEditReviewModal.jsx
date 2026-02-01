import React, { useState, useEffect, useRef, useCallback } from 'react'
import reviewsApi from '../../api/reviews'

const AddEditReviewModal = ({
  isOpen,
  onClose,
  review = null,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    quote: '',
    author_name: '',
    author_title: '',
    author_company: '',
    rating: 5,
    is_featured: false,
    is_active: true,
    order: 0,
    author_image: null,
    imagePreview: null
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (review) {
      setFormData({
        quote: review.quote || '',
        author_name: review.authorName || review.author_name || '',
        author_title: review.authorTitle || review.author_title || '',
        author_company: review.authorCompany || review.author_company || '',
        rating: review.rating || 5,
        is_featured: review.isFeatured !== undefined ? review.isFeatured : (review.is_featured !== undefined ? review.is_featured : false),
        is_active: review.isActive !== undefined ? review.isActive : (review.is_active !== undefined ? review.is_active : true),
        order: review.order || 0,
        author_image: null,
        imagePreview: review.authorImage || review.author_image || null
      })
    } else {
      setFormData({
        quote: '',
        author_name: '',
        author_title: '',
        author_company: '',
        rating: 5,
        is_featured: false,
        is_active: true,
        order: 0,
        author_image: null,
        imagePreview: null
      })
    }
    setErrors({})
  }, [review, isOpen])

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

  const handleFileSelect = (file) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, author_image: 'Please upload a valid image file (PNG, JPG, GIF, WEBP)' }))
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, author_image: 'Image size must be less than 2MB' }))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          author_image: file,
          imagePreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
      if (errors.author_image) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.author_image
          return newErrors
        })
      }
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({
      ...prev,
      author_image: null,
      imagePreview: null
    }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.quote.trim()) {
      newErrors.quote = 'Review quote is required'
    }
    if (!formData.author_name.trim()) {
      newErrors.author_name = 'Author name is required'
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
      const submitData = {
        ...formData
      }

      if (review) {
        if (!formData.imagePreview && review.authorImage) {
          submitData.remove_image = true
        }
        await reviewsApi.updateReview(review.id, submitData)
      } else {
        await reviewsApi.createReview(submitData)
      }

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save review. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      quote: '',
      author_name: '',
      author_title: '',
      author_company: '',
      rating: 5,
      is_featured: false,
      is_active: true,
      order: 0,
      author_image: null,
      imagePreview: null
    })
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
            {review ? 'Edit Review' : 'Add New Review'}
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
            {/* Quote */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Review Quote <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`block w-full rounded-lg border ${
                  errors.quote ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 resize-none`}
                rows="4"
                value={formData.quote}
                onChange={(e) => handleInputChange('quote', e.target.value)}
                placeholder="Enter the review/testimonial text..."
              />
              {errors.quote && <p className="text-sm text-red-500">{errors.quote}</p>}
            </div>

            {/* Author Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Author Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full rounded-lg border ${
                    errors.author_name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                  value={formData.author_name}
                  onChange={(e) => handleInputChange('author_name', e.target.value)}
                  placeholder="e.g., Sarah Jenkins"
                />
                {errors.author_name && <p className="text-sm text-red-500">{errors.author_name}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Author Title
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.author_title}
                  onChange={(e) => handleInputChange('author_title', e.target.value)}
                  placeholder="e.g., CTO, Founder"
                />
              </div>
            </div>

            {/* Company & Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Company Name
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.author_company}
                  onChange={(e) => handleInputChange('author_company', e.target.value)}
                  placeholder="e.g., TechVision Global"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Rating
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.rating}
                  onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
            </div>

            {/* Author Image */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Author Image
              </label>
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-full border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-primary hover:text-[#0eb37d] font-medium"
                  >
                    Click to upload image
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    PNG, JPG, GIF, WEBP up to 2MB
                  </p>
                </div>
              )}
              {errors.author_image && <p className="text-sm text-red-500">{errors.author_image}</p>}
            </div>

            {/* Status & Order */}
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
                  Featured
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
                  onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 0)}
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
                {review ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              review ? 'Update Review' : 'Add Review'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditReviewModal

