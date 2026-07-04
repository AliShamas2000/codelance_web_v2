import React from 'react'
import Shimmer from './Shimmer'

const ContactShimmer = () => (
  <section
    className="relative min-h-screen flex items-center justify-center pt-24 pb-12 bg-background-light dark:bg-background-dark"
    id="contact"
    aria-busy="true"
    aria-label="Loading contact section"
  >
    <div className="relative z-10 w-full max-w-[1400px] px-6 lg:px-12 grid lg:grid-cols-2 lg:gap-16 gap-8 items-center">
      <div className="space-y-12">
        <div className="space-y-6">
          <Shimmer className="h-12 w-3/4 max-w-md" />
          <Shimmer className="h-5 w-full max-w-lg" />
          <Shimmer className="h-5 w-5/6 max-w-md" />
        </div>

        <div className="space-y-4">
          {[0, 1, 2].map((item) => (
            <div key={item} className="flex items-center gap-4">
              <Shimmer className="size-12 shrink-0" rounded="rounded-full" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4 w-20" />
                <Shimmer className="h-5 w-40" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-8 rounded-2xl space-y-5">
        <Shimmer className="h-12 w-full" rounded="rounded-lg" />
        <Shimmer className="h-12 w-full" rounded="rounded-lg" />
        <Shimmer className="h-12 w-full" rounded="rounded-lg" />
        <Shimmer className="h-32 w-full" rounded="rounded-lg" />
        <Shimmer className="h-12 w-full" rounded="rounded-lg" />
      </div>
    </div>
  </section>
)

export default ContactShimmer
