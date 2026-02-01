import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authApi from '../api/auth'

const BarberUserContext = createContext(null)

export const BarberUserProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    id: null,
    first_name: '',
    last_name: '',
    name: '',
    role: 'Barber',
    avatar: null,
    profile_photo: null
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      setIsLoading(true)
      const data = await authApi.getCurrentUser()
      const userData = data.user || data.data || data
      
      // Ensure profile_photo URL is properly formatted
      let profilePhoto = userData.profile_photo || userData.avatar || null
      if (profilePhoto && !profilePhoto.startsWith('http') && !profilePhoto.startsWith('//')) {
        // If it's a relative path, make it absolute
        profilePhoto = profilePhoto.startsWith('/') ? profilePhoto : `/${profilePhoto}`
      }
      
      setUser({
        id: userData.id || null, // Include user ID for barber availability
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Barber',
        role: userData.role || 'Barber',
        avatar: profilePhoto,
        profile_photo: profilePhoto
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      navigate('/barber/login')
    }
  }

  const value = {
    user,
    handleLogout,
    isLoading,
    refreshUser: fetchUserData
  }

  return (
    <BarberUserContext.Provider value={value}>
      {children}
    </BarberUserContext.Provider>
  )
}

export const useBarberUserContext = () => {
  const context = useContext(BarberUserContext)
  if (!context) {
    throw new Error('useBarberUserContext must be used within BarberUserProvider')
  }
  return context
}

