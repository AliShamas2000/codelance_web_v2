import React from 'react'

const PhoneCTA = ({ phone = "(555) 123-4567", className = "" }) => {
  return (
    <a
      href={`tel:${phone.replace(/\D/g, '')}`}
      className={`hidden md:flex group items-center gap-3 pl-1 pr-5 py-1.5 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full hover:border-primary/50 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 ${className}`}
    >
      <div className="size-8 flex items-center justify-center rounded-full bg-primary text-background-dark group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined text-[18px]">call</span>
      </div>
      <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
        {phone}
      </span>
    </a>
  )
}

export default PhoneCTA

