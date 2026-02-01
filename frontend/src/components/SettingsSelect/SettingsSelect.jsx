import React from 'react'

const SettingsSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  className = "",
  helpText
}) => {
  const handleChange = (e) => {
    onChange && onChange(e)
  }

  return (
    <label className={`flex flex-col gap-2 ${className}`}>
      <span className="text-[#0e121b] dark:text-slate-200 text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
      <div className="relative">
        <select
          name={name}
          value={value || ''}
          onChange={handleChange}
          required={required}
          className={`form-select w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0e121b] dark:text-white h-11 px-4 text-sm focus:border-primary focus:ring-primary shadow-sm cursor-pointer ${
            error ? 'border-red-500' : ''
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-xs text-[#4e6797] dark:text-slate-400">{helpText}</p>
      )}
    </label>
  )
}

export default SettingsSelect
