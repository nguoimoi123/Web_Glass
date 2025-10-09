import React from 'react';
export const About: React.FC = () => {
  return <div className="bg-white">
      {/* Header */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">About Us</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Discover the story behind VisionLuxe and our commitment to quality
            eyewear.
          </p>
        </div>
      </div>
      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-gray-600 mb-4">
                Founded in 1998, VisionLuxe began with a simple mission: to
                create eyewear that combines style, comfort, and quality. What
                started as a small boutique in New York City has grown into a
                respected name in the eyewear industry.
              </p>
              <p className="text-gray-600 mb-4">
                Our founder, Sarah Chen, believed that glasses should be more
                than just a visual aid—they should be a statement piece that
                enhances your personal style. This philosophy continues to guide
                our designs today.
              </p>
              <p className="text-gray-600">
                Over the years, we've expanded our collection to include a wide
                range of styles, from classic to contemporary, while maintaining
                our commitment to exceptional craftsmanship and materials.
              </p>
            </div>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1556306510-31ca015374b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80" alt="VisionLuxe founder" className="rounded-lg shadow-lg w-full h-auto object-cover" />
            </div>
          </div>
        </div>
      </section>
      {/* Our Values */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These core principles guide everything we do at VisionLuxe.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Quality</h3>
              <p className="text-gray-600">
                We use only the finest materials and work with skilled artisans
                to create eyewear that's built to last.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Innovation
              </h3>
              <p className="text-gray-600">
                We're constantly exploring new designs, materials, and
                technologies to enhance both style and functionality.
              </p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-amber-500">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Customer Satisfaction
              </h3>
              <p className="text-gray-600">
                Your satisfaction is our priority. We're committed to providing
                exceptional service and products that exceed expectations.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Team */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate individuals behind VisionLuxe.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="mb-4">
                <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Sarah Chen - Founder & CEO" className="w-32 h-32 object-cover rounded-full mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Sarah Chen</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="David Rodriguez - Lead Designer" className="w-32 h-32 object-cover rounded-full mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                David Rodriguez
              </h3>
              <p className="text-gray-600">Lead Designer</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Emily Johnson - Marketing Director" className="w-32 h-32 object-cover rounded-full mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Emily Johnson</h3>
              <p className="text-gray-600">Marketing Director</p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <img src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80" alt="Michael Wong - Product Manager" className="w-32 h-32 object-cover rounded-full mx-auto" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Michael Wong</h3>
              <p className="text-gray-600">Product Manager</p>
            </div>
          </div>
        </div>
      </section>
    </div>;
};