# Reviews Section Component

A reusable reviews/ratings section component with customer testimonials and star ratings.

## Features

- ✅ Section header with badge, title, and description
- ✅ Star rating display (supports half stars)
- ✅ Customer testimonials/quotes
- ✅ Customer information (name, initials, avatar, type)
- ✅ Responsive grid layout (1-4 columns)
- ✅ Hover effects (shadow, border color)
- ✅ API-ready with fallback data
- ✅ Loading states
- ✅ Dark mode support

## Usage

### Basic Usage

```jsx
import ReviewsSection from './components/ReviewsSection/ReviewsSection'

function HomePage() {
  const reviews = [
    {
      id: 1,
      rating: 5,
      quote: "Great service!",
      customerName: "John Doe",
      customerInitials: "JD",
      customerType: "Regular Client"
    }
  ]

  return (
    <ReviewsSection
      reviews={reviews}
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import ReviewsSection from './components/ReviewsSection/ReviewsSection'
import reviewsApi from '../../api/reviews'

function HomePage() {
  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const data = await reviewsApi.getReviews({ limit: 3, featured: true })
      setReviews(data.data || [])
      setIsLoading(false)
    }
    fetchData()
  }, [])

  return (
    <ReviewsSection
      reviews={reviews}
      isLoading={isLoading}
    />
  )
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `badge` | `string` | `"Client Reviews"` | Section badge text |
| `title` | `string` | `"What Our Clients Say"` | Section title |
| `description` | `string` | `"Join thousands..."` | Section description |
| `reviews` | `Array` | `[]` | Array of review objects |
| `isLoading` | `boolean` | `false` | Loading state |
| `columns` | `number` | `3` | Number of columns (1-4) |
| `className` | `string` | `""` | Additional CSS classes |

## Review Structure

```javascript
{
  id: number,              // Unique identifier
  rating: number,          // Rating (1-5, supports decimals like 4.5)
  quote: string,          // Review text/quote
  customerName: string,    // Customer full name
  customerInitials: string, // Customer initials (optional, auto-generated if not provided)
  customerType: string,    // Customer type (e.g., "Regular Client")
  serviceType: string,     // Service type (e.g., "Haircut & Style")
  avatarUrl: string       // Customer avatar image URL (optional)
}
```

## API Endpoints Expected

### GET `/api/v1/reviews`

Query parameters:
- `limit` (number): Number of reviews to return (default: 10)
- `offset` (number): Number of reviews to skip (default: 0)
- `min_rating` (number): Minimum rating filter (default: 0)
- `featured` (boolean): Get only featured reviews (default: false)

Response:
```json
{
  "data": [
    {
      "id": 1,
      "rating": 5,
      "quote": "The level of service here is simply unmatched...",
      "customer_name": "James Dawson",
      "customer_initials": "JD",
      "customer_type": "Regular Client",
      "service_type": null,
      "avatar_url": null,
      "created_at": "2024-01-15T10:00:00Z"
    }
  ],
  "total": 50,
  "limit": 10,
  "offset": 0
}
```

### GET `/api/v1/reviews/average-rating`

Response:
```json
{
  "average_rating": 4.8,
  "total_reviews": 150,
  "rating_distribution": {
    "5": 120,
    "4": 20,
    "3": 5,
    "2": 3,
    "1": 2
  }
}
```

## Component Structure

- **ReviewsSection** - Main container component
- **ReviewsGrid** - Grid layout container
- **ReviewCard** - Individual review card

## Star Rating Display

The component supports:
- Full stars (filled)
- Half stars (for ratings like 4.5)
- Empty stars (for ratings below 5)
- Custom star count (default: 5 stars)

## Avatar Display

If `avatarUrl` is provided, it displays the image. Otherwise, it shows initials in a circular badge with background color.

