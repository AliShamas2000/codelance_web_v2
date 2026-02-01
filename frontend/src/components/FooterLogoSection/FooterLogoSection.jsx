import React, { useRef, useState } from 'react'

const FooterLogoSection = ({
  logo = null,
  logoPreview = null,
  onLogoChange,
  className = ""
}) => {
  const fileInputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragCounter = useRef(0)

  const handleFileSelect = (file) => {
    if (file) {
      // Validate file type
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml']
      if (!validTypes.includes(file.type)) {
        alert('Please upload a valid image file (PNG, JPG, SVG)')
        return
      }

      // Validate file size (2MB max)
      const maxSize = 2 * 1024 * 1024 // 2MB
      if (file.size > maxSize) {
        alert('File size must be less than 2MB')
        return
      }

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        onLogoChange && onLogoChange(file, reader.result)
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

  const handleRemoveLogo = () => {
    onLogoChange && onLogoChange(null, null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
        <span className="material-symbols-outlined text-gray-400 mr-2">image</span>
        Footer Logo
      </h2>
      <div className="flex flex-col items-center justify-center">
        {logoPreview ? (
          <div className="w-full relative group mb-3">
            <div className="aspect-video w-full rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 overflow-hidden relative">
              <img
                src={logoPreview}
                alt="Footer Logo"
                className="w-full h-full object-contain p-4"
              />
              <button
                onClick={handleRemoveLogo}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
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
            className={`w-full relative group cursor-pointer mb-3 ${
              isDragging ? 'opacity-75' : ''
            }`}
          >
            <div className={`aspect-video w-full rounded-xl bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed ${
              isDragging
                ? 'border-primary bg-primary/10'
                : 'border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-white'
            } transition-colors overflow-hidden`}>
              <span className="material-symbols-outlined text-gray-400 text-3xl mb-1">
                cloud_upload
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Upload Logo (White/Transparent)
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/svg+xml"
              onChange={handleFileInputChange}
              className="hidden"
            />
          </div>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
          Recommended size: 200x80px PNG
        </p>
      </div>
    </div>
  )
}

export default FooterLogoSection


