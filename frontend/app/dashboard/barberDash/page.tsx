'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { BiBell, BiLogOut } from 'react-icons/bi'
import { BsCalendar4, BsClock, BsGear, BsPeople } from 'react-icons/bs'
import API from '@/api/axios'

export default function BarberDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState('appointments');
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState('');
  const [barberInfo, setBarberInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slotError, setSlotError] = useState('');
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [selectedDateSlots, setSelectedDateSlots] = useState<{[key: string]: string[]}>({});
  const [currentDate, setCurrentDate] = useState('');

  // Add these new state variables
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editingSlots, setEditingSlots] = useState<string[]>([]);

  const fetchBarberInfo = async () => {
    try {
      const response = await API.get('/barbers/info');
      setBarberInfo(response.data);
      setUserName(response.data.name);
    } catch (error) {
      console.error('Error fetching barber info:', error);
      setError('Failed to load barber information');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'barber') {
      router.push('/login');
      return;
    }
    
    fetchBarberInfo();
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

  const handleDateSelection = (date: string) => {
    if (selectedDates.includes(date)) {
      const newSelectedDates = selectedDates.filter(d => d !== date);
      const newSelectedDateSlots = { ...selectedDateSlots };
      delete newSelectedDateSlots[date];
      setSelectedDates(newSelectedDates);
      setSelectedDateSlots(newSelectedDateSlots);
    } else {
      setSelectedDates([...selectedDates, date]);
      setSelectedDateSlots({ ...selectedDateSlots, [date]: [] });
    }
  };

  const handleSlotSelection = (date: string, time: string) => {
    const currentSlots = selectedDateSlots[date] || [];
    if (currentSlots.includes(time)) {
      setSelectedDateSlots({
        ...selectedDateSlots,
        [date]: currentSlots.filter(t => t !== time)
      });
    } else {
      setSelectedDateSlots({
        ...selectedDateSlots,
        [date]: [...currentSlots, time]
      });
    }
  };

  const handleSubmitSlots = async () => {
    if (selectedDates.length === 0) {
      setSlotError('Please select at least one date');
      return;
    }
  
    const slots = [];
    for (const date of selectedDates) {
      const timeSlots = selectedDateSlots[date] || [];
      for (const time of timeSlots) {
        slots.push({ date, time });
      }
    }
  
    if (slots.length === 0) {
      setSlotError('Please select at least one time slot');
      return;
    }
  
    setIsSubmitting(true);
    setSlotError('');
  
    try {
      await API.post('/barbers/slots', { slots });
      setShowSlotModal(false);
      setSelectedDates([]);
      setSelectedDateSlots({});
      await fetchBarberInfo();
    } catch (error) {
      console.error('Error adding slots:', error);
      setSlotError('Failed to add time slots. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

 
  const handleEditSlots = async (date: string, currentSlots: Array<{time: string, booked: boolean}>) => {
    setEditingDate(date);
    setEditingSlots(currentSlots.filter(slot => !slot.booked).map(slot => slot.time));
    setShowEditModal(true);
  };

  const handleDeleteDay = async (date: string) => {
    if (!confirm('Are you sure you want to delete all slots for this day?')) return;

    try {
      await API.delete(`/barbers/slots/${date}`);
      await fetchBarberInfo();
    } catch (error) {
      console.error('Error deleting slots:', error);
      setSlotError('Failed to delete slots. Please try again.');
    }
  };

  const handleUpdateSlots = async () => {
    if (!editingDate) return;

    setIsSubmitting(true);
    setSlotError('');

    try {
      await API.put(`/barbers/slots/${editingDate}`, {
        slots: editingSlots.map(time => ({ time }))
      });
      setShowEditModal(false);
      setEditingDate(null);
      setEditingSlots([]);
      await fetchBarberInfo();
    } catch (error) {
      console.error('Error updating slots:', error);
      setSlotError('Failed to update slots. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
            <div className="flex items-center min-w-[28px]">
              <BsCalendar4 className="mr-3" size={20} />
            </div>
            <span>Upcoming Appointments</span>
          </button>
          
          <button
            onClick={() => setActivePage('portfolio')}
            className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 ${
              activePage === 'portfolio' ? 'bg-gray-100 border-r-4 border-[var(--primary)]' : ''
            }`}
          >
            <div className="flex items-center min-w-[28px]">
              <BsPeople className="mr-3" size={20} />
            </div>
            <span>Client Portfolio</span>
          </button>

          <button
            onClick={() => setActivePage('availability')}
            className={`flex items-center w-full px-6 py-3 text-gray-600 hover:bg-gray-100 ${
              activePage === 'availability' ? 'bg-gray-100 border-r-4 border-[var(--primary)]' : ''
            }`}
          >
            <div className="flex items-center min-w-[28px]">
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
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4">{error}</div>
              ) : barberInfo?.booked_appointments?.length > 0 ? (
                <div className="divide-y">
                  {barberInfo.booked_appointments
                    .filter(apt => new Date(apt.date + ' ' + apt.time) > new Date())
                    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime())
                    .map((appointment, index) => (
                      <div key={index} className="py-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                          <div className="h-10 w-10 rounded-full bg-[#DEB887] flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-800">
                              {appointment.client_name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{appointment.client_name}</h3>
                            <p className="text-sm text-gray-500">
                              {appointment.service} • {appointment.date} at {appointment.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-4">📅</div>
                  <p>No upcoming appointments</p>
                </div>
              )}
            </div>
          )}
          {activePage === 'portfolio' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="bg-white shadow-md rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[var(--primary)]">Client Portfolio</h2>
                  <input
                    type="search"
                    placeholder="Search clients..."
                    className="px-4 py-2 border rounded-md w-64 text-gray-700"
                  />
                </div>

                {/* Client Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample Client Cards */}
                  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-semibold">
                        JH
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Joshua Hanif</h3>
                        <p className="text-sm text-gray-500">Client since Jan 2024</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">Preferred: Short Bob Cut</p>
                          <p className="text-sm text-gray-600">Last Visit: Mar 15, 2024</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Styles</h4>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-[#DEB887] text-gray-800 rounded-full text-xs">Bob Cut</span>
                        <span className="px-2 py-1 bg-[#DEB887] text-gray-800 rounded-full text-xs">Highlights</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-semibold">
                        V
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Victor</h3>
                        <p className="text-sm text-gray-500">Client since Mar 2024</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">Preferred: Layered Cut</p>
                          <p className="text-sm text-gray-600">Last Visit: Mar 28, 2024</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Styles</h4>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-[#DEB887] text-gray-800 rounded-full text-xs">Layered Cut</span>
                        <span className="px-2 py-1 bg-[#DEB887] text-gray-800 rounded-full text-xs">Color</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="h-16 w-16 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-xl font-semibold">
                        A
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Abdullah</h3>
                        <p className="text-sm text-gray-500">Client since Feb 2024</p>
                        <div className="mt-2 space-y-1">
                          <p className="text-sm text-gray-600">Preferred: Fade Cut</p>
                          <p className="text-sm text-gray-600">Last Visit: Mar 25, 2024</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Recent Styles</h4>
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-[#DEB887] text-gray-800 rounded-full text-xs">Fade</span>
                        <span className="px-2 py-1 bg-[#DEB887] text-gray-800 rounded-full text-xs">Beard Trim</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activePage === 'availability' && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-[var(--primary)]">Manage Availability</h2>
                <button 
                  onClick={() => setShowSlotModal(true)}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity"
                >
                  Add Time Slots
                </button>
              </div>
          
              {/* Current Available Slots */}
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Current Available Slots</h3>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--primary)]"></div>
                  </div>
                ) : barberInfo?.available_slots?.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {Object.entries(barberInfo?.available_slots
                      ?.reduce((acc, slot) => {
                        if (!acc[slot.date]) acc[slot.date] = [];
                        acc[slot.date].push({ time: slot.time, booked: slot.booked });
                        return acc;
                      }, {} as {[key: string]: Array<{time: string, booked: boolean}>}))
                      .map(([date, slots]) => (
                        <div key={date} className="border rounded-lg p-4">
                          <div className="flex justify-between items-center mb-4">
                            <h3 className="font-medium text-gray-900 mb-2">
                              {new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h3>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditSlots(date, slots)}
                                className="px-3 py-1 text-sm bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity"
                              >
                                Edit Slots
                              </button>
                              <button
                                onClick={() => handleDeleteDay(date)}
                                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:opacity-90 transition-opacity"
                              >
                                Delete Day
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                            {slots.map((slot) => (
                              <div 
                                key={`${date}-${slot.time}`}
                                className={`px-4 py-2 rounded-md text-center ${
                                  slot.booked 
                                    ? 'bg-red-200 text-red-800' 
                                    : 'bg-[#DEB887] text-gray-800'
                                }`}
                              >
                                {slot.time}
                                {slot.booked && (
                                  <span className="block text-xs mt-1">Booked</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-4">⏰</div>
                    <p>No time slots added</p>
                  </div>
                )}
              </div>
          
              {/* Add Slots Modal */}
              {showSlotModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
          
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Add Available Time Slots</h3>
                        <button 
                          onClick={() => setShowSlotModal(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
          
                      {slotError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                          {slotError}
                        </div>
                      )}
          
                      <div className="space-y-6">
                        {/* Date Selection */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Select Dates</h4>
                          <div className="grid grid-cols-4 gap-3">
                            {Array.from({ length: 14 }, (_, i) => {
                              const date = new Date();
                              date.setDate(date.getDate() + i);
                              return date.toISOString().split('T')[0];
                            }).map((date) => (
                              <button
                                key={date}
                                onClick={() => handleDateSelection(date)}
                                className={`px-4 py-2 rounded-md transition-colors ${
                                  selectedDates.includes(date)
                                    ? 'bg-[#DEB887] text-gray-800 border-[#8B4513]'
                                    : 'border border-gray-300 text-gray-700 hover:border-[var(--primary)]'
                                }`}
                              >
                                {new Date(date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </button>
                            ))}
                          </div>
                        </div>
                      
                        {/* Time Slots for Selected Dates */}
                        {selectedDates.map((date) => (
                          <div key={date} className="border-t pt-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-3">
                              {new Date(date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h4>
                            <div className="grid grid-cols-4 gap-3">
                              {[
                                '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                                '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
                              ].map((time) => (
                                <button
                                  key={`${date}-${time}`}
                                  onClick={() => handleSlotSelection(date, time)}
                                  className={`px-4 py-2 rounded-md transition-colors ${
                                    (selectedDateSlots[date] || []).includes(time)
                                      ? 'bg-[#DEB887] text-gray-800 border-[#8B4513]'
                                      : 'border border-gray-300 text-gray-700 hover:border-[var(--primary)]'
                                  }`}
                                >
                                  {time}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
          
                      <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowSlotModal(false)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmitSlots}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {isSubmitting ? 'Adding...' : 'Add Selected Slots'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Add Edit Slots Modal */}
              {showEditModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                    </div>
          
                    <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Edit Time Slots for {editingDate && new Date(editingDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </h3>
                        <button 
                          onClick={() => setShowEditModal(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <span className="sr-only">Close</span>
                          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
          
                      {slotError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                          {slotError}
                        </div>
                      )}
          
                      <div className="grid grid-cols-4 gap-3">
                        {[
                          '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                          '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
                        ].map((time) => (
                          <button
                            key={time}
                            onClick={() => {
                              if (editingSlots.includes(time)) {
                                setEditingSlots(editingSlots.filter(t => t !== time));
                              } else {
                                setEditingSlots([...editingSlots, time]);
                              }
                            }}
                            className={`px-4 py-2 rounded-md transition-colors ${
                              editingSlots.includes(time)
                                ? 'bg-[#DEB887] text-gray-800 border-[#8B4513]'
                                : 'border border-gray-300 text-gray-700 hover:border-[var(--primary)]'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
          
                      <div className="mt-5 sm:mt-6 flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowEditModal(false)}
                          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleUpdateSlots}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {isSubmitting ? 'Updating...' : 'Update Slots'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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