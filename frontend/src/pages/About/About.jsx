import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AboutSection from '../../components/AboutSection/AboutSection'
import aboutApi from '../../api/about'

const AboutPage = () => {
  const navigate = useNavigate()
  const [aboutData, setAboutData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch about data from API
  const fetchAboutData = async () => {
    try {
      setIsLoading(true)
      const data = await aboutApi.getAboutData()
      setAboutData(data)
    } catch (error) {
      console.error('Error fetching about data:', error)
      setAboutData(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAboutData()
  }, [])

  // Handle button clicks
  const handleMeetTeam = () => {
    navigate('/barbers')
  }

  const handleViewServices = () => {
    navigate('/services')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-text-muted dark:text-gray-400">Loading...</p>
      </div>
    )
  }

  if (!aboutData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-text-muted dark:text-gray-400">No about section found. Please add content in the admin panel.</p>
      </div>
    )
  }

  const data = aboutData

  return (
    <AboutSection
      establishedYear={data.establishedYear}
      title={data.title}
      description={data.description}
      secondaryDescription={data.secondaryDescription}
      primaryButtonText={data.primaryButtonText}
      primaryButtonOnClick={handleMeetTeam}
      secondaryButtonText={data.secondaryButtonText}
      secondaryButtonOnClick={handleViewServices}
      stats={data.stats}
      imageUrl={data.imageUrl}
      imageAlt={data.imageAlt}
      badgeProps={data.badgeProps}
    />
  )
}


export default AboutPage

