import React, { useState, useEffect, useRef } from 'react'
import Modal from '../Modal/Modal'

const AddEditAboutUsModal = ({
  isOpen,
  onClose,
  section = null,
  onSave,
  isSaving = false,
  className = ""
}) => {
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    features: [],
    type: 'Content Block',
    status: true
  })
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)

  // Load section data when editing
  useEffect(() => {
    if (isOpen && section) {
      setFormData({
        image: null,
        imagePreview: section.imageUrl || section.image || section.image_url || null,
        titleEn: section.titleEn || section.title_en || section.title || '',
        titleAr: section.titleAr || section.title_ar || '',
        descriptionEn: section.descriptionEn || section.description_en || section.description || '',
        descriptionAr: section.descriptionAr || section.description_ar || '',
        features: section.features || [],
        type: section.type || 'Content Block',
        status: section.status !== undefined ? section.status : true
      })
    } else if (isOpen && !section) {
      // Reset form for new section
      setFormData({
        image: null,
        imagePreview: null,
        titleEn: '',
        titleAr: '',
        descriptionEn: '',
        descriptionAr: '',
        features: [],
        type: 'Content Block',
        status: true
      })
    }
  }, [isOpen, section])

  const handleFileSelect = (file) => {
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (PNG, JPG, WEBP)')
        return
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        alert('File size must be less than 5MB')
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

  const handleAddFeature = () => {
    const newFeature = { id: Date.now(), textEn: '', textAr: '' }
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature]
    }))
  }

  const handleUpdateFeature = (index, field, value) => {
    const updated = [...formData.features]
    updated[index] = { ...updated[index], [field]: value }
    setFormData(prev => ({ ...prev, features: updated }))
  }

  const handleRemoveFeature = (index) => {
    const updated = formData.features.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, features: updated }))
  }

  const handleSave = () => {
    // Validation
    if (!formData.titleEn.trim()) {
      alert('Please enter a title in English')
      return
    }

    onSave && onSave(formData)
  }

  const customHeader = (
    <div className="flex items-center justify-between px-6 pt-6 pb-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <span className="material-symbols-outlined">edit_document</span>
        </div>
        <div>
          <h3 className="text-lg leading-6 font-bold text-text-main dark:text-white pl-2">
            {section ? 'Edit About Us Section' : 'Add New About Us Section'}
          </h3>
          <p className="text-xs text-text-muted mt-0.5 pl-2">
            Update content for English and Arabic versions
          </p>
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          disabled={isSaving}
          className="bg-transparent rounded-full p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 focus:outline-none transition-all disabled:opacity-50"
          type="button"
          aria-label="Close modal"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      )}
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      customHeader={customHeader}
      maxWidth="max-w-4xl"
      className={className}
    >
      <div className="px-6 py-6 max-h-[calc(100vh-200px)] overflow-y-auto custom-scrollbar">
        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-text-main dark:text-white mb-2">
              Section Main Image
            </label>
            <div className="flex gap-4 items-start">
              {formData.imagePreview ? (
                <div className="relative group h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    alt="Current image"
                    className="h-full w-full object-cover"
                    src={formData.imagePreview}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-white">edit</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
              ) : null}
              <div
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`flex-1 mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-xl transition-all cursor-pointer ${
                  isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5'
                }`}
              >
                <div className="space-y-1 text-center">
                  <span className="material-symbols-outlined text-3xl text-gray-400">cloud_upload</span>
                  <div className="text-sm text-text-muted">
                    <span className="font-medium text-primary hover:text-primary/80">Click to upload</span> or drag and drop
                  </div>
                  <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/webp"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-800 w-full"></div>

          {/* Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-muted" htmlFor="title_en">
                Section Title (EN)
              </label>
              <input
                className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 transition-shadow"
                id="title_en"
                type="text"
                value={formData.titleEn}
                onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                placeholder="Refined Grooming for the Modern Man"
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-muted text-right" htmlFor="title_ar">
                عنوان القسم (AR)
              </label>
              <input
                className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-2.5 text-right transition-shadow"
                dir="rtl"
                id="title_ar"
                type="text"
                value={formData.titleAr}
                onChange={(e) => setFormData(prev => ({ ...prev, titleAr: e.target.value }))}
                placeholder="حلاقة راقية للرجل العصري"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-muted" htmlFor="desc_en">
                Description (EN)
              </label>
              <textarea
                className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-3 leading-relaxed transition-shadow"
                id="desc_en"
                rows="4"
                value={formData.descriptionEn}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                placeholder="At Blade & Co, we believe a haircut is more than just a routine—it's a ritual..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-text-muted text-right" htmlFor="desc_ar">
                الوصف (AR)
              </label>
              <textarea
                className="block w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-text-main dark:text-white shadow-sm focus:border-primary focus:ring-primary sm:text-sm px-4 py-3 text-right leading-relaxed transition-shadow"
                dir="rtl"
                id="desc_ar"
                rows="4"
                value={formData.descriptionAr}
                onChange={(e) => setFormData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                placeholder="في Blade & Co، نؤمن أن قص الشعر هو أكثر من مجرد روتين..."
              />
            </div>
          </div>

          {/* Features List */}
          <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-5 border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-sm font-bold text-text-main dark:text-white">
                Feature List Items
              </label>
              <button
                type="button"
                onClick={handleAddFeature}
                className="text-xs font-semibold text-primary hover:underline flex items-center transition-opacity hover:opacity-80"
              >
                <span className="material-symbols-outlined text-sm mr-1">add_circle</span>
                Add Feature
              </button>
            </div>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div
                  key={feature.id || index}
                  className="group flex flex-col sm:flex-row gap-3 items-start p-3 bg-white dark:bg-[#10221c] rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-gray-400 cursor-move self-center sm:self-auto h-full flex items-center">
                    <span className="material-symbols-outlined text-lg">drag_indicator</span>
                  </div>
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      className="block w-full rounded border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:border-primary focus:ring-0 px-2 py-1.5 transition-colors dark:text-white"
                      placeholder="Feature text (EN)"
                      type="text"
                      value={feature.textEn || feature.text_en || ''}
                      onChange={(e) => handleUpdateFeature(index, 'textEn', e.target.value)}
                    />
                    <input
                      className="block w-full rounded border-gray-200 dark:border-gray-700 bg-transparent text-sm focus:border-primary focus:ring-0 px-2 py-1.5 text-right transition-colors dark:text-white"
                      dir="rtl"
                      placeholder="ميزة (AR)"
                      type="text"
                      value={feature.textAr || feature.text_ar || ''}
                      onChange={(e) => handleUpdateFeature(index, 'textAr', e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors self-center sm:self-start rounded-full hover:bg-red-50 dark:hover:bg-red-900/10"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              ))}
              {formData.features.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4">No features added yet</p>
              )}
            </div>
          </div>
        </form>
      </div>

      <div className="bg-gray-50 dark:bg-black/20 px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex flex-row-reverse gap-3">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex justify-center rounded-lg border border-transparent shadow-sm px-5 py-2.5 bg-primary text-sm font-bold text-text-main hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 focus:outline-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
        <button
          onClick={onClose}
          disabled={isSaving}
          className="inline-flex justify-center rounded-lg border border-gray-300 dark:border-gray-700 shadow-sm px-5 py-2.5 bg-white dark:bg-transparent text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 focus:outline-none transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </Modal>
  )
}

export default AddEditAboutUsModal
