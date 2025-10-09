import api from "./api";

export async function getSizeGuide(categoryName: string) {
  if (!categoryName) return null;
  const res = await api.get(`/sizeguides/${encodeURIComponent(categoryName)}`);
  return res.data.sizeGuide || res.data;
}

export async function getAllSizeGuides() {
  const res = await api.get("/sizeguides");
  return res.data.sizeGuides || [];
}

export async function getSizeGuideByCategory(categoryName: string) {
  if (!categoryName) return null;
  const res = await api.get(`/sizeguides/${encodeURIComponent(categoryName)}`);
  return res.data.sizeGuide || res.data;
}
