import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import { getImageUrl } from "../../utils/getImageUrl";
interface Product {
  id: string;
  legacyId: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'Active' | 'Inactive' | 'Out of Stock';
  description?: string;
  images?: string[];
  newFiles?: File[];
}

interface ApiProduct {
  _id: string;
  legacyId?: string | number;
  name: string;
  category?: string;
  categoryName?: string;
  price?: number;
  stock?: number;
  status?: 'Active' | 'Inactive' | 'Out of Stock';
  description?: string;
  images?: string[];
}
interface Category {
  id: string;
  name: string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState('');
  const [messageModalTitle, setMessageModalTitle] = useState('');

  // 👉 thêm state lưu ảnh cần xóa
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        const data = await res.json();
        let mappedData: Product[] = [];

        const mapFunc = (prod: ApiProduct): Product => ({
          id: prod._id,
          legacyId: prod.legacyId?.toString() ?? '',
          name: prod.name,
          category: prod.categoryName ?? prod.category ?? '',
          price: prod.price ?? 0,
          stock: prod.stock ?? 0,
          status: prod.status ?? 'Active',
          description: prod.description,
          images: prod.images,
        });

        if (Array.isArray(data)) {
          mappedData = data.map(mapFunc);
        } else if (data.products && Array.isArray(data.products)) {
          mappedData = data.products.map(mapFunc);
        }

