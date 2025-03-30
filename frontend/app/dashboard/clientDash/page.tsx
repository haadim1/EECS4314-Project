'use client'

import { useState, useEffect, SetStateAction } from 'react'
import { useRouter } from 'next/navigation'
import { BiBell, BiLogOut } from 'react-icons/bi'

import { BsCalendar4, BsLightbulb, BsStars, BsGear, BsPlus } from 'react-icons/bs'
import API from '@/api/axios'

export default function ClientDashboard() {
  const router = useRouter();
  const [activePage, setActivePage] = useState('appointments');
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookingNotes, setBookingNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState<string | null>(null);

  const services = [
    { id: 'haircut', name: 'Haircut', duration: '30', price: '40' },
    { id: 'color', name: 'Hair Coloring', duration: '120', price: '120' },
    { id: 'style', name: 'Hair Styling', duration: '60', price: '70' },
    { id: 'treatment', name: 'Hair Treatment', duration: '45', price: '55' },
  ];

  const fetchUserInfo = async () => {
    try {
      const { data } = await API.get('/users/info', {
        withCredentials: true,
      });
  
      setUserName(data.name || 'Client');
    } catch (error) {
      console.error('Error fetching user info:', error);
      setUserName('Client');
    }
  };

  const fetchAppointments = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await API.get('/users/appointments');
      setAppointments(response.data.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBarbers = async () => {
    try {
      const response = await API.get('/barbers/all');
      setBarbers(response.data.barbers);
    } catch (error) {
      console.error('Error fetching barbers:', error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'customer') {
      router.push('/login');
      return;
    }
    
    fetchUserInfo();
    fetchAppointments(); 
  }, [router]);

  useEffect(() => {
    if (showBookingForm) {
      fetchBarbers();
    }
  }, [showBookingForm]);

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

  const handleViewDetails = (appointment: SetStateAction<null>) => {
    setSelectedAppointment(appointment);
  };

  const handleCloseModal = () => {
    setSelectedAppointment(null);
  };

  const handleShowBookingForm = () => {
    setShowBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
  };

  const handleServiceSelection = (serviceId: string) => {
    setSelectedService(serviceId);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
  };

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setBookingNotes(e.target.value);
  };

  const resetBookingForm = () => {
    setSelectedBarber(null);
    setSelectedService(null);
    setSelectedDate('');
    setSelectedTime(null);
    setBookingNotes('');
    setBookingError('');
    setShowBookingForm(false);
  };

  const handleBookingSubmit = async () => {
    if (!selectedBarber || !selectedService || !selectedDate || !selectedTime) {
      setBookingError('Please select all required fields');
      return;
    }
  
    setIsBooking(true);
    setBookingError('');
  
    try {
      const selectedServiceData = services.find(s => s.id === selectedService);
      
      // Create payload matching the backend requirements
      const payload = {
        barber_id: selectedBarber,
        service: selectedServiceData?.name,
        date: selectedDate,
        time: selectedTime,
        notes: bookingNotes || "",
        price: parseInt(selectedServiceData?.price || "0"),
        duration: parseInt(selectedServiceData?.duration || "0")
      };
  
      const response = await API.post('/users/book', payload);
  
      if (response.status === 201) {
        resetBookingForm();
        fetchAppointments();
        handleCloseBookingForm();
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      setBookingError(error.response?.data?.error || 'Failed to book appointment. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };
  

  const handleCancelAppointment = async () => {
    if (!selectedAppointment) return;
    
    setIsCancelling(true);
    setCancelError('');

    try {
      const response = await API.post(`/users/appointments/cancel/${selectedAppointment._id}`);

      if (response.status === 200) {
        setShowCancelConfirm(false);
        setSelectedAppointment(null);
        // Refresh appointments list
        fetchAppointments();
      }
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      setCancelError('Failed to cancel appointment. Please try again.');
    } finally {
      setIsCancelling(false);
    }
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
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-[var(--primary)]">Your Appointments</h2>
                <button 
                  onClick={handleShowBookingForm}
                  className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 transition-all duration-300 flex items-center space-x-2"
                >
                  <BsPlus size={20} />
                  <span>Book New Appointment</span>
                </button>
              </div>

              {/* Appointments List */}
              <div className="bg-white rounded-lg shadow-md divide-y divide-gray-200">
                {isLoading ? (
                  <div className="p-4 text-center">
                    <svg className="animate-spin h-6 w-6 mx-auto text-[var(--primary)]" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  </div>
                ) : error ? (
                  <div className="p-4 text-center text-red-600">{error}</div>
                ) : appointments.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No appointments found. Book your first appointment now!
                  </div>
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{appointment.service}</h3>
                              <p className="text-sm text-gray-500">with {appointment.barber_name}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium
                              ${appointment.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' : 
                                appointment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                                appointment.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            {appointment.date} at {appointment.time}
                          </div>
                        </div>
                        <button 
                          onClick={() => handleViewDetails(appointment)}
                          className="ml-4 px-3 py-1 text-sm text-[var(--primary)] hover:bg-[var(--primary)]/10 rounded-md transition-colors"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Appointment Details Modal */}
              <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                selectedAppointment ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/50 transition-opacity duration-300"
                  onClick={() => setSelectedAppointment(null)}
                />
                {/* Modal Content */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className={`bg-white rounded-lg p-8 max-w-2xl w-full mx-4 relative transform transition-all duration-300 ${
                    selectedAppointment ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <div className="flex justify-between items-start mb-6">
                      <h3 className="text-2xl font-semibold text-gray-900">Appointment Details</h3>
                      <button 
                        onClick={() => setSelectedAppointment(null)}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6 text-sm">
                        <div>
                          <p className="text-gray-500">Service</p>
                          <p className="font-medium text-pink-400">{selectedAppointment?.service}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Stylist</p>
                          <p className="font-medium text-pink-400">{selectedAppointment?.stylist}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Date & Time</p>
                          <p className="font-medium text-pink-400">{selectedAppointment?.date} at {selectedAppointment?.time}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Duration</p>
                          <p className="font-medium text-pink-400">{selectedAppointment?.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Price</p>
                          <p className="font-medium text-pink-400">{selectedAppointment?.price}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Status</p>
                          <p className="font-medium text-pink-400">{selectedAppointment?.status}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500">Notes</p>
                        <p className="text-sm text-pink-400">{selectedAppointment?.notes}</p>
                      </div>
                      <div className="mt-8 flex justify-center">
                        <button 
                          onClick={() => setShowCancelConfirm(true)}
                          className="px-6 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
                        >
                          Cancel Appointment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Form Modal */}
              <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                showBookingForm ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/50 transition-opacity duration-300"
                  onClick={handleCloseBookingForm}
                />
                {/* Modal Content - Updated size */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className={`bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[95vh] overflow-y-auto relative transform transition-all duration-300 ${
                    showBookingForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Book New Appointment</h3>
                      <button 
                        onClick={handleCloseBookingForm}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="space-y-6">
                      {/* Stylist Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Stylist <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={selectedBarber || ''}
                          onChange={(e) => setSelectedBarber(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-700"
                          required
                        >
                          <option value="">Choose a stylist...</option>
                          {barbers.map((barber) => (
                            <option key={barber.id} value={barber.id}>
                              {barber.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Service Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Service <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'haircut', name: 'Haircut', duration: '30 min', price: '$40' },
                            { id: 'color', name: 'Hair Coloring', duration: '120 min', price: '$120' },
                            { id: 'style', name: 'Hair Styling', duration: '60 min', price: '$70' },
                            { id: 'treatment', name: 'Hair Treatment', duration: '45 min', price: '$55' },
                          ].map((service) => (
                            <button
                              key={service.id}
                              onClick={() => handleServiceSelection(service.id)}
                              className={`p-4 border rounded-lg text-left transition-colors ${
                                selectedService === service.id 
                                  ? 'border-[#8B4513] bg-[#DEB887] text-gray-900' 
                                  : 'hover:border-[var(--primary)] text-gray-700'
                              }`}
                            >
                              <h4 className="font-medium">{service.name}</h4>
                              <p className="text-sm text-gray-500">{service.duration}</p>
                              <p className={`text-sm font-medium ${
                                selectedService === service.id ? 'text-gray-900' : 'text-[var(--primary)]'
                              }`}>{service.price}</p>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Date Selection */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          selectedDate ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          Select Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={selectedDate}
                          onChange={handleDateChange}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-700"
                          required
                        />
                      </div>

                      {/* Time Selection */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          selectedTime ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          Select Time <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
                            '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
                          ].map((time) => (
                            <button
                              key={time}
                              onClick={() => handleTimeSelection(time)}
                              className={`px-4 py-2 border rounded-md transition-colors text-gray-700 ${
                                selectedTime === time 
                                  ? 'border-[#8B4513] bg-[#DEB887] text-gray-900' 
                                  : 'hover:border-[var(--primary)]'
                              }`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Notes */}
                      <div>
                        <label className={`block text-sm font-medium mb-2 ${
                          bookingNotes ? 'text-gray-700' : 'text-gray-500'
                        }`}>
                          Additional Notes
                        </label>
                        <textarea
                          rows={3}
                          value={bookingNotes}
                          onChange={handleNotesChange}
                         className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent text-gray-700"
                          placeholder="Any special requests or notes for your stylist..."
                        />
                      </div>

                      {/* Error Message - Updated styling */}
                      {bookingError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            <p className="text-base font-medium text-red-800">
                              {bookingError}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Submit Button */}
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={resetBookingForm}
                          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                          disabled={isBooking}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleBookingSubmit}
                          disabled={isBooking || !selectedService || !selectedDate || !selectedTime}
                          className="px-4 py-2 bg-[var(--primary)] text-white rounded-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isBooking ? (
                            <>
                              <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              <span>Booking...</span>
                            </>
                          ) : (
                            <span>Confirm Booking</span>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cancel Confirmation Modal */}
              <div className={`fixed inset-0 z-50 transition-opacity duration-300 ${
                showCancelConfirm ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                {/* Backdrop */}
                <div 
                  className="fixed inset-0 bg-black/50 transition-opacity duration-300"
                  onClick={() => setShowCancelConfirm(false)}
                />
                {/* Modal Content */}
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <div className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 relative transform transition-all duration-300 ${
                    showCancelConfirm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900">Cancel Appointment</h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Are you sure you want to cancel this appointment? This action cannot be undone.
                      </p>
                    </div>

                    {cancelError && (
                      <div className="mb-4 text-sm text-red-600">
                        {cancelError}
                      </div>
                    )}

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setShowCancelConfirm(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                        disabled={isCancelling}
                      >
                        No, Keep It
                      </button>
                      <button
                        onClick={handleCancelAppointment}
                        disabled={isCancelling}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                      >
                        {isCancelling ? (
                          <>
                            <svg className="animate-spin h-4 w-4 mr-2" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          "Yes, Cancel It"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activePage === 'recommendations' && (
            <div>
              {/* Recommendations page content */}
            </div>
          )}
          {activePage === 'services' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-[var(--primary)]">Service Specials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  {
                    id: 1,
                    salonName: "Elegant Cuts",
                    service: "Spring Highlights Special",
                    originalPrice: "$150",
                    discountedPrice: "$99",
                    validUntil: "April 30, 2024",
                    description: "Get ready for spring with beautiful highlights. Includes consultation, treatment, and styling."
                  },
                  {
                    id: 2,
                    salonName: "Modern Style Studio",
                    service: "First-Time Client Package",
                    originalPrice: "$120",
                    discountedPrice: "$79",
                    validUntil: "Limited Time",
                    description: "Haircut, deep conditioning treatment, and style consultation for new clients."
                  },
                  // Add more specials as needed
                ].map((special) => (
                  <div key={special.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{special.salonName}</h3>
                        <p className="text-[var(--primary)] font-medium">{special.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 line-through">{special.originalPrice}</p>
                        <p className="text-lg font-bold text-[var(--primary)]">{special.discountedPrice}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{special.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Valid until {special.validUntil}</span>
                      <button 
                        onClick={() => handleShowBookingForm()}
                        className="px-4 py-2 text-sm text-white bg-[var(--primary)] rounded-md hover:opacity-90"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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