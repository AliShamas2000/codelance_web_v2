import React from 'react'
import CodelanceServiceCard from '../CodelanceServiceCard/CodelanceServiceCard'

const CodelanceServicesGrid = ({
  services = [],
  onServiceClick = null,
  columns = 4,
  className = ""
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-12 text-[#5e808d] dark:text-gray-400">
        <p>No services available at the moment.</p>
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[4]} gap-6 p-4 ${className}`}>
      {services.map((service, index) => {
        // Check for SVG first (from database)
        const getIcon = (service) => {
          // Priority 1: SVG from database
          if (service.svg) {
            return { type: "svg", svg: service.svg }
          }
          
          // Priority 2: Material icon name from database
          if (service.icon && !service.icon_url && !service.imageUrl) {
            return { type: "material", name: service.icon }
          }
          
          // Priority 3: Icon URL/image
          if (service.icon || service.icon_url || service.imageUrl) {
            return { type: "image", url: service.icon || service.icon_url || service.imageUrl }
          }
          
          // Priority 4: Map service name/category to Material Symbols (fallback)
          const title = (service.title || service.nameEn || service.name_en || "").toLowerCase()
          const category = (service.category || "").toLowerCase()
          
          const iconMap = {
            "website": "language",
            "web": "language",
            "development": "language",
            "mobile": "smartphone",
            "app": "smartphone",
            "pos": "point_of_sale",
            "erp": "point_of_sale",
            "custom": "developer_mode_tv",
            "software": "developer_mode_tv",
            "ai": "psychology",
            "automation": "psychology",
            "design": "palette",
            "ui": "palette",
            "ux": "palette",
            "branding": "palette",
            "cloud": "cloud_sync",
            "api": "cloud_sync",
            "maintenance": "support_agent",
            "support": "support_agent"
          }
          
          // Try to find icon by title or category
          for (const [key, icon] of Object.entries(iconMap)) {
            if (title.includes(key) || category.includes(key)) {
              return { type: "material", name: icon }
            }
          }
          
          // Default icon
          return { type: "material", name: "code" }
        }

        const iconData = getIcon(service)

        return (
          <CodelanceServiceCard
            key={service.id || index}
            id={service.id}
            title={service.title || service.nameEn || service.name_en || "Service"}
            description={service.description || service.descriptionEn || service.description_en || ""}
            icon={iconData.type === "material" ? iconData.name : iconData.url || ""}
            iconType={iconData.type}
            svg={iconData.type === "svg" ? iconData.svg : null}
            onClick={onServiceClick ? () => onServiceClick(service) : null}
            className=""
          />
        )
      })}
    </div>
  )
}

export default CodelanceServicesGrid

