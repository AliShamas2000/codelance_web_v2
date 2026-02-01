import React from 'react'

const Test = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-navy-deep dark:text-white transition-colors duration-300 overflow-x-hidden">
      {/* Sticky Glass Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header border-b border-navy-deep/5 dark:border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex h-20 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary flex items-center justify-center rounded-lg text-white">
              <svg className="size-6" fill="currentColor" viewBox="0 0 48 48">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
              </svg>
            </div>
            <h2 className="text-xl font-extrabold tracking-tighter text-navy-deep dark:text-white">CODELANCE</h2>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#services">Services</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#portfolio">Portfolio</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#about">About</a>
            <a className="text-sm font-semibold hover:text-primary transition-colors" href="#contact">Contact</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex bg-primary text-white text-sm font-bold px-6 py-2.5 rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95">
              Get Started
            </button>
            <div 
              className="size-10 rounded-full bg-cover bg-center border-2 border-primary" 
              data-alt="User profile avatar portrait" 
              style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD-DxrM5xjwHS4qwWvMqpwtAOBpZqGINUO6U0SJwu0bjNSH1eZTMjdf7G9pdbuQEL0cA9m7VmQDyH86YVJxdXa8swLB8_BPFAevQM8tLRBUX-WWEq6Taqei4yJV4YfQvTB3sM3NubC00e0WpiQMGWChvLNSU4qMspylOEUlcMjXmcY4qG_kYm4pfr7uv6QXgjqjynRyWMFmKxRuq725zVL9o4qS0Y3ZEEsUieti5MPY6jdwaVlp1mdE01HuuFVAfy62jR7wPpuxtN0")'}}
            ></div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative min-h-screen flex items-center pt-20 bg-mesh overflow-hidden">
        {/* Subtle Tech Shapes Background */}
        <div className="absolute inset-0 pointer-events-none opacity-40">
          <div className="absolute top-[20%] left-[10%] size-64 border border-primary/20 rounded-full"></div>
          <div className="absolute bottom-[10%] right-[15%] size-96 border border-navy-deep/10 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
            <svg className="stroke-primary/10" height="100%" width="100%">
              <pattern height="80" id="grid" patternUnits="userSpaceOnUse" width="80">
                <path d="M 80 0 L 0 0 0 80" fill="none" strokeWidth="0.5"></path>
              </pattern>
              <rect fill="url(#grid)" height="100%" width="100%"></rect>
            </svg>
          </div>
        </div>

        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left Content */}
          <div className="flex flex-col space-y-8 max-w-2xl">
            <div className="space-y-4">
              <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
                Innovating the Digital Future
              </span>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold leading-[1.1] text-navy-deep dark:text-white">
                We Build <span className="text-primary">Digital</span> Experiences
              </h1>
              <p className="text-lg md:text-xl text-navy-deep/70 dark:text-white/70 leading-relaxed font-medium">
                Websites, Mobile Apps, POS Systems, AI Solutions, and everything your business needs to scale in the modern era.
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="bg-primary text-white text-base font-bold px-10 py-4 rounded-xl hover:shadow-xl hover:shadow-primary/40 transition-all active:scale-95 flex items-center gap-2 group">
                Start a Project
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
              </button>
              <button className="border-2 border-navy-deep dark:border-white/20 text-navy-deep dark:text-white text-base font-bold px-10 py-4 rounded-xl hover:bg-navy-deep hover:text-white dark:hover:bg-white dark:hover:text-navy-deep transition-all active:scale-95">
                See Our Work
              </button>
            </div>
            <div className="flex items-center gap-6 pt-4">
              <div className="flex -space-x-3">
                <div 
                  className="size-10 rounded-full border-2 border-white bg-slate-200 bg-cover" 
                  data-alt="Client profile photo 1" 
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDfv7s0BL7kpE8SISu54KVmV72eRDoDTpvQ8dhtMG1qQU5n_GK2Snd4Vjr55j0ooK1FEldAxM4bCBg4R0OqBqVhxlKvf8shv_n_fzUvdkPg30WnkCmfM_v_iOx3PsQiBgnKGEtdz1XXl35DISOiuH_HMAr2sZXbJ0qyqLCg4R9pd9rzf2dpnOATCWeEWgQW4lPyZPAjevyW4-eaFYuFq251ojBo-a7gKmU7zLWoDVzSVGFXUYm8K8Mb7tYty5nw3HzVt-0WE7LtqnM')"}}
                ></div>
                <div 
                  className="size-10 rounded-full border-2 border-white bg-slate-200 bg-cover" 
                  data-alt="Client profile photo 2" 
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDDUvdthqBlOw2krhbdYetVoVNGO78DBhy4CqMC_iZM7rDvgJ1_9vEWbma35iVuge12fhxCdWA8zifXSrOAkwfcE-1pxC6XIvLzZbQWxPz1C4P_oOVWX7TCXk0FPp9ddniOUa7OgviV5QxiGKZzHqn3aE2XsKV87lYbXQnDd9VVcvVXuwA3SyQigHzhAvMS9ZHsIXdJJGL2XNe7OYq-RogQayWvr0C2qUVxls9w8Qx0G-a99Yv11iARhfLK-f6h7ki1Ez8-7EdjISA')"}}
                ></div>
                <div 
                  className="size-10 rounded-full border-2 border-white bg-slate-200 bg-cover" 
                  data-alt="Client profile photo 3" 
                  style={{backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4sHYaTCtwN4xNJkvlxhkCYB7jPi5ow1w4AC1m-QZdcBJ5BZRxO9q2MWa4ZKNfqNhW5Hhqs-FeOLYFl7L-wP5Ilk6LD1ITMu_W4w9BKRmuYApYKlmws-saMeXvEDDlW14VknoKOQ6AJF2ywQJj7LxBkE3Q125GChnjZh09XmNh4dEcOJ_AwIh1Y38gZaxwTBPqzXlmHB1oagCYyloXE1ikBQXIAvGcSaH-HwX-HExE2Rrb_msDBTaiRmK5dQzB2w1BG9eO9LvTa_I')"}}
                ></div>
                <div className="size-10 rounded-full border-2 border-white bg-primary flex items-center justify-center text-[10px] text-white font-bold">50+</div>
              </div>
              <p className="text-sm font-semibold text-navy-deep/60 dark:text-white/60">Trusted by global startups and enterprises</p>
            </div>
          </div>

          {/* Right Content: 3D/Glassy Illustration */}
          <div className="relative hidden lg:block h-[600px] w-full floating">
            {/* POS Interface */}
            <div className="absolute top-[10%] right-0 w-[80%] h-[350px] glass-card rounded-2xl shadow-2xl p-6 transform translate-x-10 rotate-3 z-0">
              <div className="flex justify-between items-center mb-6">
                <div className="h-6 w-32 bg-primary/20 rounded-full"></div>
                <div className="size-8 rounded-full bg-navy-deep/10"></div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-32 bg-white/40 dark:bg-white/5 rounded-lg border border-white/30"></div>
                <div className="h-32 bg-white/40 dark:bg-white/5 rounded-lg border border-white/30"></div>
                <div className="h-32 bg-white/40 dark:bg-white/5 rounded-lg border border-white/30"></div>
                <div className="col-span-3 h-24 bg-primary/5 rounded-lg border border-primary/20 flex items-center px-4">
                  <div className="h-2 w-40 bg-primary/30 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Web Interface */}
            <div className="absolute top-[25%] left-0 w-[85%] h-[400px] glass-card rounded-2xl shadow-2xl p-8 transform -rotate-2 z-10 border-white/50">
              <div className="flex gap-2 mb-8">
                <div className="size-3 rounded-full bg-red-400/60"></div>
                <div className="size-3 rounded-full bg-yellow-400/60"></div>
                <div className="size-3 rounded-full bg-green-400/60"></div>
              </div>
              <div className="flex gap-10 h-full">
                <div className="w-1/3 space-y-4">
                  <div className="h-8 w-full bg-navy-deep/10 rounded-lg"></div>
                  <div className="h-4 w-[80%] bg-navy-deep/5 rounded-lg"></div>
                  <div className="h-4 w-[60%] bg-navy-deep/5 rounded-lg"></div>
                  <div className="h-10 w-32 bg-primary rounded-lg mt-10"></div>
                </div>
                <div className="flex-1 rounded-xl bg-gradient-to-br from-primary/10 to-primary/30 border border-primary/10 flex items-center justify-center">
                  <div className="size-16 rounded-full bg-white/80 shadow-lg flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined !text-4xl">play_arrow</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Interface */}
            <div className="absolute bottom-[5%] right-10 w-[240px] h-[480px] bg-navy-deep rounded-[40px] border-8 border-navy-deep/20 shadow-2xl z-20 overflow-hidden transform translate-x-4 -rotate-6">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-navy-deep rounded-b-2xl"></div>
              <div className="p-6 h-full flex flex-col bg-white dark:bg-[#1a2c33]">
                <div className="mt-8 space-y-6">
                  <div className="h-32 w-full bg-primary/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary !text-5xl">cloud_queue</span>
                  </div>
                  <div className="h-6 w-full bg-navy-deep/10 rounded-lg"></div>
                  <div className="h-4 w-[80%] bg-navy-deep/5 rounded-lg"></div>
                  <div className="space-y-3 mt-4">
                    <div className="flex justify-between items-center p-3 bg-primary/5 rounded-xl">
                      <div className="size-8 rounded-lg bg-primary/20"></div>
                      <div className="flex-1 px-3 h-3 bg-primary/10 rounded-full"></div>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-navy-deep/5 rounded-xl">
                      <div className="size-8 rounded-lg bg-navy-deep/10"></div>
                      <div className="flex-1 px-3 h-3 bg-navy-deep/5 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-auto h-12 w-full bg-primary rounded-xl flex items-center justify-center">
                  <div className="h-2 w-12 bg-white/40 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="text-[10px] font-bold uppercase tracking-widest">Scroll to Explore</span>
          <div className="w-6 h-10 border-2 border-navy-deep dark:border-white rounded-full flex justify-center p-1.5">
            <div className="w-1 h-2 bg-navy-deep dark:bg-white rounded-full animate-bounce"></div>
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <footer className="bg-white dark:bg-background-dark py-12 border-t border-navy-deep/5 dark:border-white/5">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3">
            <div className="size-7 bg-navy-deep dark:bg-white flex items-center justify-center rounded-lg text-white dark:text-navy-deep">
              <svg className="size-4" fill="currentColor" viewBox="0 0 48 48">
                <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z"></path>
              </svg>
            </div>
            <h2 className="text-sm font-extrabold tracking-tighter">CODELANCE</h2>
          </div>
          <div className="flex gap-8 text-sm font-medium text-navy-deep/60 dark:text-white/60">
            <a className="hover:text-primary transition-colors" href="#privacy">Privacy Policy</a>
            <a className="hover:text-primary transition-colors" href="#terms">Terms of Service</a>
            <a className="hover:text-primary transition-colors" href="#cookies">Cookie Policy</a>
          </div>
          <p className="text-xs font-bold text-navy-deep/40 dark:text-white/40">© 2024 CODELANCE INC. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>
    </div>
  )
}

export default Test

