import React, { useState, useRef, useEffect } from 'react'

const MultiSelect = ({
  label,
  name,
  value = [],
  onChange,
  options = [],
  required = false,
  error,
  className = "",
  placeholder = "Select options...",
  icon,
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (optionValue) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    
    if (onChange) {
      onChange(newValue)
    }
  }

  const handleRemove = (optionValue, e) => {
    e.stopPropagation()
    const newValue = value.filter(v => v !== optionValue)
    if (onChange) {
      onChange(newValue)
    }
  }

  const selectedOptions = options.filter(opt => value.includes(opt.value))

  return (
    <div className={`group ${className}`} ref={dropdownRef}>
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
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`flex w-full min-w-0 rounded-lg text-[#111816] dark:text-white dark:bg-[#0b1a15] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary border ${
            error ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
          } bg-white h-12 ${icon ? 'pl-11' : 'pl-4'} pr-10 text-base font-normal leading-normal transition-all duration-200 cursor-pointer ${
            disabled ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="flex-1 flex items-center gap-2 flex-wrap py-2 min-h-[2rem] overflow-hidden">
            {selectedOptions.length === 0 ? (
              <span className="text-[#9ca3af] text-base font-normal leading-normal">
                {placeholder}
              </span>
            ) : (
              selectedOptions.map((option) => (
                <span
                  key={option.value}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary text-xs font-medium rounded-md whitespace-nowrap"
                >
                  {option.label}
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemove(option.value, e)
                    }}
                    className="hover:text-primary-dark focus:outline-none cursor-pointer inline-flex items-center"
                    role="button"
                    tabIndex={-1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemove(option.value, e)
                      }
                    }}
                  >
                    <span className="material-symbols-outlined text-[14px] leading-none">close</span>
                  </span>
                </span>
              ))
            )}
          </div>
          <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center w-10 text-[#9ca3af] pointer-events-none">
            <span className={`material-symbols-outlined text-[20px] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
              expand_more
            </span>
          </div>
        </button>
        
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-[#0b1a15] border border-[#dbe6e2] dark:border-[#2a3e36] rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.length === 0 ? (
              <div className="px-4 py-3 text-sm text-[#9ca3af] dark:text-gray-400">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = value.includes(option.value)
                return (
                  <label
                    key={option.value}
                    className="flex items-center px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(option.value)}
                      className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer"
                    />
                    <span className="ml-3 text-sm text-[#111816] dark:text-white">
                      {option.label}
                    </span>
                  </label>
                )
              })
            )}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default MultiSelect

