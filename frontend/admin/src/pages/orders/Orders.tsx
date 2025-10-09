import React, { useState, useEffect } from 'react';
import { Eye, Filter } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

interface Order {
  id: string;
  customer: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment: 'Paid' | 'Pending' | 'Failed';
  total: number;
  items: number;
}

interface OrderItem {
  id: string;
  product: { name: string };
  price: number;
  quantity: number;
}

interface OrderDetail {
  id: string;
  customer: string;
  email: string;
  phone: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  payment: 'Paid' | 'Pending' | 'Failed';
  paymentMethod: string;
  total: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    apartment?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  orderItems: OrderItem[]; // Renamed to avoid conflict with Order's 'items'
}

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<OrderDetail | null>(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [statusSelect, setStatusSelect] = useState<string>('');


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/orders', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();

      // Map dữ liệu về đúng interface Order
      const mappedData: Order[] = data.map((ord: any) => ({
        id: ord._id,
        customer: `${ord.shippingAddress.firstName} ${ord.shippingAddress.lastName}`,
        date: ord.createdAt, // DataTable sẽ format
        status: ord.status.charAt(0).toUpperCase() + ord.status.slice(1), // 'Pending', 'Processing', ...
        payment: ord.paymentMethod === 'credit_card' ? 'Paid' : 'Pending', // hoặc map tùy logic
        items: ord.items.length,
        total: ord.total,
      }));
        setOrders(mappedData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  const handleViewOrder = async (order: Order) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${order.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }
      const data = await response.json();
      // Assume data has { _id, ..., orderItems: array }
      const mappedData = { ...data, id: data._id, orderItems: data.items || [] };
      setCurrentOrder(mappedData);
      setIsDetailModalOpen(true);
      setStatusSelect(data.status); // data từ API
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };
  const handleUpdateStatus = async () => {
    if (!currentOrder) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/orders/${currentOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: statusSelect }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      window.location.reload();
      const updatedOrder = await response.json();
      setCurrentOrder(updatedOrder.order); 
      setOrders(prev => prev.map(o => o.id === updatedOrder.order.id ? { ...o, status: updatedOrder.order.status } : o));
      
    } catch (err) {
      console.error(err);
    }
  };

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
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const columns = [
    // {
    //   header: 'Order ID',
    //   accessor: 'id' as keyof Order,
    //   sortable: true,
    // },
    {
      header: 'Customer',
      accessor: 'customer' as keyof Order,
      sortable: true,
    },
    {
      header: 'Date',
      accessor: 'date' as keyof Order,
      sortable: true,
      cell: (order: Order) => new Date(order.date).toLocaleDateString(),
    },
    {
      header: 'Status',
      accessor: 'status' as keyof Order,
      sortable: true,
      cell: (order: Order) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
          {order.status}
        </span>
      ),
    },
    {
      header: 'Payment',
      accessor: 'payment' as keyof Order,
      sortable: true,
      cell: (order: Order) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(order.payment)}`}>
          {order.payment}
        </span>
      ),
    },
    {
      header: 'Items',
      accessor: 'items' as keyof Order,
      sortable: true,
    },
    {
      header: 'Total',
      accessor: 'total' as keyof Order,
      sortable: true,
      cell: (order: Order) => `$${order.total.toFixed(2)}`,
    },
    {
      header: 'Actions',
      accessor: (order: Order) => (
        <Button variant="outline" size="sm" leftIcon={<Eye size={16} />} onClick={() => handleViewOrder(order)}>
          View
        </Button>
      ),
      sortable: false,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
        <Button variant="outline" leftIcon={<Filter size={16} />} onClick={() => setIsFilterModalOpen(true)}>
          Filter
        </Button>
      </div>
      <DataTable columns={columns} data={orders} keyField="id" />
      {/* Order Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={`Order Details: ${currentOrder?.id}`}
        size="lg"
        footer={
          <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
            Close
          </Button>
        }
      >
        {currentOrder && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Info */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Customer Information</h3>
                <div className="mt-2 border border-gray-200 rounded-md p-4 bg-gray-50">
                  <p className="text-sm font-medium text-gray-900">{currentOrder.customer}</p>
                  <p className="text-sm text-gray-500">{currentOrder.email}</p>
                  <p className="text-sm text-gray-500">{currentOrder.phone}</p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                <div className="mt-2 border border-gray-200 rounded-md p-4 bg-gray-50">
                  <p className="text-sm text-gray-500">
                    {currentOrder.shippingAddress.firstName} {currentOrder.shippingAddress.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{currentOrder.shippingAddress.address}</p>
                  {currentOrder.shippingAddress.apartment && (
                    <p className="text-sm text-gray-500">{currentOrder.shippingAddress.apartment}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zipCode}
                  </p>
                  <p className="text-sm text-gray-500">{currentOrder.shippingAddress.country}</p>
                </div>
              </div>

             {/* Order Status & Payment */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Order Status & Payment</h3>
                <div className="mt-2 border border-gray-200 rounded-md p-4 bg-gray-50 space-y-4">

                  {/* Status Display */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Status</p>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(currentOrder.status)}`}>
                      {currentOrder.status}
                    </span>
                  </div>

                  {/* Update Status */}
                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Update Status
                    </label>
                    <select
                      id="status"
                      value={statusSelect}
                      onChange={(e) => setStatusSelect(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                      onClick={handleUpdateStatus}
                      className="mt-2 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update
                    </button>
                  </div>

                  {/* Payment Method */}
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Payment Method</p>
                    <p className="text-sm text-gray-900">{currentOrder.paymentMethod}</p>
                  </div>

                </div>
              </div>

              {/* Order Summary */}
              <div className="md:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Order Summary</h3>
                <div className="mt-2 border border-gray-200 rounded-md p-4 bg-gray-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Order Date</p>
                    <p className="text-sm text-gray-900">{new Date(currentOrder.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Order ID</p>
                    <p className="text-sm text-gray-900">{currentOrder.id}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="text-sm font-medium text-gray-900">${currentOrder.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Items</h3>
              <div className="mt-2 border border-gray-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrder.orderItems.map(item => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.product.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Orders"
        size="md"
        footer={
          <>
            <Button variant="primary" onClick={() => setIsFilterModalOpen(false)}>
              Apply Filters
            </Button>
            <Button variant="outline" onClick={() => setIsFilterModalOpen(false)} className="mr-2">
              Reset
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700">
              Order Status
            </label>
            <select
              id="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label htmlFor="payment-filter" className="block text-sm font-medium text-gray-700">
              Payment Status
            </label>
            <select
              id="payment-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">All Payment Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
          <div>
            <label htmlFor="date-from" className="block text-sm font-medium text-gray-700">
              Date Range
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date-from" className="block text-xs text-gray-500">
                  From
                </label>
                <input
                  type="date"
                  id="date-from"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="date-to" className="block text-xs text-gray-500">
                  To
                </label>
                <input
                  type="date"
                  id="date-to"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="total-min" className="block text-sm font-medium text-gray-700">
              Total Amount
            </label>
            <div className="mt-1 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="total-min" className="block text-xs text-gray-500">
                  Min ($)
                </label>
                <input
                  type="number"
                  id="total-min"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label htmlFor="total-max" className="block text-xs text-gray-500">
                  Max ($)
                </label>
                <input
                  type="number"
                  id="total-max"
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Orders;