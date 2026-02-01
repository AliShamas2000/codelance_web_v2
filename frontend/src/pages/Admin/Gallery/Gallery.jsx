import React, { useState, useEffect } from 'react'
import GalleryHeader from '../../../components/GalleryHeader/GalleryHeader'
import GalleryFilters from '../../../components/GalleryFilters/GalleryFilters'
import GalleryGrid from '../../../components/GalleryGrid/GalleryGrid'
import GalleryPagination from '../../../components/GalleryPagination/GalleryPagination'
import AddEditGalleryModal from '../../../components/AddEditGalleryModal/AddEditGalleryModal'
import DeleteGalleryModal from '../../../components/DeleteGalleryModal/DeleteGalleryModal'
import Lightbox from '../../../components/Lightbox/Lightbox'
import galleryApi from '../../../api/gallery'
import authApi from '../../../api/auth'

const Gallery = () => {
  const [images, setImages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    service: 'all'
  })
  const [viewMode, setViewMode] = useState('grid')
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 12
  })
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)


  // Fetch gallery images
  const fetchImages = async () => {
    try {
      setIsLoading(true)
      const response = await galleryApi.getGalleryImages({
        page: pagination.currentPage,
        per_page: pagination.itemsPerPage,
        search: filters.search,
        service: filters.service
      })
      
      setImages(response.data || response.images || [])
      setPagination(prev => ({
        ...prev,
        totalPages: response.total_pages || response.totalPages || 1,
        totalItems: response.total || response.totalItems || 0
      }))
    } catch (error) {
      console.error('Error fetching gallery images:', error)
      setImages([])
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
    fetchImages()
  }, [pagination.currentPage, filters])


  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleServiceChange = (value) => {
    setFilters(prev => ({ ...prev, service: value }))
    setPagination(prev => ({ ...prev, currentPage: 1 }))
  }

  const handleViewModeChange = (mode) => {
    setViewMode(mode)
  }

  const handleAddNew = () => {
    setSelectedImage(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (image) => {
    setSelectedImage(image)
    setIsAddEditModalOpen(true)
  }

  const handleDelete = (image) => {
    setSelectedImage(image)
    setIsDeleteModalOpen(true)
  }

  const handleView = (image, index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const handleLightboxClose = () => {
    setLightboxOpen(false)
  }

  const handleLightboxNavigate = (index) => {
    setLightboxIndex(index)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedImage(null)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedImage(null)
  }

  const handleModalSuccess = () => {
    // Refresh images list after successful add/edit/delete
    fetchImages()
  }

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, currentPage: page }))
  }

  return (
    <>
      <GalleryHeader onAddNew={handleAddNew} />

      <GalleryFilters
        search={filters.search}
        service={filters.service}
        viewMode={viewMode}
        onSearchChange={handleSearchChange}
        onServiceChange={handleServiceChange}
        onViewModeChange={handleViewModeChange}
      />

      {/* Gallery Grid */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading gallery images...</p>
        </div>
      ) : (
        <>
          <GalleryGrid
            images={images}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onView={handleView}
            viewMode={viewMode}
          />
          <GalleryPagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add/Edit Gallery Modal */}
      <AddEditGalleryModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        image={selectedImage}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Gallery Modal */}
      <DeleteGalleryModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        image={selectedImage}
        onSuccess={handleModalSuccess}
      />

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={lightboxOpen}
        onClose={handleLightboxClose}
        items={images.map(img => ({
          id: img.id,
          imageUrl: img.image || img.image_url || img.url,
          imageAlt: img.title || img.name || 'Gallery image',
          title: img.title || img.name,
          category: img.category
        }))}
        currentIndex={lightboxIndex}
        onNavigate={handleLightboxNavigate}
      />
    </>
  )
}

export default Gallery
