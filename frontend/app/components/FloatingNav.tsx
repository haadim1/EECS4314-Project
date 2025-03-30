'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FloatingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <>
      {/* Desktop Navigation */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full border border-white/40 dark:border-gray-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-3 py-2 flex items-center justify-center">
          <nav className="flex items-center space-x-3">
            <Link 
              href="/" 
              className="text-sm font-bold bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent px-3 py-1.5 rounded-full hover:bg-white/10 transition-all duration-300 transform hover:scale-110"
            >
              SalonAI
            </Link>
            
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <Link 
              href="/features" 
              className="text-sm font-medium text-gray-800 dark:text-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-110"
            >
              Features
            </Link>
            
            <Link 
              href="/about" 
              className="text-sm font-medium text-gray-800 dark:text-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-110"
            >
              About
            </Link>
            
            <div className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-1"></div>
            
            <Link 
              href="/login" 
              className="text-sm font-medium text-gray-800 dark:text-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-800/70 transition-all duration-300 transform hover:scale-110"
            >
              Login
            </Link>
            
            <Link 
              href="/signup" 
              className="text-sm font-medium bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-4 py-1.5 rounded-full hover:shadow-md transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5"
            >
              Sign Up
            </Link>
          </nav>
        </div>
        
        {/* Add a subtle glow effect under the navbar */}
        <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-transparent via-[var(--primary)]/20 to-transparent blur-xl rounded-full"></div>
      </div>
      
      {/* Mobile Navigation */}
      <div className="fixed top-4 left-0 right-0 z-50 flex md:hidden justify-center">
        <div 
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md rounded-full border border-white/40 dark:border-gray-700/40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-3 py-2 flex items-center justify-between"
          style={{ width: 'calc(100% - 2rem)', maxWidth: '20rem' }}
        >
          <Link 
            href="/" 
            className="text-sm font-bold bg-gradient-to-r from-[var(--secondary)] to-[var(--primary)] bg-clip-text text-transparent"
          >
            SalonAI
          </Link>
          
          <div className="flex items-center space-x-2">
            <Link 
              href="/signup" 
              className="text-xs font-medium bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white px-3 py-1 rounded-full"
            >
              Sign Up
            </Link>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-full hover:bg-gray-100/70 dark:hover:bg-gray-800/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="fixed top-16 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg rounded-lg mx-4 p-4 border border-gray-200 dark:border-gray-800 z-50">
            <nav className="flex flex-col space-y-3">
              <Link 
                href="/features" 
                className="text-gray-800 dark:text-gray-100 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-800 dark:text-gray-100 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="text-gray-800 dark:text-gray-100 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
              <Link 
                href="/login" 
                className="text-gray-800 dark:text-gray-100 font-medium px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
              <Link 
                href="/signup" 
                className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white font-medium px-3 py-2 rounded-md text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign Up
              </Link>
            </nav>
          </div>
        )}
      </div>
    </>
  );
} 