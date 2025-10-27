import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import connectDB from "./config/db";
import productRoutes from "./routes/productRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import sizeGuideRoutes from "./routes/sizeGuideRoutes";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import cartRoutes from "./routes/cartRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import orderRoutes from "./routes/orderRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import chatbotRoutes from "./routes/chatbotRoutes";
import messageRoutes from "./routes/messageRoutes";
import Message from "./models/Message";
import User from "./models/User";

dotenv.config();
const app: Application = express();
const httpServer = createServer(app);
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174","https://367tr1k9-5173.asse.devtunnels.ms/" ];
// Kết nối MongoDB
connectDB();

// Kết nối Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.some(allowed => origin && origin.includes(allowed))) {
        callback(null, true);
      } else {
        console.warn('Rejected WebSocket connection from:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
  }
});

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
}

io.use(async (socket: any, next) => {
  try {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    const user = await User.findById(decoded.id);

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.userId = decoded.id;
    socket.userRole = user.role;
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
});

const connectedUsers = new Map<string, string>();

io.on('connection', (socket: any) => {
  console.log(`User connected: ${socket.userId} (${socket.userRole})`);
  
  connectedUsers.set(socket.userId, socket.id);

  if (socket.userRole === 'admin') {
    socket.join('admins');
  }

  socket.emit('connected', { userId: socket.userId, role: socket.userRole });

  socket.on('sendMessage', async (data: { receiverId?: string; content: string }) => {
    try {
      const message = await Message.create({
        sender: socket.userId,
        senderRole: socket.userRole,
        receiver: data.receiverId || null,
        content: data.content,
        isRead: false
      });

      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name email role')
        .populate('receiver', 'name email role');

      socket.emit('messageSent', populatedMessage);

      if (socket.userRole === 'user') {
        io.to('admins').emit('newMessage', populatedMessage);
      } else if (data.receiverId) {
        const receiverSocketId = connectedUsers.get(data.receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('newMessage', populatedMessage);
        }
      }
    } catch (error) {
      console.error('Send message error:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  socket.on('typing', (data: { receiverId?: string }) => {
    if (socket.userRole === 'user') {
      io.to('admins').emit('userTyping', { userId: socket.userId });
    } else if (data.receiverId) {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('adminTyping', { adminId: socket.userId });
      }
    }
  });

  socket.on('stopTyping', (data: { receiverId?: string }) => {
    if (socket.userRole === 'user') {
      io.to('admins').emit('userStopTyping', { userId: socket.userId });
    } else if (data.receiverId) {
      const receiverSocketId = connectedUsers.get(data.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('adminStopTyping', { adminId: socket.userId });
      }
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.userId}`);
    connectedUsers.delete(socket.userId);
  });
});

// 1. CORS đầu tiên
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.some(allowed => origin && origin.includes(allowed))) {   
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);
// 2. Body parsing
app.use(express.json());

// 3. LOGGING MIDDLEWARE - THÊM VÀO ĐÂY
// app.use((req, res, next) => {
//   console.log('=== NEW REQUEST ===');
//   console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
//   console.log('Path:', req.path);
//   console.log('Body:', req.body);
//   next();
// });

// 4. OPTIONS handling - ĐƠN GIẢN HÓA
app.use(express.json());
app.options('*', cors()); // Let CORS handle OPTIONS
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
// 5. Routes
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// ĐĂNG KÝ ROUTES - ĐẢM BẢO ORDER ROUTES ĐƯỢC ĐĂNG KÝ
app.use("/api/products", productRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/sizeguides", sizeGuideRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes); 
app.use("/api/categories", categoryRoutes);
app.use("/api/chatbot", chatbotRoutes);
app.use("/api/messages", messageRoutes);
// 6. ERROR HANDLING - THÊM 404 HANDLER
app.use('*', (req, res) => {

  res.status(404).json({ message: 'Route not found' });
});

// Server listen
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {

  
  // LOG TẤT CẢ ROUTES KHI SERVER START

  app._router.stack.forEach((middleware: any) => {
    if (middleware.route) {
      // Direct routes
      const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(', ');
   
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      // Router middleware
     
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).map(m => m.toUpperCase()).join(', ');
          
        }
      });
    }
  });
});
export { io };