        setProducts(mappedData);
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/categories', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const mapped: Category[] = data.map((cat: any) => ({
          id: cat._id,
          name: cat.name,
        }));
        setCategories(mapped);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddProduct = () => {
    setCurrentProduct({});
    setImagesToRemove([]);
    setIsModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    setImagesToRemove([]);
    setIsModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const fileArray = Array.from(files);
    const newPreviews = fileArray.map(f => URL.createObjectURL(f));
    setCurrentProduct(prev => ({
      ...prev,
      images: prev?.images ? [...prev.images, ...newPreviews] : newPreviews,
      newFiles: prev?.newFiles ? [...prev.newFiles, ...fileArray] : fileArray,
    }));
  };

  const handleViewProduct = (product: Product) => {
    navigate(`/products/${product.id}`);
  };

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/products/${productToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;
    if (!currentProduct.legacyId) {
      setMessageModalTitle("Validation Error");
      setMessageModalContent("Legacy ID is required");
      setMessageModalOpen(true);
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const productData = {
        legacyId: currentProduct.legacyId,
        name: currentProduct.name ?? '',
        categoryName: currentProduct.category ?? '',
        price: currentProduct.price ?? 0,
        stock: currentProduct.stock ?? 0,
        status: currentProduct.status ?? "Active",
        description: currentProduct.description ?? '',
      };

      let response;
      // nếu có file mới hoặc cần remove ảnh
      if ((currentProduct.newFiles && currentProduct.newFiles.length > 0) || imagesToRemove.length > 0) {
        const multipartData = new FormData();
        if (currentProduct.newFiles) {
          currentProduct.newFiles.forEach((f) => {
            multipartData.append("images", f);
          });
        }
        Object.entries(productData).forEach(([key, value]) => {
          multipartData.append(key, value.toString());
        });
        if (imagesToRemove.length > 0) {
          multipartData.append("removeImages", JSON.stringify(imagesToRemove));
        }
        response = await fetch(
          currentProduct.id
            ? `http://localhost:5000/api/products/${currentProduct.id}`
            : "http://localhost:5000/api/products",
          {
            method: currentProduct.id ? "PUT" : "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: multipartData,
          }
        );
      } else {
        const body = { ...productData };
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
            body: JSON.stringify(body),
          }
        );
      }
      if (!response.ok) throw new Error("Failed to save product");
      const savedProduct = await response.json();
      const mappedSaved: Product = {
        ...savedProduct,
        id: savedProduct._id,
        legacyId: savedProduct.legacyId?.toString() ?? '',
      };
      if (currentProduct.id) {
        setProducts(products.map(p => (p.id === mappedSaved.id ? mappedSaved : p)));
        setMessageModalTitle("Update Success");
        setMessageModalContent("Product updated successfully!");
      } else {
        setProducts([...products, mappedSaved]);
        setMessageModalTitle("Add Success");
        setMessageModalContent("Product added successfully!");
      }
      setMessageModalOpen(true);
      setIsModalOpen(false);
      setCurrentProduct(null);
      setImagesToRemove([]);
    } catch (error) {
      console.error("Error saving product:", error);
      setMessageModalTitle("Error");
      setMessageModalContent("Failed to save product. Please try again.");
      setMessageModalOpen(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
    setCurrentProduct(prev => ({ ...prev, [e.target.name]: value }));
  };

  // toggle chọn ảnh để xóa
  const toggleRemoveImage = (img: string) => {
    setImagesToRemove(prev =>
      prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img]
    );
  };

  const columns = [
    { header: 'ID', accessor: 'legacyId' as keyof Product, sortable: true },
    { header: 'Product Name', accessor: 'name' as keyof Product, sortable: true },
    { header: 'Category', accessor: 'category' as keyof Product, sortable: true },
    { header: 'Price', accessor: 'price' as keyof Product, sortable: true,
      cell: (product: Product) => `$${product.price.toFixed(2)}` },
    { header: 'Stock', accessor: 'stock' as keyof Product, sortable: true },
    {
      header: 'Status', accessor: 'status' as keyof Product, sortable: true,
      cell: (product: Product) => {
        let statusClass = '';
        switch (product.status) {
          case 'Active': statusClass = 'bg-green-100 text-green-800'; break;
          case 'Inactive': statusClass = 'bg-gray-100 text-gray-800'; break;
          case 'Out of Stock': statusClass = 'bg-red-100 text-red-800'; break;
          default: statusClass = 'bg-yellow-100 text-yellow-800';
        }
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
            {product.status}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      accessor: (product: Product) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" leftIcon={<Eye size={16} />} onClick={() => handleViewProduct(product)}>View</Button>
          <Button variant="outline" size="sm" leftIcon={<Edit size={16} />} onClick={() => handleEditProduct(product)}>Edit</Button>
          <Button variant="danger" size="sm" leftIcon={<Trash size={16} />} onClick={() => handleDeleteProduct(product)}>Delete</Button>
        </div>
      ),
      sortable: false,
    },
  ];
  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleAddProduct}>Add Product</Button>
      </div>

      <DataTable columns={columns} data={products} keyField="id" />

      {/* Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setCurrentProduct(null);setImagesToRemove([]); }}
        title={currentProduct?.id ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        {/* Form */}
        <form
          onSubmit={handleSaveProduct}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2"
          id="product-form"
        >
          {/* Product Name */}
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <input
              type="text"
              id="product-name"
              name="name"
              value={currentProduct?.name ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Legacy ID */}
          <div>
            <label htmlFor="legacyId" className="block text-sm font-medium text-gray-700">Legacy ID</label>
            <input
              type="number"
              id="legacyId"
              name="legacyId"
              min={1}
              value={currentProduct?.legacyId ?? ''}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              name="category"
              value={currentProduct?.category ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={currentProduct?.price ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">Stock</label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              value={currentProduct?.stock ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={currentProduct?.status ?? 'Active'}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={currentProduct?.description ?? ''}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          {/* Images */}
           <div className="sm:col-span-2">
  <label className="block text-sm font-medium text-gray-700">Product Images</label>

  {/* Thumbnails */}
  <div className="mt-2 flex flex-wrap gap-2">
    {currentProduct?.images?.map((img: string, idx: number) => (
      <div key={idx} className="relative">
        <img
          src={getImageUrl(img)}
          alt={`Product ${idx}`}
          className={`w-20 h-20 object-cover rounded border ${
            imagesToRemove.includes(img) ? "opacity-50 border-red-500" : ""
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

  {/* Upload mới */}
  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
    <div className="space-y-1 text-center">
      <label
        htmlFor="file-upload"
        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
      >
        <span>Upload files</span>
        <input
          id="file-upload"
          name="file-upload"
          type="file"
          className="sr-only"
          multiple
          onChange={(e) => handleFileChange(e)}
        />
      </label>
      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
    </div>
  </div>
</div>

          <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
            <Button variant="primary" type="submit">{currentProduct?.id ? 'Update' : 'Save'}</Button>
            <Button variant="outline" type="button" onClick={() => { setIsModalOpen(false); setCurrentProduct(null); setImagesToRemove([]); }}>Cancel</Button>
          </div>
        </form>
      </Modal>
      {/* Message Modal */}
      <Modal
          isOpen={messageModalOpen}
          onClose={() => setMessageModalOpen(false)}
          title={messageModalTitle}
          size="sm"
          footer={
            <Button variant="primary" onClick={() => setMessageModalOpen(false)}>OK</Button>
          }
        >
          <p className="text-sm text-gray-500">{messageModalContent}</p>
      </Modal>
      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Product" size="sm" footer={
        <>
          <Button variant="danger" onClick={confirmDelete}>Delete</Button>
          <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="mr-2">Cancel</Button>
        </>
      }>
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the product "{productToDelete?.name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default Products;
