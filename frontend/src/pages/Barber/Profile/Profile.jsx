import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileHeader from '../../../components/ProfileHeader/ProfileHeader'
import ProfileImageUpload from '../../../components/ProfileImageUpload/ProfileImageUpload'
import PasswordInput from '../../../components/PasswordInput/PasswordInput'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import barberApi from '../../../api/barber'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'

const Profile = () => {
  const navigate = useNavigate()
  const { user: sidebarUser, refreshUser } = useBarberUserContext()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    bio: ''
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [profileImage, setProfileImage] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await barberApi.getProfile()
      // API returns {success: true, data: {...}}
      const data = response.data || response
      setProfile(data)
      setFormData({
        firstName: data.firstName || data.first_name || '',
        lastName: data.lastName || data.last_name || '',
        email: data.email || '',
        jobTitle: data.jobTitle || data.job_title || data.role || '',
        bio: data.bio || ''
      })
      setProfileImagePreview(data.avatar || data.profile_image || data.profile_photo || '')
    } catch (error) {
      console.error('Error fetching profile:', error)
      // Use default profile data as fallback
      const defaultProfile = getDefaultProfile()
      setProfile(defaultProfile)
      setFormData({
        firstName: defaultProfile.firstName,
        lastName: defaultProfile.lastName,
        email: defaultProfile.email,
        jobTitle: defaultProfile.jobTitle,
        bio: defaultProfile.bio
      })
      setProfileImagePreview(defaultProfile.avatar)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    setHasChanges(true)
    setErrors(prev => ({
      ...prev,
      [field]: ''
    }))
  }

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }))
    setPasswordErrors(prev => ({
      ...prev,
      [field]: ''
    }))
  }

  const handleImageChange = (file) => {
    if (file) {
      setProfileImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
      setHasChanges(true)
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePassword = () => {
    if (!passwordData.newPassword && !passwordData.currentPassword && !passwordData.confirmPassword) {
      return true // Password change is optional
    }
    
    const newErrors = {}
    
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = 'Current password is required'
    }
    
    if (!passwordData.newPassword) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!/(?=.*[a-z])(?=.*[\d\W\s])/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one lowercase letter and one number, symbol, or whitespace'
    }
    
    if (!passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password'
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    const hasPasswordChange = passwordData.newPassword || passwordData.currentPassword || passwordData.confirmPassword
    if (hasPasswordChange && !validatePassword()) {
      return
    }

    setIsSaving(true)
    try {
      // Update profile
      const profileUpdateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        jobTitle: formData.jobTitle,
        bio: formData.bio
      }

      // If image is selected, upload it
      if (profileImage) {
        const formDataToSend = new FormData()
        formDataToSend.append('avatar', profileImage)
        formDataToSend.append('firstName', formData.firstName)
        formDataToSend.append('lastName', formData.lastName)
        formDataToSend.append('email', formData.email)
        formDataToSend.append('jobTitle', formData.jobTitle)
        formDataToSend.append('bio', formData.bio || '')
        
        const response = await barberApi.updateProfile(formDataToSend, true) // true indicates FormData
        // Update profile image preview from response
        if (response.data && (response.data.avatar || response.data.profile_photo)) {
          setProfileImagePreview(response.data.avatar || response.data.profile_photo)
        }
      } else {
        await barberApi.updateProfile(profileUpdateData)
      }

      // Update password if provided
      if (hasPasswordChange) {
        await barberApi.updatePassword({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword
        })
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }

      setHasChanges(false)
      setProfileImage(null) // Clear the file input after successful upload
      
      // Refresh profile data
      await fetchProfile()
      
      // Refresh user context to update sidebar
      if (refreshUser) {
        await refreshUser()
      }
      
      // Show success message
      setSuccessMessage('Profile updated successfully!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        fetchProfile() // Reset to original
        setHasChanges(false)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        setProfileImage(null)
      }
    } else {
      navigate('/barber/dashboard')
    }
  }

  return (
    <>
      <main className="flex-grow p-6 lg:p-10 lg:ml-64">
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="mx-auto max-w-6xl">
          <ProfileHeader
            onCancel={handleCancel}
            onSave={handleSave}
            isSaving={isSaving}
            hasChanges={hasChanges}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Image */}
            <div className="lg:col-span-1 space-y-6">
              <ProfileImageUpload
                imagePreview={profileImagePreview}
                onImageChange={handleImageChange}
              />
            </div>

            {/* Right Column - Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <h3 className="font-bold text-lg text-[#111816] dark:text-white">Personal Information</h3>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="firstName">
                        First Name
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-colors text-sm py-2.5 px-4 ${
                          errors.firstName ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.firstName && (
                        <p className="text-xs text-red-500">{errors.firstName}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="lastName">
                        Last Name
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-colors text-sm py-2.5 px-4 ${
                          errors.lastName ? 'border-red-500' : ''
                        }`}
                      />
                      {errors.lastName && (
                        <p className="text-xs text-red-500">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <span className="material-symbols-outlined text-[18px]">mail</span>
                      </span>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={`w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:border-primary focus:ring-primary dark:text-white pl-10 shadow-sm transition-colors text-sm py-2.5 ${
                          errors.email ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="jobTitle">
                      Job Title
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <span className="material-symbols-outlined text-[18px]">badge</span>
                      </span>
                      <input
                        id="jobTitle"
                        name="jobTitle"
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                        className={`w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:border-primary focus:ring-primary dark:text-white pl-10 shadow-sm transition-colors text-sm py-2.5 ${
                          errors.jobTitle ? 'border-red-500' : ''
                        }`}
                      />
                    </div>
                    {errors.jobTitle && (
                      <p className="text-xs text-red-500">{errors.jobTitle}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="bio">
                      Short Bio
                    </label>
                    <textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell clients a bit about yourself..."
                      rows="3"
                      className="w-full rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 focus:border-primary focus:ring-primary dark:text-white shadow-sm transition-colors text-sm py-2.5 px-4"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Brief description for your booking page.
                    </p>
                  </div>
                </div>
              </div>

              {/* Change Password */}
              <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                  <span className="material-symbols-outlined text-primary">lock</span>
                  <h3 className="font-bold text-lg text-[#111816] dark:text-white">Change Password</h3>
                </div>
                <div className="space-y-6">
                  <PasswordInput
                    label="Current Password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="••••••••"
                    error={passwordErrors.currentPassword}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <PasswordInput
                      label="New Password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      placeholder="••••••••"
                      error={passwordErrors.newPassword}
                    />
                    <PasswordInput
                      label="Confirm New Password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                      placeholder="••••••••"
                      error={passwordErrors.confirmPassword}
                    />
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-sm mt-0.5">info</span>
                    <div className="text-sm text-blue-800 dark:text-blue-300">
                      <p className="font-medium mb-1">Password Requirements</p>
                      <ul className="list-disc list-inside text-xs opacity-80 space-y-1">
                        <li>Minimum 8 characters long - the more, the better</li>
                        <li>At least one lowercase character</li>
                        <li>At least one number, symbol, or whitespace character</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Save/Cancel Buttons */}
              <div className="flex flex-col gap-3 md:hidden">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary text-[#111816] text-sm font-bold shadow-lg shadow-primary/20 hover:bg-[#0fb37d] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#111816]"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
            </div>
          </>
        )}
      </main>
      
      {/* Success Message Modal */}
      <SuccessMessageModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Success!"
        message={successMessage}
      />
    </>
  )
}

// Default profile data
const getDefaultProfile = () => ({
  firstName: 'Alex',
  lastName: 'Sterling',
  email: 'alex.sterling@bladecms.com',
  jobTitle: 'Master Barber',
  bio: '',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA23VfiVo4RC9FLZwS6xJhWLQ426hp2Vu-eMKnlKNN8d3iDnny3GjorYGBvaGuoPVbzEw9D53UqBjtF_KY9nDqGQ_V6JPvHAURR1LxP-aMDyBP3WoN23aoRQ6omLmugQGjqgu2cvjrv4Zr9L_GzK6nfmzGLQSoDRPTBXHiF2cOZ2TJtReuvRP4HJFIm5_OEva15qMTuYX7Ia7cROYPek1e0V-5Vyro0M08qu90SM_bXVeOiAVmq7pcpnp-0bqasneZ_q-rF0cdVjO4'
})

export default Profile

