'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative py-24 md:py-36 text-white overflow-hidden">
      {/* Background gradient with animated effect */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-800 via-gray-700 to-gray-600 z-0">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-repeat opacity-5"></div>
          {/* Animated gradient orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--primary)]/30 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[var(--secondary)]/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>
      
      <div className="container-custom relative z-10 mb-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className={`transition-all duration-1000 transform ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
            <span className="accent-font text-lg md:text-xl bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-white opacity-90 mb-3 inline-block">Modern Salon Management</span>
            
            <h1 className="display-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              <span className="accent-heading block mb-1">AI-Powered</span> 
              Salon Management
            </h1>
            
            <p className="body-lg text-lg md:text-xl mb-10 text-gray-100 transition-all duration-1000 delay-300" 
              style={{ transitionDelay: '150ms' }}>
              Automate scheduling, get AI powered hairstyle recommendations, and manage your salon effortlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-500"
              style={{ transitionDelay: '300ms' }}>
              <Link href="/booking" className="btn-primary py-3 px-8 text-lg rounded-full flex items-center justify-center gap-2 group">
                Book an Appointment
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/features" className="bg-white/10 backdrop-blur-sm text-white py-3 px-8 rounded-full border border-white/20 hover:bg-white/20 transition duration-300">
                Learn More
              </Link>
            </div>
          </div>
        </div>
        
        {/* Stylized decorative elements */}
        <div className="hidden lg:block absolute -bottom-8 left-1/2 transform -translate-x-1/2 z-20 translate-y-[100px]">
          <div className="flex justify-center">
            <div className="w-20 h-20 relative">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-full animate-ping" style={{ animationDuration: '3s' }}></div>
              <div className="absolute inset-3 bg-white/10 backdrop-blur-sm rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '0.5s' }}></div>
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 animate-bounce" style={{ animationDuration: '2s' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Wave Separator */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-0 transform">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 text-white">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-current"></path>
        </svg>
      </div> */}
    </section>
  );
} 