import React, { useState } from 'react'

const PasswordInput = ({
  label,
  name,
  value,
  onChange,
  placeholder = "••••••••••••",
  required = false,
  error,
  className = ""
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-[#111816] dark:text-[#e2e8f0] text-sm font-semibold leading-normal">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative flex w-full items-center">
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={value || ''}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`flex w-full min-w-0 resize-none overflow-hidden rounded-lg text-[#111816] dark:text-white dark:bg-[#0b1a15] focus:outline-0 focus:ring-2 focus:ring-primary/20 focus:border-primary border ${
            error ? 'border-red-500' : 'border-[#dbe6e2] dark:border-[#2a3e36]'
          } bg-white h-12 placeholder:text-[#9ca3af] pl-11 pr-12 text-base font-normal leading-normal transition-all duration-200`}
        />
        <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-11 text-[#9ca3af]">
          <span className="material-symbols-outlined text-[20px]">lock</span>
        </div>
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-0 top-0 bottom-0 px-4 text-[#9ca3af] hover:text-[#111816] dark:hover:text-white transition-colors flex items-center justify-center outline-none focus:text-primary"
        >
          <span className="material-symbols-outlined text-[20px]">
            {showPassword ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  )
}

export default PasswordInput

