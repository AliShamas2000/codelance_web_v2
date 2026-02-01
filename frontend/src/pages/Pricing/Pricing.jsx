import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PricingSection from '../../components/PricingSection/PricingSection'
import pricingApi from '../../api/pricing'

const PricingPage = () => {
  const navigate = useNavigate()
  const [pricingPlans, setPricingPlans] = useState([])
  const [filters, setFilters] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch pricing plans from API
  const fetchPricingPlans = async (filter = 'all') => {
    try {
      setIsLoading(true)
      const data = await pricingApi.getPricingPlans({ filter })
      setPricingPlans(data.data || data || [])
    } catch (error) {
      console.error('Error fetching pricing plans:', error)
      // Fallback to default data if API fails
      setPricingPlans(getDefaultPricingPlans())
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch filters from API
  const fetchFilters = async () => {
    try {
      const data = await pricingApi.getFilters()
      setFilters(data.data || [])
    } catch (error) {
      console.error('Error fetching filters:', error)
      setFilters([])
    }
  }

  useEffect(() => {
    fetchFilters()
    fetchPricingPlans('all')
  }, [])

  // Handle filter change
  const handleFilterChange = (filterId) => {
    fetchPricingPlans(filterId)
  }

  // Handle plan/book button click
  const handlePlanClick = (plan) => {
    navigate('/contact', { 
      state: { 
        formData: {
          serviceId: plan.id,
          serviceName: plan.title
        }
      } 
    })
  }

  // Handle CTA button click
  const handleCTAClick = () => {
    navigate('/contact')
  }

  return (
    <PricingSection
      pricingPlans={pricingPlans}
      filters={filters}
      isLoading={isLoading}
      onPlanClick={handlePlanClick}
      onFilterChange={handleFilterChange}
      onCTAClick={handleCTAClick}
    />
  )
}

// Default pricing plans data (fallback when API is not available)
const getDefaultPricingPlans = () => [
  {
    id: 1,
    title: "The Executive Cut",
    subtitle: "Signature hair styling",
    price: "$55",
    duration: "45 min",
    features: [
      "Personalized Consultation",
      "Precision Scissor Cut",
      "Wash & Style Finish"
    ],
    category: "haircuts",
    filterId: "haircuts"
  },
  {
    id: 2,
    title: "Hot Towel Shave",
    subtitle: "Traditional grooming",
    price: "$40",
    duration: "30 min",
    features: [
      "Hot Towel Prep",
      "Essential Oils",
      "Straight Razor Finish"
    ],
    category: "shaves",
    filterId: "shaves"
  },
  {
    id: 3,
    title: "Full Service Combo",
    subtitle: "The complete package",
    price: "$90",
    duration: "75 min",
    features: [
      "Executive Haircut",
      "Hot Towel Shave",
      "Facial Massage",
      "Complimentary Drink"
    ],
    isFeatured: true,
    featuredBadge: "Most Popular",
    category: "haircuts",
    filterId: "haircuts"
  },
  {
    id: 4,
    title: "Beard Trim & Line",
    subtitle: "Maintenance & care",
    price: "$25",
    duration: "20 min",
    features: [
      "Clipper Trim",
      "Razor Line Up",
      "Beard Oil Application"
    ],
    category: "beard",
    filterId: "beard"
  },
  {
    id: 5,
    title: "Scalp Treatment",
    subtitle: "Relaxation & health",
    price: "$35",
    duration: "30 min",
    features: [
      "Exfoliating Scrub",
      "Deep Conditioning",
      "Head Massage"
    ],
    category: "treatments",
    filterId: "treatments"
  },
  {
    id: 6,
    title: "Kid's Cut",
    subtitle: "Under 12 years old",
    price: "$30",
    duration: "30 min",
    features: [
      "Gentle Styling",
      "Classic Scissor Cut",
      "Complimentary Treat"
    ],
    category: "haircuts",
    filterId: "haircuts"
  },
]

export default PricingPage

