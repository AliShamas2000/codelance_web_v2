import React, { useState, useEffect } from 'react'
import PackagesHeader from '../../../components/PackagesHeader/PackagesHeader'
import PackagesFilters from '../../../components/PackagesFilters/PackagesFilters'
import DataTable from '../../../components/DataTable/DataTable'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import AddEditPackageModal from '../../../components/AddEditPackageModal/AddEditPackageModal'
import DeletePackageModal from '../../../components/DeletePackageModal/DeletePackageModal'
import packagesApi from '../../../api/packages'

const Packages = () => {
  const [packages, setPackages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    billing_period: 'all',
    category: 'all',
    is_active: null,
    is_featured: null,
    sort: 'order',
    order: 'asc'
  })
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Fetch packages
  const fetchPackages = async () => {
    try {
      setIsLoading(true)
      const response = await packagesApi.getPackages({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        billing_period: filters.billing_period,
        category: filters.category,
        is_active: filters.is_active,
        is_featured: filters.is_featured,
        sort: filters.sort,
        order: filters.order
      })
      
      setPackages(response.data || response.packages || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching packages:', error)
      setPackages([])
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
    fetchPackages()
  }, [pagination.currentPage, filters])

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleBillingPeriodChange = (value) => {
    setFilters(prev => ({ ...prev, billing_period: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleCategoryChange = (value) => {
    setFilters(prev => ({ ...prev, category: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleActiveStatusChange = (value) => {
    setFilters(prev => ({ ...prev, is_active: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleFeaturedStatusChange = (value) => {
    setFilters(prev => ({ ...prev, is_featured: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleSort = (sortBy, sortOrder) => {
    setFilters(prev => ({
      ...prev,
      sort: sortBy || prev.sort,
      order: sortOrder || prev.order
    }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleAddNew = () => {
    setSelectedPackage(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (pkg) => {
    setSelectedPackage(pkg)
    setIsAddEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedPackage(null)
  }

  const handleModalSuccess = () => {
    fetchPackages()
  }

  const handleDelete = (pkg) => {
    setSelectedPackage(pkg)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedPackage(null)
  }

  const handleDeleteSuccess = () => {
    fetchPackages()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
    // Make the row being dragged semi-transparent
    if (e.currentTarget.tagName === 'TR') {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e) => {
    // Reset opacity
    if (e.currentTarget.tagName === 'TR') {
      e.currentTarget.style.opacity = '1'
    }
    setDraggedIndex(null)
    setDragOverIndex(null)
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (draggedIndex !== null && draggedIndex !== index) {
      setDragOverIndex(index)
    }
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = async (e, dropIndex) => {
    e.preventDefault()
    setDragOverIndex(null)

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null)
      return
    }

    // Reorder packages array
    const reorderedPackages = [...packages]
    const draggedPackage = reorderedPackages[draggedIndex]
    reorderedPackages.splice(draggedIndex, 1)
    reorderedPackages.splice(dropIndex, 0, draggedPackage)

    // Update order values
    const updatedPackages = reorderedPackages.map((pkg, index) => ({
      id: pkg.id,
      order: index
    }))

    // Optimistically update UI
    setPackages(reorderedPackages.map((pkg, index) => ({
      ...pkg,
      order: index
    })))

    try {
      // Update order in backend
      await packagesApi.updateOrder(updatedPackages)
      // Refresh to get updated data
      await fetchPackages()
    } catch (error) {
      console.error('Error updating package order:', error)
      // Revert on error
      fetchPackages()
    }

    setDraggedIndex(null)
  }

  // Define table columns
  const columns = [
    {
      key: 'drag',
      header: '',
      width: '8',
      render: (pkg, index) => (
        <div className="flex items-center justify-center">
          <span 
            className="material-symbols-outlined text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-move select-none"
            title="Drag row to reorder"
          >
            drag_indicator
          </span>
        </div>
      )
    },
    {
      key: 'icon',
      header: 'Icon',
      width: '16',
      render: (pkg) => (
        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex items-center justify-center text-gray-400">
          {pkg.icon ? (
            <img
              alt={pkg.name || 'Package'}
              className="w-full h-full object-cover"
              src={pkg.icon || pkg.icon_url || 'https://via.placeholder.com/48'}
            />
          ) : (
            <span className="material-symbols-outlined text-2xl">inventory_2</span>
          )}
        </div>
      )
    },
    {
      key: 'name',
      header: 'Package Name',
      render: (pkg) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-white">
            {pkg.name || 'N/A'}
          </span>
          {pkg.badge && (
            <span className="text-xs text-primary font-semibold mt-1">
              {pkg.badge}
            </span>
          )}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (pkg) => (
        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
          <span className="block line-clamp-2">
            {pkg.description || 'No description'}
          </span>
        </div>
      )
    },
    {
      key: 'price',
      header: 'Price / Period',
      render: (pkg) => {
        const price = parseFloat(pkg.price || 0)
        const originalPrice = (pkg.originalPrice || pkg.original_price) ? parseFloat(pkg.originalPrice || pkg.original_price) : null
        const hasDiscount = originalPrice && originalPrice > price
        
        return (
          <div className="flex flex-col gap-1">
            <span className="font-bold text-gray-900 dark:text-white">
              {pkg.currency || 'USD'} {price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-500 line-through">
                {pkg.currency || 'USD'} {originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
              / {(pkg.billingPeriod || pkg.billing_period || 'monthly')}
            </span>
          </div>
        )
      }
    },
    {
      key: 'category',
      header: 'Category',
      render: (pkg) => (
        <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
          {pkg.category || 'website'}
        </span>
      )
    },
    {
      key: 'features',
      header: 'Features',
      render: (pkg) => {
        const features = Array.isArray(pkg.features) ? pkg.features : []
        return (
          <div className="text-sm text-gray-600 dark:text-gray-300">
            <span className="font-medium">{features.length}</span> feature{features.length !== 1 ? 's' : ''}
          </div>
        )
      }
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (pkg) => {
        const isFeatured = pkg.isFeatured !== undefined ? pkg.isFeatured : pkg.is_featured
        const isActive = pkg.isActive !== undefined ? pkg.isActive : pkg.is_active
        
        return (
          <div className="flex flex-col gap-1 items-center">
            {isFeatured && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                Featured
              </span>
            )}
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              isActive
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        )
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (pkg) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(pkg)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-xl">edit_note</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(pkg)
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
      <PackagesHeader onAddNew={handleAddNew} />

      <PackagesFilters
        search={filters.search}
        billingPeriod={filters.billing_period}
        category={filters.category}
        isActive={filters.is_active}
        isFeatured={filters.is_featured}
        sortBy={filters.sort}
        sortOrder={filters.order}
        onSearchChange={handleSearchChange}
        onBillingPeriodChange={handleBillingPeriodChange}
        onCategoryChange={handleCategoryChange}
        onActiveStatusChange={handleActiveStatusChange}
        onFeaturedStatusChange={handleFeaturedStatusChange}
        onSort={handleSort}
      />

      {/* Packages Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading packages...</p>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-card-dark rounded-xl shadow-soft border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {columns.map((column, index) => (
                      <th
                        key={column.key || index}
                        className={`px-6 py-4 ${column.width ? `w-${column.width}` : ''} ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                      >
                        {column.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {packages.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No packages found</p>
                      </td>
                    </tr>
                  ) : (
                    packages.map((pkg, rowIndex) => (
                      <tr
                        key={pkg.id || rowIndex}
                        draggable
                        onDragStart={(e) => {
                          e.stopPropagation()
                          handleDragStart(e, rowIndex)
                        }}
                        onDragOver={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDragOver(e, rowIndex)
                        }}
                        onDragLeave={(e) => {
                          e.stopPropagation()
                          handleDragLeave()
                        }}
                        onDrop={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleDrop(e, rowIndex)
                        }}
                        onDragEnd={(e) => {
                          e.stopPropagation()
                          handleDragEnd(e)
                        }}
                        onClick={(e) => {
                          // Prevent row click when dragging
                          if (draggedIndex !== null) {
                            e.preventDefault()
                            e.stopPropagation()
                          }
                        }}
                        className={`group transition-colors ${
                          draggedIndex === rowIndex ? 'opacity-50 cursor-move' : ''
                        } ${
                          dragOverIndex === rowIndex ? 'bg-primary/10 border-t-2 border-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
                        } ${draggedIndex !== null ? 'cursor-move' : ''}`}
                      >
                        {columns.map((column, colIndex) => (
                          <td
                            key={column.key || colIndex}
                            className={`px-6 py-4 align-middle ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : ''}`}
                          >
                            {column.render ? column.render(pkg, rowIndex) : pkg[column.key] || '-'}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <DataTablePagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            itemName="Packages"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add/Edit Package Modal */}
      <AddEditPackageModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        package={selectedPackage}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Package Modal */}
      <DeletePackageModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        package={selectedPackage}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default Packages
