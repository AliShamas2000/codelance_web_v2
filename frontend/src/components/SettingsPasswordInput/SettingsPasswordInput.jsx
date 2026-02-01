import React, { useState } from 'react'

const SettingsPasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder = "••••••••",
  required = false,
  error,
  className = "",
  helpText
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

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
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value || ''}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className={`form-input w-full rounded-lg border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 text-[#0e121b] dark:text-white h-11 px-4 pr-11 text-sm focus:border-primary focus:ring-primary shadow-sm placeholder:text-slate-400 ${
            error ? 'border-red-500' : ''
          }`}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
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

export default SettingsPasswordInput
