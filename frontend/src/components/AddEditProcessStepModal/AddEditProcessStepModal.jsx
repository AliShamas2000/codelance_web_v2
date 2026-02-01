import React, { useState, useEffect, useCallback } from 'react'
import processStepsApi from '../../api/processSteps'

const AddEditProcessStepModal = ({
  isOpen,
  onClose,
  step: processStep = null,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    step_number: '',
    title: '',
    description: '',
    icon: 'code',
    position: 'left',
    is_active: true,
    order: 0
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Common Material Icons for process steps
  const iconOptions = [
    'search', 'palette', 'code', 'verified_user', 'rocket_launch', 'support_agent',
    'lightbulb', 'design_services', 'settings', 'analytics', 'security', 'cloud',
    'storage', 'speed', 'trending_up', 'group', 'handshake', 'check_circle'
  ]

  useEffect(() => {
    if (processStep) {
      setFormData({
        step_number: processStep.stepNumber || processStep.step_number || '',
        title: processStep.title || '',
        description: processStep.description || '',
        icon: processStep.icon || 'code',
        position: processStep.position || 'left',
        is_active: processStep.isActive !== undefined ? processStep.isActive : (processStep.is_active !== undefined ? processStep.is_active : true),
        order: processStep.order || 0
      })
    } else {
      setFormData({
        step_number: '',
        title: '',
        description: '',
        icon: 'code',
        position: 'left',
        is_active: true,
        order: 0
      })
    }
    setErrors({})
  }, [processStep, isOpen])

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
    if (!formData.step_number.trim()) {
      newErrors.step_number = 'Step number is required'
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
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
      if (processStep) {
        await processStepsApi.updateProcessStep(processStep.id, formData)
      } else {
        await processStepsApi.createProcessStep(formData)
      }

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save process step. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      step_number: '',
      title: '',
      description: '',
      icon: 'code',
      position: 'left',
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
            {processStep ? 'Edit Process Step' : 'Add New Process Step'}
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
            {/* Step Number & Order */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Step Number <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full rounded-lg border ${
                    errors.step_number ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                  value={formData.step_number}
                  onChange={(e) => handleInputChange('step_number', e.target.value)}
                  placeholder="e.g., 01, 02, 03"
                />
                {errors.step_number && <p className="text-sm text-red-500">{errors.step_number}</p>}
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

            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                className={`block w-full rounded-lg border ${
                  errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Discovery, Development"
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                className={`block w-full rounded-lg border ${
                  errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 resize-none`}
                rows="4"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe this process step..."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Icon & Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Icon (Material Symbol)
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {iconOptions.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleInputChange('icon', icon)}
                      className={`p-3 rounded-lg border-2 transition-colors flex items-center justify-center ${
                        formData.icon === icon
                          ? 'border-primary bg-primary/10'
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary/50'
                      }`}
                      title={icon}
                    >
                      <span className="material-symbols-outlined text-2xl text-gray-700 dark:text-gray-300">
                        {icon}
                      </span>
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  className="mt-2 block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.icon}
                  onChange={(e) => handleInputChange('icon', e.target.value)}
                  placeholder="Or type custom icon name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Position
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                >
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                </select>
              </div>
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
                {processStep ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              processStep ? 'Update Step' : 'Add Step'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditProcessStepModal

