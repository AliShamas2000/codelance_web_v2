import React from 'react'

const SettingsTextInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon,
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
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[20px]">
            {icon}
          </span>
        )}
        <input
          type={type}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`form-input w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0e121b] dark:text-white h-11 ${icon ? 'pl-11' : 'px-4'} pr-4 text-sm focus:border-primary focus:ring-primary shadow-sm placeholder:text-slate-400 ${
            error ? 'border-red-500' : ''
          }`}
        />
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

export default SettingsTextInput
