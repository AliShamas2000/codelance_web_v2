import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import Layout from '../components/Layout/Layout'
import Home from '../pages/Home/Home'
import GalleryPage from '../pages/Gallery/Gallery'
import AboutPage from '../pages/About/About'
import ServicesPage from '../pages/Services/Services'
import PricingPage from '../pages/Pricing/Pricing'
import ContactPage from '../pages/Contact/Contact'
import LoginPage from '../pages/Admin/Login/Login'
import UserLogin from '../pages/User/Login/Login'
import ForgotPassword from '../pages/User/ForgotPassword/ForgotPassword'
import OTP from '../pages/User/OTP/OTP'
import ResetPassword from '../pages/User/ResetPassword/ResetPassword'
import Register from '../pages/User/Register/Register'
import UserProfile from '../pages/User/Profile/Profile'
import Dashboard from '../pages/Admin/Dashboard/Dashboard'
import AppointmentsPage from '../pages/Admin/Appointments/Appointments'
import Team from '../pages/Admin/Team/Team'
import Services from '../pages/Admin/Services/Services'
import Gallery from '../pages/Admin/Gallery/Gallery'
import Banners from '../pages/Admin/Banners/Banners'
import InformativeSections from '../pages/Admin/InformativeSections/InformativeSections'
import Footer from '../pages/Admin/Footer/Footer'
import AboutUs from '../pages/Admin/AboutUs/AboutUs'
import Settings from '../pages/Admin/Settings/Settings'
import BarberDashboard from '../pages/Barber/Dashboard/BarberDashboard'
import BarberAppointments from '../pages/Barber/Appointments/Appointments'
import BarberSchedule from '../pages/Barber/Schedule/Schedule'
import BarberClients from '../pages/Barber/Clients/Clients'
import BarberHistory from '../pages/Barber/History/History'
import BarberReviews from '../pages/Barber/Reviews/Reviews'
import BarberAvailability from '../pages/Barber/Availability/Availability'
import BarberSettings from '../pages/Barber/Settings/Settings'
import BarberProfile from '../pages/Barber/Profile/Profile'
import BarberLayout from '../components/BarberLayout/BarberLayout'
import { BarberUserProvider } from '../contexts/BarberUserContext'
import AdminLayout from '../components/AdminLayout/AdminLayout'
import { AdminUserProvider } from '../contexts/AdminUserContext'
import ReviewPage from '../pages/Review/Review'
import Test from '../pages/Test/Test'
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute'
import footerApi from '../api/footer'

