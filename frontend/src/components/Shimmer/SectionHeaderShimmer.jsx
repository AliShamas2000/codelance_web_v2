import React from 'react'
import Shimmer from './Shimmer'

const SectionHeaderShimmer = ({ centered = true, showBadge = false }) => (
  <div className={`py-8 ${centered ? 'text-center' : ''}`}>
    {showBadge && (
      <Shimmer className="h-6 w-28 mx-auto mb-4" rounded="rounded-full" />
    )}
    <Shimmer className={`h-10 w-64 mb-4 ${centered ? 'mx-auto' : ''}`} rounded="rounded-lg" />
    <Shimmer className={`h-1 w-24 mb-6 ${centered ? 'mx-auto' : ''}`} rounded="rounded-full" />
    <Shimmer className={`h-5 w-full max-w-xl ${centered ? 'mx-auto' : ''}`} />
    <Shimmer className={`h-5 w-4/5 max-w-lg mt-2 ${centered ? 'mx-auto' : ''}`} />
  </div>
)

export default SectionHeaderShimmer
