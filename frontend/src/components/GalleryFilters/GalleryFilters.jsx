import React, { useState, useEffect } from 'react'
import servicesApi from '../../api/services'

const GalleryFilters = ({
  search = "",
  service = "all",
  viewMode = "grid", // "grid" or "list"
  onSearchChange,
  onServiceChange,
  onViewModeChange,
  className = ""
}) => {
  const [services, setServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(true)

  // Fetch services for the filter dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoadingServices(true)
        const token = localStorage.getItem('auth_token')
        if (token) {
          const response = await servicesApi.getServices({ per_page: 100 })
          setServices(response.data || [])
        }
      } catch (error) {
        console.error('Error fetching services:', error)
        setServices([])
      } finally {
        setIsLoadingServices(false)
      }
    }
    fetchServices()
  }, [])

  return (
    <div className={`bg-white dark:bg-card-dark rounded-xl shadow-soft p-4 mb-6 border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-center w-full md:w-auto space-x-4">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <span className="material-symbols-outlined text-lg">search</span>
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search gallery by title or description..."
            className="w-full py-2.5 pl-10 pr-4 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 transition-colors"
          />
        </div>

        {/* Service Filter */}
        <div className="relative w-full md:w-48">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400 pointer-events-none">
            <span className="material-symbols-outlined text-lg">filter_list</span>
          </span>
          <select
            value={service}
            onChange={(e) => onServiceChange(e.target.value)}
            disabled={isLoadingServices}
            className="w-full py-2.5 pl-10 pr-8 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 dark:text-gray-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="all">All Services</option>
            {services.map((svc) => (
              <option key={svc.id} value={svc.id}>
                {svc.nameEn || svc.name_en || 'Unnamed Service'}
              </option>
            ))}
          </select>
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </span>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center space-x-2 w-full md:w-auto justify-end">
        <button
          onClick={() => onViewModeChange('grid')}
          className={`p-2.5 border rounded-lg transition-colors flex items-center ${
            viewMode === 'grid'
              ? 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span className="material-symbols-outlined text-lg">grid_view</span>
        </button>
        <button
          onClick={() => onViewModeChange('list')}
          className={`p-2.5 border rounded-lg transition-colors flex items-center ${
            viewMode === 'list'
              ? 'bg-white dark:bg-card-dark text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'
              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <span className="material-symbols-outlined text-lg">view_list</span>
        </button>
      </div>
    </div>
  )
}

export default GalleryFilters
