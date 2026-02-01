import React from 'react'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'

const Layout = ({
  children,
  headerProps = {},
  footerProps = {},
  onNewsletterSubmit,
  className = ""
}) => {
  return (
    <div className={`relative w-full min-h-screen flex flex-col ${className}`}>
      <Header {...headerProps} />
      <main className="flex-grow w-full max-w-[1440px] mx-auto px-6 lg:px-10">
        {children}
      </main>
      <Footer {...footerProps} onNewsletterSubmit={onNewsletterSubmit} />
    </div>
  )
}

export default Layout

