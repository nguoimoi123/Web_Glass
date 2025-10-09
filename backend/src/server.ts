import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
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


dotenv.config();
const app: Application = express();
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
// Kết nối MongoDB
connectDB();

// 1. CORS đầu tiên
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
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
app.use("/api/orders", orderRoutes); // ← QUAN TRỌNG: ĐẢM BẢO DÒNG NÀY TỒN TẠI
app.use("/api/categories", categoryRoutes);

// 6. ERROR HANDLING - THÊM 404 HANDLER
app.use('*', (req, res) => {

  res.status(404).json({ message: 'Route not found' });
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {

  
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