import React, { useState } from "react";
import { Plus } from "lucide-react";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";
import { useProducts } from "./hooks/useProducts";
import { Product } from "./types";
import ProductTable from "./ProductTable";
import ProductFormModal from "./ProductFormModal";
import DeleteProductModal from "./DeleteProductModal";
import MessageModal from "./MessageModal";

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { products, setProducts, categories } = useProducts();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [message, setMessage] = useState({ open: false, title: "", text: "" });

  const handleAdd = () => { setCurrentProduct({}); setIsFormOpen(true); };
  const handleEdit = (p: Product) => { setCurrentProduct(p); setIsFormOpen(true); };
  const handleView = (p: Product) => navigate(`/products/${p.id}`);

  const handleDelete = (p: Product) => { setProductToDelete(p); setDeleteModal(true); };
  const confirmDelete = async () => { /* gọi API DELETE ở đây */ };

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleAdd}>
          Add Product
        </Button>
      </div>

      <ProductTable products={products} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
      <ProductFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        product={currentProduct}
        categories={categories}
        setProducts={setProducts}
        setMessage={setMessage}
      />
      <DeleteProductModal
        isOpen={deleteModal}
        product={productToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal(false)}
      />
      <MessageModal
        isOpen={message.open}
        title={message.title}
        message={message.text}
        onClose={() => setMessage({ ...message, open: false })}
      />
    </div>
  );
};

export default Products;
