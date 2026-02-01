import React, { useRef } from 'react'

const ProfileImageUpload = ({
  imagePreview,
  onImageChange,
  className = ""
}) => {
  const fileInputRef = useRef(null)

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        alert('Please select a valid image file (JPEG, JPG, PNG, or GIF)')
        return
      }

      // Validate file size (3MB max)
      if (file.size > 3 * 1024 * 1024) {
        alert('Image size must be less than 3MB')
        return
      }

      onImageChange && onImageChange(file)
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className={`bg-surface-light dark:bg-surface-dark p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 ${className}`}>
      <h3 className="font-bold text-lg mb-6 text-[#111816] dark:text-white">Profile Image</h3>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-6 group">
          <img
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-gray-50 dark:border-gray-800 shadow-sm"
            src={imagePreview || 'https://via.placeholder.com/128'}
          />
          <div
            onClick={handleClick}
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            <span className="material-symbols-outlined text-white">camera_alt</span>
          </div>
          <div
            onClick={handleClick}
            className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full border-4 border-white dark:border-surface-dark flex items-center justify-center cursor-pointer hover:bg-[#0fb37d] transition-colors"
          >
            <span className="material-symbols-outlined text-white text-[14px]">edit</span>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">
          Allowed *.jpeg, *.jpg, *.png, *.gif
          <br />
          max size of 3 MB
        </p>
        <div className="w-full">
          <label
            htmlFor="file-upload"
            className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm font-medium transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">upload</span>
            Change Photo
          </label>
          <input
            ref={fileInputRef}
            className="hidden"
            id="file-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileSelect}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfileImageUpload


