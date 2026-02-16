import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PasswordInput from '../../../components/PasswordInput/PasswordInput'
import PhoneInput from '../../../components/PhoneInput/PhoneInput'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import clientApi from '../../../api/client'
import barbersApi from '../../../api/barbers'
import authApi from '../../../api/auth'

const Profile = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [profile, setProfile] = useState(null)
  const [barbers, setBarbers] = useState([])
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    preferredStylist: ''
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [passwordErrors, setPasswordErrors] = useState({})
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchBarbers()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    try {
      const response = await clientApi.getProfile()
      const profileData = response.profile || response
      
      setProfile(profileData)
      setFormData({
        firstName: profileData.first_name || '',
        lastName: profileData.last_name || '',
        email: profileData.email || '',
        phone: profileData.phone || '',
        preferredStylist: profileData.preferred_stylist ? profileData.preferred_stylist.toString() : ''
      })
      
      if (profileData.avatar || profileData.profile_photo) {
        const avatarUrl = profileData.avatar || profileData.profile_photo
        setAvatarPreview(avatarUrl.startsWith('http') ? avatarUrl : `${(import.meta.env.VITE_API_BASE_URL || window.location.origin)}${avatarUrl}`)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      // If unauthorized, redirect to login (ProtectedRoute will handle this)
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        navigate('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const fetchBarbers = async () => {
    try {
      const response = await barbersApi.getBarbers({ role: 'barber' })
      const barbersData = response.data || response || []
      setBarbers(Array.isArray(barbersData) ? barbersData : [])
    } catch (error) {
      console.error('Error fetching barbers:', error)
      setBarbers([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handlePhoneChange = (e) => {
    const value = e?.target?.value || e || ''
    setFormData(prev => ({ ...prev, phone: value }))
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }))
    }
  }

  const handleSelectChange = (value) => {
    setFormData(prev => ({ ...prev, preferredStylist: value }))
    if (errors.preferredStylist) {
      setErrors(prev => ({ ...prev, preferredStylist: '' }))
    }
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    if (passwordErrors[name]) {
      setPasswordErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file (JPEG, JPG, PNG, or GIF)' }))
        return
      }

      // Validate file size (2MB max)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 2MB' }))
        return
      }

      setAvatar(file)
      setErrors(prev => ({ ...prev, avatar: '' }))
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatar(null)
    setAvatarPreview(null)
    // Mark for removal in backend
    setAvatar('REMOVE')
  }

  const validateProfileForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Phone number is read-only, no validation needed

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePasswordForm = () => {
    const newErrors = {}

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Current password is required'
    }

    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'New password is required'
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
    } else if (!/(?=.*[A-Z])/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter'
    } else if (!/(?=.*[!@#$%^&*(),.?":{}|<>])/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one special character'
    }

    if (!passwordData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setPasswordErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    setIsSaving(true)
    setErrors({})

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('first_name', formData.firstName)
      formDataToSend.append('last_name', formData.lastName)
      if (formData.email) {
        formDataToSend.append('email', formData.email)
      }
      // Phone number is read-only, don't send it in update request
      if (formData.preferredStylist) {
        formDataToSend.append('preferred_stylist', formData.preferredStylist)
      }
      
      if (avatar && avatar !== 'REMOVE') {
        formDataToSend.append('avatar', avatar)
      } else if (avatar === 'REMOVE') {
        formDataToSend.append('remove_avatar', '1')
      }

      const response = await clientApi.updateProfile(formDataToSend, true)
      
      if (response.success) {
        setSuccessMessage('Profile updated successfully!')
        setIsSuccessModalOpen(true)
        await fetchProfile()
        // Update localStorage user data
        const userResponse = await authApi.getCurrentUser()
        if (userResponse.user) {
          localStorage.setItem('user', JSON.stringify(userResponse.user))
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors || {}
        setErrors(validationErrors)
      } else {
        setErrors({ general: error.response?.data?.message || 'Failed to update profile. Please try again.' })
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()

    if (!validatePasswordForm()) {
      return
    }

    setIsUpdatingPassword(true)
    setPasswordErrors({})

    try {
      const response = await clientApi.updatePassword({
        current_password: passwordData.currentPassword,
        new_password: passwordData.newPassword,
        password_confirmation: passwordData.confirmPassword
      })

      if (response.success) {
        setSuccessMessage('Password updated successfully!')
        setIsSuccessModalOpen(true)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      console.error('Error updating password:', error)
      if (error.response?.status === 422) {
        const validationErrors = error.response?.data?.errors || {}
        // Map backend error keys to frontend keys
        const mappedErrors = {}
        if (validationErrors.current_password) {
          mappedErrors.currentPassword = Array.isArray(validationErrors.current_password) 
            ? validationErrors.current_password[0] 
            : validationErrors.current_password
        }
        if (validationErrors.new_password) {
          mappedErrors.newPassword = Array.isArray(validationErrors.new_password) 
            ? validationErrors.new_password[0] 
            : validationErrors.new_password
        }
        if (validationErrors.password_confirmation) {
          mappedErrors.confirmPassword = Array.isArray(validationErrors.password_confirmation) 
            ? validationErrors.password_confirmation[0] 
            : validationErrors.password_confirmation
        }
        setPasswordErrors(Object.keys(mappedErrors).length > 0 ? mappedErrors : validationErrors)
      } else {
        setPasswordErrors({ general: error.response?.data?.message || 'Failed to update password. Please try again.' })
      }
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      const response = await clientApi.deleteAccount()
      if (response.success) {
        // Logout and redirect
        await authApi.logout()
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
        navigate('/')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      setErrors({ general: error.response?.data?.message || 'Failed to delete account. Please try again.' })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  // Get barber options for select
  const barberOptions = barbers.map(barber => ({
    value: barber.id.toString(),
    label: `${barber.name}${barber.job_title ? ` (${barber.job_title})` : ''}`
  }))

  if (isLoading) {
    return (
      <div className="w-full py-12 lg:py-16">
        <div className="max-w-4xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#637588] dark:text-[#8d9ba8]">Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="w-full py-8 lg:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-2 mb-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-[#111816] dark:text-white">User Profile Management</h1>
            <p className="text-[#637588] dark:text-[#8d9ba8] text-sm lg:text-base">Manage your personal information and account security.</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-800 dark:text-red-200 text-sm font-medium">{errors.general}</p>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="bg-white dark:bg-[#152822] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e7eb] dark:border-[#2a3e36] p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative group">
                {avatarPreview ? (
                  <img
                    alt="Profile Large"
                    className="size-32 rounded-full object-cover border-4 border-gray-50 dark:border-gray-800 shadow-sm"
                    src={avatarPreview}
                  />
                ) : (
                  <div className="size-32 rounded-full border-4 border-gray-50 dark:border-gray-800 shadow-sm bg-gradient-to-br from-primary to-[#0fb57e] flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-5xl">person</span>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 transition-transform border-4 border-white dark:border-[#152822]"
                >
                  <span className="material-symbols-outlined text-sm">photo_camera</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-bold text-[#111816] dark:text-white">Profile Picture</h3>
                <p className="text-sm text-[#637588] dark:text-[#8d9ba8] mt-1">PNG, JPG or GIF. Max size of 2MB.</p>
                <div className="mt-4 flex gap-3 justify-center md:justify-start">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-[#f0f2f5] dark:bg-[#2a3e36] hover:bg-[#e5e7eb] dark:hover:bg-[#1f3329] text-[#111816] dark:text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    Upload New
                  </button>
                  <button
                    onClick={handleRemoveAvatar}
                    className="px-4 py-2 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-sm font-semibold transition-colors"
                  >
                    Remove
                  </button>
                </div>
                {errors.avatar && (
                  <p className="mt-2 text-sm text-red-500">{errors.avatar}</p>
                )}
              </div>
            </div>
          </div>

          {/* Personal Information Section */}
          <div className="bg-white dark:bg-[#152822] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e7eb] dark:border-[#2a3e36] p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-6 border-b border-[#f0f2f5] dark:border-[#2a3e36] pb-4">
              <span className="material-symbols-outlined text-primary text-xl">badge</span>
              <h2 className="text-lg font-bold text-[#111816] dark:text-white">Personal Information</h2>
            </div>
            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111816] dark:text-white">Full Name</label>
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className={`w-full rounded-lg border ${
                    errors.firstName ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
                  } bg-white dark:bg-[#0b1a15] text-[#111816] dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111816] dark:text-white">Last Name</label>
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className={`w-full rounded-lg border ${
                    errors.lastName ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
                  } bg-white dark:bg-[#0b1a15] text-[#111816] dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111816] dark:text-white">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className={`w-full rounded-lg border ${
                    errors.email ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
                  } bg-white dark:bg-[#0b1a15] text-[#111816] dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all`}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#111816] dark:text-white">Phone Number</label>
                <PhoneInput
                  name="phone"
                  value={formData.phone}
                  onChange={() => {}} // No-op since it's read-only
                  placeholder="Enter your phone number"
                  error={errors.phone}
                  defaultCountry="LB"
                  className="[&>div]:gap-0 opacity-75"
                  disabled={true}
                />
                <p className="text-xs text-[#637588] dark:text-[#8d9ba8] mt-1">Phone number cannot be changed</p>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-[#111816] dark:text-white">Preferred Stylist</label>
                <select
                  name="preferredStylist"
                  value={formData.preferredStylist}
                  onChange={(e) => handleSelectChange(e.target.value)}
                  className={`w-full rounded-lg border ${
                    errors.preferredStylist ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
                  } bg-white dark:bg-[#0b1a15] text-[#111816] dark:text-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary appearance-none cursor-pointer transition-all`}
                >
                  <option value="">Select a stylist (optional)</option>
                  {barberOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.preferredStylist && (
                  <p className="text-sm text-red-500">{errors.preferredStylist}</p>
                )}
              </div>
            </form>
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-primary hover:bg-[#0eb57d] text-white px-8 py-3 rounded-lg font-bold text-sm transition-all shadow-md shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Account Security Section */}
          <div className="bg-white dark:bg-[#152822] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e7eb] dark:border-[#2a3e36] p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-6 border-b border-[#f0f2f5] dark:border-[#2a3e36] pb-4">
              <span className="material-symbols-outlined text-primary text-xl">security</span>
              <h2 className="text-lg font-bold text-[#111816] dark:text-white">Account Security</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#111816] dark:text-white">Current Password</label>
                  <PasswordInput
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    error={passwordErrors.currentPassword}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#111816] dark:text-white">New Password</label>
                  <PasswordInput
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Min. 8 characters"
                    error={passwordErrors.newPassword}
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#111816] dark:text-white">Confirm New Password</label>
                  <PasswordInput
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                    error={passwordErrors.confirmPassword}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="bg-[#fcfdfd] dark:bg-[#12221d] border border-[#e5e7eb] dark:border-[#2a3e36] p-6 rounded-lg space-y-4">
                <h4 className="text-sm font-bold text-[#111816] dark:text-white uppercase tracking-wider">Password Requirements</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-xs text-[#637588] dark:text-[#8d9ba8]">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    Minimum 8 characters
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#637588] dark:text-[#8d9ba8]">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    At least one uppercase letter
                  </li>
                  <li className="flex items-center gap-2 text-xs text-[#637588] dark:text-[#8d9ba8]">
                    <span className="material-symbols-outlined text-primary text-sm">check_circle</span>
                    At least one special character
                  </li>
                </ul>
                <div className="pt-4">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isUpdatingPassword}
                    className="w-full bg-[#111816] dark:bg-[#0b1a15] text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#1a2a24] dark:hover:bg-[#152822] transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
                  >
                    {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
                {passwordErrors.general && (
                  <p className="text-sm text-red-500">{passwordErrors.general}</p>
                )}
              </div>
            </div>
          </div>

          {/* Delete Account Section */}
          <div className="bg-red-50/10 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 lg:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-red-600 dark:text-red-400 font-bold">Delete Account</h3>
                <p className="text-xs text-[#637588] dark:text-[#8d9ba8]">Once deleted, your booking history and preferences will be permanently removed.</p>
              </div>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-6 py-2 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm font-semibold rounded-lg hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all active:scale-[0.98]"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessMessageModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Success!"
        message={successMessage}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#152822] rounded-xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Confirm Account Deactivation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to deactivate your account? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deactivating...' : 'Deactivate Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Profile


