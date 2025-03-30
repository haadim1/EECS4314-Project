'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BiBell, BiLogOut } from 'react-icons/bi'
import { BsCalendar4, BsLightbulb, BsStars, BsGear } from 'react-icons/bs'

export default function ClientDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState('appointments');
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    
    if (!token || role !== 'customer') {
      router.push('/login');
      return;
    }
    
    setUserName(name || 'Client');
  }, [router]);

  const handleLogout = () => {
    // Clear all auth-related data
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('userType');
    localStorage.removeItem('name');

    // Clear cookies
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    
    // Redirect to landing page
    router.push('/');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* Logo Section - adjusted padding and height */}
        <div className="px-6 h-24 flex items-end pb-4">
          <h2 className="text-2xl font-bold text-[var(--primary)]">SalonAI</h2>
        </div>
        {/* Reduced spacing */}
        <div className="h-8"></div>
        {/* Navigation Title */}
        <div className="px-8 pt-4 border-t">
          <h3 className="text-xl font-bold text-gray-700">Navigation</h3>
        </div>
        <nav className="flex-grow mt-6">
          <button
            onClick={() => setActivePage('appointments')}
            className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 ${
              activePage === 'appointments' ? 'bg-gray-100 border-r-4 border-[var(--primary)]' : ''
            }`}
          >
            <BsCalendar4 className="mr-3" />
            Appointments
          </button>
          <button
            onClick={() => setActivePage('recommendations')}
            className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 ${
              activePage === 'recommendations' ? 'bg-gray-100 border-r-4 border-[var(--primary)]' : ''
            }`}
          >
            <BsLightbulb className="mr-3" />
            Recommendations
          </button>
          <button
            onClick={() => setActivePage('services')}
            className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 ${
              activePage === 'services' ? 'bg-gray-100 border-r-4 border-[var(--primary)]' : ''
            }`}
          >
            <BsStars className="mr-3" />
            Suggested Services
          </button>
        </nav>
        {/* Settings button at bottom */}
        <div className="p-4 border-t">
          <button
            onClick={() => setActivePage('settings')}
            className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 ${
              activePage === 'settings' ? 'bg-gray-100 border-r-4 border-[var(--primary)]' : ''
            }`}
          >
            <BsGear className="mr-3" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-end px-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <BiBell size={24} />
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-2 border-b">
                    <h3 className="text-gray-600 font-medium">Notifications</h3>
                  </div>
                  <div className="px-4 py-2 text-sm text-gray-600">
                    <p>No new notifications</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-800"
            >
              <BiLogOut size={24} />
              <span className="ml-2">Logout</span>
            </button>
          </div>
        </header>

        {/* Welcome Message */}
        <div className="h-16 px-8 flex items-center bg-white border-b">
          <h1 className="text-3xl font-semibold text-gray-600">Hello, {userName} 👋</h1>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {activePage === 'appointments' && (
            <div className="grid gap-6">
              <div className="bg-white shadow-md rounded-lg p-6">
                <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Your Appointments</h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>💇‍♀️ Haircut with Sarah - Mar 31, 11:00 AM</li>
                  <li>💅 Nail Treatment - Apr 2, 3:00 PM</li>
                </ul>
                <button 
                  onClick={() => router.push('/booking')}
                  className="mt-4 px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90"
                >
                  Book New Appointment
                </button>
              </div>
            </div>
          )}
          {activePage === 'recommendations' && (
            <div>
              {/* Recommendations page content */}
            </div>
          )}
          {activePage === 'services' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Suggested Services</h2>
              <ul className="text-sm text-gray-700 space-y-2">
                <li>✨ Try the "Choppy Bob" look this spring!</li>
                <li>🌿 Hydrating Scalp Treatment recommended</li>
              </ul>
            </div>
          )}
          {activePage === 'settings' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Settings</h2>
              <div className="space-y-4">
                <div className="text-sm text-gray-700">
                  Account settings and preferences will go here
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}