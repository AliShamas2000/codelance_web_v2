import React, { useState, useEffect } from 'react'
import Gallery from '../../components/Gallery/Gallery'
import galleryApi from '../../api/gallery'

const GalleryPage = () => {
  const [galleryItems, setGalleryItems] = useState([])
  const [filters, setFilters] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState('all')

  // Fetch gallery items from API
  const fetchGalleryItems = async (page = 1, filter = 'all') => {
    try {
      setIsLoading(true)
      const response = await galleryApi.getPublicGalleryItems({
        page,
        per_page: 8,
        service: filter === 'all' ? 'all' : filter
      })

      const items = response.data || []
      
      if (page === 1) {
        setGalleryItems(items)
      } else {
        setGalleryItems(prev => [...prev, ...items])
      }

      setHasMore(response.has_more || false)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching gallery items:', error)
      setGalleryItems([])
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch services for filter chips
  const fetchFilters = async () => {
    try {
      const response = await galleryApi.getGalleryServices()
      const services = response.data || []
      
      // Format services for filter chips
      const formattedFilters = [
        { id: 'all', label: 'All' },
        ...services.map(service => ({
          id: String(service.id),
          label: service.name || service.nameEn || service.name_en || 'Unnamed Service'
        }))
      ]
      
      setFilters(formattedFilters)
    } catch (error) {
      console.error('Error fetching filters:', error)
      setFilters([{ id: 'all', label: 'All' }])
    }
  }

  // Load initial data
  useEffect(() => {
    fetchFilters()
    fetchGalleryItems(1, 'all')
  }, [])

  // Handle filter change
  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId)
    fetchGalleryItems(1, filterId)
  }

  // Handle load more
  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      fetchGalleryItems(currentPage + 1, activeFilter)
    }
  }

  // Handle item click (lightbox is handled by Gallery component)
  const handleItemClick = (item) => {
    // Additional logic can be added here if needed
    console.log('Gallery item clicked:', item)
  }

  return (
    <Gallery
      items={galleryItems}
      filters={filters}
      isLoading={isLoading}
      hasMore={hasMore}
      onFilterChange={handleFilterChange}
      onLoadMore={handleLoadMore}
      onItemClick={handleItemClick}
    />
  )
}

export default GalleryPage
