import React, { createContext, useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import authApi from '../api/auth'

const AdminUserContext = createContext(null)

export const AdminUserProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    role: 'admin',
    avatar: null,
    profile_photo: null
  })
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authApi.getCurrentUser()
        const userData = data.user || data.data || data

        let profilePhoto = userData.profile_photo || userData.avatar || null
        if (profilePhoto && !profilePhoto.startsWith('http')) {
          profilePhoto = profilePhoto.startsWith('/') ? profilePhoto : `/${profilePhoto}`
        }

        setUser({
          ...userData,
          id: userData.id || null,
          name: userData.name || '',
          email: userData.email || '',
          role: userData.role || 'admin',
          avatar: profilePhoto,
          profile_photo: profilePhoto
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUser(null)
        navigate('/admin/login') // Redirect to login on error
      } finally {
        setIsLoadingUser(false)
      }
    }
    fetchUserData()
  }, [navigate])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      navigate('/admin/login')
    }
  }

  const refreshUser = async () => {
    try {
      const data = await authApi.getCurrentUser()
      const userData = data.user || data.data || data

      let profilePhoto = userData.profile_photo || userData.avatar || null
      if (profilePhoto && !profilePhoto.startsWith('http')) {
        profilePhoto = profilePhoto.startsWith('/') ? profilePhoto : `/${profilePhoto}`
      }

      setUser({
        ...userData,
        id: userData.id || null,
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'admin',
        avatar: profilePhoto,
        profile_photo: profilePhoto
      })
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  return (
    <AdminUserContext.Provider value={{ user, handleLogout, isLoadingUser, refreshUser }}>
      {children}
    </AdminUserContext.Provider>
  )
}

export const useAdminUserContext = () => {
  const context = useContext(AdminUserContext)
  if (!context) {
    throw new Error('useAdminUserContext must be used within an AdminUserProvider')
  }
  return context
}

