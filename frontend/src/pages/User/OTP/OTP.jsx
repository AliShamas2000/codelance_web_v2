import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import authApi from '../../../api/auth'

const OTP = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [otp, setOtp] = useState(['', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(0) // Will be set from backend
  const [canResend, setCanResend] = useState(false)
  const [expiresAt, setExpiresAt] = useState(null) // Expiration timestamp from backend
  const [resendsRemaining, setResendsRemaining] = useState(null) // Remaining resends
  const [resendLimitReached, setResendLimitReached] = useState(false)
  const [nextResendAt, setNextResendAt] = useState(null) // When next resend is allowed
  const inputRefs = useRef([])

  // Get phone number and type from location state or localStorage
  const phoneNumber = location.state?.phone || localStorage.getItem('reset_phone') || localStorage.getItem('register_phone') || ''
  const otpType = location.state?.type || 'password_reset' // 'registration' or 'password_reset'
  
  // Get expiration time from location state (if coming from registration)
  const initialExpiresAt = location.state?.expires_at || localStorage.getItem('otp_expires_at')

  // Redirect if no phone number
  useEffect(() => {
    if (!phoneNumber) {
      // Redirect based on type
      if (otpType === 'registration') {
        navigate('/register')
      } else {
        navigate('/forgot-password')
      }
    }
  }, [phoneNumber, otpType, navigate])

  // Fetch OTP expiration time from backend on mount (without sending new OTP)
  useEffect(() => {
    const fetchOtpInfo = async () => {
      if (!phoneNumber) return
      
      // If we have expiration time from registration, use it first
      if (initialExpiresAt) {
        const expiresAtDate = new Date(initialExpiresAt)
        // Only use if it's still valid (not expired)
        if (expiresAtDate > new Date()) {
          setExpiresAt(expiresAtDate)
          // Still fetch from backend to ensure sync
        }
      }
      
      try {
        // Get existing OTP info from backend (for registration, OTP is created during registration)
        const response = await authApi.getOtpInfo({
          phone: phoneNumber,
          type: otpType
        })
        
        if (response.success && response.has_otp && response.expires_at) {
          setExpiresAt(new Date(response.expires_at))
          // Reset resend limit status when valid OTP exists
          setResendLimitReached(false)
          setNextResendAt(null)
        }
      } catch (error) {
        console.error('Error fetching OTP info:', error)
        
        // If getOtpInfo fails (404), handle based on type
        if (error.response?.status === 404) {
          if (otpType === 'registration') {
            // For registration, OTP should have been created during registration
            // If not found and we don't have initial expiration, redirect to registration
            if (!initialExpiresAt) {
              setError('No OTP found. Please complete registration first.')
              setTimeout(() => {
                navigate('/register')
              }, 2000)
            }
          } else {
            // For password reset, allow sending new OTP
            try {
              const sendResponse = await authApi.sendOTP({
                phone: phoneNumber,
                type: otpType
              })
              
              if (sendResponse.success && sendResponse.expires_at) {
                setExpiresAt(new Date(sendResponse.expires_at))
                // Update resend info
                if (sendResponse.resends_remaining !== undefined) {
                  setResendsRemaining(sendResponse.resends_remaining)
                }
                setResendLimitReached(false)
                setNextResendAt(null)
              } else if (sendResponse.success && sendResponse.expires_in) {
                const createdAt = sendResponse.created_at ? new Date(sendResponse.created_at) : new Date()
                const expirationTime = new Date(createdAt.getTime() + sendResponse.expires_in * 1000)
                setExpiresAt(expirationTime)
                if (sendResponse.resends_remaining !== undefined) {
                  setResendsRemaining(sendResponse.resends_remaining)
                }
                setResendLimitReached(false)
                setNextResendAt(null)
              }
            } catch (sendError) {
              console.error('Error sending OTP:', sendError)
              setError('Failed to send OTP. Please try again.')
            }
          }
        } else {
          setError('Failed to load OTP information. Please try again.')
        }
      }
    }

    fetchOtpInfo()
  }, [phoneNumber, otpType, navigate, initialExpiresAt])

  // Timer countdown based on backend expiration time
  useEffect(() => {
    if (!expiresAt) {
      setCanResend(false)
      setTimeLeft(0)
      return
    }

    const updateTimer = () => {
      const now = new Date()
      const expiresAtDate = new Date(expiresAt)
      const diff = Math.max(0, Math.floor((expiresAtDate.getTime() - now.getTime()) / 1000))
      
      setTimeLeft(diff)
      // Can resend when timer expires (diff === 0)
      const canResendNow = diff === 0
      setCanResend(canResendNow)
    }

    // Update immediately
    updateTimer()

    // Update every second
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [expiresAt])

  // Timer for next resend availability (when limit is reached)
  useEffect(() => {
    if (!nextResendAt || !resendLimitReached) return

    const updateResendTimer = () => {
      const now = new Date()
      const diff = Math.max(0, Math.floor((new Date(nextResendAt) - now) / 1000))
      
      if (diff === 0) {
        // Resend is now available again
        setResendLimitReached(false)
        setNextResendAt(null)
        setCanResend(true)
      }
    }

    // Update immediately
    updateResendTimer()

    // Update every second
    const interval = setInterval(updateResendTimer, 1000)

    return () => clearInterval(interval)
  }, [nextResendAt, resendLimitReached])

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleOtpChange = async (index, value) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) {
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Clear error when user types
    if (error) {
      setError('')
    }

    // Auto-focus next input
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when 4th digit is entered
    if (value && index === 3) {
      // Wait a tiny bit for state to update, then verify
      setTimeout(() => {
        const finalOtp = [...newOtp]
        // Ensure the 4th digit is set
        finalOtp[3] = value
        // Check if all 4 digits are filled
        if (finalOtp.every(digit => digit !== '' && digit !== undefined)) {
          handleVerify(finalOtp.join(''))
        }
      }, 150)
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
    // Handle paste (Ctrl+V / Cmd+V)
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 4).split('')
        const newOtp = ['', '', '', '']
        digits.forEach((digit, i) => {
          if (i < 4 && digit) {
            newOtp[i] = digit
          }
        })
        setOtp(newOtp)
        // Focus last filled input or last input
        const lastIndex = Math.min(digits.length - 1, 3)
        if (inputRefs.current[lastIndex]) {
          inputRefs.current[lastIndex].focus()
        }
        
        // Auto-verify if all 4 digits are pasted
        if (digits.length === 4 && newOtp.every(digit => digit !== '' && digit !== undefined && digit !== null)) {
          setTimeout(() => {
            const otpCode = newOtp.join('')
            if (otpCode.length === 4 && /^\d{4}$/.test(otpCode)) {
              handleVerify(otpCode)
            }
          }, 200)
        }
      })
    }
  }

  const handlePaste = async (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    const digits = pastedData.replace(/\D/g, '').slice(0, 4).split('')
    
    // Create new OTP array with pasted digits
    const newOtp = ['', '', '', '']
    digits.forEach((digit, i) => {
      if (i < 4 && digit) {
        newOtp[i] = digit
      }
    })
    
    // Update state
    setOtp(newOtp)
    
    // Focus last filled input or last input
    const lastIndex = Math.min(digits.length - 1, 3)
    if (inputRefs.current[lastIndex]) {
      inputRefs.current[lastIndex].focus()
    }
    
    // Auto-verify if all 4 digits are pasted
    if (digits.length === 4 && newOtp.every(digit => digit !== '' && digit !== undefined && digit !== null)) {
      // Use a small delay to ensure state is updated and UI reflects the pasted values
      setTimeout(() => {
        const otpCode = newOtp.join('')
        if (otpCode.length === 4 && /^\d{4}$/.test(otpCode)) {
          handleVerify(otpCode)
        }
      }, 200)
    }
  }

  const validateOtp = (otpCode) => {
    if (!otpCode || otpCode.length !== 4 || !/^\d{4}$/.test(otpCode)) {
      setError('Please enter the complete verification code')
      return false
    }
    return true
  }

  const handleVerify = async (otpCode) => {
    if (!validateOtp(otpCode)) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await authApi.verifyOTP({
        phone: phoneNumber,
        code: otpCode,
        type: otpType
      })

      if (response.success) {
        // Handle registration verification
        if (response.type === 'registration' || otpType === 'registration') {
          // Store token if provided
          if (response.token) {
            localStorage.setItem('auth_token', response.token)
          }

          // Store user data if provided
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user))
          }

          // Clear registration phone from localStorage
          localStorage.removeItem('register_phone')
          localStorage.removeItem('otp_expires_at')

          // Navigate to home page
          navigate('/', { replace: true })
        } else if (response.type === 'password_reset' || otpType === 'password_reset') {
          // Handle password reset verification
          const resetToken = response.reset_token || response.token || response.data?.reset_token

          // Clear reset phone from localStorage
          localStorage.removeItem('reset_phone')
          localStorage.removeItem('otp_expires_at')

          // Navigate to reset password page
          navigate('/reset-password', {
            state: {
              reset_token: resetToken,
              phone: phoneNumber
            },
            replace: true
          })
        }
      }
    } catch (error) {
      console.error('OTP verification error:', error)
      
      // Get error message
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.code?.[0] ||
                          'Invalid verification code. Please try again.'
      
      // Get remaining attempts if provided
      const remainingAttempts = error.response?.data?.remaining_attempts
      
      // Set error message
      if (remainingAttempts !== undefined && remainingAttempts > 0) {
        setError(`${errorMessage} (${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining)`)
      } else {
        setError(errorMessage)
      }
      
      // Clear OTP inputs on error
      setOtp(['', '', '', ''])
      
      // Focus first input
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const otpCode = otp.join('')
    await handleVerify(otpCode)
  }

  const handleResendCode = async () => {
    // Only allow resend if timer expired (timeLeft === 0)
    if (timeLeft > 0 || isLoading) return

    setIsLoading(true)
    setError('')

    try {
      const response = await authApi.resendOTP({
        phone: phoneNumber,
        type: otpType
      })

      if (response.success) {
        // Update expiration time from backend
        if (response.expires_at) {
          setExpiresAt(new Date(response.expires_at))
        } else if (response.expires_in && response.created_at) {
          // Use created_at + expires_in for accurate timing
          const createdAt = new Date(response.created_at)
          setExpiresAt(new Date(createdAt.getTime() + response.expires_in * 1000))
        } else if (response.expires_in) {
          // Fallback: use current time + expires_in
          setExpiresAt(new Date(Date.now() + response.expires_in * 1000))
        }
        
        // Update resend info
        if (response.resends_remaining !== undefined) {
          setResendsRemaining(response.resends_remaining)
        }
        setResendLimitReached(false)
        setNextResendAt(null)
        
        // Clear error
        setError('')
        
        // Clear OTP inputs
        setOtp(['', '', '', ''])
        
        // Focus first input
        setTimeout(() => {
          inputRefs.current[0]?.focus()
        }, 100)
      }
    } catch (error) {
      console.error('Resend OTP error:', error)
      
      // Handle resend limit error
      if (error.response?.status === 429 || error.response?.data?.resend_limit_reached) {
        setResendLimitReached(true)
        if (error.response?.data?.next_resend_at) {
          setNextResendAt(new Date(error.response.data.next_resend_at))
        }
        const errorMessage = error.response?.data?.message || 
                          'Too many resend attempts. Please try again later.'
        setError(errorMessage)
      } else {
        const errorMessage = error.response?.data?.message || 
                            'Failed to resend code. Please try again.'
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoBack = () => {
    if (otpType === 'registration') {
      navigate('/register')
    } else {
      navigate('/forgot-password')
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display min-h-screen flex items-center justify-center p-4 selection:bg-primary/30 selection:text-black">
      {/* Main Content Container */}
      <div className="w-full max-w-[440px] flex flex-col gap-8 animate-fade-in-up">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* OTP Card */}
        <div className="bg-white dark:bg-[#152822] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#e5e7eb] dark:border-[#2a3e36] overflow-hidden">
          {/* Card Header */}
          <div className="px-8 pt-10 pb-6 flex flex-col items-center text-center border-b border-[#f0f2f5] dark:border-[#2a3e36] relative">
            {/* Back Button */}
            <button
              onClick={handleGoBack}
              aria-label="Go back"
              className="group absolute top-8 left-8 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[#111816] dark:text-white group-hover:text-primary transition-colors">arrow_back</span>
            </button>
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-[#0fb57e] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-primary/20 transform rotate-3 hover:rotate-6 transition-transform duration-300">
              <span className="material-symbols-outlined text-white text-[32px]">mail</span>
            </div>
            <h1 className="text-[#111816] dark:text-white text-2xl font-bold leading-tight tracking-tight">
              Verification Code
            </h1>
            <p className="text-[#637588] dark:text-[#8d9ba8] text-sm font-medium mt-2 max-w-[260px]">
              {otpType === 'registration' 
                ? 'We have sent the verification code to your mobile number'
                : 'We have sent the code verification to your mobile number'}
            </p>
            {phoneNumber && (
              <p className="text-[#111816] dark:text-white font-bold text-sm mt-2">
                {phoneNumber}
              </p>
            )}
            {(otpType === 'registration' || otpType === 'password_reset') && (
              <p className="text-primary text-xs font-semibold mt-2">
                Use code: 2000
              </p>
            )}
          </div>

          {/* Card Body / Form */}
          <div className="p-8 flex flex-col gap-5">
            {/* OTP Inputs */}
            <div className="flex flex-col gap-2">
                <label className="text-[#111816] dark:text-[#e2e8f0] text-sm font-semibold leading-normal">
                  Verification Code
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <div className="w-full flex justify-center gap-3 sm:gap-4">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      className={`otp-input w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] text-center text-2xl font-bold rounded-2xl border-2 transition-all duration-200 ${
                        digit
                          ? 'border-primary bg-white dark:bg-slate-800 text-gray-900 dark:text-white'
                          : 'border-transparent bg-gray-50 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-900 text-gray-900 dark:text-white'
                      } focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={isLoading}
                    />
                  ))}
                </div>
                {error && otp.some(digit => !digit) && (
                  <p className="mt-1 text-sm text-red-500">Please enter the complete verification code</p>
                )}
            </div>

            {/* Timer and Resend */}
            <div className="flex flex-col items-center gap-3">
                <div className="px-4 py-2 bg-gray-50 dark:bg-slate-800 rounded-full flex items-center gap-2">
                  <span className="material-symbols-outlined text-gray-400 text-sm">schedule</span>
                  <span className="text-gray-600 dark:text-gray-300 font-semibold text-sm">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-[#637588] dark:text-[#8d9ba8]">
                    Didn't receive code?{' '}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      disabled={timeLeft > 0 || isLoading}
                      className="text-primary font-semibold hover:text-primary-dark ml-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Resend Code
                    </button>
                  </p>
                  {resendsRemaining !== null && resendsRemaining >= 0 && !resendLimitReached && (
                    <p className="text-xs text-[#637588] dark:text-[#8d9ba8]">
                      {resendsRemaining} resend{resendsRemaining !== 1 ? 's' : ''} remaining
                    </p>
                  )}
                  {resendLimitReached && nextResendAt && (
                    <p className="text-xs text-red-500 dark:text-red-400">
                      Resend limit reached. Try again in {formatTime(Math.max(0, Math.floor((new Date(nextResendAt) - new Date()) / 1000)))}
                    </p>
                  )}
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTP

