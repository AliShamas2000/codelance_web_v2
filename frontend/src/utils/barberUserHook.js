/**
 * Reusable hook for fetching barber user data and logout handler
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import authApi from '../api/auth'

export const useBarberUser = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    first_name: '',
    last_name: '',
    name: '',
    role: 'Barber',
    avatar: null,
    profile_photo: null
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const data = await authApi.getCurrentUser()
      const userData = data.user || data.data || data
      
      // Ensure profile_photo URL is properly formatted
      let profilePhoto = userData.profile_photo || userData.avatar || null
      if (profilePhoto && !profilePhoto.startsWith('http')) {
        // If it's a relative path, make it absolute
        profilePhoto = profilePhoto.startsWith('/') ? profilePhoto : `/${profilePhoto}`
      }
      
      setUser({
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        name: userData.name || `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || 'Barber',
        role: userData.role || 'Barber',
        avatar: profilePhoto,
        profile_photo: profilePhoto
      })
    } catch (error) {
      console.error('Error fetching user data:', error)
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

  return { user, handleLogout }
}

