import React from 'react'

const CodelanceFooterColumn = ({
  title,
  children,
  className = ""
}) => {
  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {title && (
        <h3 className="text-navy-deep dark:text-white font-bold text-base mb-6">
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

export default CodelanceFooterColumn

