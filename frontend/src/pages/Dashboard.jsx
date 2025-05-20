import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Garage Management Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Car Management */}
          <Link to="/car" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="h-2 bg-blue-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Car Management</h2>
                  <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">View and manage customer vehicles</p>
              </div>
            </div>
          </Link>

          {/* Services */}
          <Link to="/services" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="h-2 bg-green-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Services</h2>
                  <div className="p-2 bg-green-100 rounded-full text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">Manage garage service offerings</p>
              </div>
            </div>
          </Link>

          {/* Service Records */}
          <Link to="/servicerecord" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="h-2 bg-purple-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Service Records</h2>
                  <div className="p-2 bg-purple-100 rounded-full text-purple-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">Track service history and maintenance</p>
              </div>
            </div>
          </Link>

          {/* Payments */}
          <Link to="/payment" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="h-2 bg-yellow-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Payments</h2>
                  <div className="p-2 bg-yellow-100 rounded-full text-yellow-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">Process and manage customer payments</p>
              </div>
            </div>
          </Link>

          {/* Reports */}
          <Link to="/reports" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="h-2 bg-indigo-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Reports</h2>
                  <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">Generate business analytics and reports</p>
              </div>
            </div>
          </Link>

          {/* Logout */}
          <Link to="/logout" className="group">
            <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform group-hover:shadow-lg group-hover:-translate-y-1">
              <div className="h-2 bg-red-500"></div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">Logout</h2>
                  <div className="p-2 bg-red-100 rounded-full text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                </div>
                <p className="mt-3 text-gray-600">Sign out of your account</p>
              </div>
            </div>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">© 2023 Garage Management System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
