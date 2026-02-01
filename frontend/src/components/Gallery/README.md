# Gallery Component

A reusable gallery component with filtering, pagination, and API integration.

## Features

- ✅ Filter by category (All, Haircuts, Beard Trim, Styling, Products)
- ✅ Responsive grid layout (1-4 columns based on screen size)
- ✅ Hover effects with overlay information
- ✅ Lazy loading images
- ✅ Load more pagination
- ✅ API-ready with fallback data
- ✅ Loading states
- ✅ Dark mode support

## Usage

### Basic Usage

```jsx
import Gallery from './components/Gallery/Gallery'

function GalleryPage() {
  const items = [
    {
      id: 1,
      imageUrl: "https://example.com/image.jpg",
      imageAlt: "Description",
      category: "Service",
      title: "Hot Towel Shave",
      filterId: "beard-trim"
    }
  ]

  return (
    <Gallery
      items={items}
      title="Masterpieces"
      description="A curation of our finest cuts..."
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import Gallery from './components/Gallery/Gallery'
import galleryApi from '../../api/gallery'

function GalleryPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await galleryApi.getGalleryItems({ page: 1, filter: 'all' })
      setItems(data.data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <Gallery
      items={items}
      isLoading={isLoading}
      hasMore={data.has_more}
      onLoadMore={() => {/* load more logic */}}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `Array` | `[]` | Array of gallery items |
| `filters` | `Array` | `[]` | Array of filter options |
| `title` | `string` | `"Masterpieces"` | Gallery title |
| `description` | `string` | `"A curation..."` | Gallery description |
| `isLoading` | `boolean` | `false` | Loading state |
| `hasMore` | `boolean` | `false` | Whether more items are available |
| `onItemClick` | `function` | `undefined` | Callback when item is clicked |
| `onFilterChange` | `function` | `undefined` | Callback when filter changes |
| `onLoadMore` | `function` | `undefined` | Callback for load more button |

## Gallery Item Structure

```javascript
{
  id: number,              // Unique identifier
  imageUrl: string,        // Image URL
  imageAlt: string,        // Alt text for image
  category: string,        // Category label (e.g., "Service", "Style")
  title: string,           // Item title
  filterId: string         // Filter ID for filtering (e.g., "haircuts", "beard-trim")
}
```

## API Endpoints Expected

### GET `/api/v1/gallery`
Query parameters:
- `page` (number): Page number
- `filter` (string): Filter category
- `per_page` (number): Items per page

Response:
```json
{
  "data": [
    {
      "id": 1,
      "image_url": "https://...",
      "image_alt": "...",
      "category": "Service",
      "title": "Hot Towel Shave",
      "filter_id": "beard-trim"
    }
  ],
  "has_more": true,
  "current_page": 1,
  "total_pages": 5
}
```

### GET `/api/v1/gallery/filters`
Response:
```json
{
  "data": [
    { "id": "all", "label": "All" },
    { "id": "haircuts", "label": "Haircuts" },
    { "id": "beard-trim", "label": "Beard Trim" }
  ]
}
```

