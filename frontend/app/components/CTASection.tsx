'use client';

import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

export default function CTASection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--secondary)] to-[var(--secondary-light)] -skew-y-3 origin-top-right transform scale-110"></div>
      
      {/* Decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full"></div>
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-white/5 rounded-full"></div>
      </div>
      
      <div className="container-custom relative z-10">
        <div 
          ref={ref}
          className={`text-center max-w-3xl mx-auto transition-all duration-700 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-white leading-tight">
            Ready to Elevate Your<br className="hidden md:block" /> Salon Experience?
          </h2>
          
          <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of salon professionals who are growing their business with SalonAI. 
            Start your free 14-day trial today — no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/signup" 
              className="bg-white text-[var(--secondary)] hover:bg-gray-100 px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transform transition-all duration-300 hover:-translate-y-1 group flex items-center"
            >
              Start Free Trial
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                className="w-5 h-5 ml-2 transform transition-transform group-hover:translate-x-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            
            <Link 
              href="/demo" 
              className="bg-transparent text-white border border-white/30 backdrop-blur-sm hover:bg-white/10 px-8 py-4 rounded-full font-medium transition-all duration-300"
            >
              Schedule a Demo
            </Link>
          </div>
          
          <div className="mt-10 text-white/80 text-sm">
            <p>No credit card required. Cancel anytime.</p>
          </div>
        </div>
        
        {/* Trust badges */}
        <div className={`mt-16 transition-all duration-700 delay-300 ${
            inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="text-white text-center">
              <div className="font-bold text-2xl md:text-3xl">4.9/5</div>
              <div className="text-white/60 text-sm mt-1">Customer Rating</div>
            </div>
            <div className="text-white text-center">
              <div className="font-bold text-2xl md:text-3xl">10k+</div>
              <div className="text-white/60 text-sm mt-1">Active Users</div>
            </div>
            <div className="text-white text-center">
              <div className="font-bold text-2xl md:text-3xl">99.9%</div>
              <div className="text-white/60 text-sm mt-1">Uptime</div>
            </div>
            <div className="text-white text-center">
              <div className="font-bold text-2xl md:text-3xl">24/7</div>
              <div className="text-white/60 text-sm mt-1">Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 