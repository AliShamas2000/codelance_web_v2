import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileCard from '../../../components/ProfileCard/ProfileCard'
import SettingsTextInput from '../../../components/SettingsTextInput/SettingsTextInput'
import SettingsPasswordInput from '../../../components/SettingsPasswordInput/SettingsPasswordInput'
import settingsApi from '../../../api/settings'
import { useAdminUserContext } from '../../../contexts/AdminUserContext'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'

const Settings = () => {
  const navigate = useNavigate()
  const { user: adminUser, refreshUser } = useAdminUserContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    jobTitle: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [userData, setUserData] = useState({ name: '', role: '', memberSince: '' })

  // Load profile data
  useEffect(() => {
    const loadData = async () => {
      try {
        await loadProfile()
      } catch (error) {
        console.error('Error loading profile:', error)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  // Load profile data
  const loadProfile = async () => {
    try {
      const response = await settingsApi.getProfile()
      const data = response.data || response
      
      setFormData(prev => ({
        ...prev,
        firstName: data.first_name || data.firstName || '',
        lastName: data.last_name || data.lastName || '',
        email: data.email || '',
        jobTitle: data.job_title || data.jobTitle || ''
      }))

      setPhotoPreview(data.profile_photo || data.profile_image || data.avatar || data.photo || null)

      setUserData({
        name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Admin',
        role: data.role || 'Super Admin',
        memberSince: data.member_since || data.memberSince || (data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '')
      })
    } catch (error) {
      console.error('Error loading profile:', error)
      // Set empty state on error
      setFormData(prev => ({
        ...prev,
        firstName: '',
        lastName: '',
        email: '',
        jobTitle: ''
      }))
      setUserData({
        name: adminUser?.name || 'Admin',
        role: adminUser?.role || 'Super Admin',
        memberSince: ''
      })
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle photo upload - auto-save to backend without needing Save button
  const handlePhotoUpload = async (file) => {
    try {
      setIsUploadingPhoto(true)
      setProfilePhoto(file)

      // Optimistic preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)

      // Immediately persist to backend
      await settingsApi.updateProfile({
        photo: file,
        remove_photo: false
      })

      // Reload profile to ensure data stays in sync
      await loadProfile()

      // Refresh admin user context so sidebar avatar updates
      if (refreshUser) {
        await refreshUser()
      }

      // Optional success feedback
      setSuccessMessage('Profile photo updated successfully!')
      setIsSuccessModalOpen(true)
      
      // Clear local file reference so Save Changes doesn't need to resend it
      setProfilePhoto(null)
    } catch (error) {
      console.error('Error uploading photo:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to upload photo. Please try again.'
      alert(errorMessage)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  // Handle photo remove
  const handlePhotoRemove = async () => {
    try {
      setIsUploadingPhoto(true)
      await settingsApi.removePhoto()
      setPhotoPreview(null)
      setProfilePhoto(null)
      // Reload profile to get updated data
      await loadProfile()
    } catch (error) {
      console.error('Error removing photo:', error)
      // Still remove from UI even if API fails
      setPhotoPreview(null)
      setProfilePhoto(null)
    } finally {
      setIsUploadingPhoto(false)
    }
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    // Profile validation
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

    // Password validation (only if any password field is filled)
    const hasPasswordData = formData.currentPassword || formData.newPassword || formData.confirmPassword
    if (hasPasswordData) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Current password is required'
      }
      if (!formData.newPassword) {
        newErrors.newPassword = 'New password is required'
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters long'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
        newErrors.newPassword = 'Password must include letters, numbers, and symbols'
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your new password'
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    try {
      setIsSaving(true)

      // Update profile
      await settingsApi.updateProfile({
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        job_title: formData.jobTitle,
        photo: profilePhoto,
        remove_photo: false
      })

      // Update password if provided
      const hasPasswordData = formData.currentPassword || formData.newPassword || formData.confirmPassword
      if (hasPasswordData) {
        await settingsApi.changePassword({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
          new_password_confirmation: formData.confirmPassword
        })
        // Clear password fields after successful change
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }))
      }

      // Reload profile to get updated data
      await loadProfile()
      
      // Show success message
      setSuccessMessage('Settings saved successfully!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error saving settings:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save settings. Please try again.'
      alert(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      loadProfile()
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
      setErrors({})
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
        </div>
      </div>
    )
  }

  const profileCardData = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    name: userData?.name || `${formData.firstName} ${formData.lastName}`.trim() || 'Admin',
    role: userData?.role || 'Super Admin',
    photo: photoPreview,
    memberSince: userData?.memberSince || ''
  }

  return (
    <>
      <div className="max-w-[1200px] mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex flex-wrap gap-2 py-4 mb-2">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate('/admin')
            }}
            className="text-[#4e6797] dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary transition-colors"
          >
            Home
          </a>
          <span className="text-[#4e6797] dark:text-slate-500 text-sm font-medium leading-normal">/</span>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              navigate('/admin')
            }}
            className="text-[#4e6797] dark:text-slate-400 text-sm font-medium leading-normal hover:text-primary transition-colors"
          >
            Users
          </a>
          <span className="text-[#4e6797] dark:text-slate-500 text-sm font-medium leading-normal">/</span>
          <span className="text-[#0e121b] dark:text-white text-sm font-medium leading-normal">Profile</span>
        </nav>

        {/* Page Heading */}
        <div className="flex flex-wrap justify-between gap-3 mb-8">
          <div className="flex min-w-72 flex-col gap-2">
            <h1 className="text-[#0e121b] dark:text-white text-3xl sm:text-4xl font-black leading-tight tracking-[-0.033em]">
              Profile Settings
            </h1>
            <p className="text-[#4e6797] dark:text-slate-400 text-base font-normal leading-normal">
              Manage your personal information, security, and preferences.
            </p>
          </div>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Identity Card */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <ProfileCard
              profile={profileCardData}
              onPhotoUpload={handlePhotoUpload}
              onPhotoRemove={handlePhotoRemove}
              isUploading={isUploadingPhoto}
            />
            {/* Admin Status Card */}
            <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6 border border-primary/10">
              <h3 className="text-primary dark:text-blue-400 font-bold mb-2 flex items-center gap-2">
                <span className="material-symbols-outlined">shield_person</span>
                Admin Status
              </h3>
              <p className="text-sm text-[#4e6797] dark:text-slate-400">
                You have full access permissions to manage users, settings, and system configurations.
              </p>
            </div>
          </div>

          {/* Right Column: Settings Forms */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Personal Information Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary">person</span>
                <h2 className="text-[#0e121b] dark:text-white text-xl font-bold">Personal Information</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <SettingsTextInput
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  error={errors.firstName}
                />
                <SettingsTextInput
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  error={errors.lastName}
                />
                <SettingsTextInput
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon="mail"
                  required
                  error={errors.email}
                  className="sm:col-span-2"
                />
                <SettingsTextInput
                  label="Job Title"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleInputChange}
                  error={errors.jobTitle}
                  className="sm:col-span-2"
                />
              </div>
            </div>

            {/* Security Card */}
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                <span className="material-symbols-outlined text-primary">lock</span>
                <h2 className="text-[#0e121b] dark:text-white text-xl font-bold">Change Password</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <SettingsPasswordInput
                  label="Current Password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  error={errors.currentPassword}
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <SettingsPasswordInput
                    label="New Password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    error={errors.newPassword}
                  />
                  <SettingsPasswordInput
                    label="Confirm New Password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    error={errors.confirmPassword}
                  />
                </div>
                <div className="flex items-start gap-2 mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-[20px] mt-0.5">
                    info
                  </span>
                  <p className="text-xs text-blue-800 dark:text-blue-200 leading-tight">
                    Password must be at least 8 characters long and include a mix of letters, numbers, and symbols.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSaving}
                className="w-full sm:w-auto h-12 sm:h-11 px-8 rounded-lg border border-transparent text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="w-full sm:w-auto h-12 sm:h-11 px-8 rounded-lg bg-primary hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">save</span>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message Modal */}
      <SuccessMessageModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Settings Saved!"
        message={successMessage}
      />
    </>
  )
}

export default Settings
