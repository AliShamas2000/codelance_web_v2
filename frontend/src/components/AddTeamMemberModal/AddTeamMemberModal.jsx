import React, { useState, useEffect } from 'react'
import Modal from '../Modal/Modal'
import ToggleSwitch from '../ToggleSwitch/ToggleSwitch'
import PhoneInput from '../PhoneInput/PhoneInput'

const AddTeamMemberModal = ({
  isOpen = false,
  onClose,
  onSubmit,
  member = null, // If provided, this is edit mode
  isLoading = false,
  className = ""
}) => {
  const isEditMode = !!member
  const [formData, setFormData] = useState({
    teamMemberName: '',
    jobTitle: '',
    phone: '',
    email: '',
    isActive: true,
    bio: ''
  })
  const [profilePhoto, setProfilePhoto] = useState(null)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState(null)
  const [errors, setErrors] = useState({})
  const [socialLinks, setSocialLinks] = useState([])
  
  // Available social media platforms
  const availablePlatforms = [
    { value: 'instagram', label: 'Instagram', icon: 'photo_camera' },
    { value: 'facebook', label: 'Facebook', icon: 'facebook' },
    { value: 'twitter', label: 'Twitter', icon: 'alternate_email' },
    { value: 'linkedin', label: 'LinkedIn', icon: 'work' },
    { value: 'youtube', label: 'YouTube', icon: 'play_circle' },
    { value: 'tiktok', label: 'TikTok', icon: 'music_note' },
  ]

  useEffect(() => {
    if (isOpen) {
      if (member) {
        // Edit mode - populate form with member data
        const fullName = `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.name || ''
        setFormData({
          teamMemberName: fullName,
          jobTitle: member.jobTitle || member.job_title || '',
          phone: member.phone || '',
          email: member.email || '',
          isActive: member.status === 'active',
          bio: member.bio || ''
        })
        setProfilePhotoPreview(member.profilePhoto || member.avatar || null)
        
        // Load social media links
        if (member.socialLinks && Array.isArray(member.socialLinks)) {
          setSocialLinks(member.socialLinks.map(link => ({
            platform: link.platform,
            url: link.url,
            id: link.id || Math.random().toString(36).substr(2, 9)
          })))
        } else {
          setSocialLinks([])
        }
      } else {
        // Add mode - reset form
        setFormData({
          teamMemberName: '',
          jobTitle: '',
          phone: '',
          email: '',
          isActive: true,
          bio: ''
        })
        setProfilePhoto(null)
        setProfilePhotoPreview(null)
        setSocialLinks([])
      }
      setErrors({})
    }
  }, [isOpen, member])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setProfilePhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validation
    const newErrors = {}
    if (!formData.teamMemberName.trim()) {
      newErrors.teamMemberName = 'Team member name is required'
    }
    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required'
    }
    if (!formData.phone || !formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!formData.phone.startsWith('+')) {
      newErrors.phone = 'Please enter a valid international phone number'
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Prepare data for submission
    // Split barber name into first and last name
    const nameParts = formData.teamMemberName.trim().split(' ')
    const firstName = nameParts[0] || ''
    const lastName = nameParts.slice(1).join(' ') || ''

    // Prepare social links (filter out empty ones)
    const validSocialLinks = socialLinks
      .filter(link => link.platform && link.url && link.url.trim())
      .map(link => ({
        platform: link.platform,
        url: link.url.trim()
      }))

    const submitData = {
      firstName,
      lastName,
      name: formData.teamMemberName.trim(),
      jobTitle: formData.jobTitle.trim(),
      phone: formData.phone ? formData.phone.trim() : '',
      email: formData.email.trim(),
      status: formData.isActive ? 'active' : 'inactive',
      bio: formData.bio ? formData.bio.trim() : '',
      profilePhoto: profilePhoto || undefined,
      // Always send socialLinks (can be empty array) so backend can clear them if needed
      socialLinks: validSocialLinks
    }

    onSubmit(submitData)
  }

  const handleClose = () => {
    setFormData({
      teamMemberName: '',
      jobTitle: '',
      phone: '',
      email: '',
      isActive: true,
      bio: ''
    })
    setProfilePhoto(null)
    setProfilePhotoPreview(null)
    setSocialLinks([])
    setErrors({})
    onClose()
  }

  const addSocialLink = () => {
    setSocialLinks(prev => [...prev, {
      platform: 'instagram',
      url: '',
      id: Math.random().toString(36).substr(2, 9)
    }])
  }

  const removeSocialLink = (id) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id))
  }

  const updateSocialLink = (id, field, value) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ))
  }

  const getPlatformIcon = (platform) => {
    const platformData = availablePlatforms.find(p => p.value === platform)
    return platformData?.icon || 'link'
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Team Member' : 'Add Team Member'}
      titleIcon="person_add"
      maxWidth="max-w-2xl"
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex justify-center items-center rounded-lg bg-white dark:bg-transparent px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="inline-flex justify-center items-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-gray-300/50 dark:shadow-none hover:bg-gray-800 dark:hover:bg-gray-600 transition-all transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isLoading ? 'Saving...' : isEditMode ? 'Update Barber' : 'Add Barber'}
          </button>
        </>
      }
      className={className}
    >
      <div className="space-y-6">
        {/* Profile Photo Upload */}
        <div className="flex flex-col items-center justify-center pb-2">
          <div className="relative group cursor-pointer">
            <div
              className="w-28 h-28 rounded-full bg-gray-50 dark:bg-gray-800 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary dark:hover:border-white transition-all overflow-hidden"
              onClick={() => document.getElementById('profile-photo-input')?.click()}
            >
              {profilePhotoPreview ? (
                <img
                  alt="Preview"
                  className="h-full w-full object-cover"
                  src={profilePhotoPreview}
                />
              ) : (
                <>
                  <span className="material-symbols-outlined text-gray-400 text-3xl mb-1 group-hover:text-primary dark:group-hover:text-white transition-colors">
                    add_a_photo
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium group-hover:text-primary dark:group-hover:text-white transition-colors">
                    Upload Photo
                  </span>
                </>
              )}
            </div>
            <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 shadow-md border-2 border-white dark:border-gray-800">
              <span className="material-symbols-outlined text-sm block">edit</span>
            </div>
            <input
              id="profile-photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Barber Name */}
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="team-member-name">
              Team Member Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <span className="material-symbols-outlined text-lg">badge</span>
              </span>
              <input
                id="team-member-name"
                type="text"
                value={formData.teamMemberName}
                onChange={(e) => handleInputChange('teamMemberName', e.target.value)}
                placeholder="e.g. John Doe"
                className={`w-full bg-gray-50 dark:bg-gray-800 border ${
                  errors.barberName ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 transition-colors`}
              />
            </div>
            {errors.teamMemberName && (
              <p className="mt-1 text-xs text-red-500">{errors.teamMemberName}</p>
            )}
          </div>

          {/* Job Title */}
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="job-title">
              Job Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <span className="material-symbols-outlined text-lg">work</span>
              </span>
              <input
                id="job-title"
                type="text"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="e.g. Senior Stylist"
                className={`w-full bg-gray-50 dark:bg-gray-800 border ${
                  errors.jobTitle ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 transition-colors`}
              />
            </div>
            {errors.jobTitle && (
              <p className="mt-1 text-xs text-red-500">{errors.jobTitle}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="col-span-1 md:col-span-1">
            <PhoneInput
              label="Phone Number"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="Enter phone number"
              required
              error={errors.phone}
              defaultCountry="LB"
            />
          </div>

          {/* Email Address */}
          <div className="col-span-1 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="email">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
                <span className="material-symbols-outlined text-lg">email</span>
              </span>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="barber@sadek.com"
                className={`w-full bg-gray-50 dark:bg-gray-800 border ${
                  errors.email ? 'border-red-500' : 'border-gray-200 dark:border-gray-600'
                } rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 transition-colors`}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password fields removed as team members no longer require manual password entry */}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Short bio about this team member..."
            className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 transition-colors resize-none"
          />
        </div>

        {/* Social Media Links */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-5 mt-2">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-semibold text-gray-900 dark:text-white">
              Social Media Links
            </label>
            <button
              type="button"
              onClick={addSocialLink}
              className="text-xs text-primary dark:text-white font-medium flex items-center hover:underline"
            >
              <span className="material-symbols-outlined text-sm mr-1">add_circle_outline</span>
              Add Platform
            </button>
          </div>
          <div className="space-y-3">
            {socialLinks.map((link) => (
              <div key={link.id} className="flex gap-2 items-center">
                <div className="flex-1 flex rounded-lg shadow-sm">
                  <div className="flex-shrink-0 relative">
                    <select
                      value={link.platform}
                      onChange={(e) => updateSocialLink(link.id, 'platform', e.target.value)}
                      className="inline-flex items-center px-3 py-2.5 rounded-l-lg border border-r-0 border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none cursor-pointer"
                    >
                      {availablePlatforms.map(platform => (
                        <option key={platform.value} value={platform.value}>
                          {platform.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                    placeholder={`Enter ${availablePlatforms.find(p => p.value === link.platform)?.label || 'platform'} URL`}
                    className="flex-1 w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-r-lg px-4 py-2.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary focus:outline-none dark:text-white placeholder-gray-400 transition-colors"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(link.id)}
                  className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                  title="Remove"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
            {socialLinks.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-2">
                No social media links added. Click "Add Platform" to add one.
              </p>
            )}
          </div>
        </div>

        {/* Active Status Toggle */}
        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-xl p-4 flex items-center justify-between border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-300">
                {formData.isActive ? 'toggle_on' : 'toggle_off'}
              </span>
            </div>
            <div>
              <span className="block text-sm font-semibold text-gray-900 dark:text-white">
                Active Status
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                Toggle to enable or disable team member account access.
              </span>
            </div>
          </div>
          <ToggleSwitch
            checked={formData.isActive}
            onChange={(checked) => handleInputChange('isActive', checked)}
          />
        </div>
      </div>
    </Modal>
  )
}

export default AddTeamMemberModal
