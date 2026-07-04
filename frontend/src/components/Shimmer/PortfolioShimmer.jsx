import React from 'react'
import Shimmer from './Shimmer'
import SectionHeaderShimmer from './SectionHeaderShimmer'

const PortfolioShimmer = () => (
  <div aria-busy="true" aria-label="Loading portfolio">
    <SectionHeaderShimmer showBadge centered />

    <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
      {[0, 1, 2, 3, 4].map((item) => (
        <Shimmer key={item} className="h-10 w-28" rounded="rounded-full" />
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="overflow-hidden rounded-xl bg-white dark:bg-gray-900">
          <Shimmer className="w-full h-56" rounded="rounded-none" />
          <div className="p-6 space-y-3">
            <Shimmer className="h-6 w-2/3" />
            <div className="flex gap-2">
              <Shimmer className="h-6 w-16" rounded="rounded-full" />
              <Shimmer className="h-6 w-20" rounded="rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
)

export default PortfolioShimmer
