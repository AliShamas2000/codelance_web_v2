import React from 'react'

const PricingFilters = ({
  filters = [],
  activeFilter = "all",
  onFilterChange,
  className = ""
}) => {
  const defaultFilters = [
    { id: "all", label: "All Services" },
    { id: "haircuts", label: "Haircuts" },
    { id: "shaves", label: "Shaves" },
    { id: "beard", label: "Beard" },
    { id: "treatments", label: "Treatments" },
  ]

  const filterList = filters.length > 0 ? filters : defaultFilters

  return (
    <div className={`flex justify-center pb-12 ${className}`}>
      <div className="w-full">
        <div className="flex gap-3 flex-wrap justify-center">
          {filterList.map((filter) => {
            const isActive = activeFilter === filter.id

            return (
              <button
                key={filter.id}
                onClick={() => onFilterChange && onFilterChange(filter.id)}
                className={`group flex h-10 items-center justify-center rounded-full px-6 transition-all ${
                  isActive
                    ? 'bg-primary shadow-sm hover:shadow-md'
                    : 'bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'
                }`}
              >
                <span
                  className={`text-sm font-medium ${
                    isActive
                      ? 'text-gray-900 font-bold'
                      : 'text-gray-600 dark:text-gray-300 group-hover:text-primary'
                  }`}
                >
                  {filter.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PricingFilters

