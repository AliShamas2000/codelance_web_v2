# Services Section Component

A reusable services section component with service cards, pricing, and API integration.

## Features

- ✅ Section header with title and description
- ✅ Responsive grid layout (1-4 columns based on screen size)
- ✅ Service cards with background images and gradient overlays
- ✅ Price display
- ✅ "Book Now" buttons
- ✅ Hover effects (shadow, translate-y)
- ✅ API-ready with fallback data
- ✅ Loading states
- ✅ Dark mode support

## Usage

### Basic Usage

```jsx
import ServicesSection from './components/ServicesSection/ServicesSection'

function ServicesPage() {
  const services = [
    {
      id: 1,
      title: "The Classic Cut",
      description: "Precision scissor cut...",
      price: "$45",
      imageUrl: "https://...",
      imageAlt: "Barber cutting hair"
    }
  ]

  return (
    <ServicesSection
      services={services}
      title="Refined Grooming"
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import ServicesSection from './components/ServicesSection/ServicesSection'
import servicesApi from '../../api/services'

function ServicesPage() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await servicesApi.getServices()
      setServices(data.data || [])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <ServicesSection
      services={services}
      isLoading={isLoading}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Refined Grooming"` | Section title |
| `description` | `string` | `"Experience..."` | Section description |
| `services` | `Array` | `[]` | Array of service objects |
| `isLoading` | `boolean` | `false` | Loading state |
| `onServiceClick` | `function` | `undefined` | Callback when service/book button is clicked |
| `buttonText` | `string` | `"Book Now"` | Button text |
| `columns` | `number` | `4` | Number of columns (1-4) |

## Service Object Structure

```javascript
{
  id: number,              // Unique identifier
  title: string,           // Service name
  description: string,     // Service description
  price: string,           // Price (e.g., "$45", "$35.00")
  imageUrl: string,        // Background image URL
  imageAlt: string,        // Image alt text
  category: string,        // Optional: Service category
  duration: number,        // Optional: Duration in minutes
}
```

## API Endpoints Expected

### GET `/api/v1/services`

Query parameters:
- `category` (string): Filter by category
- `active` (boolean): Filter by active status (default: true)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "The Classic Cut",
      "description": "Precision scissor cut with hot towel finish...",
      "price": "$45",
      "image_url": "https://...",
      "image_alt": "Barber cutting hair with scissors",
      "category": "haircuts",
      "duration": 45,
      "active": true
    }
  ]
}
```

### GET `/api/v1/services/{id}`

Response:
```json
{
  "data": {
    "id": 1,
    "title": "The Classic Cut",
    "description": "...",
    "price": "$45",
    "image_url": "https://...",
    "category": "haircuts",
    "duration": 45,
    "active": true
  }
}
```

## Component Structure

- **ServicesSection** - Main container component
- **ServicesGrid** - Grid layout container
- **ServiceCard** - Individual service card with image, price, description, and button

## Styling Notes

- Cards use aspect ratio with `pt-[200px]` for consistent height
- Background images have gradient overlays for text readability
- Hover effects: shadow increase and slight translate-y
- Dark mode: Cards use `dark:bg-[#1a2e26]` background

