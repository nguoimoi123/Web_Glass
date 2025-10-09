import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { UserIcon, ShoppingBagIcon, HeartIcon, CreditCardIcon, MapPinIcon, LogOutIcon, CheckCircleIcon, XIcon } from 'lucide-react';
import { useUser } from '../context/UserContext';
import api from '../services/api';  // Import axios instance

export const Account: React.FC = () => {
  const { currentUser, updateUserProfile, logout } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState({ orders: false, addresses: false, payments: false });

  // Update formData when currentUser changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
      email: currentUser?.email || '',
    }));
  }, [currentUser]);

  // Fetch orders
  useEffect(() => {
    if (activeTab === 'orders') {
      setLoading(prev => ({ ...prev, orders: true }));
      api.get('/orders/me')  // Giả định route backend /api/orders/me
        .then(res => setOrders(res.data))
        .catch(err => console.error('Failed to fetch orders:', err))
        .finally(() => setLoading(prev => ({ ...prev, orders: false })));
    }
  }, [activeTab]);

  // Fetch addresses
  useEffect(() => {
    if (activeTab === 'addresses') {
      setLoading(prev => ({ ...prev, addresses: true }));
      api.get('/users/addresses')  // Giả định route backend /api/users/addresses
        .then(res => setAddresses(res.data))
        .catch(err => console.error('Failed to fetch addresses:', err))
        .finally(() => setLoading(prev => ({ ...prev, addresses: false })));
    }
  }, [activeTab]);

  // Fetch payment methods
  useEffect(() => {
    if (activeTab === 'payment') {
      setLoading(prev => ({ ...prev, payments: true }));
      api.get('/users/payments')  // Giả định route backend /api/users/payments
        .then(res => setPaymentMethods(res.data))
        .catch(err => console.error('Failed to fetch payments:', err))
        .finally(() => setLoading(prev => ({ ...prev, payments: false })));
    }
  }, [activeTab]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUserProfile({ firstName: formData.firstName, lastName: formData.lastName });
      setNotification({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to update profile.' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setNotification({ type: 'error', message: 'New passwords do not match.' });
      return;
    }
    try {
      await api.put('/auth/change-password', {  // Giả định route backend PUT /api/auth/change-password
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      setNotification({ type: 'success', message: 'Password updated successfully!' });
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setNotification({ type: 'error', message: 'Failed to change password.' });
    }
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>
        {notification && (
          <div className={`mb-6 p-4 rounded-md ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex">
              {notification.type === 'success' ? <CheckCircleIcon size={20} className="text-green-500 mr-3" /> : <XIcon size={20} className="text-red-500 mr-3" />}
              <p className={notification.type === 'success' ? 'text-green-700' : 'text-red-700'}>{notification.message}</p>
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar navigation */}
          <div className="md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center">
                  <div className="bg-amber-100 rounded-full p-3">
                    <UserIcon size={24} className="text-amber-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{currentUser?.email}</p>
                  </div>
                </div>
              </div>
              <nav className="space-y-1">
                <button onClick={() => setActiveTab('profile')} className={`w-full flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'profile' ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <UserIcon size={20} className="mr-3" /> Profile
                </button>
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'orders' ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <ShoppingBagIcon size={20} className="mr-3" /> Orders
                </button>
                <button onClick={() => setActiveTab('addresses')} className={`w-full flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'addresses' ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <MapPinIcon size={20} className="mr-3" /> Addresses
                </button>
                <button onClick={() => setActiveTab('payment')} className={`w-full flex items-center px-6 py-3 text-sm font-medium ${activeTab === 'payment' ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <CreditCardIcon size={20} className="mr-3" /> Payment Methods
                </button>
                <Link to="/wishlist" className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <HeartIcon size={20} className="mr-3" /> Wishlist
                </Link>
                <button onClick={logout} className="w-full flex items-center px-6 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50">
                  <LogOutIcon size={20} className="mr-3" /> Sign Out
                </button>
              </nav>
            </div>
          </div>
          {/* Main content */}
          <div className="flex-1">
            {/* Profile Settings */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-50 rounded-md text-gray-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
                      >
                        Update Profile
                      </button>
                    </div>
                  </form>
                </div>
                <div className="p-6 border-t border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
                      >
                        Change Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
            {/* Orders */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Order History</h2>
                </div>
                <div className="p-6">
                  {loading.orders ? (
                    <p className="text-center text-gray-500">Loading orders...</p>
                  ) : orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="border border-gray-200 rounded-md overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 sm:px-6 flex flex-wrap justify-between items-center">
                            <div>
                              <span className="text-sm font-medium text-gray-900">Order #{order.id}</span>
                              <span className="ml-3 text-xs text-gray-500">
                                Placed on {new Date(order.date).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {order.status}
                              </span>
                              <Link to={`/orders/${order.id}`} className="ml-4 text-sm text-amber-500 hover:text-amber-600">
                                View Details
                              </Link>
                            </div>
                          </div>
                          <div className="px-4 py-3 sm:px-6 border-b border-gray-200">
                            {order.items.map((item: any) => (
                              <div key={item.id} className="flex items-center py-2">
                                <span className="text-sm text-gray-900 flex-1">{item.name}</span>
                                <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                <span className="ml-4 text-sm font-medium text-gray-900">${item.price.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="px-4 py-3 sm:px-6 bg-gray-50 flex justify-between">
                            <span className="text-sm font-medium text-gray-700">Total</span>
                            <span className="text-sm font-medium text-amber-500">${order.total.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <ShoppingBagIcon size={40} className="mx-auto text-gray-400 mb-4" />
                      <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                      <Link
                        to="/shop"
                        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200"
                      >
                        Start Shopping
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Addresses */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">My Addresses</h2>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                    Add New Address
                  </button>
                </div>
                <div className="p-6">
                  {loading.addresses ? (
                    <p className="text-center text-gray-500">Loading addresses...</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {addresses.map(address => (
                        <div key={address.id} className="border border-gray-200 rounded-md p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">{address.type} Address</span>
                              {address.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex space-x-2">
                              <button className="text-sm text-amber-500 hover:text-amber-600">Edit</button>
                              <button className="text-sm text-gray-500 hover:text-gray-700">Delete</button>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>{address.name}</p>
                            <p>{address.street}</p>
                            <p>
                              {address.city}, {address.state} {address.zip}
                            </p>
                            <p>{address.country}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Payment Methods */}
            {activeTab === 'payment' && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                    Add New Payment Method
                  </button>
                </div>
                <div className="p-6">
                  {loading.payments ? (
                    <p className="text-center text-gray-500">Loading payment methods...</p>
                  ) : (
                    <div className="space-y-4">
                      {paymentMethods.map(payment => (
                        <div key={payment.id} className="border border-gray-200 rounded-md p-4 flex justify-between items-center">
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium text-gray-900">
                                {payment.cardType} ending in {payment.last4}
                              </span>
                              {payment.isDefault && (
                                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">Expires {payment.expiry}</p>
                          </div>
                          <div className="flex space-x-2">
                            <button className="text-sm text-amber-500 hover:text-amber-600">Edit</button>
                            <button className="text-sm text-gray-500 hover:text-gray-700">Delete</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};