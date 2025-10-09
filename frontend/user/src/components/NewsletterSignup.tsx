import React, { useState } from 'react';
import { MailIcon, CheckCircleIcon } from 'lucide-react';
export const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    // In a real app, this would send the email to your newsletter service
    console.log('Newsletter signup:', email);
    // Show success message
    setIsSubmitted(true);
    setError(null);
    // Reset form
    setEmail('');
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };
  return <div>
      {isSubmitted ? <div className="flex items-center bg-green-100 p-3 rounded-md">
          <CheckCircleIcon size={20} className="text-green-500 mr-2" />
          <p className="text-sm text-green-700">
            Thank you for subscribing to our newsletter!
          </p>
        </div> : <form onSubmit={handleSubmit}>
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MailIcon size={16} className="text-gray-400" />
              </div>
              <input type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} className="w-full pl-10 pr-3 py-2 border border-gray-700 rounded-l-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500" />
            </div>
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-r-md transition-colors duration-200">
              Subscribe
            </button>
          </div>
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
        </form>}
      <p className="text-xs text-gray-500 mt-2">
        By subscribing, you agree to receive marketing emails from us.
      </p>
    </div>;
};