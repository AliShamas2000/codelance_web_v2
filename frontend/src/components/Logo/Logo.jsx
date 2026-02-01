import React from 'react'
import { Link } from 'react-router-dom'

const Logo = ({ href = "/", logoUrl = null, className = "" }) => {
  return (
    <Link 
      to={href} 
      className={`flex items-center gap-3 group focus:outline-none ${className}`}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo"
          className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="relative flex items-center justify-center size-10 rounded-lg bg-black dark:bg-primary text-white dark:text-background-dark overflow-hidden transition-transform duration-300 group-hover:scale-105">
          <span className="material-symbols-outlined text-[24px]">content_cut</span>
        </div>
      )}
      <div className="flex flex-col">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white leading-none group-hover:text-primary transition-colors">
          THE STUDIO
        </h1>
        <span className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-400 font-medium">
          Premium Cuts
        </span>
      </div>
    </Link>
  )
}

export default Logo

