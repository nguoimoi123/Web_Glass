import api from "./api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: any;
}

// Login
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

// Register
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

// Logout (optional)
export const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Lấy user hiện tại từ backend
export const getCurrentUser = async (): Promise<any> => {
  const response = await api.get("/auth/me", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return response.data;
};
