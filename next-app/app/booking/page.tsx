'use client';

import { useState } from 'react';
import FloatingNav from '@/app/components/FloatingNav';
import Footer from '@/app/components/Footer';

type Service = {
  id: string;
  name: string;
  duration: number;
  price: number;
};

type TimeSlot = {
  time: string;
  available: boolean;
};

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  
  // Mock services data
  const services: Service[] = [
    { id: 'haircut', name: 'Haircut', duration: 30, price: 40 },
    { id: 'color', name: 'Hair Coloring', duration: 120, price: 120 },
    { id: 'style', name: 'Hair Styling', duration: 60, price: 70 },
    { id: 'treatment', name: 'Hair Treatment', duration: 45, price: 55 },
  ];
  
  // Mock time slots
  const timeSlots: TimeSlot[] = [
    { time: '9:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '12:00 PM', available: true },
    { time: '1:00 PM', available: false },
    { time: '2:00 PM', available: true },
    { time: '3:00 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '5:00 PM', available: false },
  ];
  
  const handleNextStep = () => {
    setStep(step + 1);
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would submit the booking data to your API
    console.log('Booking submitted:', {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      name,
      email,
      phone,
      notes,
    });
    
    // Move to confirmation step
    setStep(4);
  };
  
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedService === service.id 
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10' 
                      : 'border-gray-200 hover:border-[var(--primary)]'
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <h3 className="font-medium">{service.name}</h3>
                  <p className="text-sm text-gray-500">{service.duration} minutes</p>
                  <p className="font-medium mt-2">${service.price}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 flex justify-end">
              <button
                type="button"
                className="btn-primary"
                onClick={handleNextStep}
                disabled={!selectedService}
              >
                Next: Choose Date & Time
              </button>
            </div>
          </div>
        );
        
      case 2:
        return (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select a Date & Time</h2>
            
            <div className="mb-6">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    className={`py-2 px-3 text-center rounded-md ${
                      selectedTime === slot.time
                        ? 'bg-[var(--primary)] text-white'
                        : slot.available
                        ? 'bg-white border border-gray-300 hover:border-[var(--primary)]'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className="text-gray-600 border border-gray-300 rounded px-4 py-2 hover:bg-gray-50 transition-colors"
                onClick={handlePrevStep}
              >
                Back
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleNextStep}
                disabled={!selectedDate || !selectedTime}
              >
                Next: Your Information
              </button>
            </div>
          </div>
        );
        
      case 3:
        return (
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-semibold mb-6">Your Information</h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="mt-8 flex justify-between">
              <button
                type="button"
                className="text-gray-600 border border-gray-300 rounded px-4 py-2 hover:bg-gray-50 transition-colors"
                onClick={handlePrevStep}
              >
                Back
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Confirm Booking
              </button>
            </div>
          </form>
        );
        
      case 4:
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-[var(--secondary)]">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a confirmation email to {email} with all the details.
            </p>
            <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-medium mb-4">Booking Details</h3>
              <p><span className="font-medium">Service:</span> {services.find(s => s.id === selectedService)?.name}</p>
              <p><span className="font-medium">Date:</span> {selectedDate}</p>
              <p><span className="font-medium">Time:</span> {selectedTime}</p>
              <p><span className="font-medium">Name:</span> {name}</p>
            </div>
            <button
              type="button"
              onClick={() => window.location.href = '/'}
              className="btn-primary"
            >
              Return to Home
            </button>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <FloatingNav />
      <main className="flex-grow py-16 bg-[var(--gray-bg)]">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-center mb-8 text-[var(--secondary)]">Book Your Appointment</h1>
            
            {/* Progress Steps */}
            <div className="flex justify-between items-center mb-8">
              {[1, 2, 3].map((stepNumber) => (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= stepNumber ? 'bg-[var(--primary)] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNumber}
                  </div>
                  <span className="text-xs mt-1 text-gray-600">
                    {stepNumber === 1 ? 'Service' : stepNumber === 2 ? 'Schedule' : 'Details'}
                  </span>
                </div>
              ))}
            </div>
            
            {renderStep()}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 