'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuth from '@/app/hooks/useAuth'
import FloatingNav from './components/FloatingNav'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import TestimonialsSection from './components/TestimonialsSection'
import CTASection from './components/CTASection'
import Footer from './components/Footer'

export default function Home() {
  const router = useRouter()
  const { loading, isAuthenticated, role } = useAuth(false)

  useEffect(() => {
    if (!loading && isAuthenticated) {
      if (role === 'barber') {
        router.push('/dashboard/barberDash')
      } else {
        router.push('/dashboard/clientDash')
      }
    }
  }, [loading, isAuthenticated, role, router])

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
