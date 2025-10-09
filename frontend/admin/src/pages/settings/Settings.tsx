import React, { useState } from 'react';
import { Save, Store, Mail, CreditCard, Truck, DollarSign, Settings as SettingsIcon } from 'lucide-react';
import Button from '../../components/ui/Button';
import { Plus } from 'lucide-react';
interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  storeLogo: string;
  currency: string;
  timezone: string;
}
interface EmailSettings {
  smtpServer: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
}
interface PaymentSettings {
  paymentMethods: {
    creditCard: boolean;
    paypal: boolean;
    applePay: boolean;
    googlePay: boolean;
    bankTransfer: boolean;
  };
  stripePubKey: string;
  stripeSecretKey: string;
  paypalClientId: string;
  paypalSecretKey: string;
}
interface ShippingSettings {
  shippingMethods: {
    standard: boolean;
    express: boolean;
    overnight: boolean;
    freeShipping: boolean;
  };
  freeShippingThreshold: string;
}
interface TaxSettings {
  enableTax: boolean;
  taxRate: string;
  taxIncluded: boolean;
}
const defaultStoreSettings: StoreSettings = {
  storeName: 'EyeWear Store',
  storeEmail: 'info@eyewearstore.com',
  storePhone: '+1 (555) 123-4567',
  storeAddress: '123 Main St, Suite 100, New York, NY 10001',
  storeLogo: 'https://via.placeholder.com/150',
  currency: 'USD',
  timezone: 'America/New_York'
};
const defaultEmailSettings: EmailSettings = {
  smtpServer: 'smtp.example.com',
  smtpPort: '587',
  smtpUsername: 'info@eyewearstore.com',
  smtpPassword: '••••••••••••',
  fromEmail: 'info@eyewearstore.com',
  fromName: 'EyeWear Store'
};
const defaultPaymentSettings: PaymentSettings = {
  paymentMethods: {
    creditCard: true,
    paypal: true,
    applePay: false,
    googlePay: false,
    bankTransfer: false
  },
  stripePubKey: 'pk_test_••••••••••••••••••••••••',
  stripeSecretKey: 'sk_test_••••••••••••••••••••••••',
  paypalClientId: '••••••••••••••••••••••••',
  paypalSecretKey: '••••••••••••••••••••••••'
};
const defaultShippingSettings: ShippingSettings = {
  shippingMethods: {
    standard: true,
    express: true,
    overnight: false,
    freeShipping: true
  },
  freeShippingThreshold: '100'
};
const defaultTaxSettings: TaxSettings = {
  enableTax: true,
  taxRate: '8.5',
  taxIncluded: false
};
const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('store');
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [emailSettings, setEmailSettings] = useState<EmailSettings>(defaultEmailSettings);
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(defaultPaymentSettings);
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>(defaultShippingSettings);
  const [taxSettings, setTaxSettings] = useState<TaxSettings>(defaultTaxSettings);
  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStoreSettings({
      ...storeSettings,
      [e.target.name]: e.target.value
    });
  };
  const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailSettings({
      ...emailSettings,
      [e.target.name]: e.target.value
    });
  };
  const handlePaymentMethodToggle = (method: keyof PaymentSettings['paymentMethods']) => {
    setPaymentSettings({
      ...paymentSettings,
      paymentMethods: {
        ...paymentSettings.paymentMethods,
        [method]: !paymentSettings.paymentMethods[method]
      }
    });
  };
  const handlePaymentSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentSettings({
      ...paymentSettings,
      [e.target.name]: e.target.value
    });
  };
  const handleShippingMethodToggle = (method: keyof ShippingSettings['shippingMethods']) => {
    setShippingSettings({
      ...shippingSettings,
      shippingMethods: {
        ...shippingSettings.shippingMethods,
        [method]: !shippingSettings.shippingMethods[method]
      }
    });
  };
  const handleShippingSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingSettings({
      ...shippingSettings,
      [e.target.name]: e.target.value
    });
  };
  const handleTaxSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setTaxSettings({
      ...taxSettings,
      [e.target.name]: value
    });
  };
  const saveSettings = () => {
    // In a real app, you would send this to your API
    console.log({
      storeSettings,
      emailSettings,
      paymentSettings,
      shippingSettings,
      taxSettings
    });
    // Show success message
    alert('Settings saved successfully!');
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case 'store':
        return <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700">
                  Store Name
                </label>
                <input type="text" name="storeName" id="storeName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={storeSettings.storeName} onChange={handleStoreSettingsChange} />
              </div>
              <div>
                <label htmlFor="storeEmail" className="block text-sm font-medium text-gray-700">
                  Store Email
                </label>
                <input type="email" name="storeEmail" id="storeEmail" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={storeSettings.storeEmail} onChange={handleStoreSettingsChange} />
              </div>
              <div>
                <label htmlFor="storePhone" className="block text-sm font-medium text-gray-700">
                  Store Phone
                </label>
                <input type="text" name="storePhone" id="storePhone" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={storeSettings.storePhone} onChange={handleStoreSettingsChange} />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="storeAddress" className="block text-sm font-medium text-gray-700">
                  Store Address
                </label>
                <input type="text" name="storeAddress" id="storeAddress" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={storeSettings.storeAddress} onChange={handleStoreSettingsChange} />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select name="currency" id="currency" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={storeSettings.currency} onChange={handleStoreSettingsChange}>
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="CAD">CAD - Canadian Dollar</option>
                  <option value="AUD">AUD - Australian Dollar</option>
                  <option value="JPY">JPY - Japanese Yen</option>
                </select>
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-gray-700">
                  Timezone
                </label>
                <select name="timezone" id="timezone" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" value={storeSettings.timezone} onChange={handleStoreSettingsChange}>
                  <option value="America/New_York">
                    Eastern Time (US & Canada)
                  </option>
                  <option value="America/Chicago">
                    Central Time (US & Canada)
                  </option>
                  <option value="America/Denver">
                    Mountain Time (US & Canada)
                  </option>
                  <option value="America/Los_Angeles">
                    Pacific Time (US & Canada)
                  </option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                  <option value="Australia/Sydney">Sydney</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Store Logo
                </label>
                <div className="mt-1 flex items-center">
                  <img src={storeSettings.storeLogo} alt="Store Logo" className="h-16 w-16 rounded-md object-cover" />
                  <button type="button" className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Change
                  </button>
                </div>
              </div>
            </div>
          </div>;
      case 'email':
        return <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="smtpServer" className="block text-sm font-medium text-gray-700">
                  SMTP Server
                </label>
                <input type="text" name="smtpServer" id="smtpServer" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={emailSettings.smtpServer} onChange={handleEmailSettingsChange} />
              </div>
              <div>
                <label htmlFor="smtpPort" className="block text-sm font-medium text-gray-700">
                  SMTP Port
                </label>
                <input type="text" name="smtpPort" id="smtpPort" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={emailSettings.smtpPort} onChange={handleEmailSettingsChange} />
              </div>
              <div>
                <label htmlFor="smtpUsername" className="block text-sm font-medium text-gray-700">
                  SMTP Username
                </label>
                <input type="text" name="smtpUsername" id="smtpUsername" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={emailSettings.smtpUsername} onChange={handleEmailSettingsChange} />
              </div>
              <div>
                <label htmlFor="smtpPassword" className="block text-sm font-medium text-gray-700">
                  SMTP Password
                </label>
                <input type="password" name="smtpPassword" id="smtpPassword" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={emailSettings.smtpPassword} onChange={handleEmailSettingsChange} />
              </div>
              <div>
                <label htmlFor="fromEmail" className="block text-sm font-medium text-gray-700">
                  From Email
                </label>
                <input type="email" name="fromEmail" id="fromEmail" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={emailSettings.fromEmail} onChange={handleEmailSettingsChange} />
              </div>
              <div>
                <label htmlFor="fromName" className="block text-sm font-medium text-gray-700">
                  From Name
                </label>
                <input type="text" name="fromName" id="fromName" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={emailSettings.fromName} onChange={handleEmailSettingsChange} />
              </div>
            </div>
            <div>
              <Button variant="outline" size="sm">
                Test Email Configuration
              </Button>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Email Templates
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Customize the email templates sent to customers.
              </p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">
                    Order Confirmation
                  </span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">
                    Shipping Confirmation
                  </span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">
                    Password Reset
                  </span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">
                    Account Welcome
                  </span>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>;
      case 'payment':
        return <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Payment Methods
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enable or disable payment methods for your store.
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input id="creditCard" name="creditCard" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={paymentSettings.paymentMethods.creditCard} onChange={() => handlePaymentMethodToggle('creditCard')} />
                  <label htmlFor="creditCard" className="ml-3 block text-sm font-medium text-gray-700">
                    Credit Card (Stripe)
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="paypal" name="paypal" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={paymentSettings.paymentMethods.paypal} onChange={() => handlePaymentMethodToggle('paypal')} />
                  <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                    PayPal
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="applePay" name="applePay" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={paymentSettings.paymentMethods.applePay} onChange={() => handlePaymentMethodToggle('applePay')} />
                  <label htmlFor="applePay" className="ml-3 block text-sm font-medium text-gray-700">
                    Apple Pay
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="googlePay" name="googlePay" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={paymentSettings.paymentMethods.googlePay} onChange={() => handlePaymentMethodToggle('googlePay')} />
                  <label htmlFor="googlePay" className="ml-3 block text-sm font-medium text-gray-700">
                    Google Pay
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="bankTransfer" name="bankTransfer" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={paymentSettings.paymentMethods.bankTransfer} onChange={() => handlePaymentMethodToggle('bankTransfer')} />
                  <label htmlFor="bankTransfer" className="ml-3 block text-sm font-medium text-gray-700">
                    Bank Transfer
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Stripe Configuration
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="stripePubKey" className="block text-sm font-medium text-gray-700">
                    Publishable Key
                  </label>
                  <input type="text" name="stripePubKey" id="stripePubKey" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={paymentSettings.stripePubKey} onChange={handlePaymentSettingsChange} />
                </div>
                <div>
                  <label htmlFor="stripeSecretKey" className="block text-sm font-medium text-gray-700">
                    Secret Key
                  </label>
                  <input type="password" name="stripeSecretKey" id="stripeSecretKey" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={paymentSettings.stripeSecretKey} onChange={handlePaymentSettingsChange} />
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                PayPal Configuration
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="paypalClientId" className="block text-sm font-medium text-gray-700">
                    Client ID
                  </label>
                  <input type="text" name="paypalClientId" id="paypalClientId" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={paymentSettings.paypalClientId} onChange={handlePaymentSettingsChange} />
                </div>
                <div>
                  <label htmlFor="paypalSecretKey" className="block text-sm font-medium text-gray-700">
                    Secret Key
                  </label>
                  <input type="password" name="paypalSecretKey" id="paypalSecretKey" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={paymentSettings.paypalSecretKey} onChange={handlePaymentSettingsChange} />
                </div>
              </div>
            </div>
          </div>;
      case 'shipping':
        return <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                Shipping Methods
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Enable or disable shipping methods for your store.
              </p>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input id="standard" name="standard" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={shippingSettings.shippingMethods.standard} onChange={() => handleShippingMethodToggle('standard')} />
                  <label htmlFor="standard" className="ml-3 block text-sm font-medium text-gray-700">
                    Standard Shipping (3-5 business days)
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="express" name="express" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={shippingSettings.shippingMethods.express} onChange={() => handleShippingMethodToggle('express')} />
                  <label htmlFor="express" className="ml-3 block text-sm font-medium text-gray-700">
                    Express Shipping (2-3 business days)
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="overnight" name="overnight" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={shippingSettings.shippingMethods.overnight} onChange={() => handleShippingMethodToggle('overnight')} />
                  <label htmlFor="overnight" className="ml-3 block text-sm font-medium text-gray-700">
                    Overnight Shipping (1 business day)
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="freeShipping" name="freeShipping" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={shippingSettings.shippingMethods.freeShipping} onChange={() => handleShippingMethodToggle('freeShipping')} />
                  <label htmlFor="freeShipping" className="ml-3 block text-sm font-medium text-gray-700">
                    Free Shipping (orders above threshold)
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Free Shipping Settings
              </h3>
              <div className="mt-4">
                <label htmlFor="freeShippingThreshold" className="block text-sm font-medium text-gray-700">
                  Free Shipping Threshold ({storeSettings.currency})
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input type="text" name="freeShippingThreshold" id="freeShippingThreshold" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" placeholder="0.00" value={shippingSettings.freeShippingThreshold} onChange={handleShippingSettingsChange} />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Orders above this amount will qualify for free shipping.
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Shipping Zones
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure shipping rates for different regions.
              </p>
              <div className="mt-4 space-y-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900">
                    Domestic (United States)
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Standard Shipping</span>
                      <span className="text-gray-900">$5.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Express Shipping</span>
                      <span className="text-gray-900">$12.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Overnight Shipping</span>
                      <span className="text-gray-900">$24.99</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-gray-900">
                    International
                  </h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Standard Shipping</span>
                      <span className="text-gray-900">$15.99</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Express Shipping</span>
                      <span className="text-gray-900">$29.99</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" leftIcon={<Plus size={16} />}>
                    Add Shipping Zone
                  </Button>
                </div>
              </div>
            </div>
          </div>;
      case 'tax':
        return <div className="space-y-6">
            <div>
              <div className="flex items-center">
                <input id="enableTax" name="enableTax" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={taxSettings.enableTax} onChange={handleTaxSettingsChange} />
                <label htmlFor="enableTax" className="ml-3 text-lg font-medium text-gray-900">
                  Enable Tax Calculation
                </label>
              </div>
              <p className="mt-1 text-sm text-gray-500 ml-7">
                When enabled, tax will be calculated based on the settings
                below.
              </p>
            </div>
            {taxSettings.enableTax && <>
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                        Default Tax Rate (%)
                      </label>
                      <input type="text" name="taxRate" id="taxRate" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" value={taxSettings.taxRate} onChange={handleTaxSettingsChange} />
                      <p className="mt-2 text-sm text-gray-500">
                        This rate will be applied to all orders unless
                        overridden by tax zones.
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center h-10">
                        <input id="taxIncluded" name="taxIncluded" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" checked={taxSettings.taxIncluded} onChange={handleTaxSettingsChange} />
                        <label htmlFor="taxIncluded" className="ml-3 block text-sm font-medium text-gray-700">
                          Prices include tax
                        </label>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        If enabled, the displayed prices will include tax.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-medium text-gray-900">
                    Tax Zones
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Configure specific tax rates for different regions.
                  </p>
                  <div className="mt-4 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          California
                        </h4>
                        <span className="text-sm font-medium text-gray-900">
                          9.5%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        United States
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          New York
                        </h4>
                        <span className="text-sm font-medium text-gray-900">
                          8.875%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        United States
                      </p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          European Union
                        </h4>
                        <span className="text-sm font-medium text-gray-900">
                          20%
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">VAT</p>
                      <div className="mt-3">
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button variant="outline" size="sm" leftIcon={<Plus size={16} />}>
                        Add Tax Zone
                      </Button>
                    </div>
                  </div>
                </div>
              </>}
          </div>;
      case 'general':
      default:
        return <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">
                General Settings
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Configure general settings for your store.
              </p>
              <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="itemsPerPage" className="block text-sm font-medium text-gray-700">
                    Items Per Page
                  </label>
                  <select id="itemsPerPage" name="itemsPerPage" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="12">
                    <option value="8">8</option>
                    <option value="12">12</option>
                    <option value="16">16</option>
                    <option value="24">24</option>
                    <option value="36">36</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="defaultSorting" className="block text-sm font-medium text-gray-700">
                    Default Sorting
                  </label>
                  <select id="defaultSorting" name="defaultSorting" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="newest">
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dateFormat" className="block text-sm font-medium text-gray-700">
                    Date Format
                  </label>
                  <select id="dateFormat" name="dateFormat" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="MM/DD/YYYY">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="weightUnit" className="block text-sm font-medium text-gray-700">
                    Weight Unit
                  </label>
                  <select id="weightUnit" name="weightUnit" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="g">
                    <option value="g">Grams (g)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="oz">Ounces (oz)</option>
                    <option value="lb">Pounds (lb)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dimensionUnit" className="block text-sm font-medium text-gray-700">
                    Dimension Unit
                  </label>
                  <select id="dimensionUnit" name="dimensionUnit" className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md" defaultValue="cm">
                    <option value="cm">Centimeters (cm)</option>
                    <option value="m">Meters (m)</option>
                    <option value="in">Inches (in)</option>
                    <option value="ft">Feet (ft)</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Review Settings
              </h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center">
                  <input id="enableReviews" name="enableReviews" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                  <label htmlFor="enableReviews" className="ml-3 block text-sm font-medium text-gray-700">
                    Enable product reviews
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="reviewApproval" name="reviewApproval" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                  <label htmlFor="reviewApproval" className="ml-3 block text-sm font-medium text-gray-700">
                    Reviews require approval
                  </label>
                </div>
                <div className="flex items-center">
                  <input id="verifiedPurchase" name="verifiedPurchase" type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" defaultChecked />
                  <label htmlFor="verifiedPurchase" className="ml-3 block text-sm font-medium text-gray-700">
                    Allow reviews only from verified purchases
                  </label>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900">
                Analytics & Tracking
              </h3>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor="googleAnalytics" className="block text-sm font-medium text-gray-700">
                    Google Analytics Tracking ID
                  </label>
                  <input type="text" name="googleAnalytics" id="googleAnalytics" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" />
                </div>
                <div>
                  <label htmlFor="facebookPixel" className="block text-sm font-medium text-gray-700">
                    Facebook Pixel ID
                  </label>
                  <input type="text" name="facebookPixel" id="facebookPixel" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="XXXXXXXXXXXXXXXXXX" />
                </div>
              </div>
            </div>
          </div>;
    }
  };
  return <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your store settings and configurations.
        </p>
      </div>
      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex overflow-x-auto py-4 px-6">
            <button className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'store' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('store')}>
              <Store className="inline-block mr-2 h-5 w-5" />
              Store Information
            </button>
            <button className={`whitespace-nowrap ml-8 pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'email' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('email')}>
              <Mail className="inline-block mr-2 h-5 w-5" />
              Email
            </button>
            <button className={`whitespace-nowrap ml-8 pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'payment' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('payment')}>
              <CreditCard className="inline-block mr-2 h-5 w-5" />
              Payment
            </button>
            <button className={`whitespace-nowrap ml-8 pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'shipping' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('shipping')}>
              <Truck className="inline-block mr-2 h-5 w-5" />
              Shipping
            </button>
            <button className={`whitespace-nowrap ml-8 pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'tax' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('tax')}>
              <DollarSign className="inline-block mr-2 h-5 w-5" />
              Tax
            </button>
            <button className={`whitespace-nowrap ml-8 pb-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`} onClick={() => setActiveTab('general')}>
              <SettingsIcon className="inline-block mr-2 h-5 w-5" />
              General
            </button>
          </nav>
        </div>
        <div className="p-6">{renderTabContent()}</div>
        <div className="bg-gray-50 px-6 py-3 flex justify-end">
          <Button variant="primary" leftIcon={<Save size={16} />} onClick={saveSettings}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>;
};
export default Settings;