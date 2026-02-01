import React, { useState, useEffect } from 'react'
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
import CodelanceTeamHeader from '../../components/CodelanceTeamHeader/CodelanceTeamHeader'
import CodelanceTeamGrid from '../../components/CodelanceTeamGrid/CodelanceTeamGrid'
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

const Home = () => {
  const navigate = useNavigate()
  const [footerData, setFooterData] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [activePortfolioFilter, setActivePortfolioFilter] = useState('all')
  const [isLoadingAbout, setIsLoadingAbout] = useState(true)
  const [isLoadingServices, setIsLoadingServices] = useState(true)
  const [isLoadingProjects, setIsLoadingProjects] = useState(true)
  const [isLoadingTeam, setIsLoadingTeam] = useState(true)

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
      // TODO: Replace with actual portfolio API endpoint
      // const response = await portfolioApi.getPublicProjects({ limit: 6 })
      // const projectsData = response.data || response || []
      // setProjects(projectsData)
      
      // Temporary default projects for demonstration
      setProjects([
        {
          id: 1,
          title: "NeoBank Ecosystem",
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAzpe-WmUGXz34p9osFvUtRThVZYCfDkTBejyZZOsDfPHHGvz-LvkVFVaD28iJin-x2T-v6ItXgXg2dWlHZstmIOA-xHEJkVkPyS1AirYXiMs_5ubRPPIuHKSxUcXTUldVjIj5KsFObMRMVoZ_WE5eo3FNWdFEgBDtNrjyL0SQBaK9UIyEbIjSa3ZhbxrwepkQFdfbTClrpR7SFMqELkDNFDOlGiZZ4qJ_Dji8QAZE2Sio_zftqCP6x0ptdlQYjP5zspgEQ2NUrIwE",
          tags: ["Next.js", "Fintech", "UI/UX"],
          category: "website"
        },
        {
          id: 2,
          title: "LuxeDelivery Mobile",
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAYd3zHyXLteCvn-pZH6i04sm0beI-Xrl4T4Wn1ShJlHsyFfHBZMXzrXBBni76AWOtuo1bDH8BtSzKVBH6NukK55_HvGQpEvjn6SRJBmc3h5aYxglnoUyKSaOKChorEuNpLl2xiXbRbvRaO3hNLFSZoBSmeI_8Ps39ICfDOhg76fxhYRPofZH0j4vJrG16Ht7ii8J969yugGG8b32dptcu82AI_86JUZDQIWOa9Mjk0_3WJSo3VPEQ3PnkMxlE-j2l6D5dy5QQom_U",
          tags: ["Flutter", "E-Commerce", "Mobile"],
          category: "mobile"
        },
        {
          id: 3,
          title: "DataPulse Analytics",
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAx5qqkBFA6wzk4QSxh73Zfsi-7BjhXQbvc5d0ZuUEviS70R0OH3mDTjwZPGYv-iStnhjnURRsfmI2CGuktRY4PIGmVar2piKWHhhf-ZThNuEz26deZnAg21SBqFyLpNEiUTDuJjQFjxil7hbRhMbGGQsNEvQrvSQz1Feg2TyQcYPc1phXgqL4VqqHM3TaVntPX_x1LAi4eLt_9dydDnHLc5icJ8Fo33OqvYK2k3Z2LVJLb0_1dW7tg4RTL19dILDA7vvR5n71OUuE",
          tags: ["React", "SaaS", "Dashboard"],
          category: "dashboard"
        },
        {
          id: 4,
          title: "OmniPOS Retail",
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC1AV_gHIN39Yjg05djPoEY5VvypcUWpuCGYqnddmL0I-YmBmWsOoXp-Mc02emm1spWJ4MAUSWeOb0CKXa-KRVdR4kEWvI09UFCn9UdmEWJpyKX2yyOyU-CwPvqbBmWkqNqJb_vM7nbX065cHyBngMy_7zJW1fTIOMxI1Sx_gxIzytsZm57fn0I6rVHsZGLqUAdSdkmOtG05-Irht4XMzRAX9p-HFjKAZ3QhXyElVfZGsCccFkp6OWYhG83SQLtsZDC4XztgCx9fQw",
          tags: ["C# / .NET", "Retail", "ERP"],
          category: "pos"
        },
        {
          id: 5,
          title: "CloudSync Portal",
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDm1SeqkOoqugndw7ly9OEF6JiSyNc-ypDbNl-VFwQh8dQYxaALjAaRfxD39C_47MkSotInNhYD9WjHcgCKkUOV42G-8QTXOnkkmqJAvCbpA_ouM0CW9QAJJTIzhetTyrjPm3wguK_sEFdTO0oGZP9q_ocT40rrImj72DZucjPgnY1bWm19jmT7s7_MxfRL_nt15RJSiCZIIQNBH6uUd8aw55XZHkW813fVh2GVr1HoIn8ivad6l0iokcKig98EeIo4WrW3bRILRH4",
          tags: ["Vue.js", "Cloud", "Enterprise"],
          category: "website"
        },
        {
          id: 6,
          title: "FitFlow Health App",
          imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDEvHucOcqMqIwvmzdcN2fHPZhzw0E0VUgX3mYyoEE_IzF9xgswCHMLmin2tQO03Fo18RuJgp_HTYF-wR27PfXQ-KCLmZ-RZnSqfWXuWUfuri-7j9HcqG8IFSZzpLr-Ed1V3NQPFRw9SS_lywTBlDqU_hBmxdSDWEtIsuwKR1ZsZXFYySYfim23AZr2owE7X-bPc7ehciykWOFmAUrDJzREBDX-dnvPjhGP6om6uTMYb6Vr111JHoPRd-iWsZVFVN7kWQ4beEX4AVQ",
          tags: ["React Native", "Health", "AI"],
          category: "mobile"
        }
      ])
    } catch (error) {
      console.error('Error fetching projects:', error)
      setProjects([])
    } finally {
      setIsLoadingProjects(false)
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

  useEffect(() => {
    fetchFooterData()
    fetchAboutData()
    fetchServices()
    fetchProjects()
    fetchTeamMembers()
  }, [])

  // Navigation items - can be fetched from backend later
  const navigationItems = [
    { label: "Services", href: "#services" },
    { label: "Portfolio", href: "#portfolio" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ]

  // Client avatars - can be fetched from backend later
  const clientAvatars = [
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDfv7s0BL7kpE8SISu54KVmV72eRDoDTpvQ8dhtMG1qQU5n_GK2Snd4Vjr55j0ooK1FEldAxM4bCBg4R0OqBqVhxlKvf8shv_n_fzUvdkPg30WnkCmfM_v_iOx3PsQiBgnKGEtdz1XXl35DISOiuH_HMAr2sZXbJ0qyqLCg4R9pd9rzf2dpnOATCWeEWgQW4lPyZPAjevyW4-eaFYuFq251ojBo-a7gKmU7zLWoDVzSVGFXUYm8K8Mb7tYty5nw3HzVt-0WE7LtqnM',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDDUvdthqBlOw2krhbdYetVoVNGO78DBhy4CqMC_iZM7rDvgJ1_9vEWbma35iVuge12fhxCdWA8zifXSrOAkwfcE-1pxC6XIvLzZbQWxPz1C4P_oOVWX7TCXk0FPp9ddniOUa7OgviV5QxiGKZzHqn3aE2XsKV87lYbXQnDd9VVcvVXuwA3SyQigHzhAvMS9ZHsIXdJJGL2XNe7OYq-RogQayWvr0C2qUVxls9w8Qx0G-a99Yv11iARhfLK-f6h7ki1Ez8-7EdjISA',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA4sHYaTCtwN4xNJkvlxhkCYB7jPi5ow1w4AC1m-QZdcBJ5BZRxO9q2MWa4ZKNfqNhW5Hhqs-FeOLYFl7L-wP5Ilk6LD1ITMu_W4w9BKRmuYApYKlmws-saMeXvEDDlW14VknoKOQ6AJF2ywQJj7LxBkE3Q125GChnjZh09XmNh4dEcOJ_AwIh1Y38gZaxwTBPqzXlmHB1oagCYyloXE1ikBQXIAvGcSaH-HwX-HExE2Rrb_msDBTaiRmK5dQzB2w1BG9eO9LvTa_I'
  ]

  const handleGetStarted = () => {
    navigate('/contact')
  }

  const handleStartProject = () => {
    navigate('/contact')
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
    navigate('/contact', {
      state: {
        formData: {
          serviceId: service.id,
          serviceName: service.title || service.nameEn || service.name_en
        }
      }
    })
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
        clientAvatars={clientAvatars}
        clientCount="50+"
        trustText="Trusted by global startups and enterprises"
        showIllustrations={true}
      />

      <CodelanceAbout
        title={aboutData?.title || "Who We Are"}
        description={aboutData?.description || "CODELANCE is a premier technology agency dedicated to sculpting the digital landscape of tomorrow. We bridge the gap between complex engineering and human-centric design, delivering high-performance solutions that empower enterprises to thrive in an ever-evolving market."}
        stats={aboutData?.stats || [
          { value: "150+", label: "Projects Delivered" },
          { value: "8+", label: "Years Experience" },
          { value: "< 2hr", label: "Support Response" }
        ]}
        primaryButtonText="Our Mission"
        primaryButtonAction={() => navigate('/about')}
        secondaryButtonText="View Team"
        secondaryButtonAction={() => navigate('/team')}
        showIllustrations={true}
        codeSnippet={{
          mission: "Excellence",
          stack: ["AI", "Cloud"],
          deliver: true
        }}
      />

      {/* Services Section */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-16 lg:py-24" id="services">
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
      <section className="max-w-7xl mx-auto px-6 lg:px-10 py-20" id="portfolio">
        <CodelancePortfolioHeader
          badge="Showcase"
          title="Our Portfolio"
        />

        <CodelancePortfolioFilters
          filters={[
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
          primaryButtonAction={() => navigate('/contact')}
          secondaryButtonText="Our Process"
          secondaryButtonAction={() => navigate('/#process')}
        />
      </section>

      {/* Team Section */}
      <section className="max-w-[1440px] mx-auto px-4 md:px-10 lg:px-40 py-20" id="team">
        <CodelanceTeamHeader
          badge="Our Team"
          title="Meet the Experts"
        />

        {isLoadingTeam ? (
          <div className="text-center py-12">
            <p className="text-[#5e808d] dark:text-gray-400">Loading team members...</p>
          </div>
        ) : (
          <CodelanceTeamGrid
            teamMembers={teamMembers}
            onMemberClick={handleTeamMemberClick}
            columns={4}
          />
        )}
      </section>

      {/* How We Work / Process Section */}
      <section id="process">
        <CodelanceProcessHeader
          badge="Our Methodology"
          title="How We Work"
          description="We follow a structured, transparent process to turn your complex ideas into high-performance digital realities."
        />

        <CodelanceProcessTimeline
          steps={[]} // Can be fetched from backend later - will use scroll-based animation
        />

        <CodelanceProcessCTA
          title="Ready to build something amazing?"
          subtitle="Join dozens of successful companies scaling with our proven process."
          primaryButtonText="Contact Us Today"
          primaryButtonAction={() => navigate('/contact')}
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
        <div className="max-w-7xl mx-auto px-6">
          <CodelanceReviewsHeader
            title="Client Success Stories"
            description="Hear from the innovative teams we've partnered with to build the future of digital infrastructure."
          />

          <CodelanceReviewsCarousel
            reviews={[]} // Frontend-only, uses default reviews
            autoPlay={true}
            autoPlayInterval={5000}
          />
        </div>
      </section>

      {/* Pricing / Packages Section */}
      <section className="bg-background-light dark:bg-background-dark" id="packages">
        <CodelancePricingHeader
          title="Pricing Packages"
          description="Choose the perfect plan for your technical needs. Our flexible packages are designed to scale with your business and deliver premium GSAP-powered experiences."
        />

        <section className="max-w-[1200px] mx-auto px-6 py-12">
          <CodelancePricingGrid
            packages={[]} // Frontend-only, uses default packages
            onPackageSelect={(pkg) => {
              navigate('/contact', {
                state: {
                  formData: {
                    packageId: pkg.id,
                    packageName: pkg.name,
                    packagePrice: pkg.price
                  }
                }
              })
            }}
            columns={3}
          />
        </section>

        <CodelancePricingCTA
          title="Need a custom solution?"
          description="Our team can build a tailor-made package specifically for your enterprise requirements, including specialized integrations and dedicated server architecture."
          primaryButtonText="Schedule a Discovery Call"
          primaryButtonAction={() => navigate('/contact')}
          secondaryButtonText="View Full Services"
          secondaryButtonAction={() => navigate('/services')}
        />
      </section>

      {/* Contact Section */}
      <CodelanceContactSection
        title="Let's Build"
        titleHighlight="Something Great"
        description="Have a vision for the next big thing? Our team of experts is ready to transform your ideas into world-class digital solutions."
        contactItems={[
          {
            type: 'email',
            label: 'Email',
            value: 'hello@codelance.tech',
            icon: 'mail'
          },
          {
            type: 'phone',
            label: 'Phone',
            value: '+1 (555) 000-CODELANCE',
            icon: 'call'
          },
          {
            type: 'address',
            label: 'Address',
            value: 'Tech Hub Plaza, Silicon Valley, CA',
            icon: 'location_on'
          }
        ]}
        socialLinks={[
          {
            name: 'LinkedIn',
            icon: 'linkedin',
            href: '#'
          },
          {
            name: 'GitHub',
            icon: 'github',
            href: '#'
          },
          {
            name: 'Twitter',
            icon: 'twitter',
            href: '#'
          }
        ]}
        services={[
          { value: 'web', label: 'Web Development' },
          { value: 'mobile', label: 'Mobile App Development' },
          { value: 'design', label: 'UI/UX Design' },
          { value: 'cloud', label: 'Cloud Solutions' }
        ]}
        onSubmit={null} // Frontend-only for now
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
        socialLinks={[
          { icon: 'language', href: '#', label: 'Website' },
          { icon: 'terminal', href: '#', label: 'GitHub' },
          { icon: 'alternate_email', href: '#', label: 'Email' },
          { icon: 'camera', href: '#', label: 'Instagram' }
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