const AppRouter = () => {
  const [footerData, setFooterData] = useState(null)

  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ]

  // Fetch footer data on mount
  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const response = await footerApi.getPublicFooterData()
        const data = response.data || response
        setFooterData(data)
      } catch (error) {
        console.error('Error fetching footer data:', error)
        setFooterData(null)
      }
    }
    fetchFooterData()
  }, [])

  // Handle newsletter subscription
  const handleNewsletterSubmit = async (email) => {
    try {
      await footerApi.subscribeNewsletter(email)
      // You can add a success notification here
      console.log('Newsletter subscription successful')
    } catch (error) {
      console.error('Newsletter subscription failed:', error)
      throw error // Re-throw to let FooterContact handle it
    }
  }

  // Format footer data for Footer component props
  const footerProps = footerData ? formatFooterData(footerData) : getDefaultFooterData()
  
  // Format header props from footer data
  const getHeaderProps = () => ({
    logoHref: "/",
    logoUrl: footerData?.logo || footerData?.logo_url || null,
    navigationItems: navigationItems,
    phone: footerData?.phone || "(555) 123-4567"
  })

  return (
    <BrowserRouter>
      <Routes>
        {/* Default/Home Route - Uses its own header and footer */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Gallery Route */}
        <Route
          path="/gallery"
          element={
            <Layout
              headerProps={getHeaderProps()}
              footerProps={footerProps}
              onNewsletterSubmit={handleNewsletterSubmit}
            >
              <GalleryPage />
            </Layout>
          }
        />

        {/* About Route */}
        <Route
          path="/about"
          element={
            <Layout
              headerProps={getHeaderProps()}
              footerProps={footerProps}
              onNewsletterSubmit={handleNewsletterSubmit}
            >
              <AboutPage />
            </Layout>
          }
        />


        {/* Services Route - Uses its own header and footer */}
        <Route
          path="/services"
          element={<ServicesPage />}
        />

        {/* Pricing Route */}
        <Route
          path="/pricing"
          element={
            <Layout
              headerProps={getHeaderProps()}
              footerProps={footerProps}
              onNewsletterSubmit={handleNewsletterSubmit}
            >
              <PricingPage />
            </Layout>
          }
        />

        {/* Contact/Appointment Route */}
        <Route
          path="/contact"
          element={
            <Layout
              headerProps={getHeaderProps()}
              footerProps={footerProps}
              onNewsletterSubmit={handleNewsletterSubmit}
            >
              <ContactPage />
            </Layout>
          }
        />

        {/* Review Route (Public - No Layout) */}
        <Route
          path="/review/:appointmentId?"
          element={<ReviewPage />}
        />

        {/* Test Route (Public - No Layout) */}
        <Route
          path="/test"
          element={<Test />}
        />

        {/* User Login Route */}
        <Route
          path="/login"
          element={<UserLogin />}
        />

        {/* User Register Route */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* User Signup Route (alias) */}
        <Route
          path="/signup"
          element={<Register />}
        />

        {/* Forgot Password Route */}
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        {/* OTP Verification Route */}
        <Route
          path="/otp"
          element={<OTP />}
        />

        {/* Reset Password Route */}
        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />

        {/* User Profile Route - Protected for clients */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute requiredRole="client" redirectTo="/login">
              <Layout
                headerProps={getHeaderProps()}
                footerProps={footerProps}
                onNewsletterSubmit={handleNewsletterSubmit}
              >
                <UserProfile />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* Admin Login Route */}
        <Route
          path="/admin/login"
          element={<LoginPage />}
        />

        {/* Admin Routes - Wrapped in shared layout with context */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminUserProvider>
                <AdminLayout>
                  <Outlet />
                </AdminLayout>
              </AdminUserProvider>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="team" element={<Team />} />
          <Route path="services" element={<Services />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="banners" element={<Banners />} />
          <Route path="informative-sections" element={<InformativeSections />} />
          <Route path="footer" element={<Footer />} />
          <Route path="about-us" element={<AboutUs />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Barber Routes - Wrapped in shared layout with context */}
        <Route
          path="/barber"
          element={
            <ProtectedRoute requiredRole="barber" redirectTo="/admin/login">
              <BarberUserProvider>
                <BarberLayout>
                  <Outlet />
                </BarberLayout>
              </BarberUserProvider>
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<BarberDashboard />} />
          <Route path="appointments" element={<BarberAppointments />} />
          <Route path="schedule" element={<BarberSchedule />} />
          <Route path="clients" element={<BarberClients />} />
          <Route path="history" element={<BarberHistory />} />
          <Route path="reviews" element={<BarberReviews />} />
          <Route path="availability" element={<BarberAvailability />} />
          <Route path="settings" element={<BarberSettings />} />
          <Route path="profile" element={<BarberProfile />} />
        </Route>

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// Format footer data from API to match Footer component props
const formatFooterData = (data) => {
  if (!data) return getDefaultFooterData()
  
  // Get first footer link column or use empty array
  const firstFooterColumn = data.footerLinks && data.footerLinks.length > 0 
    ? data.footerLinks[0] 
    : { title: 'Explore', links: [] }
  
  return {
    brandProps: {
      logoIcon: (data.logo || data.logo_url) ? null : "content_cut", // Use icon if no logo
      logoUrl: data.logo || data.logo_url || null,
      brandName: "Barber Studio", // Can be made configurable later
      description: data.aboutEn || data.about_en || data.about || '',
      socialLinks: data.socialLinks || data.social_links || [],
    },
    linksProps: {
      title: firstFooterColumn.title || 'Explore',
      links: firstFooterColumn.links || [],
    },
    hoursProps: {
      title: "Working Hours",
      hours: data.workingHours || data.working_hours || [],
    },
    contactProps: {
      title: "Get in Touch",
      address: data.address || '',
      phone: data.phone || '',
      email: data.email || '',
      showNewsletter: true,
    },
    bottomProps: {
      copyright: `© ${new Date().getFullYear()} Barber Studio. All rights reserved.`,
      legalLinks: [], // Can be added to database later
    },
    // Additional data for LocationSection
    mapEmbed: data.mapEmbed || data.map_embed || null,
    locationData: {
      address: data.address || '',
      phone: data.phone || '',
      email: data.email || '',
      workingHours: data.workingHours || data.working_hours || [],
    },
  }
}

// Default footer data (fallback when API is not available)
const getDefaultFooterData = () => ({
  brandProps: {
    logoIcon: "content_cut",
    brandName: "Barber Studio",
    description: "Premium cuts for the modern gentleman. We combine traditional techniques with modern style to give you the best look.",
    socialLinks: [
      { icon: "public", href: "#", label: "Website" },
      { icon: "thumb_up", href: "#", label: "Facebook" },
      { icon: "share", href: "#", label: "Share" },
    ],
  },
  linksProps: {
    title: "Explore",
    links: [
      { label: "Services Menu", href: "#services", icon: "chevron_right" },
      { label: "Gallery", href: "/gallery", icon: "chevron_right" },
      { label: "Careers", href: "#careers", icon: "chevron_right" },
    ],
  },
  hoursProps: {
    title: "Working Hours",
    hours: [
      { day: "Mon - Fri", time: "9:00 AM - 8:00 PM", isClosed: false },
      { day: "Saturday", time: "10:00 AM - 6:00 PM", isClosed: false },
      { day: "Sunday", time: "Closed", isClosed: true },
    ],
  },
  contactProps: {
    title: "Get in Touch",
    address: "123 Blade Street, Soho\nNew York, NY 10012",
    phone: "(555) 123-4567",
    email: "hello@barberstudio.com",
    showNewsletter: true,
  },
  bottomProps: {
    copyright: "© 2024 Barber Studio. All rights reserved.",
    legalLinks: [
      { label: "Privacy Policy", href: "#privacy" },
      { label: "Terms of Service", href: "#terms" },
      { label: "Cookies", href: "#cookies" },
    ],
  },
})

export default AppRouter

