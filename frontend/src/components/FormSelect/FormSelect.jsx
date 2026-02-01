import React from 'react'

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error,
  className = "",
  helpText,
  placeholder,
  icon,
  disabled = false
}) => {
  const handleChange = (e) => {
    const selectedValue = e.target.value
    // FormSelect onChange receives the value directly, not the event
    if (onChange) {
      onChange(selectedValue)
    }
  }

  return (
    <div className={`group ${className}`}>
      {label && (
        <label className="text-[#111816] dark:text-[#e2e8f0] text-sm font-semibold leading-normal">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-11 text-[#9ca3af] pointer-events-none z-10">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}
        <select
          name={name}
          value={value || ''}
          onChange={handleChange}
          required={required}
          disabled={disabled}
          className={`flex w-full min-w-0 rounded-lg text-[#111816] dark:text-white dark:bg-[#0b1a15] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary border ${
            error ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
          } bg-white h-12 ${icon ? 'pl-11' : 'pl-4'} pr-10 text-base font-normal leading-normal transition-all duration-200 appearance-none cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 text-[#9ca3af] pointer-events-none">
          <span className="material-symbols-outlined text-[20px]">expand_more</span>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-xs text-[#4e6797] dark:text-slate-400">{helpText}</p>
      )}
    </div>
  )
}

export default FormSelect
