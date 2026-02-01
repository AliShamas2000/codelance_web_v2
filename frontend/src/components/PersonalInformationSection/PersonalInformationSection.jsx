import React from 'react'
import FormInput from '../FormInput/FormInput'

const PersonalInformationSection = ({
  formData,
  errors = {},
  onChange
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    onChange && onChange(name, value)
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <span className="material-symbols-outlined text-primary">person</span>
        <h2 className="text-[#0e121b] dark:text-white text-xl font-bold">Personal Information</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <FormInput
          label="First Name"
          name="firstName"
          value={formData.firstName || ''}
          onChange={handleInputChange}
          error={errors.firstName}
          className="flex flex-col gap-2"
        />
        <FormInput
          label="Last Name"
          name="lastName"
          value={formData.lastName || ''}
          onChange={handleInputChange}
          error={errors.lastName}
          className="flex flex-col gap-2"
        />
        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email || ''}
          onChange={handleInputChange}
          icon="mail"
          error={errors.email}
          className="flex flex-col gap-2 sm:col-span-2"
        />
        <FormInput
          label="Job Title"
          name="jobTitle"
          value={formData.jobTitle || ''}
          onChange={handleInputChange}
          error={errors.jobTitle}
          className="flex flex-col gap-2 sm:col-span-2"
        />
      </div>
    </div>
  )
}

export default PersonalInformationSection

