# Footer Component

A comprehensive, reusable footer component with multiple sections, prepared for backend integration.

## Features

- ✅ 4-column responsive layout
- ✅ Brand section with logo, description, and social links
- ✅ Quick links navigation
- ✅ Working hours display
- ✅ Contact information
- ✅ Newsletter subscription form
- ✅ Legal links and copyright
- ✅ API-ready with fallback data
- ✅ Dark mode support

## Component Structure

```
Footer (Main)
├── FooterBrand (Column 1)
│   ├── Logo & Brand Name
│   ├── Description
│   └── Social Icons
├── FooterLinks (Column 2)
│   └── Navigation Links
├── FooterHours (Column 3)
│   └── Working Hours List
├── FooterContact (Column 4)
│   ├── Contact Info
│   └── Newsletter Form
└── FooterBottom
    ├── Copyright
    └── Legal Links
```

## Usage

The Footer is automatically included in the Layout component and will fetch data from the API. It works with or without API data (falls back to defaults).

## Props Structure

```javascript
{
  brandProps: {
    logoIcon: "content_cut",
    brandName: "Barber Studio",
    description: "...",
    socialLinks: [
      { icon: "public", href: "#", label: "Website" }
    ]
  },
  linksProps: {
    title: "Explore",
    links: [
      { label: "Services Menu", href: "#services", icon: "chevron_right" }
    ]
  },
  hoursProps: {
    title: "Working Hours",
    hours: [
      { day: "Mon - Fri", time: "9:00 AM - 8:00 PM", isClosed: false }
    ]
  },
  contactProps: {
    title: "Get in Touch",
    address: "123 Blade Street...",
    phone: "(555) 123-4567",
    email: "hello@barberstudio.com",
    showNewsletter: true
  },
  bottomProps: {
    copyright: "© 2024 Barber Studio...",
    legalLinks: [
      { label: "Privacy Policy", href: "#privacy" }
    ]
  }
}
```

## API Endpoints Expected

### GET `/api/v1/footer`

Response:
```json
{
  "data": {
    "brand_props": {
      "logo_icon": "content_cut",
      "brand_name": "Barber Studio",
      "description": "...",
      "social_links": [
        {
          "icon": "public",
          "href": "#",
          "label": "Website"
        }
      ]
    },
    "links_props": {
      "title": "Explore",
      "links": [
        {
          "label": "Services Menu",
          "href": "#services",
          "icon": "chevron_right"
        }
      ]
    },
    "hours_props": {
      "title": "Working Hours",
      "hours": [
        {
          "day": "Mon - Fri",
          "time": "9:00 AM - 8:00 PM",
          "is_closed": false
        }
      ]
    },
    "contact_props": {
      "title": "Get in Touch",
      "address": "123 Blade Street...",
      "phone": "(555) 123-4567",
      "email": "hello@barberstudio.com",
      "show_newsletter": true
    },
    "bottom_props": {
      "copyright": "© 2024 Barber Studio...",
      "legal_links": [
        {
          "label": "Privacy Policy",
          "href": "#privacy"
        }
      ]
    }
  }
}
```

### POST `/api/v1/newsletter/subscribe`

Request:
```json
{
  "email": "user@example.com"
}
```

Response:
```json
{
  "message": "Successfully subscribed",
  "success": true
}
```

## Newsletter Subscription

The newsletter form automatically handles:
- Email validation
- Loading states
- API integration
- Error handling
- Success feedback (can be extended with notifications)

