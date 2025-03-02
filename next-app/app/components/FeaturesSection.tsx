'use client';

import { FC, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

type FeatureCardProps = {
  title: string;
  description: string;
  className?: string;
  icon: React.ReactNode;
  delay?: number;
};

const FeatureCard: FC<FeatureCardProps> = ({ title, description, className = '', icon, delay = 0 }) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div 
      ref={inViewRef}
      className={`rounded-lg p-8 text-white shadow-lg transition-all duration-500 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-6 text-white/90 w-14 h-14 rounded-full bg-white/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-xl md:text-2xl font-semibold mb-4">{title}</h3>
      <p className="text-white/90">{description}</p>
      <div className="mt-6 pt-4 border-t border-white/10">
        <a href="#" className="inline-flex items-center text-sm font-medium text-white group">
          Learn more
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
            className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default function FeaturesSection() {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section className="py-20 bg-white relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-[var(--gray-bg)] to-transparent opacity-70"></div>
      <div className="absolute right-0 top-1/3 w-64 h-64 bg-[var(--primary)]/5 rounded-full filter blur-3xl"></div>
      <div className="absolute left-0 bottom-1/4 w-64 h-64 bg-[var(--secondary)]/5 rounded-full filter blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-sm font-medium mb-4">
            Why SalonAI?
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--secondary)]">
            Transforming Salon Management
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Our platform brings cutting-edge AI technology to streamline your salon operations,
            delight your clients, and boost your revenue.
          </p>
        </div>
        
        {isClient && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              title="AI-Powered Scheduling" 
              description="Never worry about double bookings. Let AI optimize your schedule and maximize revenue with smart client allocation."
              className="bg-[var(--primary)]"
              delay={100}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Personalized Hairstyle Recommendations" 
              description="Leverage AI to analyze face shape, hair type, and trends to provide customized style and color suggestions for each client."
              className="bg-[var(--secondary)]"
              delay={200}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
              }
            />
            
            <FeatureCard 
              title="Effortless Management" 
              description="Handle client bookings, staff schedules, inventory, and pricing all in one intuitive platform designed for busy salon owners."
              className="bg-[var(--accent)]"
              delay={300}
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              }
            />
          </div>
        )}
        
        {/* Mobile app preview - decorative element */}
        <div className="mt-20 text-center">
          <div className="bg-gradient-to-r from-[var(--primary)]/10 to-[var(--accent)]/10 p-10 rounded-2xl relative overflow-hidden mx-auto max-w-6xl">
            <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5"></div>
            <h3 className="text-2xl font-bold text-[var(--secondary)] mb-6">Available on Web, iOS, and Android</h3>
            <p className="mb-8 text-gray-600 max-w-2xl mx-auto">
              Manage your salon on the go. Our mobile apps keep you connected with your business from anywhere.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#" className="btn-primary flex items-center px-6 py-3 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                iOS App
              </a>
              <a href="#" className="btn-secondary flex items-center px-6 py-3 gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" />
                </svg>
                Android App
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 