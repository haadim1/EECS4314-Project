'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BiBell, BiLogOut } from 'react-icons/bi'
import { BsCalendar4, BsClock, BsGear } from 'react-icons/bs'
import FloatingNav from '@/app/components/FloatingNav'
import Footer from '@/app/components/Footer'

export default function BarberDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState('appointments');
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const name = localStorage.getItem('name');
    
    if (!token || role !== 'barber') {
      router.push('/login');
      return;
    }
    
    setUserName(name || 'Stylist');
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
        {/* Logo Section */}
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
            <div className="flex items-center min-w-[24px]">
              <BsCalendar4 className="mr-3" size={20} />
            </div>
            <span>Upcoming Appointments</span>
          </button>
          <button
            onClick={() => setActivePage('availability')}
            className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 ${
              activePage === 'availability' ? 'bg-gray-100 border-r-4 border-[var(--primary)]' : ''
            }`}
          >
            <div className="flex items-center min-w-[24px]">
              <BsClock className="mr-3" size={20} />
            </div>
            <span>Manage Availability</span>
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

        {/* Updated Welcome Message */}
        <div className="h-16 px-8 flex items-center bg-white border-b">
          <h1 className="text-3xl font-semibold text-gray-600">Hello, {userName} 👋</h1>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 bg-gray-50">
          {activePage === 'appointments' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Upcoming Appointments</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>💇‍♀️ Jane Doe - Mar 30, 10:00 AM</li>
                <li>💇‍♂️ John Smith - Mar 30, 12:00 PM</li>
                <li>💇 Emily Rose - Apr 1, 1:30 PM</li>
              </ul>
            </div>
          )}
          {activePage === 'availability' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--primary)] mb-4">Manage Availability</h2>
              <button className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity">
                Add Time Slots
              </button>
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