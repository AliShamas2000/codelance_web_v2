# About Section Component

A reusable about section component with content, image, stats, and API integration.

## Features

- ✅ Two-column responsive layout (text + image)
- ✅ Established year badge
- ✅ Title and descriptions
- ✅ Action buttons (primary + secondary)
- ✅ Stats grid (3 columns)
- ✅ Image with decorative elements
- ✅ Floating badge with customer avatars
- ✅ API-ready with fallback data
- ✅ Dark mode support

## Usage

### Basic Usage

```jsx
import AboutSection from './components/AboutSection/AboutSection'

function AboutPage() {
  return (
    <AboutSection
      establishedYear="2015"
      title="Refined Grooming for the Modern Man"
      description="At Blade & Co, we believe..."
      stats={[
        { value: "15k+", label: "Clients Served" },
        { value: "9", label: "Master Barbers" }
      ]}
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import AboutSection from './components/AboutSection/AboutSection'
import aboutApi from '../../api/about'

function AboutPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const aboutData = await aboutApi.getAboutData()
      setData(aboutData)
    }
    fetchData()
  }, [])

  if (!data) return <div>Loading...</div>

  return <AboutSection {...data} />
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `establishedYear` | `string` | `"2015"` | Year the business was established |
| `title` | `string` | `"Refined Grooming..."` | Main heading |
| `description` | `string` | `"At Blade & Co..."` | Primary description |
| `secondaryDescription` | `string` | `undefined` | Secondary description paragraph |
| `primaryButtonText` | `string` | `"Meet the Team"` | Primary button label |
| `primaryButtonOnClick` | `function` | `undefined` | Primary button click handler |
| `secondaryButtonText` | `string` | `"View Services"` | Secondary button label |
| `secondaryButtonOnClick` | `function` | `undefined` | Secondary button click handler |
| `stats` | `Array` | `[]` | Array of stat objects |
| `imageUrl` | `string` | `undefined` | Main image URL |
| `imageAlt` | `string` | `"Barber..."` | Image alt text |
| `badgeProps` | `object` | `{}` | Props for FloatingBadge component |

## Stats Structure

```javascript
[
  {
    value: "15k+",    // Stat value (string or number)
    label: "Clients Served"  // Stat label
  }
]
```

## Badge Props Structure

```javascript
{
  title: "Join our community",
  subtitle: "Rated Top Barber in City",
  customerAvatars: [
    {
      imageUrl: "https://...",  // Avatar image URL
      initials: "JD"  // Optional: fallback initials
    }
  ]
}
```

## API Endpoint Expected

### GET `/api/v1/about`

Response:
```json
{
  "data": {
    "established_year": "2015",
    "title": "Refined Grooming for the Modern Man",
    "description": "At Blade & Co...",
    "secondary_description": "Our barbers are...",
    "primary_button_text": "Meet the Team",
    "secondary_button_text": "View Services",
    "stats": [
      {
        "value": "15k+",
        "label": "Clients Served"
      },
      {
        "value": "9",
        "label": "Master Barbers"
      },
      {
        "value": "4.9",
        "label": "Average Rating"
      }
    ],
    "image_url": "https://...",
    "image_alt": "Barber cutting hair...",
    "badge_props": {
      "title": "Join our community",
      "subtitle": "Rated Top Barber in City",
      "customer_avatars": [
        {
          "image_url": "https://..."
        }
      ]
    }
  }
}
```

## Component Structure

- **AboutSection** - Main container component
- **AboutContent** - Left column with text, buttons, stats
- **AboutImage** - Right column with image and decorative elements
- **StatsGrid** - Stats display component
- **FloatingBadge** - Badge overlay on image

