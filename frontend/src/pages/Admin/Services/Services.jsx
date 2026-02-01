import React, { useState, useEffect } from 'react'
import ServicesHeader from '../../../components/ServicesHeader/ServicesHeader'
import ServicesFilters from '../../../components/ServicesFilters/ServicesFilters'
import DataTable from '../../../components/DataTable/DataTable'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import AddEditServiceModal from '../../../components/AddEditServiceModal/AddEditServiceModal'
import DeleteServiceModal from '../../../components/DeleteServiceModal/DeleteServiceModal'
import servicesApi from '../../../api/services'
import authApi from '../../../api/auth'

const Services = () => {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: 'all'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedService, setSelectedService] = useState(null)


  // Fetch services
  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const response = await servicesApi.getServices({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        category: filters.category
      })
      
      setServices(response.data || response.services || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
      setPagination(prev => ({
        ...prev,
        totalPages: 1,
        totalItems: 0
      }))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [pagination.currentPage, filters])


  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleCategoryChange = (value) => {
    setFilters(prev => ({ ...prev, category: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSort = () => {
    // TODO: Implement sort functionality
    console.log('Sort clicked')
  }

  const handleAddNew = () => {
    setSelectedService(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (service) => {
    setSelectedService(service)
    setIsAddEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedService(null)
  }

  const handleModalSuccess = () => {
    // Refresh services list after successful add/edit
    fetchServices()
  }

  const handleDelete = (service) => {
    setSelectedService(service)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedService(null)
  }

  const handleDeleteSuccess = () => {
    // Refresh services list after successful delete
    fetchServices()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  // Define table columns
  const columns = [
    {
      key: 'icon',
      header: 'Icon',
      width: '16',
      render: (service) => (
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center text-gray-400">
          {service.icon ? (
            <img
              alt={service.nameEn || service.name_en || 'Service'}
              className="w-full h-full object-cover"
              src={service.icon || service.icon_url || 'https://via.placeholder.com/48'}
            />
          ) : (
            <span className="material-symbols-outlined text-2xl">image</span>
          )}
        </div>
      )
    },
    {
      key: 'name',
      header: 'Service Name (EN / AR)',
      render: (service) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {service.nameEn || service.name_en || service.name || 'N/A'}
          </span>
          {(service.nameAr || service.name_ar) && (
            <span className="text-sm text-gray-500 dark:text-gray-400 font-arabic text-right dir-rtl">
              {service.nameAr || service.name_ar}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description (EN / AR)',
      render: (service) => (
        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
          <span className="block mb-1 line-clamp-2">
            {service.descriptionEn || service.description_en || service.description || 'No description'}
          </span>
          {(service.descriptionAr || service.description_ar) && (
            <span className="block text-gray-400 dark:text-gray-500 text-xs font-arabic dir-rtl line-clamp-2">
              {service.descriptionAr || service.description_ar}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price / Discount',
      render: (service) => {
        const price = parseFloat(service.price || 0)
        const discountPercentage = service.discountPercentage || service.discount_percentage
        const hasDiscount = discountPercentage && discountPercentage > 0
        
        return (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-gray-900 dark:text-white">
              ${price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-red-600 dark:text-red-400 font-semibold">
                -{parseFloat(discountPercentage).toFixed(0)}%
              </span>
            )}
          </div>
        )
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (service) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(service)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-xl">edit_note</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(service)
            }}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
            title="Delete"
          >
            <span className="material-symbols-outlined text-xl">delete_outline</span>
          </button>
        </div>
      )
    }
  ]

  return (
    <>
      <ServicesHeader onAddNew={handleAddNew} />

      <ServicesFilters
        search={filters.search}
        category={filters.category}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onSort={handleSort}
      />

      {/* Services Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading services...</p>
        </div>
      ) : (
        <>
          <DataTable
            columns={columns}
            data={services}
            emptyMessage="No services found"
          />
          <DataTablePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            itemName="Services"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add/Edit Service Modal */}
      <AddEditServiceModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        service={selectedService}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Service Modal */}
      <DeleteServiceModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        service={selectedService}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default Services

