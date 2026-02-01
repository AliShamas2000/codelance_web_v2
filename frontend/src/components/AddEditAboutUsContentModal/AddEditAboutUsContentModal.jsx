import React, { useState, useEffect, useRef, useCallback } from 'react'
import aboutUsContentApi from '../../api/aboutUsContent'

const AddEditAboutUsContentModal = ({
  isOpen,
  onClose,
  content = null,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stats: [
      { value: '', label: '' },
      { value: '', label: '' },
      { value: '', label: '' }
    ],
    primary_button_text: '',
    secondary_button_text: '',
    code_snippet: {
      mission: 'Excellence',
      stack: ['AI', 'Cloud'],
      deliver: true
    },
    is_active: true,
    order: 0
  })
  const [stackInput, setStackInput] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (content) {
      setFormData({
        title: content.title || '',
        description: content.description || '',
        stats: Array.isArray(content.stats) && content.stats.length > 0 
          ? content.stats 
          : [
              { value: '', label: '' },
              { value: '', label: '' },
              { value: '', label: '' }
            ],
        primary_button_text: content.primaryButtonText || content.primary_button_text || '',
        secondary_button_text: content.secondaryButtonText || content.secondary_button_text || '',
        code_snippet: content.codeSnippet || content.code_snippet || {
          mission: 'Excellence',
          stack: ['AI', 'Cloud'],
          deliver: true
        },
        is_active: content.isActive !== undefined ? content.isActive : (content.is_active !== undefined ? content.is_active : true),
        order: content.order || 0
      })
      setStackInput('')
    } else {
      setFormData({
        title: '',
        description: '',
        stats: [
          { value: '', label: '' },
          { value: '', label: '' },
          { value: '', label: '' }
        ],
        primary_button_text: '',
        secondary_button_text: '',
        code_snippet: {
          mission: 'Excellence',
          stack: ['AI', 'Cloud'],
          deliver: true
        },
        is_active: true,
        order: 0
      })
      setStackInput('')
    }
    setErrors({})
  }, [content, isOpen])

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

  const handleStatChange = (index, field, value) => {
    setFormData(prev => {
      const newStats = [...prev.stats]
      newStats[index] = { ...newStats[index], [field]: value }
      return { ...prev, stats: newStats }
    })
  }

  const handleAddStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '' }]
    }))
  }

  const handleRemoveStat = (index) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }))
  }

  const handleCodeSnippetChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      code_snippet: {
        ...prev.code_snippet,
        [field]: value
      }
    }))
  }

  const handleAddStack = () => {
    if (stackInput.trim()) {
      setFormData(prev => ({
        ...prev,
        code_snippet: {
          ...prev.code_snippet,
          stack: [...prev.code_snippet.stack, stackInput.trim()]
        }
      }))
      setStackInput('')
    }
  }

  const handleRemoveStack = (index) => {
    setFormData(prev => ({
      ...prev,
      code_snippet: {
        ...prev.code_snippet,
        stack: prev.code_snippet.stack.filter((_, i) => i !== index)
      }
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.stats || formData.stats.length === 0) {
      newErrors.stats = 'At least one stat is required'
    } else {
      formData.stats.forEach((stat, index) => {
        if (!stat.value.trim()) {
          newErrors[`stat_${index}_value`] = 'Stat value is required'
        }
        if (!stat.label.trim()) {
          newErrors[`stat_${index}_label`] = 'Stat label is required'
        }
      })
    }
    if (!formData.code_snippet.mission.trim()) {
      newErrors.code_mission = 'Code snippet mission is required'
    }
    if (!formData.code_snippet.stack || formData.code_snippet.stack.length === 0) {
      newErrors.code_stack = 'At least one stack item is required'
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
        ...formData,
        stats: formData.stats.filter(stat => stat.value.trim() && stat.label.trim())
      }

      if (content) {
        await aboutUsContentApi.updateAboutUsContent(content.id, submitData)
      } else {
        await aboutUsContentApi.createAboutUsContent(submitData)
      }

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save content. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      stats: [
        { value: '', label: '' },
        { value: '', label: '' },
        { value: '', label: '' }
      ],
      primary_button_text: '',
      secondary_button_text: '',
      code_snippet: {
        mission: 'Excellence',
        stack: ['AI', 'Cloud'],
        deliver: true
      },
      is_active: true,
      order: 0
    })
    setStackInput('')
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
        className="relative w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white dark:bg-[#1a2e26] shadow-2xl transition-all border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-6 py-5">
          <h3 className="text-xl font-bold text-[#111816] dark:text-white">
            {content ? 'Edit About Us Content' : 'Add New About Us Content'}
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
                placeholder="e.g., Who We Are"
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
                rows="6"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter the description text..."
              />
              {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
            </div>

            {/* Stats */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Statistics <span className="text-red-500">*</span>
              </label>
              <div className="space-y-3">
                {formData.stats.map((stat, index) => (
                  <div key={index} className="grid grid-cols-2 gap-3 items-end">
                    <div>
                      <input
                        className={`block w-full rounded-lg border ${
                          errors[`stat_${index}_value`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                        placeholder="Value (e.g., 150+)"
                        value={stat.value}
                        onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      />
                      {errors[`stat_${index}_value`] && <p className="text-xs text-red-500 mt-1">{errors[`stat_${index}_value`]}</p>}
                    </div>
                    <div className="flex gap-2">
                      <input
                        className={`block w-full rounded-lg border ${
                          errors[`stat_${index}_label`] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                        } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                        placeholder="Label (e.g., Projects Delivered)"
                        value={stat.label}
                        onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      />
                      {formData.stats.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveStat(index)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <span className="material-symbols-outlined text-xl">delete_outline</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddStat}
                  className="text-sm text-primary hover:text-[#0eb37d] font-medium flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-lg">add_circle</span>
                  Add Stat
                </button>
              </div>
              {errors.stats && <p className="text-sm text-red-500">{errors.stats}</p>}
            </div>

            {/* Button Texts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Primary Button Text
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.primary_button_text}
                  onChange={(e) => handleInputChange('primary_button_text', e.target.value)}
                  placeholder="e.g., Our Mission"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Secondary Button Text
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.secondary_button_text}
                  onChange={(e) => handleInputChange('secondary_button_text', e.target.value)}
                  placeholder="e.g., View Team"
                />
              </div>
            </div>

            {/* Code Snippet */}
            <div className="space-y-4 border-t border-gray-200 dark:border-gray-700 pt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Code Snippet
              </label>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Mission <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`block w-full rounded-lg border ${
                      errors.code_mission ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                    value={formData.code_snippet.mission}
                    onChange={(e) => handleCodeSnippetChange('mission', e.target.value)}
                    placeholder="e.g., Excellence"
                  />
                  {errors.code_mission && <p className="text-xs text-red-500">{errors.code_mission}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Stack <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      className="block flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                      placeholder="Add stack item (e.g., AI)"
                      value={stackInput}
                      onChange={(e) => setStackInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddStack()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleAddStack}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#0eb37d] transition-colors"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.code_snippet.stack.map((item, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-lg text-sm"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => handleRemoveStack(index)}
                          className="text-primary hover:text-red-500"
                        >
                          <span className="material-symbols-outlined text-sm">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                  {errors.code_stack && <p className="text-xs text-red-500">{errors.code_stack}</p>}
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="code_deliver"
                    checked={formData.code_snippet.deliver}
                    onChange={(e) => handleCodeSnippetChange('deliver', e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="code_deliver" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Deliver (true/false)
                  </label>
                </div>
              </div>
            </div>

            {/* Status & Order */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-gray-200 dark:border-gray-700 pt-6">
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
                {content ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              content ? 'Update Content' : 'Add Content'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditAboutUsContentModal

