import React from 'react'

const SectionHeader = ({
  badge,
  title,
  description,
  showDecoration = true,
  className = ""
}) => {
  return (
    <div className={`flex flex-col items-center text-center mb-16 space-y-4 ${className}`}>
      {badge && (
        <span className="text-primary font-semibold tracking-wider uppercase text-sm">
          {badge}
        </span>
      )}
      
      {title && (
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111816] dark:text-white">
          {title}
        </h2>
      )}
      
      {description && (
        <p className="max-w-2xl text-gray-500 dark:text-gray-400 text-lg md:text-xl font-light leading-relaxed">
          {description}
        </p>
      )}
      
      {/* Decorative Element */}
      {showDecoration && (
        <div className="w-24 h-1 bg-primary/20 rounded-full mt-6">
          <div className="w-1/3 h-full bg-primary rounded-full"></div>
        </div>
      )}
    </div>
  )
}

export default SectionHeader

