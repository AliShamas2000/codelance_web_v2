import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import CodelanceHeader from '../../components/CodelanceHeader/CodelanceHeader'
import CodelanceHero from '../../components/CodelanceHero/CodelanceHero'
import CodelanceAbout from '../../components/CodelanceAbout/CodelanceAbout'
import CodelanceServicesHeader from '../../components/CodelanceServicesHeader/CodelanceServicesHeader'
import CodelanceServicesGrid from '../../components/CodelanceServicesGrid/CodelanceServicesGrid'
import CodelanceProcessHeader from '../../components/CodelanceProcessHeader/CodelanceProcessHeader'
import CodelanceProcessTimeline from '../../components/CodelanceProcessTimeline/CodelanceProcessTimeline'
import CodelanceProcessCTA from '../../components/CodelanceProcessCTA/CodelanceProcessCTA'
import CodelancePortfolioHeader from '../../components/CodelancePortfolioHeader/CodelancePortfolioHeader'
import CodelancePortfolioFilters from '../../components/CodelancePortfolioFilters/CodelancePortfolioFilters'
import CodelancePortfolioGrid from '../../components/CodelancePortfolioGrid/CodelancePortfolioGrid'
import CodelancePortfolioCTA from '../../components/CodelancePortfolioCTA/CodelancePortfolioCTA'
import CodelanceTeamShowcase from '../../components/CodelanceTeamShowcase/CodelanceTeamShowcase'
import CodelanceReviewsHeader from '../../components/CodelanceReviewsHeader/CodelanceReviewsHeader'
import CodelanceReviewsCarousel from '../../components/CodelanceReviewsCarousel/CodelanceReviewsCarousel'
import CodelancePricingHeader from '../../components/CodelancePricingHeader/CodelancePricingHeader'
import CodelancePricingGrid from '../../components/CodelancePricingGrid/CodelancePricingGrid'
import CodelancePricingCTA from '../../components/CodelancePricingCTA/CodelancePricingCTA'
import CodelanceContactSection from '../../components/CodelanceContactSection/CodelanceContactSection'
import CodelanceFooter from '../../components/CodelanceFooter/CodelanceFooter'
import footerApi from '../../api/footer'
import aboutUsApi from '../../api/aboutUs'
import servicesApi from '../../api/services'
import barbersApi from '../../api/barbers'
import packagesApi from '../../api/packages'
import processStepsApi from '../../api/processSteps'
import projectsApi from '../../api/projects'
import reviewsApi from '../../api/reviews'
import contactSubmissionsApi from '../../api/contactSubmissions'
import aboutUsContentApi from '../../api/aboutUsContent'

