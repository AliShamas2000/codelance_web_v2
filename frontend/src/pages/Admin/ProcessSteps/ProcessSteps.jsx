import React, { useState, useEffect } from 'react'
import ProcessStepsHeader from '../../../components/ProcessStepsHeader/ProcessStepsHeader'
import ProcessStepsFilters from '../../../components/ProcessStepsFilters/ProcessStepsFilters'
import DataTablePagination from '../../../components/DataTablePagination/DataTablePagination'
import AddEditProcessStepModal from '../../../components/AddEditProcessStepModal/AddEditProcessStepModal'
import DeleteProcessStepModal from '../../../components/DeleteProcessStepModal/DeleteProcessStepModal'
import processStepsApi from '../../../api/processSteps'

const ProcessSteps = () => {
  const [steps, setSteps] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    position: 'all',
    is_active: null,
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
  const [selectedStep, setSelectedStep] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  // Fetch process steps
  const fetchSteps = async () => {
    try {
      setIsLoading(true)
      const response = await processStepsApi.getProcessSteps({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        position: filters.position,
        is_active: filters.is_active,
        sort: filters.sort,
        order: filters.order
      })
      
      setSteps(response.data || response.steps || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching process steps:', error)
      setSteps([])
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
    fetchSteps()
  }, [pagination.currentPage, filters])

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handlePositionChange = (value) => {
    setFilters(prev => ({ ...prev, position: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleActiveStatusChange = (value) => {
    setFilters(prev => ({ ...prev, is_active: value }))
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
    setSelectedStep(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (step) => {
    setSelectedStep(step)
    setIsAddEditModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedStep(null)
  }

  const handleModalSuccess = () => {
    fetchSteps()
  }

  const handleDelete = (step) => {
    setSelectedStep(step)
    setIsDeleteModalOpen(true)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedStep(null)
  }

  const handleDeleteSuccess = () => {
    fetchSteps()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  // Drag and Drop Handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', index.toString())
    if (e.currentTarget.tagName === 'TR') {
      e.currentTarget.style.opacity = '0.5'
    }
  }

  const handleDragEnd = (e) => {
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

    // Reorder steps array
    const reorderedSteps = [...steps]
    const draggedStep = reorderedSteps[draggedIndex]
    reorderedSteps.splice(draggedIndex, 1)
    reorderedSteps.splice(dropIndex, 0, draggedStep)

    // Update order values
    const updatedSteps = reorderedSteps.map((step, index) => ({
      id: step.id,
      order: index
    }))

    // Optimistically update UI
    setSteps(reorderedSteps.map((step, index) => ({
      ...step,
      order: index
    })))

    try {
      // Update order in backend
      await processStepsApi.updateOrder(updatedSteps)
      // Refresh to get updated data
      await fetchSteps()
    } catch (error) {
      console.error('Error updating process step order:', error)
      // Revert on error
      fetchSteps()
    }

    setDraggedIndex(null)
  }

  // Define table columns
  const columns = [
    {
      key: 'drag',
      header: '',
      width: '8',
      render: (step, index) => (
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
      key: 'step_number',
      header: 'Step #',
      width: '12',
      render: (step) => (
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">
            {step.icon || 'code'}
          </span>
          <span className="font-bold text-gray-900 dark:text-white">
            {step.stepNumber || step.step_number || 'N/A'}
          </span>
        </div>
      )
    },
    {
      key: 'title',
      header: 'Title',
      render: (step) => (
        <div className="font-semibold text-gray-900 dark:text-white">
          {step.title || 'N/A'}
        </div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (step) => (
        <div className="text-sm text-gray-600 dark:text-gray-300 max-w-xs">
          <span className="block line-clamp-2">
            {step.description || 'No description'}
          </span>
        </div>
      )
    },
    {
      key: 'position',
      header: 'Position',
      align: 'center',
      render: (step) => (
        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
          step.position === 'left'
            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
            : 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
        }`}>
          {step.position || 'left'}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      render: (step) => {
        const isActive = step.isActive !== undefined ? step.isActive : step.is_active
        
        return (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            isActive
              ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        )
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      render: (step) => (
        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleEdit(step)
            }}
            className="p-2 text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            title="Edit"
          >
            <span className="material-symbols-outlined text-xl">edit_note</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDelete(step)
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
      <ProcessStepsHeader onAddNew={handleAddNew} />

      <ProcessStepsFilters
        search={filters.search}
        position={filters.position}
        isActive={filters.is_active}
        sortBy={filters.sort}
        sortOrder={filters.order}
        onSearchChange={handleSearchChange}
        onPositionChange={handlePositionChange}
        onActiveStatusChange={handleActiveStatusChange}
        onSort={handleSort}
      />

      {/* Process Steps Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading process steps...</p>
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
                  {steps.length === 0 ? (
                    <tr>
                      <td colSpan={columns.length} className="px-6 py-12 text-center">
                        <p className="text-sm text-gray-500 dark:text-gray-400">No process steps found</p>
                      </td>
                    </tr>
                  ) : (
                    steps.map((step, rowIndex) => (
                      <tr
                        key={step.id || rowIndex}
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
                            {column.render ? column.render(step, rowIndex) : step[column.key] || '-'}
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
            itemName="Process Steps"
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add/Edit Process Step Modal */}
      <AddEditProcessStepModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        step={selectedStep}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Process Step Modal */}
      <DeleteProcessStepModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        step={selectedStep}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}

export default ProcessSteps

