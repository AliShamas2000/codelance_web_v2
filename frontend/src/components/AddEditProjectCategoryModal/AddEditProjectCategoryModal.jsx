import React, { useState, useEffect, useCallback } from 'react'
import projectCategoriesApi from '../../api/projectCategories'

const AddEditProjectCategoryModal = ({
  isOpen,
  onClose,
  category: projectCategory = null,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    is_active: true,
    order: 0
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (projectCategory) {
      setFormData({
        name: projectCategory.name || '',
        slug: projectCategory.slug || '',
        description: projectCategory.description || '',
        is_active: projectCategory.isActive !== undefined ? projectCategory.isActive : (projectCategory.is_active !== undefined ? projectCategory.is_active : true),
        order: projectCategory.order || 0
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        is_active: true,
        order: 0
      })
    }
    setErrors({})
  }, [projectCategory, isOpen])

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

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required'
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
      if (projectCategory) {
        await projectCategoriesApi.updateProjectCategory(projectCategory.id, formData)
      } else {
        await projectCategoriesApi.createProjectCategory(formData)
      }

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save category. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      is_active: true,
      order: 0
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
        className="relative w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e26] shadow-2xl transition-all border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-5">
          <h3 className="text-xl font-bold text-[#111816] dark:text-white">
            {projectCategory ? 'Edit Project Category' : 'Add New Project Category'}
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
            {/* Name & Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full rounded-lg border ${
                    errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="e.g., Websites, Mobile Apps"
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
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

            {/* Slug */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug (URL-friendly)
              </label>
              <input
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                placeholder="Auto-generated from name if left empty"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Leave empty to auto-generate from category name
              </p>
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
                placeholder="Brief description of this category..."
              />
            </div>

            {/* Active Status */}
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
                {projectCategory ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              projectCategory ? 'Update Category' : 'Add Category'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditProjectCategoryModal

