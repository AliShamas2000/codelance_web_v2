import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook for scroll reveal animations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Intersection threshold (0-1)
 * @param {string} options.rootMargin - Root margin for intersection observer
 * @param {boolean} options.once - Whether to animate only once (default: true)
 * @returns {[boolean, React.RefObject]} - [isVisible, ref]
 */
const useScrollReveal = ({
  threshold = 0.2,
  rootMargin = '0px 0px -100px 0px',
  once = true
} = {}) => {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            if (once) {
              observer.disconnect()
            }
          } else if (!once) {
            setIsVisible(false)
          }
        })
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [threshold, rootMargin, once])

  return [isVisible, ref]
}

export default useScrollReveal

