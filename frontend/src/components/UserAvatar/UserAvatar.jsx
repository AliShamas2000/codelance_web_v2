import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import authApi from '../../api/auth'

const UserAvatar = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [imageError, setImageError] = useState(false)
  const dropdownRef = useRef(null)

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (!token) {
          setUser(null)
          setIsLoading(false)
          return
        }

        // Get user data from localStorage first (faster)
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser)
            setUser(userData)
            setImageError(false)
            setIsLoading(false)
            // Fetch fresh data in background to ensure avatar URL is up to date
            fetchUserData()
          } catch (e) {
            // If parsing fails, fetch from API
            await fetchUserData()
          }
        } else {
          await fetchUserData()
        }
      } catch (error) {
        console.error('Auth check error:', error)
        setUser(null)
        setIsLoading(false)
      }
    }

    const fetchUserData = async () => {
      try {
        const response = await authApi.getCurrentUser()
        const userData = response.user || response
        
        // Ensure avatar URLs are properly formatted
        if (userData.avatar && !userData.avatar.startsWith('http')) {
          // If it doesn't start with /, add it
          if (!userData.avatar.startsWith('/')) {
            userData.avatar = `/${userData.avatar}`
          }
        }
        if (userData.profile_photo && !userData.profile_photo.startsWith('http')) {
          if (!userData.profile_photo.startsWith('/')) {
            userData.profile_photo = `/${userData.profile_photo}`
          }
        }
        
        setUser(userData)
        setImageError(false)
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(userData))
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUser(null)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for storage changes (when user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'auth_token' || e.key === 'user') {
        checkAuth()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setUser(null)
      setIsDropdownOpen(false)
      navigate('/')
    }
  }

  // Get user initials
  const getInitials = () => {
    if (!user) return 'U'
    
    const firstName = user.first_name || ''
    const lastName = user.last_name || ''
    
    if (firstName && lastName) {
      return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`
    } else if (user.name) {
      const nameParts = user.name.trim().split(' ')
      if (nameParts.length >= 2) {
        return `${nameParts[0].charAt(0).toUpperCase()}${nameParts[nameParts.length - 1].charAt(0).toUpperCase()}`
      }
      return nameParts[0].charAt(0).toUpperCase()
    }
    
    return 'U'
  }

  // Get avatar image URL
  const getAvatarUrl = () => {
    if (!user) return null
    
    const avatar = user.avatar || user.profile_photo
    if (!avatar) return null
    
    // If it's already a full URL, return as is
    if (avatar.startsWith('http://') || avatar.startsWith('https://')) {
      return avatar
    }
    
    // If it's a relative path starting with /storage, return as is (Laravel storage URL)
    if (avatar.startsWith('/storage/')) {
      return avatar
    }
    
    // If it's a relative path without leading slash, add it
    if (!avatar.startsWith('/')) {
      return `/${avatar}`
    }
    
    // If it already starts with /, return as is
    return avatar
  }

  const avatarUrl = getAvatarUrl()
  const initials = getInitials()

  // Debug: Log avatar URL
  useEffect(() => {
    if (user && avatarUrl) {
      console.log('Avatar URL constructed:', {
        avatarUrl,
        userAvatar: user.avatar,
        userProfilePhoto: user.profile_photo,
        phone: user.phone
      })
    }
  }, [user, avatarUrl])

  // Reset image error when user or avatar changes
  useEffect(() => {
    setImageError(false)
  }, [user?.id, avatarUrl])

  if (isLoading) {
    return (
      <div className="size-10 rounded-full border-2 border-primary/50 overflow-hidden bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        className="flex items-center gap-2 focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="User menu"
      >
        <div className="size-10 rounded-full border-2 border-primary/50 overflow-hidden hover:border-primary transition-all p-0.5">
          {user && avatarUrl && !imageError ? (
            <img
              alt="User Profile"
              className="w-full h-full object-cover rounded-full"
              src={avatarUrl}
              onError={(e) => {
                // If image fails to load, show initials instead
                console.error('Avatar image failed to load:', {
                  avatarUrl,
                  userAvatar: user.avatar,
                  userProfilePhoto: user.profile_photo,
                  phone: user.phone,
                  error: e
                })
                setImageError(true)
              }}
              onLoad={() => {
                console.log('Avatar image loaded successfully:', avatarUrl)
                setImageError(false)
              }}
            />
          ) : (
            <div
              className={`w-full h-full rounded-full flex items-center justify-center text-sm font-bold text-white ${
                user
                  ? 'bg-gradient-to-br from-primary to-[#0fb57e]'
                  : 'bg-gray-400 dark:bg-gray-600'
              }`}
            >
              {user ? initials : (
                <span className="material-symbols-outlined text-lg">person</span>
              )}
            </div>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="dropdown-menu absolute right-0 mt-2 w-48 origin-top-right rounded-xl bg-background-dark border border-white/10 shadow-2xl backdrop-blur-xl z-50">
          <div className="py-2 px-1">
            {user ? (
              <>
                {user.role === 'client' && (
                  <>
                    <Link
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <span className="material-symbols-outlined text-lg">person</span>
                      My Profile
                    </Link>
                    <div className="my-1 border-t border-white/5"></div>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/5 rounded-lg transition-colors text-left"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-lg">login</span>
                  Sign In
                </Link>
                <div className="my-1 border-t border-white/5"></div>
                <Link
                  to="/register"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-white/90 hover:bg-white/5 hover:text-primary rounded-lg transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default UserAvatar

