import { Request } from "express";
import { Types } from "mongoose";

export interface AuthUser {
  _id: Types.ObjectId;   // id trong MongoDB
  firstName: string;
  lastName: string;
  email: string;
  role: number;          // 0 = user, 1 = admin (theo cấu trúc bạn đã dùng)
}

export interface AuthRequest extends Request {
  user?: AuthUser;       // gắn vào khi middleware auth verify JWT
}
