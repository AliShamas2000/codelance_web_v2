import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceContactInfo = ({
  contactItems = [
    {
      type: 'email',
      label: 'Email',
      value: 'info@codelancelb.com',
      icon: 'mail'
    },
    {
      type: 'phone',
      label: 'Phone',
      value: '+96176505353',
      icon: 'call'
    },
    {
      type: 'phone',
      label: 'Phone',
      value: '+9613122606',
      icon: 'call'
    }
  ],
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  return (
    <div 
      ref={ref}
      className={`space-y-2 transition-all duration-1000 ease-out delay-200 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {contactItems.map((item, index) => {
        const getLink = () => {
          if (item.type === 'email') {
            return `mailto:${item.value}`
          } else if (item.type === 'phone') {
            return `tel:${item.value.replace(/\s/g, '')}`
          }
          return null
        }

        const link = getLink()
        const content = (
          <>
            <div className="text-primary flex items-center justify-center rounded-lg bg-primary/10 shrink-0 size-12 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">{item.icon}</span>
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-navy-deep dark:text-white text-base font-bold leading-normal">
                {item.label}
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                {item.value}
              </p>
            </div>
          </>
        )

        if (link) {
          return (
            <a
              key={index}
              href={link}
              className="flex items-center gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-white/50 dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer"
            >
              {content}
            </a>
          )
        }

        return (
          <div
            key={index}
            className="flex items-center gap-4 bg-white/50 dark:bg-white/5 p-4 rounded-xl border border-white/50 dark:border-white/5 group hover:bg-white dark:hover:bg-white/10 transition-all cursor-default"
          >
            {content}
          </div>
        )
      })}
    </div>
  )
}

export default CodelanceContactInfo

