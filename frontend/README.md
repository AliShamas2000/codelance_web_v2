# Codelance - Frontend

Professional React + Vite frontend for the Codelance website.

## 🚀 Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Material Symbols** - Icon library

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable components
│   │   ├── Header/
│   │   ├── Logo/
│   │   ├── Navigation/
│   │   ├── PhoneCTA/
│   │   ├── MobileMenuToggle/
│   │   ├── HeroSection/
│   │   ├── ServiceCard/
│   │   ├── ServicesGrid/
│   │   ├── Footer/
│   │   └── Layout/
│   ├── pages/              # Page components
│   │   └── Home/
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🎨 Components

All components are designed to be:
- **Reusable** - Accept props for customization
- **Responsive** - Mobile-first design
- **Accessible** - Proper ARIA labels and semantic HTML
- **Themeable** - Dark mode support built-in

### Available Components

1. **Logo** - Brand logo with icon
2. **Navigation** - Desktop navigation menu
3. **PhoneCTA** - Phone call-to-action button
4. **MobileMenuToggle** - Mobile menu toggle button
5. **Header** - Complete header with all navigation elements
6. **HeroSection** - Hero banner with image and CTA
7. **ServiceCard** - Individual service card
8. **ServicesGrid** - Grid layout for services
9. **Footer** - Site footer
10. **Layout** - Main layout wrapper

## 🛠️ Installation

```bash
cd frontend
npm install
```

## 🚀 Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## 📦 Build

```bash
npm run build
```

## 🎯 Usage Example

```jsx
import Layout from './components/Layout/Layout'
import HeroSection from './components/HeroSection/HeroSection'
import ServicesGrid from './components/ServicesGrid/ServicesGrid'

function App() {
  return (
    <Layout
      headerProps={{
        phone: "(555) 123-4567",
        navigationItems: [
          { label: "Home", href: "#" },
          { label: "Services", href: "#" }
        ]
      }}
    >
      <HeroSection 
        title="Welcome"
        buttonText="Book Now"
      />
      <ServicesGrid />
    </Layout>
  )
}
```

## 🎨 Customization

### Tailwind Config

Custom colors and theme settings are in `tailwind.config.js`:

- Primary color: `#11d493`
- Background light: `#f6f8f7`
- Background dark: `#10221c`

### Dark Mode

Dark mode is controlled by the `dark` class on the root HTML element. Toggle it by adding/removing the class.

## 📝 Notes

- All components follow React best practices
- Components are fully typed with PropTypes (can be added)
- Mobile-first responsive design
- Smooth animations and transitions
- Custom scrollbar styling

