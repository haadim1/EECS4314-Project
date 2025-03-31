'use client'

import FloatingNav from './components/FloatingNav'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

export default function Home() {
 


  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNav />
      <main className="flex-grow">
        <HeroSection />
        <FeaturesSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
