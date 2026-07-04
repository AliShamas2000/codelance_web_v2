import React from 'react'
import Shimmer from './Shimmer'
import SectionHeaderShimmer from './SectionHeaderShimmer'

const ServicesShimmer = () => (
  <div aria-busy="true" aria-label="Loading services">
    <SectionHeaderShimmer showBadge centered />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {[0, 1, 2, 3, 4, 5, 6, 7].map((item) => (
        <div
          key={item}
          className="flex flex-col gap-4 p-8 rounded-xl border border-white/50 dark:border-white/10 bg-white/50 dark:bg-gray-900/50"
        >
          <Shimmer className="size-12" rounded="rounded-lg" />
          <Shimmer className="h-6 w-3/4" />
          <Shimmer className="h-4 w-full" />
          <Shimmer className="h-4 w-5/6" />
        </div>
      ))}
    </div>
  </div>
)

export default ServicesShimmer