const Home = () => {
  const navigate = useNavigate()
  const [footerData, setFooterData] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [projectCategories, setProjectCategories] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [packages, setPackages] = useState([])
  const [processSteps, setProcessSteps] = useState([])
  const [reviews, setReviews] = useState([])
  const [aboutUsContent, setAboutUsContent] = useState(null)
  const [activePortfolioFilter, setActivePortfolioFilter] = useState('all')
  const [isLoadingAbout, setIsLoadingAbout] = useState(true)
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [isLoadingTeam, setIsLoadingTeam] = useState(true)
  const [isLoadingPackages, setIsLoadingPackages] = useState(true)
  const [isLoadingProcessSteps, setIsLoadingProcessSteps] = useState(true)
  const [isLoadingReviews, setIsLoadingReviews] = useState(true)
  const [isLoadingAboutUsContent, setIsLoadingAboutUsContent] = useState(true)

  // Fetch footer data for dynamic content
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

  // Fetch about us data for dynamic content
  const fetchAboutData = async () => {
    try {
      setIsLoadingAbout(true)
      const response = await aboutUsApi.getPublicAboutUs()
      // Handle different response structures
      let data = null
      if (response && response.data && Array.isArray(response.data)) {
        // API returned { data: [...] }
        data = response.data
      } else if (Array.isArray(response)) {
        // API returned array directly
        data = response
      } else if (response && response.success === false && Array.isArray(response.data)) {
        // API error but returned { success: false, data: [] }
        data = response.data
      }
      
      // Format the data for the component
      if (data && Array.isArray(data) && data.length > 0) {
        // Use the first active about us entry
        const activeAbout = data.find(item => item.is_active !== false) || data[0]
        setAboutData({
          title: activeAbout.title_en || activeAbout.title || "Who We Are",
          description: activeAbout.description_en || activeAbout.description || "",
          stats: [
            { value: "150+", label: "Projects Delivered" },
            { value: "8+", label: "Years Experience" },
            { value: "< 2hr", label: "Support Response" }
          ]
        })
      } else {
        // Use default data if API returns empty or different structure
        setAboutData(null)
      }
    } catch (error) {
      console.error('Error fetching about data:', error)
      // Use default data on error
      setAboutData(null)
    } finally {
      setIsLoadingAbout(false)
    }
  }

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setIsLoadingServices(true)
      const response = await servicesApi.getPublicServices({ limit: 8 })
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
      setIsLoadingServices(false)
    }
  }

  // Fetch portfolio projects from API
  const fetchProjects = async () => {
    try {
      setIsLoadingProjects(true)
      const response = await projectsApi.getPublicProjects()
      const projectsData = response.data || response || []
      
      // Transform projects to match CodelancePortfolioCard format
      const transformedProjects = Array.isArray(projectsData)
        ? projectsData.map(project => ({
            id: project.id,
            title: project.title || '',
            imageUrl: project.image || project.imageUrl || project.image_url || null,
            imageAlt: project.title || 'Project image',
            tags: project.tags || [],
            category: project.category || project.categorySlug || null,
            // Keep original data for potential future use
            description: project.description || null,
            projectUrl: project.projectUrl || project.project_url || null,
            githubUrl: project.githubUrl || project.github_url || null,
            clientName: project.clientName || project.client_name || null,
            isFeatured: project.isFeatured || project.is_featured || false
          }))
        : []
      
      setProjects(transformedProjects)
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setIsLoadingProjects(false)
    }
  }

  // Fetch project categories for filters
  const fetchProjectCategories = async () => {
    try {
      const response = await projectsApi.getPublicCategories()
      const categoriesData = response.data || response || []
      
      // Transform categories to match filter format
      const transformedCategories = Array.isArray(categoriesData)
        ? categoriesData.map(category => ({
            id: category.slug || category.id,
            label: category.name || category.slug || 'Category'
          }))
        : []
      
      // Add "All Projects" filter at the beginning
      setProjectCategories([
        { id: 'all', label: 'All Projects' },
        ...transformedCategories
      ])
    } catch (error) {
      console.error('Error fetching project categories:', error)
      // Fallback to default filters
      setProjectCategories([
        { id: 'all', label: 'All Projects' },
        { id: 'website', label: 'Websites' },
        { id: 'mobile', label: 'Mobile Apps' },
        { id: 'pos', label: 'POS' },
        { id: 'dashboard', label: 'Dashboards' }
      ])
    }
  }

  // Fetch team members from API
  const fetchTeamMembers = async () => {
    try {
      setIsLoadingTeam(true)
      const response = await barbersApi.getBarbers({ limit: 8 })
      const membersData = response.data || response || []
      // Filter only active members if status field exists
      const activeMembers = Array.isArray(membersData) 
        ? membersData.filter(member => member.status !== 'inactive' && member.status !== 'leave')
        : []
      setTeamMembers(activeMembers)
    } catch (error) {
      console.error('Error fetching team members:', error)
      setTeamMembers([])
    } finally {
      setIsLoadingTeam(false)
    }
  }

  // Fetch packages from API
  const fetchPackages = async () => {
    try {
      setIsLoadingPackages(true)
      const response = await packagesApi.getPublicPackages({ limit: 6 })
      const packagesData = response.data || response || []
      // Transform packages to match CodelancePricingCard format
      const transformedPackages = Array.isArray(packagesData)
        ? packagesData.map(pkg => {
            // Format price - extract currency symbol and format number
            const priceRaw = pkg.priceRaw || 0
            const originalPrice = pkg.originalPrice || pkg.original_price || null
            const currency = pkg.currency || 'USD'
            const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : currency + ' '
            const formattedPrice = priceRaw >= 1000 
              ? `${currencySymbol}${priceRaw.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
              : `${currencySymbol}${priceRaw.toFixed(2)}`
            
            // Format original price if it exists and is greater than current price
            let formattedOriginalPrice = null
            let originalPriceNumeric = null
            if (originalPrice && originalPrice > priceRaw) {
              originalPriceNumeric = originalPrice
              formattedOriginalPrice = originalPrice >= 1000
                ? `${currencySymbol}${originalPrice.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
                : `${currencySymbol}${originalPrice.toFixed(2)}`
            }
            
            return {
              id: pkg.id,
              name: pkg.name,
              price: formattedPrice,
              originalPrice: originalPriceNumeric, // Pass numeric value for calculation
              originalPriceFormatted: formattedOriginalPrice, // Pass formatted string for display
              pricePeriod: pkg.pricePeriod || pkg.period || '/month',
              description: pkg.description || '',
              features: pkg.features || [],
              badge: pkg.badge || null,
              isHighlighted: pkg.isHighlighted || pkg.isFeatured || pkg.is_featured || false,
              buttonText: 'Get Started'
            }
          })
        : []
      setPackages(transformedPackages)
    } catch (error) {
      console.error('Error fetching packages:', error)
      setPackages([])
    } finally {
      setIsLoadingPackages(false)
    }
  }

  // Fetch process steps from API
  const fetchProcessSteps = async () => {
    try {
      setIsLoadingProcessSteps(true)
      const response = await processStepsApi.getPublicProcessSteps()
      const stepsData = response.data || response || []
      // Transform steps to match CodelanceProcessTimeline format
      const transformedSteps = Array.isArray(stepsData)
        ? stepsData.map((step, index) => ({
            stepNumber: step.stepNumber || step.step_number || String(index + 1).padStart(2, '0'),
            title: step.title || '',
            description: step.description || '',
            icon: step.icon || 'code',
            position: step.position || (index % 2 === 0 ? 'left' : 'right')
          }))
        : []
      setProcessSteps(transformedSteps)
    } catch (error) {
      console.error('Error fetching process steps:', error)
      setProcessSteps([])
    } finally {
      setIsLoadingProcessSteps(false)
    }
  }

  // Fetch reviews from API
  const fetchReviews = async () => {
    try {
      setIsLoadingReviews(true)
      const response = await reviewsApi.getPublicReviews()
      const reviewsData = response.data || response || []
      
      // Transform reviews to match CodelanceReviewsCarousel format
      const transformedReviews = Array.isArray(reviewsData)
        ? reviewsData.map(review => ({
            id: review.id,
            quote: review.quote || '',
            authorName: review.authorName || review.author_name || '',
            authorTitle: review.authorTitle || review.author_title || null,
            authorCompany: review.authorCompany || review.author_company || null,
            authorImage: review.authorImage || review.author_image || null
          }))
        : []
      
      setReviews(transformedReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    } finally {
      setIsLoadingReviews(false)
    }
  }

  // Fetch about us content from API
  const fetchAboutUsContent = async () => {
    try {
      setIsLoadingAboutUsContent(true)
      const response = await aboutUsContentApi.getPublicContent()
      const contentData = response.data || response || null
      
      if (contentData) {
        setAboutUsContent({
          title: contentData.title || 'Who We Are',
          description: contentData.description || '',
          stats: Array.isArray(contentData.stats) ? contentData.stats : [],
          primaryButtonText: contentData.primaryButtonText || contentData.primary_button_text || 'Our Mission',
          secondaryButtonText: contentData.secondaryButtonText || contentData.secondary_button_text || 'View Team',
          codeSnippet: contentData.codeSnippet || contentData.code_snippet || {
            mission: 'Excellence',
            stack: ['AI', 'Cloud'],
            deliver: true
          }
        })
      }
    } catch (error) {
      console.error('Error fetching about us content:', error)
      setAboutUsContent(null)
    } finally {
      setIsLoadingAboutUsContent(false)
    }
  }

  // Handle contact form submission
  const handleContactSubmit = useCallback(async (formData) => {
    try {
      await contactSubmissionsApi.submitContactForm({
        name: formData.name,
        email: formData.email,
        project_id: formData.project_id ? parseInt(formData.project_id) : null,
        message: formData.message
      })
      // Success is handled by the form component's SuccessModal
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to send message. Please try again.'
      alert(errorMessage)
      throw error
    }
  }, [])

  useEffect(() => {
    fetchFooterData()
    fetchAboutData()
    fetchServices()
    fetchProjects()
    fetchProjectCategories()
    fetchTeamMembers()
    fetchPackages()
    fetchProcessSteps()
    fetchReviews()
    fetchAboutUsContent()
  }, [])

  // Navigation items - can be fetched from backend later
  const navigationItems = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ]

  // Helper function to scroll to contact section
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact')
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Fallback: navigate to contact page if section not found
      navigate('/contact')
    }
  }

  const handleGetStarted = () => {
    scrollToContact()
  }

  const handleStartProject = () => {
    scrollToContact()
  }

  const handleSeeWork = () => {
    // Scroll to portfolio section on home page
    const portfolioSection = document.getElementById('portfolio')
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      // Fallback: navigate to home with hash
      navigate('/#portfolio')
    }
  }

  // Handle service click
  const handleServiceClick = (service) => {
    scrollToContact()
    // Note: Service data could be stored in state or URL params if needed for form pre-fill
  }

  // Handle portfolio filter change
  const handlePortfolioFilterChange = (filterId) => {
    setActivePortfolioFilter(filterId)
  }

  // Handle project click
  const handleProjectClick = (project) => {
    // Navigate to portfolio section (detail pages can be added later)
    // For now, scroll to portfolio section
    const portfolioSection = document.getElementById('portfolio')
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#portfolio')
    }
  }

  // Handle team member click
  const handleTeamMemberClick = (member) => {
    // Navigate to team section (detail pages can be added later)
    // For now, scroll to team section
    const teamSection = document.getElementById('team')
    if (teamSection) {
      teamSection.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/#team')
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-navy-deep dark:text-white transition-colors duration-300 overflow-x-hidden min-h-screen flex flex-col">
      <CodelanceHeader
        logoUrl={footerData?.logo || footerData?.logo_url || null}
        brandName="CODELANCE"
        navigationItems={navigationItems}
        userAvatar={null} // Can be fetched from user context later
        onGetStartedClick={handleGetStarted}
        showGetStarted={true}
      />

      <CodelanceHero
        badge="Innovating the Digital Future"
        title="We Build Digital Experiences"
        titleHighlight="Digital"
        description="Websites, Mobile Apps, POS Systems, AI Solutions, and everything your business needs to scale in the modern era."
        primaryButtonText="Start a Project"
        primaryButtonAction={handleStartProject}
        secondaryButtonText="See Our Work"
        secondaryButtonAction={handleSeeWork}
        showIllustrations={true}
      />

      <CodelanceAbout
        title={aboutUsContent?.title || aboutData?.title || "Who We Are"}
        description={aboutUsContent?.description || aboutData?.description || "CODELANCE is a premier technology agency dedicated to sculpting the digital landscape of tomorrow. We bridge the gap between complex engineering and human-centric design, delivering high-performance solutions that empower enterprises to thrive in an ever-evolving market."}
        stats={aboutUsContent?.stats || aboutData?.stats || [
          { value: "150+", label: "Projects Delivered" },
          { value: "8+", label: "Years Experience" },
          { value: "< 2hr", label: "Support Response" }
        ]}
        primaryButtonText={aboutUsContent?.primaryButtonText || "Our Mission"}
        primaryButtonAction={() => navigate('/about')}
        secondaryButtonText={aboutUsContent?.secondaryButtonText || "View Team"}
        secondaryButtonAction={() => navigate('/team')}
        showIllustrations={true}
        codeSnippet={aboutUsContent?.codeSnippet || {
          mission: "Excellence",
          stack: ["AI", "Cloud"],
          deliver: true
        }}
      />

      {/* Services Section */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-16 lg:py-24" id="services">
        <CodelanceServicesHeader
          badge="Our Expertise"
          title="Our Services"
          description="We design and build bespoke digital solutions that empower modern enterprises to scale and innovate."
        />

        {isLoadingServices ? (
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
      </section>

      {/* Portfolio Section */}
      <section className="py-20" id="portfolio">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <CodelancePortfolioHeader
            badge="Showcase"
            title="Our Portfolio"
          />

          <CodelancePortfolioFilters
            filters={projectCategories.length > 0 ? projectCategories : [
              { id: 'all', label: 'All Projects' },
              { id: 'website', label: 'Websites' },
              { id: 'mobile', label: 'Mobile Apps' },
              { id: 'pos', label: 'POS' },
              { id: 'dashboard', label: 'Dashboards' }
            ]}
            activeFilter={activePortfolioFilter}
            onFilterChange={handlePortfolioFilterChange}
          />

          {isLoadingProjects ? (
            <div className="text-center py-12">
              <p className="text-[#5e808d] dark:text-gray-400">Loading projects...</p>
            </div>
          ) : (
            <CodelancePortfolioGrid
              projects={projects}
              activeFilter={activePortfolioFilter}
              onProjectClick={handleProjectClick}
              columns={3}
            />
          )}

          <CodelancePortfolioCTA
            title="Have a visionary project in mind?"
            subtitle="From concept to deployment, we build the digital future of your business with precision and passion."
            primaryButtonText="Get Started"
            primaryButtonAction={scrollToContact}
            secondaryButtonText="Our Process"
            secondaryButtonAction={() => {
              const processSection = document.getElementById('process')
              if (processSection) {
                processSection.scrollIntoView({ behavior: 'smooth' })
              } else {
                navigate('/#process')
              }
            }}
          />
        </div>
      </section>

      {/* Team Section */}
      {isLoadingTeam ? (
        <div className="text-center py-24">
          <p className="text-[#5e808d] dark:text-gray-400">Loading team members...</p>
        </div>
      ) : (
        <CodelanceTeamShowcase teamMembers={teamMembers} />
      )}

      {/* How We Work / Process Section */}
      <section id="process">
        <CodelanceProcessHeader
          badge="Our Methodology"
          title="How We Work"
          description="We follow a structured, transparent process to turn your complex ideas into high-performance digital realities."
        />

        {isLoadingProcessSteps ? (
          <div className="text-center py-12">
            <p className="text-[#5e808d] dark:text-gray-400">Loading process steps...</p>
          </div>
        ) : (
          <CodelanceProcessTimeline
            steps={processSteps} // Fetched from backend
          />
        )}

        <CodelanceProcessCTA
          title="Ready to build something amazing?"
          subtitle="Join dozens of successful companies scaling with our proven process."
          primaryButtonText="Contact Us Today"
          primaryButtonAction={scrollToContact}
          secondaryButtonText="View Portfolio"
          secondaryButtonAction={() => {
            const portfolioSection = document.getElementById('portfolio')
            if (portfolioSection) {
              portfolioSection.scrollIntoView({ behavior: 'smooth' })
            } else {
              navigate('/#portfolio')
            }
          }}
        />
      </section>

      {/* Reviews / Testimonials Section */}
      <section className="py-16 overflow-hidden bg-background-light dark:bg-background-dark" id="reviews">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <CodelanceReviewsHeader
            title="Client Success Stories"
            description="Hear from the innovative teams we've partnered with to build the future of digital infrastructure."
          />

          {isLoadingReviews ? (
            <div className="text-center py-12">
              <p className="text-[#5e808d] dark:text-gray-400">Loading reviews...</p>
            </div>
          ) : (
            <CodelanceReviewsCarousel
              reviews={reviews} // Fetched from backend
              autoPlay={true}
              autoPlayInterval={5000}
            />
          )}
        </div>
      </section>

      {/* Pricing / Packages Section */}
      <section className="bg-background-light dark:bg-background-dark" id="packages">
        <CodelancePricingHeader
          title="Pricing Packages"
          description="Choose the perfect plan for your technical needs. Our flexible packages are designed to scale with your business and deliver premium GSAP-powered experiences."
        />

        <section className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12">
          {isLoadingPackages ? (
            <div className="text-center py-12">
              <p className="text-[#5e808d] dark:text-gray-400">Loading packages...</p>
            </div>
          ) : (
            <CodelancePricingGrid
              packages={packages}
              onPackageSelect={(pkg) => {
                scrollToContact()
                // Note: Package data could be stored in state or URL params if needed for form pre-fill
              }}
              columns={3}
            />
          )}
        </section>

        <CodelancePricingCTA
          title="Need a custom solution?"
          description="Our team can build a tailor-made package specifically for your enterprise requirements, including specialized integrations and dedicated server architecture."
          primaryButtonText="Schedule a Call"
          primaryButtonAction={scrollToContact}
          secondaryButtonText="View Full Services"
          secondaryButtonAction={() => {
            const servicesSection = document.getElementById('services')
            if (servicesSection) {
              servicesSection.scrollIntoView({ behavior: 'smooth' })
            } else {
              navigate('/services')
            }
          }}
        />
      </section>

      {/* Contact Section */}
      <CodelanceContactSection
        title="Let's Build"
        titleHighlight="Something Great"
        description="Have a vision for the next big thing? Our team of experts is ready to transform your ideas into world-class digital solutions."
        projects={projects}
        onSubmit={handleContactSubmit}
        contactItems={[
          {
            type: 'email',
            label: 'Email',
            value: 'info@codelancelb.com',
            icon: 'mail'
          },
          {
            type: 'phone',
            label: 'Phone',
            value: '+96176505353',
            icon: 'call'
          },
          {
            type: 'phone',
            label: 'Phone',
            value: '+9613122606',
            icon: 'call'
          }
        ]}
      />

      <CodelanceFooter
        logoUrl={footerData?.logo || footerData?.logo_url || null}
        brandName="CODELANCE"
        description="Empowering businesses through cutting-edge digital solutions and innovative engineering."
        quickLinks={[
          { label: "Home", href: "/" },
          { label: "Services", href: "#services" },
          { label: "Portfolio", href: "#portfolio" },
          { label: "Packages", href: "#packages" },
          { label: "Contact", href: "#contact" }
        ]}
        serviceLinks={[
          { label: "Web Development", href: "#services" },
          { label: "Mobile Apps", href: "#services" },
          { label: "AI Solutions", href: "#services" },
          { label: "Cloud Infrastructure", href: "#services" }
        ]}
        legalLinks={[
          { label: "Privacy Policy", href: "#privacy" },
          { label: "Terms of Service", href: "#terms" },
          { label: "Cookies Settings", href: "#cookies" }
        ]}
        copyright={`© ${new Date().getFullYear()} CODELANCE. All rights reserved.`}
        onNewsletterSubmit={null} // Frontend-only for now
      />
    </div>
  )
}

export default Home
