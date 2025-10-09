import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

// GET /api/users/me
export const getMe = async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-passwordHash");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// GET /api/users/user
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({ role: "user" }).select("-passwordHash");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// POST /api/users/user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, password, role = "user", status = "active" } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      role,
      status,
    });

    if ((req as any).file) {
      newUser.avatar = `/uploads/${(req as any).file.filename}`;
    }

    await newUser.save();

    res.status(201).json({
      id: newUser._id,
      name: `${newUser.firstName} ${newUser.lastName}`,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      avatar: newUser.avatar || null,
      createdAt: newUser.createdAt,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/users/user/:id
export const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { firstName, lastName, email, role, status, password } = req.body;

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    if ((req as any).file) {
      user.avatar = `/uploads/${(req as any).file.filename}`;
    }

    await user.save();

    res.json({
      id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar: user.avatar || null,
      createdAt: user.createdAt,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/users/user/:id
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Kiểm tra user tồn tại
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Không cho xóa admin (tuỳ logic)
    if (user.role === "admin") {
      return res.status(403).json({ message: "Cannot delete admin user" });
    }

    // Nếu có avatar thì xóa file cũ trong uploads
    if (user.avatar && !user.avatar.startsWith("http")) {
      const filename = path.basename(user.avatar); // lấy tên file
      const filePath = path.join(__dirname, "../uploads", filename);

      try {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
          console.log("Deleted avatar:", filePath);
        }
      } catch (err) {
        console.error("Error deleting avatar file:", err);
      }
    }

    // Xóa user trong DB
    await User.findByIdAndDelete(userId);

    res.status(200).json({ message: "User deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

