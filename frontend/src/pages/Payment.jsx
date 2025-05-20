import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Payment() {
  const [serviceRecords, setServiceRecords] = useState([]);
  const [selectedServiceRecord, setSelectedServiceRecord] = useState('');
  const [services, setServices] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [receiver, setReceiver] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchServiceRecords();
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (selectedServiceRecord) {
      const record = serviceRecords.find(r => r.id === parseInt(selectedServiceRecord));
      if (record) {
        setServices(record.services);
        const total = record.services.reduce((sum, s) => sum + parseFloat(s.price), 0);
        setTotalPrice(total);
      } else {
        setServices([]);
        setTotalPrice(0);
      }
    } else {
      setServices([]);
      setTotalPrice(0);
    }
  }, [selectedServiceRecord, serviceRecords]);

  const fetchServiceRecords = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5000/servicerecord', { withCredentials: true });
      setServiceRecords(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to fetch service records');
      setMessageType('error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await axios.get('http://localhost:5000/me', { withCredentials: true });
      setReceiver(res.data.id);
    } catch (err) {
      console.error('Failed to fetch current user', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceRecord || !receiver) {
      setMessage('Please select a service record and enter receiver ID');
      setMessageType('error');
      return;
    }
    
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/payment', {
        service_record_id: selectedServiceRecord,
        receiver_id: receiver,
        payment_date: new Date().toISOString().split('T')[0]
      }, { withCredentials: true });
      
      setMessage('Payment recorded successfully');
      setMessageType('success');
      setSelectedServiceRecord('');
      setReceiver('');
      setServices([]);
      setTotalPrice(0);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error recording payment');
      setMessageType('error');
    } finally {
      setIsLoading(false);
      // Auto-dismiss message after 5 seconds
      setTimeout(() => {
        setMessage('');
      }, 5000);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
            </svg>
            Record Payment
          </h2>
        </div>
        
        <div className="p-6">
          {message && (
            <div className={`mb-6 p-4 rounded-md ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {messageType === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium">{message}</p>
                </div>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="serviceRecord" className="block text-sm font-medium text-gray-700 mb-1">
                Select Service Record
              </label>
              <select
                id="serviceRecord"
                value={selectedServiceRecord}
                onChange={(e) => setSelectedServiceRecord(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={isLoading}
              >
                <option value="">-- Select Service Record --</option>
                {serviceRecords.map(record => (
                  <option key={record.id} value={record.id}>
                    {record.car.make} {record.car.model} ({record.car.year}) - {record.service_date}
                  </option>
                ))}
              </select>
            </div>
            
            {services.length > 0 && (
              <div className="bg-gray-50 rounded-md p-4">
                <h3 className="font-medium text-gray-700 mb-2">Services</h3>
                <ul className="space-y-1 mb-3">
                  {services.map(s => (
                    <li key={s.id} className="flex justify-between text-sm">
                      <span>{s.name}</span>
                      <span className="font-medium">RWF {parseFloat(s.price).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between font-bold text-gray-700">
                    <span>Total Amount</span>
                    <span>RWF {totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="receiver" className="block text-sm font-medium text-gray-700 mb-1">
                Receiver (User ID)
              </label>
              <input
                id="receiver"
                type="number"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                disabled={isLoading}
              />
              <p className="mt-1 text-xs text-gray-500">Enter the ID of the user receiving the payment</p>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Record Payment'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payment;
