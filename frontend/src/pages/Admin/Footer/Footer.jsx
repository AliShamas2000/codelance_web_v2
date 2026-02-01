import React, { useState, useEffect } from 'react'
import FooterHeader from '../../../components/FooterHeader/FooterHeader'
import FooterLogoSection from '../../../components/FooterLogoSection/FooterLogoSection'
import AboutTextSection from '../../../components/AboutTextSection/AboutTextSection'
import SocialLinksSection from '../../../components/SocialLinksSection/SocialLinksSection'
import ContactInfoSection from '../../../components/ContactInfoSection/ContactInfoSection'
import WorkingHoursSection from '../../../components/WorkingHoursSection/WorkingHoursSection'
import FooterLinksSection from '../../../components/FooterLinksSection/FooterLinksSection'
import LocationMapSection from '../../../components/LocationMapSection/LocationMapSection'
import footerApi from '../../../api/footer'
import authApi from '../../../api/auth'

const Footer = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [formData, setFormData] = useState({
    logo: null,
    logoPreview: null,
    aboutEn: '',
    aboutAr: '',
    socialLinks: [],
    phone: '',
    email: '',
    address: '',
    workingHours: [],
    footerLinks: [],
    mapEmbed: ''
  })


  // Fetch footer data
  const fetchFooterData = async () => {
    try {
      setIsLoading(true)
      const response = await footerApi.getFooterData()
      const data = response.data || response
      
      setFormData({
        logo: null,
        logoPreview: data.logo || data.logo_url || null,
        aboutEn: data.aboutEn || data.about_en || data.about || '',
        aboutAr: data.aboutAr || data.about_ar || '',
        socialLinks: data.socialLinks || data.social_links || [],
        phone: data.phone || '',
        email: data.email || '',
        address: data.address || '',
        workingHours: data.workingHours || data.working_hours || [],
        footerLinks: data.footerLinks || data.footer_links || [],
        mapEmbed: data.mapEmbed || data.map_embed || ''
      })
    } catch (error) {
      console.error('Error fetching footer data:', error)
      // Initialize with empty data if API fails
      setFormData({
        logo: null,
        logoPreview: null,
        aboutEn: '',
        aboutAr: '',
        socialLinks: [],
        phone: '',
        email: '',
        address: '',
        workingHours: [],
        footerLinks: [],
        mapEmbed: ''
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchFooterData()
  }, [])


  const handleLogoChange = (file, preview) => {
    setFormData(prev => ({ ...prev, logo: file, logoPreview: preview }))
    setHasChanges(true)
  }

  const handleAboutEnChange = (value) => {
    setFormData(prev => ({ ...prev, aboutEn: value }))
    setHasChanges(true)
  }

  const handleAboutArChange = (value) => {
    setFormData(prev => ({ ...prev, aboutAr: value }))
    setHasChanges(true)
  }

  const handleAddSocialLink = () => {
    const newLink = { id: Date.now(), platform: '', url: '' }
    setFormData(prev => ({ ...prev, socialLinks: [...prev.socialLinks, newLink] }))
    setHasChanges(true)
  }

  const handleUpdateSocialLink = (index, updatedLink) => {
    const updated = [...formData.socialLinks]
    updated[index] = updatedLink
    setFormData(prev => ({ ...prev, socialLinks: updated }))
    setHasChanges(true)
  }

  const handleRemoveSocialLink = (index) => {
    const updated = formData.socialLinks.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, socialLinks: updated }))
    setHasChanges(true)
  }

  const handlePhoneChange = (value) => {
    setFormData(prev => ({ ...prev, phone: value }))
    setHasChanges(true)
  }

  const handleEmailChange = (value) => {
    setFormData(prev => ({ ...prev, email: value }))
    setHasChanges(true)
  }

  const handleAddressChange = (value) => {
    setFormData(prev => ({ ...prev, address: value }))
    setHasChanges(true)
  }

  const handleUpdateWorkingHours = (hours) => {
    setFormData(prev => ({ ...prev, workingHours: hours }))
    setHasChanges(true)
  }

  const handleAddFooterColumn = () => {
    const newColumn = { id: Date.now(), title: '', links: [] }
    setFormData(prev => ({ ...prev, footerLinks: [...prev.footerLinks, newColumn] }))
    setHasChanges(true)
  }

  const handleUpdateFooterColumn = (index, updatedColumn) => {
    const updated = [...formData.footerLinks]
    updated[index] = updatedColumn
    setFormData(prev => ({ ...prev, footerLinks: updated }))
    setHasChanges(true)
  }

  const handleRemoveFooterColumn = (index) => {
    const updated = formData.footerLinks.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, footerLinks: updated }))
    setHasChanges(true)
  }

  const handleAddFooterLink = (columnIndex, newLink) => {
    const updated = [...formData.footerLinks]
    updated[columnIndex] = {
      ...updated[columnIndex],
      links: [...(updated[columnIndex].links || []), newLink]
    }
    setFormData(prev => ({ ...prev, footerLinks: updated }))
    setHasChanges(true)
  }

  const handleUpdateFooterLink = (columnIndex, linkIndex, updatedLink) => {
    const updated = [...formData.footerLinks]
    const columnLinks = [...(updated[columnIndex].links || [])]
    columnLinks[linkIndex] = updatedLink
    updated[columnIndex] = { ...updated[columnIndex], links: columnLinks }
    setFormData(prev => ({ ...prev, footerLinks: updated }))
    setHasChanges(true)
  }

  const handleRemoveFooterLink = (columnIndex, linkIndex) => {
    const updated = [...formData.footerLinks]
    const columnLinks = (updated[columnIndex].links || []).filter((_, i) => i !== linkIndex)
    updated[columnIndex] = { ...updated[columnIndex], links: columnLinks }
    setFormData(prev => ({ ...prev, footerLinks: updated }))
    setHasChanges(true)
  }

  const handleMapEmbedChange = (value) => {
    setFormData(prev => ({ ...prev, mapEmbed: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      await footerApi.updateFooterData(formData)
      setHasChanges(false)
      // Show success message (you can add a toast notification here)
      alert('Footer data saved successfully!')
    } catch (error) {
      console.error('Error saving footer data:', error)
      alert('Failed to save footer data. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges && window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      fetchFooterData()
      setHasChanges(false)
    } else if (!hasChanges) {
      // Navigate back or just refresh
      fetchFooterData()
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <p>Loading footer data...</p>
      </div>
    )
  }

  return (
    <>
      <FooterHeader
        onCancel={handleCancel}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 lg:col-span-1">
          <FooterLogoSection
            logo={formData.logo}
            logoPreview={formData.logoPreview}
            onLogoChange={handleLogoChange}
          />
          <AboutTextSection
            aboutEn={formData.aboutEn}
            aboutAr={formData.aboutAr}
            onAboutEnChange={handleAboutEnChange}
            onAboutArChange={handleAboutArChange}
          />
          <SocialLinksSection
            socialLinks={formData.socialLinks}
            onAddLink={handleAddSocialLink}
            onUpdateLink={handleUpdateSocialLink}
            onRemoveLink={handleRemoveSocialLink}
          />
        </div>

        {/* Middle Column */}
        <div className="space-y-6 lg:col-span-1">
          <ContactInfoSection
            phone={formData.phone}
            email={formData.email}
            address={formData.address}
            onPhoneChange={handlePhoneChange}
            onEmailChange={handleEmailChange}
            onAddressChange={handleAddressChange}
          />
          <WorkingHoursSection
            workingHours={formData.workingHours}
            onUpdateHours={handleUpdateWorkingHours}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:col-span-1">
          <FooterLinksSection
            footerLinks={formData.footerLinks}
            onAddColumn={handleAddFooterColumn}
            onUpdateColumn={handleUpdateFooterColumn}
            onRemoveColumn={handleRemoveFooterColumn}
            onAddLink={handleAddFooterLink}
            onUpdateLink={handleUpdateFooterLink}
            onRemoveLink={handleRemoveFooterLink}
          />
          <LocationMapSection
            mapEmbed={formData.mapEmbed}
            onMapEmbedChange={handleMapEmbedChange}
          />
        </div>
      </div>
    </>
  )
}


export default Footer


