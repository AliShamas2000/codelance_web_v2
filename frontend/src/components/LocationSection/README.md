# Location Section Component

A reusable location and contact information section component with Google Maps embed.

## Features

- ✅ Two-column layout (contact info + map)
- ✅ Badge, title, and description
- ✅ Contact information items (address, phone, email, hours)
- ✅ Google Maps embed with custom filter
- ✅ Clickable phone and email links
- ✅ API-ready with fallback data
- ✅ Loading states
- ✅ Dark mode support (map filter adapts)
- ✅ Responsive design (stacks on mobile)

## Usage

### Basic Usage

```jsx
import LocationSection from './components/LocationSection/LocationSection'

function HomePage() {
  return (
    <LocationSection
      address={{
        title: "Our Address",
        content: "123 Barber Street, Suite 101\nSoHo, New York, NY 10013"
      }}
      phone={{
        title: "Phone",
        content: "(555) 123-4567",
        href: "tel:5551234567"
      }}
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import LocationSection from './components/LocationSection/LocationSection'
import locationApi from '../../api/location'

function HomePage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await locationApi.getLocationData()
      setData(data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <LocationSection
      badge={data?.badge}
      title={data?.title}
      address={data?.address}
      phone={data?.phone}
      email={data?.email}
      hours={data?.hours}
      mapUrl={data?.mapUrl}
      isLoading={isLoading}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `badge` | `string` | `"Find Us"` | Badge text |
| `title` | `string` | `"Location & Contact"` | Section title |
| `description` | `string` | `"Visit our studio..."` | Description text |
| `address` | `Object` | `{}` | Address object with title and content |
| `phone` | `Object` | `{}` | Phone object with title, content, and href |
| `email` | `Object` | `{}` | Email object with title, content, and href |
| `hours` | `Object` | `{}` | Hours object with title and content |
| `mapUrl` | `string` | `""` | Google Maps embed URL |
| `mapEmbedCode` | `string` | `""` | Custom map embed HTML code |
| `isLoading` | `boolean` | `false` | Loading state |
| `className` | `string` | `""` | Additional CSS classes |

## Contact Info Structure

```javascript
{
  title: string,    // Item title (e.g., "Our Address")
  content: string,  // Item content (supports \n for line breaks)
  href: string     // Optional link URL (for phone/email)
}
```

## API Endpoints Expected

### GET `/api/v1/location`

Response:
```json
{
  "badge": "Find Us",
  "title": "Location & Contact",
  "description": "Visit our studio for a consultation...",
  "address": {
    "title": "Our Address",
    "content": "123 Barber Street, Suite 101\nSoHo, New York, NY 10013"
  },
  "phone": {
    "title": "Phone",
    "content": "(555) 123-4567",
    "href": "tel:5551234567"
  },
  "email": {
    "title": "Email",
    "content": "info@thestudio.com",
    "href": "mailto:info@thestudio.com"
  },
  "hours": {
    "title": "Opening Hours",
    "content": "Mon - Fri: 9am - 8pm\nSat: 10am - 6pm\nSun: Closed"
  },
  "map_url": "https://www.google.com/maps/embed?pb=...",
  "map_embed_code": null
}
```

## Component Structure

- **LocationSection** - Main container component
- **ContactInfoItem** - Individual contact information item
- **LocationMap** - Google Maps embed component

## Map Filter

The map uses a custom CSS filter:
- **Light mode**: Grayscale (100%)
- **Dark mode**: Grayscale (100%) + Invert (90%) + Hue-rotate (180deg)

This creates a cohesive look that matches the site's design in both light and dark modes.

## Google Maps Embed

The component supports:
- **mapUrl**: Standard Google Maps embed URL
- **mapEmbedCode**: Custom HTML embed code (if you need more control)

If neither is provided, it uses a default New York location.

