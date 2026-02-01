# Pricing Section Component

A reusable pricing section component with filters, pricing cards, and API integration.

## Features

- ✅ Section header with title and description
- ✅ Filter chips (All Services, Haircuts, Shaves, Beard, Treatments)
- ✅ Responsive grid layout (1-3 columns based on screen size)
- ✅ Pricing cards with features list
- ✅ Featured plan highlighting (with badge)
- ✅ Duration badges
- ✅ "Book Now" buttons
- ✅ CTA section at bottom
- ✅ Hover effects (shadow, translate-y, border color)
- ✅ API-ready with fallback data
- ✅ Loading states
- ✅ Dark mode support

## Usage

### Basic Usage

```jsx
import PricingSection from './components/PricingSection/PricingSection'

function PricingPage() {
  const plans = [
    {
      id: 1,
      title: "The Executive Cut",
      subtitle: "Signature hair styling",
      price: "$55",
      duration: "45 min",
      features: ["Personalized Consultation", "Precision Scissor Cut"],
      isFeatured: false
    }
  ]

  return (
    <PricingSection
      pricingPlans={plans}
      title="Precision Cuts & Styling"
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import PricingSection from './components/PricingSection/PricingSection'
import pricingApi from '../../api/pricing'

function PricingPage() {
  const [plans, setPlans] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await pricingApi.getPricingPlans()
      setPlans(data.data || [])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <PricingSection
      pricingPlans={plans}
      isLoading={isLoading}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Precision Cuts..."` | Section title |
| `description` | `string` | `"Experience..."` | Section description |
| `pricingPlans` | `Array` | `[]` | Array of pricing plan objects |
| `filters` | `Array` | `[]` | Array of filter options |
| `isLoading` | `boolean` | `false` | Loading state |
| `onPlanClick` | `function` | `undefined` | Callback when plan/book button is clicked |
| `onFilterChange` | `function` | `undefined` | Callback when filter changes |
| `onCTAClick` | `function` | `undefined` | Callback for CTA button |
| `buttonText` | `string` | `"Book Now"` | Book button text |
| `showCTA` | `boolean` | `true` | Show/hide CTA section |
| `columns` | `number` | `3` | Number of columns (1-4) |

## Pricing Plan Structure

```javascript
{
  id: number,              // Unique identifier
  title: string,           // Plan name
  subtitle: string,        // Plan subtitle/description
  price: string,           // Price (e.g., "$55", "$40.00")
  duration: string,        // Duration (e.g., "45 min", "30 min")
  features: Array<string>, // Array of feature descriptions
  isFeatured: boolean,     // Whether this is the featured plan
  featuredBadge: string,   // Badge text for featured plan (default: "Most Popular")
  category: string,        // Category for filtering
  filterId: string         // Filter ID for filtering
}
```

## API Endpoints Expected

### GET `/api/v1/pricing`

Query parameters:
- `filter` (string): Filter by category (all, haircuts, shaves, beard, treatments)
- `active` (boolean): Filter by active status (default: true)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "title": "The Executive Cut",
      "subtitle": "Signature hair styling",
      "price": "$55",
      "duration": "45 min",
      "features": [
        "Personalized Consultation",
        "Precision Scissor Cut",
        "Wash & Style Finish"
      ],
      "is_featured": false,
      "category": "haircuts",
      "filter_id": "haircuts",
      "active": true
    }
  ]
}
```

### GET `/api/v1/pricing/filters`

Response:
```json
{
  "data": [
    { "id": "all", "label": "All Services" },
    { "id": "haircuts", "label": "Haircuts" },
    { "id": "shaves", "label": "Shaves" }
  ]
}
```

## Component Structure

- **PricingSection** - Main container component
- **PricingFilters** - Filter chips component
- **PricingGrid** - Grid layout container
- **PricingCard** - Individual pricing card
- **PricingCTA** - Call-to-action section at bottom

## Featured Plan

Plans with `isFeatured: true` will:
- Have primary border color
- Show "Most Popular" badge (or custom badge text)
- Have primary-colored title
- Have primary background on button

