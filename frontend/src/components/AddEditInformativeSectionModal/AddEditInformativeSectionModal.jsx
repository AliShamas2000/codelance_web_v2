import React, { useState, useEffect, useRef, useCallback } from 'react'
import informativeSectionsApi from '../../api/informativeSections'

const AddEditInformativeSectionModal = ({
  isOpen,
  onClose,
  section = null, // If provided, we're in edit mode
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    name: '',
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    features: [],
    status: 'draft'
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Initialize form data when section is provided (edit mode only)
  useEffect(() => {
    if (section) {
      setFormData({
        name: section.name || section.key || '',
        titleEn: section.titleEn || section.title_en || section.title || '',
        titleAr: section.titleAr || section.title_ar || '',
        descriptionEn: section.descriptionEn || section.description_en || section.description || '',
        descriptionAr: section.descriptionAr || section.description_ar || '',
        features: (section.features || section.items || []).map(feature => ({
          id: feature.id,
          nameEn: feature.nameEn || feature.name_en || '',
          nameAr: feature.nameAr || feature.name_ar || '',
          icon: null,
          iconPreview: feature.icon || feature.icon_url || feature.iconUrl || null
        })),
        status: section.status || 'published'
      })
    }
    setErrors({})
  }, [section, isOpen])

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

  const handleFeatureChange = (index, field, value) => {
    setFormData(prev => {
      const newFeatures = [...prev.features]
      newFeatures[index] = { ...newFeatures[index], [field]: value }
      return { ...prev, features: newFeatures }
    })
  }

  const handleFeatureIconChange = (index, file) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [`feature_${index}_icon`]: 'Please upload a valid image file'
        }))
        return
      }

      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [`feature_${index}_icon`]: 'File size must be less than 2MB'
        }))
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData(prev => {
          const newFeatures = [...prev.features]
          newFeatures[index] = {
            ...newFeatures[index],
            icon: file,
            iconPreview: reader.result
          }
          return { ...prev, features: newFeatures }
        })
      }
      reader.readAsDataURL(file)

      // Clear error
      if (errors[`feature_${index}_icon`]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[`feature_${index}_icon`]
          return newErrors
        })
      }
    }
  }

  const handleAddFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, {
        nameEn: '',
        nameAr: '',
        icon: null,
        iconPreview: null
      }]
    }))
  }

  const handleRemoveFeature = (index) => {
    setFormData(prev => {
      const newFeatures = prev.features.filter((_, i) => i !== index)
      return { ...prev, features: newFeatures }
    })
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Section name is required'
    }

    if (!formData.titleEn.trim()) {
      newErrors.titleEn = 'Title (EN) is required'
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
      const sectionData = {
        name: formData.name.trim(),
        titleEn: formData.titleEn.trim(),
        titleAr: formData.titleAr.trim(),
        descriptionEn: formData.descriptionEn.trim(),
        descriptionAr: formData.descriptionAr.trim(),
        features: formData.features.map(feature => ({
          id: feature.id,
          nameEn: feature.nameEn || feature.name_en || '',
          nameAr: feature.nameAr || feature.name_ar || '',
          icon: feature.icon,
          iconPreview: feature.iconPreview || feature.icon_url || feature.iconUrl
        })),
        status: formData.status
      }

      // Only edit mode is allowed
      await informativeSectionsApi.updateSection(section.id, sectionData)

      // Success - close modal and refresh
      if (onSuccess) {
        onSuccess()
      }
      onClose()
    } catch (error) {
      console.error('Error saving informative section:', error)
      setErrors({
        submit: error.response?.data?.message || 'Failed to save section. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = useCallback(() => {
    setFormData({
      name: '',
      titleEn: '',
      titleAr: '',
      descriptionEn: '',
      descriptionAr: '',
      features: [],
      status: 'draft'
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

  if (!isOpen || !section) return null

  const sectionTitle = `Edit ${section.title || section.name || 'Section'}`

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-display"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity"></div>
      <div
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-white dark:bg-[#10221c] rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-[#10221c] shrink-0">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              {sectionTitle}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Update content and localized text for this section
            </p>
          </div>
          <button
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-full p-2 hover:bg-slate-100 dark:hover:bg-white/5"
            type="button"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Name - Read only */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Section Name/Key
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-black/40 px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 outline-none transition-all"
                type="text"
                value={formData.name}
                readOnly
                disabled
              />
            </div>

            {/* Titles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Section Title (EN) <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full rounded-xl border ${
                    errors.titleEn ? 'border-red-500' : 'border-slate-200 dark:border-white/10'
                  } bg-slate-50 dark:bg-black/20 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400`}
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => handleInputChange('titleEn', e.target.value)}
                  placeholder="Why Choose Us?"
                />
                {errors.titleEn && (
                  <p className="text-sm text-red-500">{errors.titleEn}</p>
                )}
              </div>
              <div className="space-y-2" dir="rtl">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Section Title (AR)
                </label>
                <input
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400"
                  type="text"
                  value={formData.titleAr}
                  onChange={(e) => handleInputChange('titleAr', e.target.value)}
                  placeholder="لماذا تختارنا؟"
                />
              </div>
            </div>

            {/* Descriptions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Description (EN)
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 resize-none"
                  rows="4"
                  value={formData.descriptionEn}
                  onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
                  placeholder="At The Studio, we believe that a haircut is more than just a routine—it's an experience."
                />
              </div>
              <div className="space-y-2" dir="rtl">
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  Description (AR)
                </label>
                <textarea
                  className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-4 py-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 resize-none"
                  rows="4"
                  value={formData.descriptionAr}
                  onChange={(e) => handleInputChange('descriptionAr', e.target.value)}
                  placeholder="في الاستوديو، نؤمن بأن قص الشعر أكثر من مجرد روتين - إنه تجربة."
                />
              </div>
            </div>

            {/* Divider */}
            <div className="h-px w-full bg-slate-100 dark:bg-white/5"></div>

            {/* Features Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-lg">verified</span>
                  Feature Items
                </h4>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1.5 border border-transparent hover:border-primary/20"
                >
                  <span className="material-symbols-outlined text-sm">add_circle</span>
                  Add Feature
                </button>
              </div>

              <div className="space-y-4">
                {formData.features.map((feature, index) => (
                  <div
                    key={index}
                    className={`group p-5 rounded-xl border ${
                      feature.iconPreview || feature.icon
                        ? 'border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:border-primary/40'
                        : 'border-dashed border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02]'
                    } transition-colors shadow-sm flex flex-col md:flex-row gap-6`}
                  >
                    {/* Icon Upload */}
                    <div className="shrink-0 flex items-start">
                      <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-black/40 border border-slate-200 dark:border-white/10 group-hover:border-primary/30 transition-colors">
                        {feature.iconPreview || feature.icon_url || feature.iconUrl ? (
                          <>
                            <img
                              alt="Icon"
                              className="w-full h-full object-cover"
                              src={feature.iconPreview || feature.icon_url || feature.iconUrl}
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                              <label className="cursor-pointer">
                                <span className="material-symbols-outlined text-white">edit</span>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleFeatureIconChange(index, file)
                                  }}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </>
                        ) : (
                          <label className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-primary cursor-pointer border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-primary transition-colors">
                            <span className="material-symbols-outlined text-2xl mb-1">cloud_upload</span>
                            <span className="text-[10px] font-bold uppercase">Upload</span>
                            <input
                              type="file"
                              accept="image/jpeg,image/jpg,image/png,image/svg+xml"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleFeatureIconChange(index, file)
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Feature Name Fields */}
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Feature Name (EN)
                          </label>
                          <input
                            className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-sm focus:border-primary outline-none text-slate-900 dark:text-white"
                            type="text"
                            value={feature.nameEn || feature.name_en || ''}
                            onChange={(e) => handleFeatureChange(index, 'nameEn', e.target.value)}
                            placeholder="e.g. Expert Styling"
                          />
                        </div>
                        <div className="space-y-1.5" dir="rtl">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                            Feature Name (AR)
                          </label>
                          <input
                            className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 px-3 py-2.5 text-sm focus:border-primary outline-none text-slate-900 dark:text-white"
                            type="text"
                            value={feature.nameAr || feature.name_ar || ''}
                            onChange={(e) => handleFeatureChange(index, 'nameAr', e.target.value)}
                            placeholder="مثال: تصفيف احترافي"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveFeature(index)}
                          className="text-xs font-medium text-red-500 hover:text-red-600 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add New Feature Placeholder */}
                {formData.features.length === 0 && (
                  <div
                    className="group p-5 rounded-xl border border-dashed border-slate-300 dark:border-white/10 bg-slate-50/50 dark:bg-white/[0.02] flex flex-col md:flex-row gap-6 cursor-pointer hover:border-primary"
                    onClick={handleAddFeature}
                  >
                    <div className="shrink-0 flex items-start">
                      <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-white/10 hover:border-primary hover:bg-white dark:hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center text-slate-400 group-hover:text-primary">
                        <span className="material-symbols-outlined text-2xl mb-1">cloud_upload</span>
                        <span className="text-[10px] font-bold uppercase">Upload</span>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Feature Name (EN)
                          </label>
                          <input
                            className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-3 py-2.5 text-sm focus:border-primary outline-none text-slate-900 dark:text-white"
                            placeholder="e.g. Premium Products"
                            type="text"
                            readOnly
                          />
                        </div>
                        <div className="space-y-1.5" dir="rtl">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                            Feature Name (AR)
                          </label>
                          <input
                            className="w-full rounded-lg border-slate-200 dark:border-white/10 bg-white dark:bg-black/20 px-3 py-2.5 text-sm focus:border-primary outline-none text-slate-900 dark:text-white"
                            placeholder="مثال: منتجات مميزة"
                            type="text"
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
        <div className="flex items-center justify-between px-8 py-5 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-[#0d1c17] shrink-0">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="material-symbols-outlined text-sm">info</span>
            <span>All changes are auto-saved to draft</span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 text-sm font-bold bg-primary text-[#10221c] rounded-xl hover:bg-white hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">refresh</span>
                  Saving...
                </>
              ) : (
                <>
                  <span>Save Changes</span>
                  <span className="material-symbols-outlined text-lg">check</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddEditInformativeSectionModal
