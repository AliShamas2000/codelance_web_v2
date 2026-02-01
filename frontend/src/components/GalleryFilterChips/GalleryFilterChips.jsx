import React from 'react'

const GalleryFilterChips = ({
  filters = [],
  activeFilter = "all",
  onFilterChange,
  className = ""
}) => {
  const defaultFilters = [
    { id: "all", label: "All" },
    { id: "haircuts", label: "Haircuts" },
    { id: "beard-trim", label: "Beard Trim" },
    { id: "styling", label: "Styling" },
    { id: "products", label: "Products" },
  ]

  const filterList = filters.length > 0 ? filters : defaultFilters

  return (
    <div className={`mb-8 sticky top-[73px] z-40 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm py-2 -mx-4 px-4 md:mx-0 md:px-0 ${className}`}>
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {filterList.map((filter) => {
          const isActive = activeFilter === filter.id

          return (
            <button
              key={filter.id}
              onClick={() => onFilterChange && onFilterChange(filter.id)}
              className={`shrink-0 flex items-center justify-center px-5 h-9 rounded-full text-sm font-semibold transition-all active:scale-95 ${
                isActive
                  ? "border border-primary dark:border-primary bg-transparent text-primary dark:text-primary font-medium hover:border-primary dark:hover:border-primary"
                  : "border border-[#e5e7eb] dark:border-[#2a3833] hover:border-primary dark:hover:border-primary bg-transparent text-text-main dark:text-text-main-dark font-medium"
              }`}
            >
              {filter.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default GalleryFilterChips

