import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ServiceRecord() {
  const [cars, setCars] = useState([]);
  const [services, setServices] = useState([]);
  const [serviceRecords, setServiceRecords] = useState([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [serviceDate, setServiceDate] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCars();
    fetchServices();
    fetchServiceRecords();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await axios.get('http://localhost:5000/car', { withCredentials: true });
      setCars(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await axios.get('http://localhost:5000/services', { withCredentials: true });
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServiceRecords = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:5000/servicerecord', { withCredentials: true });
      setServiceRecords(res.data);
    } catch (err) {
      console.error(err);
      setMessage('Failed to load service records');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceSelect = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const resetForm = () => {
    setSelectedCar('');
    setSelectedServices([]);
    setServiceDate('');
    setEditingId(null);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCar || selectedServices.length === 0 || !serviceDate) {
      setMessage('Please fill all fields');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/servicerecord/${editingId}`, {
          car_id: selectedCar,
          service_ids: selectedServices,
          service_date: serviceDate
        }, { withCredentials: true });
        setMessage('Service record updated successfully');
        setMessageType('success');
      } else {
        await axios.post('http://localhost:5000/servicerecord', {
          car_id: selectedCar,
          service_ids: selectedServices,
          service_date: serviceDate
        }, { withCredentials: true });
        setMessage('Service record added successfully');
        setMessageType('success');
      }
      fetchServiceRecords();
      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving service record');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (record) => {
    setEditingId(record.id);
    setSelectedCar(record.car_id);
    setSelectedServices(record.services.map(s => s.id));
    setServiceDate(record.service_date);
    setMessage('');
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service record?')) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:5000/servicerecord/${id}`, { withCredentials: true });
      setMessage('Service record deleted successfully');
      setMessageType('success');
      fetchServiceRecords();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error deleting service record');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate total price for selected services
  const calculateTotalPrice = () => {
    if (selectedServices.length === 0) return 0;
    return services
      .filter(service => selectedServices.includes(service.id))
      .reduce((total, service) => total + service.price, 0);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Form Section */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-6">
        <div className="bg-blue-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {editingId ? 'Edit' : 'Add'} Service Record
          </h2>
        </div>
        
        <div className="p-6">
          {message && (
            <div className={`mb-4 p-3 rounded-md ${
              messageType === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700' 
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Select Car</label>
              <select
                value={selectedCar}
                onChange={(e) => setSelectedCar(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded"
                disabled={loading}
              >
                <option value="">-- Select Car --</option>
                {cars.map(car => (
                  <option key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.year}) - {car.owner_name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Select Services</label>
              <div className="border border-gray-300 p-3 rounded max-h-48 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {services.map(service => (
                    <label key={service.id} className="flex items-start p-2 hover:bg-gray-50 rounded">
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service.id)}
                        onChange={() => handleServiceSelect(service.id)}
                        className="mt-1 mr-2"
                        disabled={loading}
                      />
                      <div>
                        <div className="font-medium">{service.name}</div>
                        <div className="text-sm text-gray-500">RWF {service.price.toLocaleString()}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              {selectedServices.length > 0 && (
                <div className="mt-2 text-right font-medium text-blue-600">
                  Total: RWF {calculateTotalPrice().toLocaleString()}
                </div>
              )}
            </div>
            
            <div>
              <label className="block mb-1 font-medium text-gray-700">Service Date</label>
              <input
                type="date"
                value={serviceDate}
                onChange={(e) => setServiceDate(e.target.value)}
                required
                className="w-full border border-gray-300 p-2 rounded"
                disabled={loading}
              />
            </div>
            
            <div className="flex justify-end space-x-2 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  disabled={loading}
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  editingId ? 'Update Record' : 'Add Record'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Records Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="bg-blue-600 px-6 py-4">
          <h3 className="text-lg font-bold text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Service Records
          </h3>
        </div>
        
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-2 text-gray-600">Loading records...</span>
            </div>
          ) : serviceRecords.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2">No service records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Car Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Services
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {serviceRecords.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.car.make} {record.car.model} ({record.car.year})
                        </div>
                        <div className="text-sm text-gray-500">
                          Owner: {record.car.owner_name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {record.services.map(service => (
                            <span key={service.id} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {service.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(record.service_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        RWF {record.services.reduce((sum, service) => sum + service.price, 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEdit(record)}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ServiceRecord;
