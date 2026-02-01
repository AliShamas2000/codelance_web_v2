import React, { useRef } from 'react'

const ProfileCard = ({
  profile,
  onPhotoUpload,
  onPhotoRemove,
  isUploading = false
}) => {
  const fileInputRef = useRef(null)

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file')
        return
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB')
        return
      }
      onPhotoUpload && onPhotoUpload(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemovePhoto = () => {
    if (window.confirm('Are you sure you want to remove your profile photo?')) {
      onPhotoRemove && onPhotoRemove()
    }
  }

  const fullName = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : profile.name || 'Administrator'

  const photoUrl = profile.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=195de6&color=fff&size=128`

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
      <div className="flex flex-col items-center gap-6">
        {/* Profile Photo */}
        <div className="relative group cursor-pointer" onClick={handleUploadClick}>
          <div
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full h-32 w-32 ring-4 ring-slate-50 dark:ring-slate-700 shadow-lg"
            style={{ backgroundImage: `url(${photoUrl})` }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white">photo_camera</span>
          </div>
        </div>

        {/* User Info */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-[#0e121b] dark:text-white text-xl font-bold leading-tight">
            {fullName}
          </h2>
          <p className="text-[#4e6797] dark:text-slate-400 text-sm font-medium mt-1">
            {profile.role || 'Super Admin'}
          </p>
          {profile.memberSince && (
            <div className="flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700">
              <span className="material-symbols-outlined text-[16px] text-slate-500 dark:text-slate-400">
                calendar_month
              </span>
              <span className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                Member since {profile.memberSince}
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-3">
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-[#0e121b] dark:text-white text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="mr-2 material-symbols-outlined text-[18px]">upload</span>
            {isUploading ? 'Uploading...' : 'Upload New Photo'}
          </button>
          {profile.photo && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              disabled={isUploading}
              className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Photo
            </button>
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}

export default ProfileCard
