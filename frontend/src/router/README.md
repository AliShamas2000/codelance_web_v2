# Router Configuration

This directory contains the routing configuration for the React application.

## Files

- **AppRouter.jsx** - Main router component with all route definitions
- **routes.js** - Centralized route constants and navigation items

## Current Routes

- `/` - Home page (default route)
- `*` - Catch-all route that redirects to home

## Adding New Routes

To add a new route:

1. Create a new page component in `src/pages/`
2. Import it in `AppRouter.jsx`
3. Add a new `<Route>` element:

```jsx
<Route
  path="/new-page"
  element={
    <Layout {...layoutProps}>
      <NewPage />
    </Layout>
  }
/>
```

4. Add the route constant to `routes.js` if needed
5. Update navigation items in `routes.js` or pass them as props to Layout

## Navigation

Navigation items support both:
- **React Router links** (e.g., `/about`) - Uses `<Link>` component
- **Hash links** (e.g., `#about`) - Uses regular `<a>` tags for anchor navigation

