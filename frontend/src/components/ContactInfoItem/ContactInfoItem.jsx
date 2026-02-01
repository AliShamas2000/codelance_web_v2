import React from 'react'

const ContactInfoItem = ({
  icon,
  title,
  content,
  href,
  className = ""
}) => {
  const contentElement = href ? (
    <a
      href={href}
      className="hover:text-primary transition-colors"
    >
      {content}
    </a>
  ) : (
    <span>{content}</span>
  )

  return (
    <div className={`flex items-start gap-4 ${className}`}>
      {icon && (
        <div className="flex-shrink-0 size-10 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center text-primary border border-slate-100 dark:border-white/10">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
      )}
      <div>
        {title && (
          <h4 className="font-bold text-slate-900 dark:text-white">
            {title}
          </h4>
        )}
        {content && (
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 leading-relaxed">
            {contentElement}
          </p>
        )}
      </div>
    </div>
  )
}

export default ContactInfoItem

