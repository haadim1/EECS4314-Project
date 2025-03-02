'use client';

import { FC, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import Image from 'next/image';

type TestimonialProps = {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
  delay?: number;
};

const Testimonial: FC<TestimonialProps> = ({ quote, author, role = "Client", avatarUrl, delay = 0 }) => {
  const [inViewRef, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <div 
      ref={inViewRef}
      className={`bg-white rounded-xl p-8 shadow-md transition-all duration-500 transform ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } hover:shadow-lg`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mb-4">
        {/* Quote icon */}
        <svg className="w-10 h-10 text-[var(--primary)]/20" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
        </svg>
      </div>
      <p className="text-gray-700 mb-6 italic relative">{quote}</p>
      <div className="flex items-center">
        <div className="mr-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden">
            {avatarUrl ? (
              <Image src={avatarUrl} alt={author} width={48} height={48} className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[var(--primary)]">
                <span className="text-white font-medium text-lg">{author.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>
        <div>
          <p className="text-[var(--secondary)] font-medium">{author}</p>
          <p className="text-gray-500 text-sm">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  
  const testimonials = [
    { 
      quote: "SalonAI completely changed how I manage my salon. Scheduling is a breeze now and my clients love the personalized recommendations!",
      author: "Sarah M.",
      role: "Salon Owner, Glow Beauty",
    },
    { 
      quote: "My clients love the personalized style recommendations. It's like having a digital stylist that knows exactly what will look good on them!",
      author: "David L.",
      role: "Hair Stylist, Chic Cuts",
    },
    { 
      quote: "The AI scheduling has increased my bookings by 30%. The system optimizes my calendar perfectly and clients can book 24/7.",
      author: "Jennifer K.",
      role: "Salon Manager, Pure Elegance",
    },
    { 
      quote: "I was skeptical about AI for my salon, but SalonAI proved me wrong. It's intuitive, powerful, and my staff adapted to it in no time.",
      author: "Michael P.",
      role: "Owner, Urban Style",
    },
  ];
  
  const displayedTestimonials = [
    testimonials[currentIndex % testimonials.length],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];
  
  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-[var(--gray-bg)] relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[url('/dot-pattern.svg')] opacity-5"></div>
      <div className="absolute left-0 top-1/4 w-72 h-72 bg-[var(--primary)]/10 rounded-full filter blur-3xl"></div>
      <div className="absolute right-0 bottom-1/4 w-72 h-72 bg-[var(--secondary)]/10 rounded-full filter blur-3xl"></div>
      
      <div className="container-custom relative z-10">
        <div 
          ref={headerRef}
          className={`text-center mb-16 transition-all duration-700 ${
            headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <span className="inline-block px-4 py-1 rounded-full bg-[var(--secondary)]/10 text-[var(--secondary)] text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[var(--secondary)]">
            What Our Clients Say
          </h2>
          <p className="max-w-2xl mx-auto text-gray-600">
            Don&apos;t just take our word for it. Hear from salon owners and stylists who have transformed their businesses with SalonAI.
          </p>
        </div>
        
        {/* Mobile view: single column testimonials */}
        <div className="block md:hidden">
          {isClient && (
            <div className="relative">
              <div className="grid grid-cols-1 gap-8">
                <Testimonial {...displayedTestimonials[0]} delay={100} />
              </div>
              
              {/* Navigation controls */}
              <div className="flex justify-center mt-8 gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-[var(--primary)]' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Desktop view: two column testimonials with navigation */}
        <div className="hidden md:block">
          {isClient && (
            <div className="relative">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Testimonial {...displayedTestimonials[0]} delay={100} />
                <Testimonial {...displayedTestimonials[1]} delay={200} />
              </div>
              
              {/* Navigation controls */}
              <div className="flex justify-center mt-12 gap-4">
                <button 
                  onClick={prevTestimonial} 
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[var(--primary)] hover:text-white hover:border-transparent transition-colors"
                  aria-label="Previous testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button 
                  onClick={nextTestimonial} 
                  className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-[var(--primary)] hover:text-white hover:border-transparent transition-colors"
                  aria-label="Next testimonial"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Contact CTA */}
        <div className="mt-20">
          <div className="bg-white rounded-xl p-8 md:p-10 shadow-lg flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold text-[var(--secondary)] mb-4">Want to learn more?</h3>
              <p className="text-gray-600 max-w-2xl">
                Schedule a free demo with our team to see how SalonAI can help your business grow.
              </p>
            </div>
            <a href="/contact" className="btn-primary whitespace-nowrap py-3 px-8">Request a Demo</a>
          </div>
        </div>
      </div>
    </section>
  );
} 