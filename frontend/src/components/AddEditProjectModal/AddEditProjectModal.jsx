import React, { useState, useEffect, useRef, useCallback } from 'react'
import projectsApi from '../../api/projects'

const AddEditProjectModal = ({
  isOpen,
  onClose,
  project = null,
  categories = [],
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project_category_id: null,
    tags: [],
    client_name: '',
    project_date: '',
    project_url: '',
    github_url: '',
    is_featured: false,
    is_active: true,
    order: 0,
    image: null,
    imagePreview: null
  })
  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        project_category_id: project.categoryId || project.category_id || null,
        tags: Array.isArray(project.tags) ? project.tags : [],
        client_name: project.clientName || project.client_name || '',
        project_date: project.projectDate || project.project_date || '',
        project_url: project.projectUrl || project.project_url || '',
        github_url: project.githubUrl || project.github_url || '',
        is_featured: project.isFeatured !== undefined ? project.isFeatured : (project.is_featured !== undefined ? project.is_featured : false),
        is_active: project.isActive !== undefined ? project.isActive : (project.is_active !== undefined ? project.is_active : true),
        order: project.order || 0,
        image: null,
        imagePreview: project.image || project.image_url || null
      })
    } else {
      setFormData({
        title: '',
        description: '',
        project_category_id: null,
        tags: [],
        client_name: '',
        project_date: '',
        project_url: '',
        github_url: '',
        is_featured: false,
        is_active: true,
        order: 0,
        image: null,
        imagePreview: null
      })
    }
    setTagInput('')
    setErrors({})
  }, [project, isOpen])

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

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }))
  }

  const handleFileSelect = (file) => {
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please upload a valid image file (PNG, JPG, GIF, WEBP)' }))
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }))
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }))
      }
      reader.readAsDataURL(file)
      if (errors.image) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors.image
          return newErrors
        })
      }
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
    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required'
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
        project_category_id: formData.project_category_id || null
      }

      if (project) {
        if (!formData.imagePreview && project.image) {
          submitData.remove_image = true
        }
        await projectsApi.updateProject(project.id, submitData)
      } else {
        await projectsApi.createProject(submitData)
      }

      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      setErrors({
        submit: error.response?.data?.message || error.response?.data?.error || error.message || 'Failed to save project. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      title: '',
      description: '',
      project_category_id: null,
      tags: [],
      client_name: '',
      project_date: '',
      project_url: '',
      github_url: '',
      is_featured: false,
      is_active: true,
      order: 0,
      image: null,
      imagePreview: null
    })
    setTagInput('')
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
            {project ? 'Edit Project' : 'Add New Project'}
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
            {/* Title & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input
                  className={`block w-full rounded-lg border ${
                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5`}
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., NeoBank Ecosystem"
                />
                {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.project_category_id || ''}
                  onChange={(e) => handleInputChange('project_category_id', e.target.value ? parseInt(e.target.value) : null)}
                >
                  <option value="">No Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5 resize-none"
                rows="4"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe this project..."
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Project Image
              </label>
              {formData.imagePreview ? (
                <div className="relative">
                  <img
                    src={formData.imagePreview}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
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
                    PNG, JPG, GIF, WEBP up to 5MB
                  </p>
                </div>
              )}
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (Technologies)
              </label>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                  placeholder="e.g., React, Next.js, TypeScript"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#0eb37d] transition-colors"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(index)}
                        className="hover:text-red-500"
                      >
                        <span className="material-symbols-outlined text-sm">close</span>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Client Name & Project Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Client Name
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  value={formData.client_name}
                  onChange={(e) => handleInputChange('client_name', e.target.value)}
                  placeholder="Client or company name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project Date
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  type="date"
                  value={formData.project_date}
                  onChange={(e) => handleInputChange('project_date', e.target.value)}
                />
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Project URL
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  type="url"
                  value={formData.project_url}
                  onChange={(e) => handleInputChange('project_url', e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  GitHub URL
                </label>
                <input
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#10221c] text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-2.5"
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => handleInputChange('github_url', e.target.value)}
                  placeholder="https://github.com/..."
                />
              </div>
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
                {project ? 'Updating...' : 'Adding...'}
              </span>
            ) : (
              project ? 'Update Project' : 'Add Project'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddEditProjectModal

