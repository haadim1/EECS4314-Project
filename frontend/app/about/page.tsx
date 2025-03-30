'use client';

import FloatingNav from '@/app/components/FloatingNav';
import Footer from '@/app/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNav />
      <main className="flex-grow pt-24 pb-16 bg-[var(--gray-bg)]">
        <div className="container-custom max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
              About SalonAI
            </h1>
            
            <div className="space-y-6 text-gray-600">
              <p className="leading-relaxed">
                SalonAI is a revolutionary platform that combines the artistry of hairstyling with 
                the power of artificial intelligence. We're transforming the way people connect with 
                hair care professionals, making it easier than ever to achieve your perfect look.
              </p>

              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[var(--primary)] mb-3">
                    Our Mission
                  </h3>
                  <p className="text-sm">
                    To revolutionize the hair care industry by providing a seamless, 
                    AI-powered platform that connects clients with talented stylists, 
                    ensuring everyone can access professional hair care services with ease.
                  </p>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-[var(--primary)] mb-3">
                    Our Vision
                  </h3>
                  <p className="text-sm">
                    To create a world where finding and booking the perfect hairstylist 
                    is as easy as a few clicks, powered by innovative AI technology that 
                    understands your unique style preferences.
                  </p>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-semibold text-[var(--primary)] mb-4">
                  Why Choose SalonAI?
                </h2>
                <ul className="grid md:grid-cols-2 gap-4">
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span>AI-powered style recommendations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span>Easy online booking system</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span>Professional stylist network</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span>Personalized experience</span>
                  </li>
                </ul>
              </div>

              <div className="mt-12 text-center">
                <p className="text-sm text-gray-500">
                  Have questions? Contact us at{' '}
                  <a href="mailto:support@salonai.com" className="text-[var(--primary)] hover:underline">
                    support@salonai.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}