import React from 'react'
import AppRouter from './router/AppRouter'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <div className="bg-background-light dark:bg-background-dark font-display antialiased text-slate-900 dark:text-white transition-colors duration-300">
        <AppRouter />
      </div>
    </ErrorBoundary>
  )
}

export default App
