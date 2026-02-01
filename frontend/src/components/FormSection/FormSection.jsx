import React from 'react'

const FormSection = ({
  stepNumber,
  title,
  children,
  className = ""
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {title && (
        <h2 className="text-sm font-bold uppercase tracking-wider text-text-muted/80 dark:text-gray-400 flex items-center gap-2">
          {stepNumber && (
            <span className="w-6 h-6 rounded-full bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs">
              {stepNumber}
            </span>
          )}
          {title}
        </h2>
      )}
      {children}
    </div>
  )
}

export default FormSection

