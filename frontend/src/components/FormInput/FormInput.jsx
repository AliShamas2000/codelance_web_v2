import React, { useRef } from 'react'

const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  icon,
  required = false,
  error,
  className = ""
}) => {
  const inputRef = useRef(null)

  const handleInputClick = () => {
    // For date inputs, clicking anywhere on the input should open the date picker
    if (type === 'date' && inputRef.current) {
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker()
      }
    }
  }

  const handleCalendarIconClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // For date inputs, clicking the calendar icon should open the date picker
    if (type === 'date' && inputRef.current) {
      if (inputRef.current.showPicker) {
        inputRef.current.showPicker()
      } else {
        inputRef.current.focus()
        inputRef.current.click()
      }
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
        {icon && type !== 'date' && (
          <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-11 text-[#9ca3af] pointer-events-none">
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
          </div>
        )}
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value || ''}
          onChange={onChange}
          onClick={handleInputClick}
          placeholder={placeholder}
          required={required}
          className={`flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#111816] dark:text-white dark:bg-[#0b1a15] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary border ${
            error ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
          } bg-white h-12 placeholder:text-[#9ca3af] ${icon && type !== 'date' ? 'pl-11' : 'pl-4'} ${type === 'date' ? 'pr-11' : 'pr-4'} text-base font-normal leading-normal transition-all duration-200 ${type === 'date' ? 'cursor-pointer' : ''}`}
        />
        {/* Calendar icon on the right for date inputs */}
        {type === 'date' && (
          <button
            type="button"
            onClick={handleCalendarIconClick}
            className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-11 text-[#9ca3af] cursor-pointer hover:text-primary transition-colors focus:outline-none z-10"
            aria-label="Open date picker"
          >
            <span className="material-symbols-outlined text-[20px]">calendar_today</span>
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default FormInput

