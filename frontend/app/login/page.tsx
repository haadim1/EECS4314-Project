'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import FloatingNav from '@/app/components/FloatingNav';
import Footer from '@/app/components/Footer';
import API from '@/api/axios';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'client' | 'stylist'>('stylist');
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const payload = { email, password, remember: rememberMe };
    const endpoint =
      userType === 'stylist' ? '/auth/login/barber' : '/auth/login/user';

    try {
      const res = await API.post(endpoint, payload, {
        withCredentials: true,
      });

      console.log('Full response:', JSON.stringify(res.data, null, 2));

      // Check for the actual response structure
      if (res.data && res.data.message === 'Login successful') {
        const token = res.data.access_token;
        const role = res.data.role;
        const userId = res.data.user_id;

        if (token) {
          document.cookie = `token=${token}; path=/`;
          localStorage.setItem('token', token);
          localStorage.setItem('role', role);
          localStorage.setItem('userId', userId);
          
          if (rememberMe) {
            localStorage.setItem('userType', userType);
          }

          // Redirect based on role instead of userType
          if (role === 'barber') {
            await router.push('/dashboard/barberDash');
          } else {
            await router.push('/dashboard/clientDash');
          }
        } else {
          setError('Authentication token not received. Please try again.');
        }
      } else {
        setError('Invalid login response. Please try again.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNav />
      <main className="flex-grow pt-24 pb-16 bg-[var(--gray-bg)]">
        <div className="container-custom">
          <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-6 text-[var(--secondary)]">
              Login to SalonAI
            </h1>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-600 placeholder-gray-300"
                  placeholder="••••••••"
                  required
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-black"
                >
                  <option value="stylist">Hair Stylist</option>
                  <option value="client">Client</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
  id="remember-me"
  type="checkbox"
  checked={rememberMe}
  onChange={(e) => setRememberMe(e.target.checked)}
  className="h-4 w-4 text-[var(--primary)] focus:ring-[var(--primary)]"
/>
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <Link href="/forgot-password" className="text-sm text-[var(--primary)] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="w-full btn-primary py-2 px-4">
                Sign In
              </button>

              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-[var(--primary)] hover:underline">
                  Sign up
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