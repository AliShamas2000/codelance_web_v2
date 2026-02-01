import React from 'react'

const Checkbox = ({
  id,
  name,
  label,
  checked = false,
  onChange,
  className = ""
}) => {
  return (
    <label className={`flex items-center gap-3 cursor-pointer group select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        <input
          id={id}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="custom-checkbox h-5 w-5 rounded border-2 border-[#dbe6e2] dark:border-[#3e534b] bg-transparent text-primary checked:bg-primary checked:border-primary focus:ring-0 focus:ring-offset-0 transition-all cursor-pointer appearance-none"
        />
      </div>
      {label && (
        <span className="text-[#3e4d46] dark:text-[#9ca3af] text-sm font-medium group-hover:text-[#111816] dark:group-hover:text-white transition-colors">
          {label}
        </span>
      )}
    </label>
  )
}

export default Checkbox

