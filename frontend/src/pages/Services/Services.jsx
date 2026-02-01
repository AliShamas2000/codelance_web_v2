import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import CodelanceHeader from '../../components/CodelanceHeader/CodelanceHeader'
import CodelanceServicesHeader from '../../components/CodelanceServicesHeader/CodelanceServicesHeader'
import CodelanceServicesGrid from '../../components/CodelanceServicesGrid/CodelanceServicesGrid'
import CodelanceServicesCTA from '../../components/CodelanceServicesCTA/CodelanceServicesCTA'
import CodelanceFooter from '../../components/CodelanceFooter/CodelanceFooter'
import servicesApi from '../../api/services'
import footerApi from '../../api/footer'

const Services = () => {
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [footerData, setFooterData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingFooter, setIsLoadingFooter] = useState(true)

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setIsLoading(true)
      const response = await servicesApi.getPublicServices()
      const servicesData = response.data || response || []
      // Filter only active services
      const activeServices = Array.isArray(servicesData) 
        ? servicesData.filter(service => service.isActive !== false && service.is_active !== false)
        : []
      setServices(activeServices)
    } catch (error) {
      console.error('Error fetching services:', error)
      setServices([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch footer data
  const fetchFooterData = async () => {
    try {
      setIsLoadingFooter(true)
      const response = await footerApi.getPublicFooterData()
      const data = response.data || response
      setFooterData(data)
    } catch (error) {
      console.error('Error fetching footer data:', error)
      setFooterData(null)
    } finally {
      setIsLoadingFooter(false)
    }
  }

  useEffect(() => {
    fetchServices()
    fetchFooterData()
  }, [])

  // Navigation items
  const navigationItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ]

  // Handle service click
  const handleServiceClick = (service) => {
    navigate('/contact', {
      state: {
        formData: {
          serviceId: service.id,
          serviceName: service.title || service.nameEn || service.name_en
        }
      }
    })
  }

  const handleGetStarted = () => {
    navigate('/contact')
  }

  const handleStartProject = () => {
    navigate('/contact')
  }

  const handleContactUs = () => {
    navigate('/contact')
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-navy-deep dark:text-white transition-colors duration-300 overflow-x-hidden min-h-screen flex flex-col">
      <CodelanceHeader
        logoUrl={footerData?.logo || footerData?.logo_url || null}
        brandName="CODELANCE"
        navigationItems={navigationItems}
        userAvatar={null}
        onGetStartedClick={handleGetStarted}
        showGetStarted={true}
      />

      <main className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-24 flex-1">
        <CodelanceServicesHeader
          badge="Our Expertise"
          title="Our Services"
          description="We design and build bespoke digital solutions that empower modern enterprises to scale and innovate."
        />

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#5e808d] dark:text-gray-400">Loading services...</p>
          </div>
        ) : (
          <CodelanceServicesGrid
            services={services}
            onServiceClick={handleServiceClick}
            columns={4}
          />
        )}

        <CodelanceServicesCTA
          title="Ready to transform your digital presence?"
          subtitle="Let's build something amazing together."
          primaryButtonText="Start a Project"
          primaryButtonAction={handleStartProject}
          secondaryButtonText="Contact Us"
          secondaryButtonAction={handleContactUs}
        />
      </main>

      <CodelanceFooter
        logoUrl={footerData?.logo || footerData?.logo_url || null}
        brandName="CODELANCE"
        legalLinks={[
          { label: "Privacy Policy", href: "#privacy" },
          { label: "Terms of Service", href: "#terms" },
          { label: "Cookie Policy", href: "#cookies" }
        ]}
        copyright={`© ${new Date().getFullYear()} CODELANCE INC. ALL RIGHTS RESERVED.`}
      />
    </div>
  )
}

export default Services
