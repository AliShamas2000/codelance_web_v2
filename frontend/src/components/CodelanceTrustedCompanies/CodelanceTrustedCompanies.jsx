import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceTrustedCompanies = ({
  title = "Trusted by industry leaders",
  companies = [
    { name: "CloudScale", icon: "token" },
    { name: "NexusData", icon: "deployed_code" },
    { name: "Everloop", icon: "all_inclusive" },
    { name: "SecureSafe", icon: "shield_with_heart" },
    { name: "Vault", icon: "database" }
  ],
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.2 })

  return (
    <div 
      ref={ref}
      className={`max-w-4xl mx-auto mt-20 px-6 transition-all duration-1000 ease-out delay-300 ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {title && (
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-navy-deep/30 dark:text-white/30 mb-8">
          {title}
        </p>
      )}
      <div className="flex flex-wrap justify-between items-center gap-8 opacity-30 grayscale saturate-0">
        {companies.map((company, index) => (
          <div key={index} className="flex items-center gap-2">
            {company.icon && (
              <span className="material-symbols-outlined text-2xl text-navy-deep dark:text-white">
                {company.icon}
              </span>
            )}
            {company.logo && (
              <img 
                src={company.logo} 
                alt={company.name}
                className="h-6 object-contain"
                loading="lazy"
              />
            )}
            <span className="font-bold text-lg tracking-tight text-navy-deep dark:text-white">
              {company.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CodelanceTrustedCompanies

