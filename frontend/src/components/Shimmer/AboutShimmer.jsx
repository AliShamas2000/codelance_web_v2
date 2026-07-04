import React from 'react'
import Shimmer from './Shimmer'

const AboutShimmer = () => (
  <section
    className="min-h-screen lg:py-32 py-16 flex items-center bg-background-light dark:bg-background-dark overflow-hidden"
    id="about"
    aria-busy="true"
    aria-label="Loading about section"
  >
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center">
      <div className="relative h-[600px] flex items-center justify-center">
        <div className="relative w-full h-full max-w-lg">
          <Shimmer className="absolute top-0 left-0 w-3/4 h-64 -rotate-3 z-10" rounded="rounded-2xl" />
          <Shimmer className="absolute bottom-10 right-0 w-3/4 h-56 rotate-6 z-20" rounded="rounded-2xl" />
          <Shimmer className="absolute top-1/4 right-1/4 w-12 h-12 z-30" rounded="rounded-full" />
        </div>
      </div>

      <div className="flex flex-col space-y-10 text-center lg:text-left">
        <div className="space-y-6">
          <Shimmer className="h-12 w-3/4 max-w-sm mx-auto lg:mx-0" />
          <Shimmer className="h-5 w-full max-w-xl mx-auto lg:mx-0" />
          <Shimmer className="h-5 w-full max-w-lg mx-auto lg:mx-0" />
          <Shimmer className="h-5 w-2/3 max-w-md mx-auto lg:mx-0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 w-full">
          {[0, 1, 2].map((item) => (
            <Shimmer key={item} className="h-28 w-full" rounded="rounded-3xl" />
          ))}
        </div>
      </div>
    </div>
  </section>
)

export default AboutShimmer
