# Philosophy Section Component

A reusable philosophy/features section component with two-column layout, team information, and feature cards.

## Features

- ✅ Two-column layout (content + features grid)
- ✅ Badge with animated indicator
- ✅ Title with highlighted text
- ✅ Description paragraph
- ✅ Team avatars with info
- ✅ Feature cards grid (2x2 layout)
- ✅ Staggered card animation (translate-y)
- ✅ Hover effects on cards
- ✅ API-ready with fallback data
- ✅ Loading states
- ✅ Dark mode support
- ✅ Responsive design

## Usage

### Basic Usage

```jsx
import PhilosophySection from './components/PhilosophySection/PhilosophySection'

function HomePage() {
  const features = [
    {
      id: 1,
      icon: "verified",
      title: "Precision First",
      description: "Exact attention to detail...",
      translateY: false
    }
  ]

  return (
    <PhilosophySection
      features={features}
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import PhilosophySection from './components/PhilosophySection/PhilosophySection'
import philosophyApi from '../../api/philosophy'

function HomePage() {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await philosophyApi.getPhilosophyData()
      setData(data)
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <PhilosophySection
      badge={data?.badge}
      title={data?.title}
      description={data?.description}
      teamAvatars={data?.teamAvatars || []}
      features={data?.features || []}
      isLoading={isLoading}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `badge` | `string` | `"Our Philosophy"` | Badge text |
| `badgeIcon` | `string` | `"w-2 h-2..."` | Badge icon classes |
| `title` | `string` | `"Refining..."` | Section title |
| `titleHighlight` | `string` | `"Modern Grooming."` | Highlighted part of title |
| `description` | `string` | `"We don't just..."` | Description text |
| `teamAvatars` | `Array` | `[]` | Array of team avatar objects |
| `teamTitle` | `string` | `"Master Barbers"` | Team title |
| `teamSubtitle` | `string` | `"15+ Years Combined"` | Team subtitle |
| `features` | `Array` | `[]` | Array of feature objects |
| `isLoading` | `boolean` | `false` | Loading state |
| `className` | `string` | `""` | Additional CSS classes |

## Feature Structure

```javascript
{
  id: number,              // Unique identifier
  icon: string,           // Material icon name
  title: string,          // Feature title
  description: string,   // Feature description
  translateY: boolean    // Whether to apply translate-y animation
}
```

## Team Avatar Structure

```javascript
{
  initials: string,       // Avatar initials (e.g., "JD")
  bgColor: string,       // Background color class (e.g., "bg-slate-200")
  textColor: string      // Text color class (e.g., "text-slate-600")
}
```

## API Endpoints Expected

### GET `/api/v1/philosophy`

Response:
```json
{
  "badge": "Our Philosophy",
  "title": "Refining the Art of Modern Grooming.",
  "title_highlight": "Modern Grooming.",
  "description": "We don't just cut hair...",
  "team_avatars": [
    {
      "initials": "JD",
      "bg_color": "bg-slate-200",
      "text_color": "text-slate-600"
    }
  ],
  "team_title": "Master Barbers",
  "team_subtitle": "15+ Years Combined",
  "features": [
    {
      "id": 1,
      "icon": "verified",
      "title": "Precision First",
      "description": "Exact attention to detail...",
      "translate_y": false
    }
  ]
}
```

### GET `/api/v1/philosophy/features`

Query parameters:
- `limit` (number): Number of features to return (default: 10)
- `featured` (boolean): Get only featured features (default: false)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "icon": "verified",
      "title": "Precision First",
      "description": "Exact attention to detail...",
      "translate_y": false
    }
  ]
}
```

## Component Structure

- **PhilosophySection** - Main container component
- **FeaturesGrid** - Grid layout for features
- **FeatureCard** - Individual feature card

## Staggered Animation

The feature cards use `sm:translate-y-8` on alternating cards (odd indices) to create a staggered effect on larger screens. This can be controlled via the `translateY` property on each feature.

