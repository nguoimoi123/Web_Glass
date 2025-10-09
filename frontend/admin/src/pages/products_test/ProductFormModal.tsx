import React, { useState } from "react";
import Modal from "../../components/ui/Modal";
import Button from "../../components/ui/Button";
import { Product, Category } from "./types";
import { getImageUrl } from "../../utils/getImageUrl";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: Partial<Product> | null;
  categories: Category[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  setMessage: React.Dispatch<React.SetStateAction<{ open: boolean; title: string; text: string }>>;
}

const ProductFormModal: React.FC<Props> = ({
  isOpen,
  onClose,
  product,
  categories,
  setProducts,
  setMessage,
}) => {
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>(product || {});
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  React.useEffect(() => {
    setCurrentProduct(product || {});
    setImagesToRemove([]);
  }, [product]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === "number" ? parseFloat(e.target.value) : e.target.value;
    setCurrentProduct((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const previews = fileArray.map((f) => URL.createObjectURL(f));
    setCurrentProduct((prev) => ({
      ...prev,
      images: prev?.images ? [...prev.images, ...previews] : previews,
      newFiles: prev?.newFiles ? [...prev.newFiles, ...fileArray] : fileArray,
    }));
  };

  const toggleRemoveImage = (img: string) => {
    setImagesToRemove((prev) =>
      prev.includes(img) ? prev.filter((i) => i !== img) : [...prev, img]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct.legacyId) {
      setMessage({
        open: true,
        title: "Validation Error",
        text: "Legacy ID is required",
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const productData = {
        legacyId: currentProduct.legacyId,
        name: currentProduct.name ?? "",
        categoryName: currentProduct.category ?? "",
        price: currentProduct.price ?? 0,
        stock: currentProduct.stock ?? 0,
        status: currentProduct.status ?? "Active",
        description: currentProduct.description ?? "",
      };

      let response;
      if ((currentProduct.newFiles && currentProduct.newFiles.length > 0) || imagesToRemove.length > 0) {
        const formData = new FormData();
        if (currentProduct.newFiles) {
          currentProduct.newFiles.forEach((f) => formData.append("images", f));
        }
        Object.entries(productData).forEach(([k, v]) => formData.append(k, v.toString()));
        if (imagesToRemove.length > 0) {
          formData.append("removeImages", JSON.stringify(imagesToRemove));
        }

        response = await fetch(
          currentProduct.id
            ? `http://localhost:5000/api/products/${currentProduct.id}`
            : "http://localhost:5000/api/products",
          {
            method: currentProduct.id ? "PUT" : "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          }
        );
      } else {
        response = await fetch(
          currentProduct.id
            ? `http://localhost:5000/api/products/${currentProduct.id}`
            : "http://localhost:5000/api/products",
          {
            method: currentProduct.id ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(productData),
          }
        );
      }

      if (!response.ok) throw new Error("Failed to save product");
      const saved = await response.json();
      const mapped: Product = {
        ...saved,
        id: saved._id,
        legacyId: saved.legacyId?.toString() ?? "",
      };

      setProducts((prev) =>
        currentProduct.id
          ? prev.map((p) => (p.id === mapped.id ? mapped : p))
          : [...prev, mapped]
      );

      setMessage({
        open: true,
        title: currentProduct.id ? "Update Success" : "Add Success",
        text: currentProduct.id
          ? "Product updated successfully!"
          : "Product added successfully!",
      });

      onClose();
      setImagesToRemove([]);
    } catch (err) {
      console.error("Error saving product:", err);
      setMessage({
        open: true,
        title: "Error",
        text: "Failed to save product. Please try again.",
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={currentProduct?.id ? "Edit Product" : "Add Product"}
      size="lg"
    >
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2"
      >
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            name="name"
            value={currentProduct.name ?? ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded-md py-2 px-3"
          />
        </div>

        {/* Legacy ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Legacy ID
          </label>
          <input
            type="number"
            name="legacyId"
            min={1}
            required
            value={currentProduct.legacyId ?? ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded-md py-2 px-3"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={currentProduct.category ?? ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded-md py-2 px-3"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            min="0"
            step="0.01"
            value={currentProduct.price ?? ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded-md py-2 px-3"
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Stock</label>
          <input
            type="number"
            name="stock"
            min="0"
            value={currentProduct.stock ?? ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded-md py-2 px-3"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={currentProduct.status ?? "Active"}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded-md py-2 px-3"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>

        {/* Description */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            rows={3}
            value={currentProduct.description ?? ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border rounded-md py-2 px-3"
          />
        </div>

        {/* Images */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Product Images
          </label>

          <div className="mt-2 flex flex-wrap gap-2">
            {currentProduct.images?.map((img, idx) => (
              <div key={idx} className="relative">
                <img
                  src={getImageUrl(img)}
                  alt={`Product ${idx}`}
                  className={`w-20 h-20 object-cover rounded border ${
                    imagesToRemove.includes(img)
                      ? "opacity-50 border-red-500"
                      : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => toggleRemoveImage(img)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  {imagesToRemove.includes(img) ? "↩" : "×"}
                </button>
              </div>
            ))}
          </div>

          {/* Upload */}
          <div className="mt-3 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer text-blue-600 hover:text-blue-500"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
          <Button variant="primary" type="submit">
            {currentProduct.id ? "Update" : "Save"}
          </Button>
          <Button variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductFormModal;
