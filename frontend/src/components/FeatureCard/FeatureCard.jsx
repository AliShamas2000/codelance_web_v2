import React from 'react'

const FeatureCard = ({
  id,
  icon,
  title,
  description,
  translateY = false,
  className = ""
}) => {
  return (
    <div
      className={`group p-6 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/5 hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 ${
        translateY ? 'sm:translate-y-8' : ''
      } ${className}`}
    >
      {icon && (
        <div className="size-12 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center mb-4 text-slate-900 dark:text-white group-hover:bg-primary group-hover:text-background-dark transition-colors duration-300">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      )}
      {title && (
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          {title}
        </h3>
      )}
      {description && (
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      )}
    </div>
  )
}

export default FeatureCard

