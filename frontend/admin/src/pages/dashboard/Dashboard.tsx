import React from 'react';
import { Users, ShoppingBag, DollarSign, ShoppingCart, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend, PieChart, Pie, Cell } from 'recharts';
const Dashboard: React.FC = () => {
  // Mock data for charts
  const salesData = [{
    name: 'Jan',
    sales: 4000
  }, {
    name: 'Feb',
    sales: 3000
  }, {
    name: 'Mar',
    sales: 5000
  }, {
    name: 'Apr',
    sales: 4500
  }, {
    name: 'May',
    sales: 6000
  }, {
    name: 'Jun',
    sales: 5500
  }, {
    name: 'Jul',
    sales: 7000
  }, {
    name: 'Aug',
    sales: 8000
  }, {
    name: 'Sep',
    sales: 7500
  }, {
    name: 'Oct',
    sales: 9000
  }, {
    name: 'Nov',
    sales: 10000
  }, {
    name: 'Dec',
    sales: 12000
  }];
  const categoryData = [{
    name: 'Sunglasses',
    value: 45
  }, {
    name: 'Eyeglasses',
    value: 30
  }, {
    name: 'Lenses',
    value: 15
  }, {
    name: 'Accessories',
    value: 10
  }];
  const topProducts = [{
    name: 'Ray-Ban Aviator',
    sales: 245,
    revenue: 39200
  }, {
    name: 'Oakley Holbrook',
    sales: 187,
    revenue: 24310
  }, {
    name: 'Prada PR 17WS',
    sales: 142,
    revenue: 29820
  }, {
    name: 'Gucci GG0022S',
    sales: 132,
    revenue: 36960
  }, {
    name: 'Persol PO3019S',
    sales: 112,
    revenue: 19040
  }];
  const recentOrders = [{
    id: 'ORD-7352',
    customer: 'John Doe',
    status: 'Delivered',
    date: '2023-10-15',
    amount: 245.99
  }, {
    id: 'ORD-7351',
    customer: 'Jane Smith',
    status: 'Processing',
    date: '2023-10-15',
    amount: 189.5
  }, {
    id: 'ORD-7350',
    customer: 'Robert Johnson',
    status: 'Shipped',
    date: '2023-10-14',
    amount: 324.75
  }, {
    id: 'ORD-7349',
    customer: 'Emily Davis',
    status: 'Pending',
    date: '2023-10-14',
    amount: 142.25
  }, {
    id: 'ORD-7348',
    customer: 'Michael Wilson',
    status: 'Delivered',
    date: '2023-10-13',
    amount: 218.0
  }];
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Revenue
              </p>
              <p className="text-2xl font-semibold text-gray-900">$24,567.89</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
            <span className="text-green-500 font-medium">12.5%</span>
            <span className="text-gray-500 ml-1.5">from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
              <ShoppingCart className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Orders
              </p>
              <p className="text-2xl font-semibold text-gray-900">1,234</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
            <span className="text-green-500 font-medium">8.2%</span>
            <span className="text-gray-500 ml-1.5">from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Products
              </p>
              <p className="text-2xl font-semibold text-gray-900">512</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1.5" />
            <span className="text-green-500 font-medium">4.7%</span>
            <span className="text-gray-500 ml-1.5">from last month</span>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-orange-500 rounded-md p-3">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="ml-5">
              <p className="text-sm font-medium text-gray-500 truncate">
                Total Customers
              </p>
              <p className="text-2xl font-semibold text-gray-900">892</p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingDown className="h-4 w-4 text-red-500 mr-1.5" />
            <span className="text-red-500 font-medium">2.3%</span>
            <span className="text-gray-500 ml-1.5">from last month</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Sales Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData} margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area type="monotone" dataKey="sales" stroke="#3B82F6" fillOpacity={1} fill="url(#colorSales)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Product Categories
          </h2>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" label={({
                name,
                percent
              }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Top Selling Products
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sales
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topProducts.map((product, index) => <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${product.revenue.toLocaleString()}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Recent Orders</h2>
            <a href="/orders" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              View all
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders.map(order => <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${order.amount.toFixed(2)}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>;
};
export default Dashboard;