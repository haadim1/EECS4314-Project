'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="container-custom py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold gradient-text">
            SalonAI
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6 mr-6">
            <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors text-sm font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors text-sm font-medium">
              About
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/login" className="text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full px-5 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Login
            </Link>
            <Link href="/signup" className="text-sm font-medium bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full px-5 py-1.5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
              Sign Up
            </Link>
          </div>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-gray-700 dark:text-gray-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            )}
          </svg>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-4">
          <div className="container-custom flex flex-col space-y-4">
            <Link href="/features" className="text-gray-700 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 dark:text-gray-300 hover:text-[var(--primary)] dark:hover:text-white transition-colors">
              About
            </Link>
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
              <Link href="/login" className="text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded-full py-2 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Login
              </Link>
              <Link href="/signup" className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white rounded-full py-2 text-center hover:shadow-md transition-all duration-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 