import React, { useState } from 'react';
import { MapPinIcon, PhoneIcon, MailIcon, ClockIcon, CheckCircleIcon } from 'lucide-react';
export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
    // Reset form submission status after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };
  return <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you.
          </p>
        </div>
      </div>
      {/* Contact information and form */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Contact information */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                We're here to help with any questions about our products,
                orders, or services. Feel free to reach out to us using any of
                the methods below.
              </p>
              <div className="space-y-6">
                <div className="flex items-start">
                  <MapPinIcon size={24} className="text-amber-500 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Visit Our Store
                    </h3>
                    <p className="text-gray-600">
                      123 Eyewear Ave, Fashion District, NY 10001
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <PhoneIcon size={24} className="text-amber-500 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Call Us</h3>
                    <p className="text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MailIcon size={24} className="text-amber-500 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Email Us</h3>
                    <p className="text-gray-600">info@visionluxe.com</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <ClockIcon size={24} className="text-amber-500 mr-4 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">
                      Business Hours
                    </h3>
                    <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                    <p className="text-gray-600">Saturday: 10am - 4pm</p>
                    <p className="text-gray-600">Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Contact form */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Send Us a Message
              </h2>
              {isSubmitted ? <div className="bg-green-50 border border-green-200 rounded-md p-6">
                  <div className="flex">
                    <CheckCircleIcon size={24} className="text-green-500 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-green-800">
                        Message sent!
                      </h3>
                      <p className="text-green-700 mt-2">
                        Thank you for contacting us. We'll get back to you as
                        soon as possible.
                      </p>
                    </div>
                  </div>
                </div> : <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email
                    </label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                      <option value="">Select a subject</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Order Status">Order Status</option>
                      <option value="Return/Exchange">Return/Exchange</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Message
                    </label>
                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"></textarea>
                  </div>
                  <button type="submit" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-500 hover:bg-amber-600 transition-colors duration-200">
                    Send Message
                  </button>
                </form>}
            </div>
          </div>
        </div>
      </section>
      {/* Map */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-200 rounded-lg overflow-hidden h-96 shadow-inner">
            {/* This would be replaced with an actual map component in a real application */}
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-600">Map would be displayed here</p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};