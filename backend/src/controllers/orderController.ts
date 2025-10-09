import { Request, Response } from 'express';
import Order from '../models/Order';
import Product from '../models/Product';
import Payment from '../models/Payment';  // Thêm import
import Shipping from '../models/Shipping';  // Thêm import

// POST /api/orders - create order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, paymentDetails, total, email, phone, shippingMethod = 'Standard' } = req.body;  // Thêm shippingMethod default
    const user = (req as any).user?._id;  // Từ auth middleware

    if (!user) {
      return res.status(401).json({ message: 'User not authenticated' });  // Thêm check
    }

    // Check stock và update (di chuyển vào try để rollback nếu cần, nhưng đơn giản hóa)
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // Tạo Order
    const order = await Order.create({
      user,
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      paymentDetails,  
      total,
      email,
      phone,
    });

    // Tạo Payment
    const payment = await Payment.create({
      order: order._id,
      method: paymentMethod,
      amount: total,
      currency: 'USD',      
    });

    // Tạo Shipping
    const shipping = await Shipping.create({
      order: order._id,
      fullName: `${shippingAddress.firstName} ${shippingAddress.lastName}`,
      address: `${shippingAddress.address}${shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ''}`,
      city: shippingAddress.city,
      postalCode: shippingAddress.zipCode,
      country: shippingAddress.country,
      phone,
      shippingMethod,  
    });

    // Update Order với refs
    order.payment = payment._id;
    order.shipping = shipping._id;
    await order.save();

    res.status(201).json(order);
  } catch (err: any) {
    console.error(err);  // Log để debug
    res.status(500).json({ message: 'Server error: ' + err.message });
  }
};

// GET /api/orders/myorders - get logged in user's orders
export const getMyOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/orders/:id - get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price"); // <-- thêm populate cho sản phẩm

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/orders - get all orders (admin)
export const getAllOrders = async (req: any, res: Response) => {
  try {
    const orders = await Order.find({})
      .populate("user", "firstName lastName email")
      .populate("items.product", "name price"); // <-- thêm populate cho sản phẩm

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/orders/:id/status - update order status (admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // "Pending" | "Processing" | "Shipped" | "Delivered" | "Cancelled"
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    order.status = status.toLowerCase() as any; // Type assertion
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};
