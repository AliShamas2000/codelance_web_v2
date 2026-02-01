# Barbers Section Component

A reusable barbers/team section component with cards, hover effects, and API integration.

## Features

- ✅ Section header with badge, title, description, and decorative element
- ✅ Responsive grid layout (1-3 columns based on screen size)
- ✅ Barber cards with hover effects (image zoom, gradient overlay)
- ✅ Social links on hover (Instagram, Twitter, Email, Calendar)
- ✅ "View Full Team" button with animation
- ✅ Gallery link
- ✅ API-ready with fallback data
- ✅ Loading states
- ✅ Dark mode support

## Usage

### Basic Usage

```jsx
import BarbersSection from './components/BarbersSection/BarbersSection'

function BarbersPage() {
  const barbers = [
    {
      id: 1,
      name: "Alex Sterling",
      role: "Senior Stylist",
      imageUrl: "https://...",
      socialLinks: [
        { icon: "instagram", href: "#", label: "Instagram" }
      ]
    }
  ]

  return (
    <BarbersSection
      barbers={barbers}
      title="Master Barbers"
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import BarbersSection from './components/BarbersSection/BarbersSection'
import barbersApi from '../../api/barbers'

function BarbersPage() {
  const [barbers, setBarbers] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await barbersApi.getBarbers()
      setBarbers(data.data || [])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <BarbersSection
      barbers={barbers}
      isLoading={isLoading}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `badge` | `string` | `"Our Experts"` | Section badge/subtitle |
| `title` | `string` | `"Master Barbers"` | Section title |
| `description` | `string` | `"Experience..."` | Section description |
| `barbers` | `Array` | `[]` | Array of barber objects |
| `isLoading` | `boolean` | `false` | Loading state |
| `onBarberClick` | `function` | `undefined` | Callback when barber card is clicked |
| `onViewFullTeam` | `function` | `undefined` | Callback for "View Full Team" button |
| `showViewFullTeamButton` | `boolean` | `true` | Show/hide the button |
| `viewFullTeamText` | `string` | `"View Full Team"` | Button text |
| `galleryLinkText` | `string` | `"Browse our gallery"` | Gallery link text |
| `galleryLinkHref` | `string` | `"/gallery"` | Gallery link URL |

## Barber Object Structure

```javascript
{
  id: number,              // Unique identifier
  name: string,            // Barber name
  role: string,            // Job title/role
  imageUrl: string,        // Profile image URL
  imageAlt: string,         // Image alt text
  socialLinks: [           // Array of social links
    {
      icon: "instagram" | "twitter" | "email" | "calendar" | string,
      href: string,         // Link URL
      label: string,        // Accessibility label
      platform: string,     // Platform name
      customIcon: string,   // Optional: custom Material icon name
      target: string,       // Optional: link target
      rel: string           // Optional: link rel
    }
  ]
}
```

## Social Icons Supported

- `instagram` - Instagram icon (SVG)
- `twitter` - Twitter/X icon (SVG)
- `email` - Email icon (Material Symbols)
- `calendar` - Calendar icon (Material Symbols)
- `customIcon` - Any Material Symbols icon name

## API Endpoints Expected

### GET `/api/v1/barbers`

Query parameters:
- `limit` (number): Limit number of results
- `role` (string): Filter by role

Response:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Alex Sterling",
      "role": "Senior Stylist",
      "image_url": "https://...",
      "image_alt": "Barber with beard...",
      "social_links": [
        {
          "icon": "instagram",
          "href": "https://instagram.com/...",
          "label": "Instagram",
          "platform": "instagram"
        }
      ]
    }
  ]
}
```

### GET `/api/v1/barbers/{id}`

Response:
```json
{
  "data": {
    "id": 1,
    "name": "Alex Sterling",
    "role": "Senior Stylist",
    "image_url": "https://...",
    "bio": "...",
    "specialties": ["Fades", "Beard Trimming"],
    "social_links": [...]
  }
}
```

## Component Structure

- **BarbersSection** - Main container component
- **SectionHeader** - Header with badge, title, description
- **BarbersGrid** - Grid layout container
- **BarberCard** - Individual barber card with hover effects

