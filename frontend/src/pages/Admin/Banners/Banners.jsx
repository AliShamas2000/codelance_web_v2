import React, { useState, useEffect } from 'react'
import BannersHeader from '../../../components/BannersHeader/BannersHeader'
import BannersTable from '../../../components/BannersTable/BannersTable'
import AddEditBannerModal from '../../../components/AddEditBannerModal/AddEditBannerModal'
import DeleteBannerModal from '../../../components/DeleteBannerModal/DeleteBannerModal'
import bannersApi from '../../../api/banners'
import authApi from '../../../api/auth'

const Banners = () => {
  const [banners, setBanners] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedBanner, setSelectedBanner] = useState(null)


  // Fetch banners
  const fetchBanners = async () => {
    try {
      setIsLoading(true)
      const response = await bannersApi.getBanners()
      
      setBanners(response.data || response.banners || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
      setBanners([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBanners()
  }, [])


  const handleAddNew = () => {
    setSelectedBanner(null)
    setIsAddEditModalOpen(true)
  }

  const handleEdit = (banner) => {
    setSelectedBanner(banner)
    setIsAddEditModalOpen(true)
  }

  const handleDelete = (banner) => {
    setSelectedBanner(banner)
    setIsDeleteModalOpen(true)
  }

  const handleModalClose = () => {
    setIsAddEditModalOpen(false)
    setSelectedBanner(null)
  }

  const handleDeleteModalClose = () => {
    setIsDeleteModalOpen(false)
    setSelectedBanner(null)
  }

  const handleModalSuccess = () => {
    // Refresh banners list after successful add/edit/delete
    fetchBanners()
  }

  return (
    <>
      <BannersHeader onAddNew={handleAddNew} />

      {/* Banners Table */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p>Loading banners...</p>
        </div>
      ) : (
        <BannersTable
          banners={banners}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add/Edit Banner Modal */}
      <AddEditBannerModal
        isOpen={isAddEditModalOpen}
        onClose={handleModalClose}
        banner={selectedBanner}
        onSuccess={handleModalSuccess}
      />

      {/* Delete Banner Modal */}
      <DeleteBannerModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteModalClose}
        banner={selectedBanner}
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

export default Banners


