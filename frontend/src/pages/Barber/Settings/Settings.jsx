import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsHeader from '../../../components/SettingsHeader/SettingsHeader'
import SettingsSection from '../../../components/SettingsSection/SettingsSection'
import ToggleSwitch from '../../../components/ToggleSwitch/ToggleSwitch'
import FormSelect from '../../../components/FormSelect/FormSelect'
import barberApi from '../../../api/barber'
import SuccessMessageModal from '../../../components/SuccessMessageModal/SuccessMessageModal'
import { useBarberUserContext } from '../../../contexts/BarberUserContext'

const Settings = () => {
  const navigate = useNavigate()
  const { user } = useBarberUserContext()
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setIsLoading(true)
    try {
      const response = await barberApi.getSettings()
      // API returns {success: true, data: {...}}
      const data = response.data || response
      setSettings(data)
    } catch (error) {
      console.error('Error fetching settings:', error)
      // Use default settings as fallback
      setSettings(getDefaultSettings())
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleNestedSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Save general settings
      const response = await barberApi.updateSettings(settings)
      
      // Update settings with response data if available
      if (response.data) {
        setSettings(response.data)
      }
      
      setHasChanges(false)
      setSuccessMessage('Settings saved successfully!')
      setIsSuccessModalOpen(true)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        fetchSettings() // Reset to original
        setHasChanges(false)
      }
    }
  }

  return (
    <>
      <main className="flex-grow p-6 lg:p-10 lg:ml-64">
        {isLoading && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400">Loading settings...</p>
            </div>
          </div>
        )}
        {!isLoading && (
          <>
            <div className="mx-auto max-w-6xl">
          <SettingsHeader
            onCancel={handleCancel}
            onSave={handleSave}
            isSaving={isSaving}
            hasChanges={hasChanges}
          />

          <div className="space-y-8">
            {/* Dashboard Preferences */}
            <SettingsSection
              title="Dashboard Preferences"
              icon="tune"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormSelect
                  label="Default Calendar View"
                  value={settings?.dashboardPreferences?.defaultCalendarView || 'daily'}
                  onChange={(value) => handleNestedSettingChange('dashboardPreferences', 'defaultCalendarView', value)}
                  options={[
                    { value: 'daily', label: 'Daily View' },
                    { value: 'weekly', label: 'Weekly View' },
                    { value: 'list', label: 'List View' }
                  ]}
                  helpText="This view will be shown when you first log in."
                />
                <FormSelect
                  label="Language"
                  value={settings?.dashboardPreferences?.language || 'en'}
                  onChange={(value) => handleNestedSettingChange('dashboardPreferences', 'language', value)}
                  options={[
                    { value: 'en', label: 'English' }
                  ]}
                  disabled={true}
                  helpText="Only English is available"
                />
                <FormSelect
                  label="Timezone"
                  value={settings?.dashboardPreferences?.timezone || 'Asia/Beirut'}
                  onChange={(value) => handleNestedSettingChange('dashboardPreferences', 'timezone', value)}
                  options={[
                    { value: 'Asia/Beirut', label: 'Lebanon (Beirut)' }
                  ]}
                  disabled={true}
                  helpText="Timezone is set to Lebanon"
                />
                <FormSelect
                  label="Start of Week"
                  value={settings?.dashboardPreferences?.startOfWeek || 'monday'}
                  onChange={(value) => handleNestedSettingChange('dashboardPreferences', 'startOfWeek', value)}
                  options={[
                    { value: 'monday', label: 'Monday' },
                    { value: 'sunday', label: 'Sunday' }
                  ]}
                />
              </div>
            </SettingsSection>

            {/* Booking Configuration */}
            <SettingsSection
              title="Booking Configuration"
              icon="calendar_clock"
            >
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-[#111816] dark:text-white">Auto-Confirm Appointments</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Automatically confirm bookings from trusted clients.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings?.bookingConfig?.autoConfirm || false}
                    onChange={(checked) => handleNestedSettingChange('bookingConfig', 'autoConfirm', checked)}
                  />
                </div>
                <hr className="border-gray-100 dark:border-gray-800" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormSelect
                    label="Appointment Buffer"
                    value={settings?.bookingConfig?.appointmentBuffer || '5'}
                    onChange={(value) => handleNestedSettingChange('bookingConfig', 'appointmentBuffer', value)}
                    options={[
                      { value: '5', label: '5 minutes' },
                      { value: '10', label: '10 minutes' },
                      { value: '15', label: '15 minutes' },
                      { value: '0', label: 'None' }
                    ]}
                    icon="hourglass_empty"
                    helpText="Gap between consecutive appointments."
                  />
                  <FormSelect
                    label="Minimum Notice"
                    value={settings?.bookingConfig?.minimumNotice || '1'}
                    onChange={(value) => handleNestedSettingChange('bookingConfig', 'minimumNotice', value)}
                    options={[
                      { value: '1', label: '1 hour' },
                      { value: '2', label: '2 hours' },
                      { value: '24', label: '24 hours' }
                    ]}
                    icon="notifications_off"
                    helpText="Minimum time before a client can book."
                  />
                </div>
              </div>
            </SettingsSection>

            {/* Notifications */}
            <SettingsSection
              title="Notifications"
              icon="notifications_active"
            >
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                <div className="p-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  <div>
                    <h3 className="font-medium text-[#111816] dark:text-white">New Appointment Alerts</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Receive an email when a new client books a slot.</p>
                  </div>
                  <ToggleSwitch
                    checked={settings?.notifications?.newAppointmentAlerts || false}
                    onChange={(checked) => handleNestedSettingChange('notifications', 'newAppointmentAlerts', checked)}
                  />
                </div>
              </div>
            </SettingsSection>
          </div>

          {/* Footer */}
          <div className="mt-10 text-center text-xs text-gray-400">
            <p>
              Codelance •{' '}
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a> •{' '}
              <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            </p>
          </div>
            </div>
          </>
        )}
      </main>

      {/* Success Message Modal */}
      <SuccessMessageModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        message={successMessage}
      />
    </>
  )
}

// Default settings structure
const getDefaultSettings = () => ({
  dashboardPreferences: {
    defaultCalendarView: 'daily',
    language: 'en',
    timezone: 'Asia/Beirut',
    startOfWeek: 'monday'
  },
  bookingConfig: {
    autoConfirm: false,
    appointmentBuffer: '5',
    minimumNotice: '1'
  },
  notifications: {
    newAppointmentAlerts: true
  }
})

export default Settings

