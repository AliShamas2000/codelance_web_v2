# Contact Section Component

A reusable contact/appointment booking section component with form, calendar, and contact information panel.

## Features

- ✅ Two-column layout (info panel + form)
- ✅ Contact information panel with address and phone
- ✅ Multi-step appointment form
- ✅ Calendar date picker
- ✅ Time slot selector
- ✅ Form validation
- ✅ API-ready with fallback data
- ✅ Loading states
- ✅ Dark mode support
- ✅ Responsive design (mobile-friendly)
- ✅ Background decorations

## Usage

### Basic Usage

```jsx
import ContactSection from './components/ContactSection/ContactSection'

function ContactPage() {
  const handleSubmit = (formData) => {
    console.log('Form submitted:', formData)
  }

  return (
    <ContactSection
      infoPanelProps={{
        title: "Premium Experience",
        description: "Relax in our modern studio...",
        address: {
          title: "Our Studio",
          line1: "123 Fashion Ave, Suite 101",
          line2: "New York, NY 10012"
        },
        contact: {
          title: "Contact Us",
          phone: "+1 (555) 000-0000",
          email: "hello@luxecuts.com"
        }
      }}
      formProps={{
        onSubmit: handleSubmit
      }}
    />
  )
}
```

### With API Integration

```jsx
import { useState, useEffect } from 'react'
import ContactSection from './components/ContactSection/ContactSection'
import appointmentApi from '../../api/appointments'

function ContactPage() {
  const [timeSlots, setTimeSlots] = useState([])
  const [availableDates, setAvailableDates] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const dates = await appointmentApi.getAvailableDates()
      setAvailableDates(dates.available || [])
    }
    fetchData()
  }, [])

  const handleDateSelect = async (date) => {
    const slots = await appointmentApi.getAvailableTimeSlots(date)
    setTimeSlots(slots.available || [])
  }

  return (
    <ContactSection
      formProps={{
        availableTimeSlots: timeSlots,
        availableDates: availableDates,
        onDateSelect: handleDateSelect,
        onSubmit: handleSubmit
      }}
    />
  )
}
```

## Props

### ContactSection Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `infoPanelProps` | `Object` | `{}` | Props for ContactInfoPanel component |
| `formProps` | `Object` | `{}` | Props for AppointmentForm component |
| `className` | `string` | `""` | Additional CSS classes |

### ContactInfoPanel Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | `"Premium Experience"` | Panel title |
| `description` | `string` | `"Relax..."` | Panel description |
| `address` | `Object` | `{}` | Address object with title, line1, line2 |
| `contact` | `Object` | `{}` | Contact object with title, phone, email |
| `backgroundImage` | `string` | `""` | Background image URL |
| `showSecurityBadge` | `boolean` | `true` | Show security badge |

### AppointmentForm Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialData` | `Object` | `{}` | Initial form data |
| `onSubmit` | `function` | `undefined` | Form submission handler |
| `isLoading` | `boolean` | `false` | Loading state |
| `availableTimeSlots` | `Array` | `[]` | Available time slots |
| `unavailableTimeSlots` | `Array` | `[]` | Unavailable time slots |
| `availableDates` | `Array` | `[]` | Available dates (Date objects) |
| `unavailableDates` | `Array` | `[]` | Unavailable dates (Date objects) |
| `onDateSelect` | `function` | `undefined` | Callback when date is selected |

## Form Data Structure

```javascript
{
  fullName: string,      // Required
  phone: string,         // Required
  selectedDate: Date,     // Required
  selectedTime: string,  // Required
  notes: string          // Optional
}
```

## API Endpoints Expected

### POST `/api/v1/appointments`

Request body:
```json
{
  "full_name": "John Doe",
  "phone": "(555) 000-0000",
  "appointment_date": "2024-10-15",
  "appointment_time": "10:00 AM",
  "notes": "Optional notes",
  "service_id": 1,
  "barber_id": 2
}
```

### GET `/api/v1/appointments/time-slots?date=2024-10-15`

Response:
```json
{
  "available": ["09:00 AM", "09:30 AM", "10:00 AM"],
  "unavailable": ["11:00 AM", "12:00 PM"]
}
```

### GET `/api/v1/appointments/available-dates?days=30`

Response:
```json
{
  "available": ["2024-10-15", "2024-10-16"],
  "unavailable": ["2024-10-14"]
}
```

### GET `/api/v1/appointments/contact-info`

Response:
```json
{
  "title": "Premium Experience",
  "description": "Relax in our modern studio...",
  "address": {
    "title": "Our Studio",
    "line1": "123 Fashion Ave, Suite 101",
    "line2": "New York, NY 10012"
  },
  "contact": {
    "title": "Contact Us",
    "phone": "+1 (555) 000-0000",
    "email": "hello@luxecuts.com"
  }
}
```

## Component Structure

- **ContactSection** - Main container component
- **ContactInfoPanel** - Left side info panel (desktop only)
- **AppointmentForm** - Main form component
- **FormSection** - Section wrapper with step numbers
- **FormInput** - Input field component
- **CalendarPicker** - Calendar date picker
- **TimeSlotSelector** - Time slot selection buttons

## Navigation Integration

All "Book Now" buttons throughout the website should navigate to `/contact`:

```jsx
import { useNavigate } from 'react-router-dom'

const navigate = useNavigate()

// Navigate to contact page
navigate('/contact')

// Navigate with pre-filled data
navigate('/contact', {
  state: {
    formData: {
      serviceId: 1,
      serviceName: "The Classic Cut"
    }
  }
})
```

