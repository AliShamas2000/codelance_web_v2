import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceFooterIdentity = ({
  logoUrl = null,
  brandName = "CODELANCE",
  description = "Empowering businesses through cutting-edge digital solutions and innovative engineering.",
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  return (
    <div 
      ref={ref}
      className={`flex flex-col gap-6 transition-all duration-1000 ease-out delay-100 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      <div className="flex items-center gap-1 text-navy-deep dark:text-white">
        <img 
          src={logoUrl || "/logo.png"} 
          alt={brandName}
          className="w-8 h-8 object-contain"
        />
        <h2 className="text-2xl font-bold tracking-tight">{brandName}</h2>
      </div>
      {description && (
        <p className="text-navy-deep/70 dark:text-white/60 text-sm leading-relaxed max-w-xs">
          {description}
        </p>
      )}
    </div>
  )
}

export default CodelanceFooterIdentity

