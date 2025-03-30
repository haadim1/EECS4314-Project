'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FloatingNav from '@/app/components/FloatingNav';
import Footer from '@/app/components/Footer';
import API from '@/api/axios'; 

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'stylist' | 'client'>('stylist');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy to continue');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    const payload = { name, email, password };

    try {
      if (userType === 'stylist') {
        const res = await API.post('/auth/register/barber', payload);
        setSuccess('Stylist account created successfully!');
      } else {
        const res = await API.post('/auth/register/user', payload);
        setSuccess('Client account created successfully!');
      }

      // Clear form
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Redirect to login page after a brief delay to show success message
      setTimeout(() => {
        router.push('/login?registered=true');
      }, 1500);

    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNav />
      <main className="flex-grow pt-24 pb-16 bg-[var(--gray-bg)]">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-[var(--secondary)]">Create Your SalonAI Account</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-700"
                  placeholder="Your Name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-700"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-700"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-700"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label htmlFor="user-type" className="block text-sm font-medium text-gray-700 mb-1">
                  I am a:
                </label>
                <select
                  id="user-type"
                  value={userType}
                  onChange={(e) => setUserType(e.target.value as 'stylist' | 'client')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-700"
                >
                  <option value="stylist" style={{ color: 'gray' }}>
                    Hair Stylist
                  </option>
                  <option value="client" style={{ color: 'gray' }}>
                    Client
                  </option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
                  required
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[var(--primary)] hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[var(--primary)] hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button type="submit" className="w-full btn-primary py-2 px-4">
                Sign Up
              </button>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
              {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-[var(--primary)] hover:underline">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
