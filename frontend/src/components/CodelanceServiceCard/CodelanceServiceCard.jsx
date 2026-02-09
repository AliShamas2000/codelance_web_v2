import React from 'react'
import useScrollReveal from '../../hooks/useScrollReveal'

const CodelanceServiceCard = ({
  id,
  title,
  description,
  icon = "code", // Material Symbol name or icon URL
  iconType = "material", // "material", "image", or "svg"
  svg = null, // SVG code from database
  onClick = null,
  className = ""
}) => {
  const [isVisible, ref] = useScrollReveal({ threshold: 0.1 })

  const handleClick = () => {
    if (onClick) {
      onClick({ id, title, description, icon, svg })
    }
  }

  return (
    <div
      ref={ref}
      className={`glass-card flex flex-col gap-4 p-8 rounded-xl shadow-sm border border-white/50 dark:border-white/10 cursor-pointer transition-all duration-1000 ease-out ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-8'
      } ${className}`}
      onClick={handleClick}
    >
      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary icon-rotate">
        {iconType === "svg" && svg ? (
          <div 
            className="w-8 h-8 flex items-center justify-center [&>svg]:w-full [&>svg]:h-full [&>svg]:text-primary [&>svg]:fill-current"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : iconType === "material" ? (
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        ) : (
          <img src={icon} alt={title} className="w-8 h-8 object-contain" />
        )}
      </div>
      <div>
        <h3 className="text-navy-deep dark:text-white text-lg font-bold leading-tight mb-2">
          {title}
        </h3>
        {description && (
          <p className="text-[#5e808d] dark:text-gray-400 text-sm font-medium leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default CodelanceServiceCard

