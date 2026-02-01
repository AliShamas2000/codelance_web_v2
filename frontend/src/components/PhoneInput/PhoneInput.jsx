import React from 'react'
import PhoneInputLib from 'react-phone-number-input'
import 'react-phone-number-input/style.css'

const PhoneInput = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Enter phone number',
  required = false,
  error,
  helpText,
  className = '',
  defaultCountry = 'LB',
  disabled = false,
  id
}) => {
  // Ensure value is always a string (never an object or undefined)
  const safeValue = (() => {
    if (typeof value === 'string') {
      return value
    }
    if (value === null || value === undefined) {
      return ''
    }
    // If somehow an object was passed, try to extract a string value
    if (typeof value === 'object' && value !== null) {
      if (value.target && typeof value.target.value === 'string') {
        return value.target.value
      }
      return ''
    }
    return String(value || '')
  })()

  const handleChange = (phoneValue) => {
    if (onChange) {
      // react-phone-number-input passes undefined when clearing, convert to empty string
      // Ensure phoneValue is always a string (handle undefined/null)
      const stringValue = (phoneValue === undefined || phoneValue === null) ? '' : String(phoneValue)
      
      // Create an event-like object for compatibility with existing form handlers
      const event = {
        target: {
          name: name || id,
          value: stringValue
        }
      }
      onChange(event)
    }
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label 
          htmlFor={id || name} 
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <PhoneInputLib
          international
          defaultCountry={defaultCountry}
          value={safeValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`phone-input-custom ${error ? 'phone-input-error' : ''}`}
          numberInputProps={{
            id: id || name,
            name: name,
            className: `phone-input-field ${error ? 'border-red-500' : ''}`
          }}
        />
      </div>
      {error && (
        <p className="text-xs text-red-500 mt-1">{error}</p>
      )}
      {helpText && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{helpText}</p>
      )}
    </div>
  )
}

export default PhoneInput

