import React from 'react'
import Shimmer from './Shimmer'
import SectionHeaderShimmer from './SectionHeaderShimmer'

const ReviewsShimmer = () => (
  <div aria-busy="true" aria-label="Loading reviews">
    <SectionHeaderShimmer centered />

    <div className="relative flex items-center justify-center py-8">
      <div className="hidden lg:block w-72 shrink-0">
        <Shimmer className="h-64 w-full" rounded="rounded-2xl" />
      </div>

      <div className="w-full max-w-2xl mx-4">
        <Shimmer className="h-72 w-full" rounded="rounded-2xl" />
        <div className="flex items-center gap-4 mt-8">
          <Shimmer className="size-14 shrink-0" rounded="rounded-full" />
          <div className="flex-1 space-y-2">
            <Shimmer className="h-5 w-40" />
            <Shimmer className="h-4 w-28" />
          </div>
        </div>
      </div>

      <div className="hidden lg:block w-72 shrink-0">
        <Shimmer className="h-64 w-full" rounded="rounded-2xl" />
      </div>
    </div>

    <div className="flex justify-center gap-2 mt-4">
      {[0, 1, 2].map((item) => (
        <Shimmer key={item} className="size-2" rounded="rounded-full" />
      ))}
    </div>
  </div>
)

export default ReviewsShimmer
