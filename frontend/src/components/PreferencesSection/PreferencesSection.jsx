import React from 'react'
import FormSelect from '../FormSelect/FormSelect'

const PreferencesSection = ({
  formData,
  errors = {},
  onChange
}) => {
  const languageOptions = [
    { value: 'en', label: 'English (United States)' },
    { value: 'ar', label: 'Arabic (العربية)' },
    { value: 'fr', label: 'French (Français)' },
    { value: 'es', label: 'Spanish (Español)' }
  ]

  const handleLanguageChange = (value) => {
    onChange && onChange('language', value)
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <span className="material-symbols-outlined text-primary">language</span>
        <h2 className="text-[#0e121b] dark:text-white text-xl font-bold">Preferences</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormSelect
          label="Language Preference"
          value={formData.language || 'en'}
          onChange={handleLanguageChange}
          options={languageOptions}
          helpText="This will update the interface language for your dashboard."
          error={errors.language}
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}

export default PreferencesSection

