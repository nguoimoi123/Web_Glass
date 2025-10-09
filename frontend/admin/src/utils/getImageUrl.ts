const BACKEND_URL = "http://localhost:5000";

export function getImageUrl(path?: string): string {
  if (!path) return "https://via.placeholder.com/400"; // fallback
  if (path.startsWith("http")) return path; // ảnh absolute (unsplash, cdn)
  return `${BACKEND_URL}${path}`; // ảnh từ backend
}