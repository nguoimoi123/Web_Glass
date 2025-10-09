import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCardIcon, ShieldCheckIcon, CheckCircleIcon, ChevronRightIcon, UserIcon, MapPinIcon, TruckIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { useUser } from '../context/UserContext';

type CheckoutStep = 'information' | 'shipping' | 'payment' | 'confirmation';

export const Checkout: React.FC = () => {
  const { currentUser } = useUser();
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const [formData, setFormData] = useState({
    // Contact information
    email: '',
    phone: '',
    // Shipping information
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States',
    // Payment information
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    // Billing address (same as shipping by default)
    sameAsShipping: true,
    billingAddress: '',
    billingApartment: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States'
  });
  const [error, setError] = useState<string>('');
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser && currentStep !== 'confirmation') {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [currentUser, navigate, currentStep]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Handle form submission for each step
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (currentStep === 'information') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      try {
        // Prepare data cho API: cartItems, shipping, billing, payment
        const shippingAddress = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        };
        const billingAddress = formData.sameAsShipping ? shippingAddress : {
          address: formData.billingAddress,
          apartment: formData.billingApartment,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.billingCountry,
        };
        const orderData = {
          items: cartItems.map(item => ({
            product: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          shippingAddress,
          billingAddress,
          paymentMethod: 'credit_card',
          paymentDetails: {
            cardName: formData.cardName,
            cardNumber: formData.cardNumber,
            cardExpiry: formData.cardExpiry,
            cardCvc: formData.cardCvc,
          },
          total: total,
          email: formData.email,
          phone: formData.phone,
          shippingMethod: 'Standard',
        };

        // Gọi API tạo order
        const res = await api.post('/orders', orderData);
        console.log('Order created:', res.data);

        setOrderId(res.data._id);
        clearCart();
        setCurrentStep('confirmation');
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      }
    }
  };

  // Calculate totals
  const subtotal = getCartTotal();
  const shipping = 0; // Free shipping
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + shipping + tax;

  // If cart is empty and not on confirmation step, redirect to cart
  if (cartItems.length === 0 && currentStep !== 'confirmation') {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Your cart is empty
        </h2>
        <p className="text-gray-600 mb-8">
          Add some items to your cart before proceeding to checkout.
        </p>
        <Link to="/shop" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
          Continue Shopping
        </Link>
      </div>;
  }

  // Helper function to determine step icon content
  const getStepIconContent = (step: CheckoutStep, targetStep: CheckoutStep) => {
    const stepOrder: CheckoutStep[] = ['information', 'shipping', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const targetIndex = stepOrder.indexOf(targetStep);

    if (currentIndex > targetIndex) {
      return <CheckCircleIcon size={16} />;
    } else if (currentStep === targetStep) {
      return String(targetIndex + 1);
    } else {
      return String(targetIndex + 1);
    }
  };

  // Helper function to determine step styling
  const getStepStyles = (step: CheckoutStep) => {
    const stepOrder: CheckoutStep[] = ['information', 'shipping', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (currentIndex > stepIndex) {
      return 'text-amber-600 font-medium';
    } else if (currentStep === step) {
      return 'text-amber-600 font-medium';
    } else {
      return 'text-gray-500';
    }
  };

  // Helper function to determine step circle styling
  const getStepCircleStyles = (step: CheckoutStep) => {
    const stepOrder: CheckoutStep[] = ['information', 'shipping', 'payment', 'confirmation'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(step);

    if (currentIndex > stepIndex) {
      return 'bg-amber-500 text-white';
    } else if (currentStep === step) {
      return 'bg-amber-100 text-amber-600';
    } else {
      return 'bg-gray-200';
    }
  };

  return <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Checkout header with logo and steps */}
        <div className="mb-8">
          <Link to="/" className="flex items-center justify-center mb-8">
            <span className="text-2xl font-bold text-black">VISION</span>
            <span className="text-2xl font-light text-amber-500">LUXE</span>
          </Link>
          {/* Checkout steps */}
          {currentStep !== 'confirmation' && <div className="flex justify-center">
              <ol className="flex items-center w-full max-w-3xl">
                <li className={`flex items-center ${getStepStyles('information')}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${getStepCircleStyles('information')}`}>
                    {getStepIconContent(currentStep, 'information')}
                  </span>
                  <span className="ml-2 text-sm">Information</span>
                </li>
                <li className="flex items-center">
                  <ChevronRightIcon size={16} className="mx-3 text-gray-400" />
                </li>
                <li className={`flex items-center ${getStepStyles('shipping')}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${getStepCircleStyles('shipping')}`}>
                    {getStepIconContent(currentStep, 'shipping')}
                  </span>
                  <span className="ml-2 text-sm">Shipping</span>
                </li>
                <li className="flex items-center">
                  <ChevronRightIcon size={16} className="mx-3 text-gray-400" />
                </li>
                <li className={`flex items-center ${getStepStyles('payment')}`}>
                  <span className={`flex items-center justify-center w-6 h-6 rounded-full ${getStepCircleStyles('payment')}`}>
                    {getStepIconContent(currentStep, 'payment')}
                  </span>
                  <span className="ml-2 text-sm">Payment</span>
                </li>
              </ol>
            </div>}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main checkout form */}
          <div className="lg:col-span-2">
            {/* Information step */}
            {currentStep === 'information' && <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Contact Information
                  </h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                    </div>
                    <h2 className="text-lg font-medium text-gray-900 pt-4 border-t border-gray-200">
                      Shipping Address
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </label>
                      <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                    </div>
                    <div>
                      <label htmlFor="apartment" className="block text-sm font-medium text-gray-700 mb-1">
                        Apartment, suite, etc. (optional)
                      </label>
                      <input type="text" id="apartment" name="apartment" value={formData.apartment} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State / Province
                        </label>
                        <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                      </div>
                      <div>
                        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP / Postal Code
                        </label>
                        <input type="text" id="zipCode" name="zipCode" value={formData.zipCode} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select id="country" name="country" value={formData.country} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <Link to="/cart" className="text-amber-500 hover:text-amber-600">
                      Return to cart
                    </Link>
                    <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                      Continue to Shipping
                    </button>
                  </div>
                </form>
              </div>}
            {/* Shipping step */}
            {currentStep === 'shipping' && <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Shipping Method
                  </h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-6">
                    {/* Contact and shipping info summary */}
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <UserIcon size={16} className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            {formData.email} | {formData.phone}
                          </span>
                        </div>
                        <button type="button" onClick={() => setCurrentStep('information')} className="text-sm text-amber-500 hover:text-amber-600">
                          Change
                        </button>
                      </div>
                      <div className="flex items-start">
                        <MapPinIcon size={16} className="text-gray-500 mr-2 mt-0.5" />
                        <span className="text-sm text-gray-600">
                          {formData.address}, {formData.city}, {formData.state}{' '}
                          {formData.zipCode}, {formData.country}
                        </span>
                      </div>
                    </div>
                    {/* Shipping options */}
                    <div className="space-y-3">
                      <div className="border border-amber-500 bg-amber-50 rounded-md p-4 relative">
                        <input type="radio" id="shipping-standard" name="shippingMethod" value="standard" checked className="absolute h-4 w-4 top-4 left-4 text-amber-500 focus:ring-amber-500 border-gray-300" readOnly />
                        <div className="pl-8">
                          <label htmlFor="shipping-standard" className="text-sm font-medium text-gray-900">
                            Standard Shipping (Free)
                          </label>
                          <p className="text-sm text-gray-500 mt-1">
                            Delivery in 5-7 business days
                          </p>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium">
                          Free
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 relative">
                        <input type="radio" id="shipping-express" name="shippingMethod" value="express" className="absolute h-4 w-4 top-4 left-4 text-amber-500 focus:ring-amber-500 border-gray-300" disabled />
                        <div className="pl-8">
                          <label htmlFor="shipping-express" className="text-sm font-medium text-gray-400">
                            Express Shipping
                          </label>
                          <p className="text-sm text-gray-400 mt-1">
                            Delivery in 2-3 business days
                          </p>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-400">
                          $12.99
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-md p-4 relative">
                        <input type="radio" id="shipping-overnight" name="shippingMethod" value="overnight" className="absolute h-4 w-4 top-4 left-4 text-amber-500 focus:ring-amber-500 border-gray-300" disabled />
                        <div className="pl-8">
                          <label htmlFor="shipping-overnight" className="text-sm font-medium text-gray-400">
                            Overnight Shipping
                          </label>
                          <p className="text-sm text-gray-400 mt-1">
                            Delivery the next business day
                          </p>
                        </div>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm font-medium text-gray-400">
                          $24.99
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <button type="button" onClick={() => setCurrentStep('information')} className="text-amber-500 hover:text-amber-600">
                      Return to Information
                    </button>
                    <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>}
            {/* Payment step */}
            {currentStep === 'payment' && <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Payment Method
                  </h2>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="p-6 space-y-6">
                    {/* Contact, shipping, and delivery info summary */}
                    <div className="bg-gray-50 p-4 rounded-md space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <UserIcon size={16} className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            {formData.email} | {formData.phone}
                          </span>
                        </div>
                        <button type="button" onClick={() => setCurrentStep('information')} className="text-sm text-amber-500 hover:text-amber-600">
                          Change
                        </button>
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <MapPinIcon size={16} className="text-gray-500 mr-2 mt-0.5" />
                          <span className="text-sm text-gray-600">
                            {formData.address}, {formData.city},{' '}
                            {formData.state} {formData.zipCode},{' '}
                            {formData.country}
                          </span>
                        </div>
                        <button type="button" onClick={() => setCurrentStep('information')} className="text-sm text-amber-500 hover:text-amber-600">
                          Change
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <TruckIcon size={16} className="text-gray-500 mr-2" />
                          <span className="text-sm text-gray-600">
                            Standard Shipping (5-7 business days)
                          </span>
                        </div>
                        <button type="button" onClick={() => setCurrentStep('shipping')} className="text-sm text-amber-500 hover:text-amber-600">
                          Change
                        </button>
                      </div>
                    </div>
                    {/* Credit card information */}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">
                        Card Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                            Name on Card
                          </label>
                          <input type="text" id="cardName" name="cardName" value={formData.cardName} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                        </div>
                        <div>
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                            Card Number
                          </label>
                          <div className="relative">
                            <input type="text" id="cardNumber" name="cardNumber" value={formData.cardNumber} onChange={handleChange} required placeholder="1234 5678 9012 3456" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <CreditCardIcon size={20} className="text-gray-400" />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                              Expiration Date (MM/YY)
                            </label>
                            <input type="text" id="cardExpiry" name="cardExpiry" value={formData.cardExpiry} onChange={handleChange} required placeholder="MM/YY" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                          </div>
                          <div>
                            <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                              CVC / CVV
                            </label>
                            <input type="text" id="cardCvc" name="cardCvc" value={formData.cardCvc} onChange={handleChange} required placeholder="123" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Billing address */}
                    <div>
                      <h3 className="text-base font-medium text-gray-900 mb-4">
                        Billing Address
                      </h3>
                      <div className="mb-4">
                        <label className="flex items-center">
                          <input type="checkbox" name="sameAsShipping" checked={formData.sameAsShipping} onChange={handleChange} className="h-4 w-4 text-amber-500 focus:ring-amber-500 border-gray-300 rounded" />
                          <span className="ml-2 text-sm text-gray-700">
                            Same as shipping address
                          </span>
                        </label>
                      </div>
                      {!formData.sameAsShipping && <div className="space-y-4">
                          <div>
                            <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">
                              Address
                            </label>
                            <input type="text" id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={handleChange} required={!formData.sameAsShipping} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                          </div>
                          <div>
                            <label htmlFor="billingApartment" className="block text-sm font-medium text-gray-700 mb-1">
                              Apartment, suite, etc. (optional)
                            </label>
                            <input type="text" id="billingApartment" name="billingApartment" value={formData.billingApartment} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                              <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">
                                City
                              </label>
                              <input type="text" id="billingCity" name="billingCity" value={formData.billingCity} onChange={handleChange} required={!formData.sameAsShipping} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                            </div>
                            <div>
                              <label htmlFor="billingState" className="block text-sm font-medium text-gray-700 mb-1">
                                State / Province
                              </label>
                              <input type="text" id="billingState" name="billingState" value={formData.billingState} onChange={handleChange} required={!formData.sameAsShipping} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                            </div>
                            <div>
                              <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                ZIP / Postal Code
                              </label>
                              <input type="text" id="billingZipCode" name="billingZipCode" value={formData.billingZipCode} onChange={handleChange} required={!formData.sameAsShipping} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                            </div>
                          </div>
                        </div>}
                    </div>
                  </div>
                  <div className="p-6 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                    <button type="button" onClick={() => setCurrentStep('shipping')} className="text-amber-500 hover:text-amber-600">
                      Return to Shipping
                    </button>
                    <button type="submit" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                      Complete Order
                    </button>
                  </div>
                </form>
              </div>}
            {/* Order confirmation */}
            {currentStep === 'confirmation' && <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                    <CheckCircleIcon size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Thank You For Your Order!
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Your order has been received and is being processed. You
                    will receive an email confirmation shortly.
                  </p>
                  <div className="inline-block bg-gray-50 rounded-md px-6 py-4 text-left mb-6">
                    <p className="text-sm text-gray-600">
                      Order Number:{' '}
                      <span className="font-medium text-gray-900">
                        {orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`}
                      </span>
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link to="/" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                      Continue Shopping
                    </Link>
                    <Link to="/account" className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200">
                      View Order History
                    </Link>
                  </div>
                </div>
              </div>}
          </div>
          {/* Order summary */}
          {currentStep !== 'confirmation' && <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden sticky top-20">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    Order Summary
                  </h2>
                </div>
                <div className="p-6">
                  {/* Cart items */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map(item => <div key={item.id} className="flex items-center">
                        <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative">
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover object-center" />
                          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-amber-500 rounded-full">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>)}
                  </div>
                  {/* Price calculations */}
                  <div className="space-y-3 border-t border-gray-200 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes</span>
                      <span className="text-gray-900">${tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between pt-3 border-t border-gray-200">
                      <span className="text-base font-medium text-gray-900">
                        Total
                      </span>
                      <span className="text-base font-medium text-amber-500">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Secure checkout badge */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-center">
                    <ShieldCheckIcon size={20} className="text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">
                      Secure Checkout
                    </span>
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </div>
    </div>;
};