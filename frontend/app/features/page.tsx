'use client';

import FloatingNav from '@/app/components/FloatingNav';
import Footer from '@/app/components/Footer';

export default function FeaturesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNav />
      <main className="flex-grow pt-24 pb-16 bg-[var(--gray-bg)]">
        <div className="container-custom max-w-6xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent">
              Features & Services
            </h1>

            {/* Client Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-[var(--primary)] mb-6">
                For Clients
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">
                    Easy Appointment Booking
                  </h3>
                  <p className="text-sm text-gray-600">
                    Book appointments with your favorite stylists instantly. Choose your preferred time, 
                    date, and service with our user-friendly booking system.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">
                    AI Style Recommendations
                  </h3>
                  <p className="text-sm text-gray-600">
                    Receive personalized hairstyle suggestions based on your preferences, face shape, 
                    and hair type using our advanced AI technology.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">
                    Service History
                  </h3>
                  <p className="text-sm text-gray-600">
                    Keep track of your past appointments, favorite styles, and maintain a history of 
                    your hair care journey.
                  </p>
                </div>
              </div>
            </div>

            {/* Stylist Features */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-[var(--primary)] mb-6">
                For Stylists
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">
                    Schedule Management
                  </h3>
                  <p className="text-sm text-gray-600">
                    Efficiently manage your appointments, set availability, and organize your work 
                    schedule with our intuitive calendar system.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">
                    Client Portfolio
                  </h3>
                  <p className="text-sm text-gray-600">
                    Build and maintain detailed client profiles, including style preferences, hair 
                    history, and special notes for personalized service.
                  </p>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-[var(--primary)] mb-3">
                    Business Analytics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Access insights about your business performance, client retention, and popular 
                    services to optimize your offerings.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Features */}
            <div>
              <h2 className="text-2xl font-semibold text-[var(--primary)] mb-6">
                Additional Features
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span className="text-gray-600">Real-time notifications and reminders</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span className="text-gray-600">Secure payment processing</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span className="text-gray-600">Review and rating system</span>
                  </li>
                </ul>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span className="text-gray-600">Mobile-friendly interface</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span className="text-gray-600">24/7 customer support</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-[var(--primary)]">•</span>
                    <span className="text-gray-600">Integrated messaging system</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}