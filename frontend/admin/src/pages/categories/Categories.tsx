import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import DataTable from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

interface Category {
  id: string;
  legacyId: string;
  name: string;
  // slug: string;
  description: string;
  products: number;
  status: 'Active' | 'Inactive';
  createdAt: string;
}
interface ApiCategory {
  _id: string;
  legacyId?: string | number;
  name: string;
  // slug: string;
  description: string;
  products?: number;
  status?: 'Active' | 'Inactive';
  createdAt: string;
}
const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<Partial<Category> | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [categoryToView, setCategoryToView] = useState<Category | null>(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState('');
  const [messageModalTitle, setMessageModalTitle] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/categories', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        // Assume data is array of { _id, ... }, map id: _id
        let mappedData: Category[] = [];
        const mapFunc = (cat: ApiCategory): Category => ({
          id: cat._id,
          legacyId: cat.legacyId ? String(cat.legacyId) : 'N/A',
          name: cat.name,
          // slug: cat.slug,
          description: cat.description,
          products: cat.products || 0,
          status: cat.status || 'Inactive',
          createdAt: cat.createdAt,
        });
        if (Array.isArray(data)) {
          mappedData = data.map(mapFunc);
        } else if (data.category && Array.isArray(data.category.categories)) {
          mappedData = data.category.categories.map(mapFunc);
        }

        setCategories(mappedData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setCurrentCategory({});
    setIsModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCurrentCategory(category);
    setIsModalOpen(true);
  };

  const handleViewCategory = (category: Category) => {
    setCategoryToView(category);
    setIsViewModalOpen(true);
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (categoryToDelete) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/categories/${categoryToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to delete category');
        }
        setCategories(categories.filter(c => c.id !== categoryToDelete.id));
        setIsDeleteModalOpen(false);
        setCategoryToDelete(null);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentCategory) return;

    if (!currentCategory.name) {
      setMessageModalTitle('Error');
      setMessageModalContent('Category name is required.');
      setMessageModalOpen(true);
      return;
    }
    try {
      const token = localStorage.getItem('token');

      const categoryData = {
        name: currentCategory.name || '',
        // slug: currentCategory.slug || '',
        description: currentCategory.description || '',
        status: currentCategory.status || 'Active',
      };
      console.log("Category being saved:", categoryData);
      const response = await fetch(
        currentCategory.id
          ? `http://localhost:5000/api/categories/${currentCategory.id}` // PUT
          : 'http://localhost:5000/api/categories', // POST
        {
          method: currentCategory.id ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(categoryData),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to save category, response:', response.status, errorText);
        throw new Error('Failed to save category');
      }

      const savedCategory = await response.json();
      const mappedSaved = { ...savedCategory, id: savedCategory._id };

      if (currentCategory.id) {
        // Update category cũ
        setCategories(categories.map(c => c.id === mappedSaved.id ? mappedSaved : c));
        setMessageModalTitle('Success');
        setMessageModalContent('Category updated successfully.');
      } else {
        // Thêm category mới
        setCategories([...categories, mappedSaved]);
        setMessageModalTitle('Success');
        setMessageModalContent('Category created successfully.');
      }

      setMessageModalOpen(true);
      setIsModalOpen(false);
      setCurrentCategory(null);
    } catch (error) {
      console.error('Error saving category:', error);
      setMessageModalTitle('Error');
      setMessageModalContent('An error occurred while saving the category.');
      setMessageModalOpen(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (currentCategory) {
      setCurrentCategory({
        ...currentCategory,
        [e.target.name]: e.target.value,
      });
    }
  };

  const columns = [
    // { header: 'ID', accessor: 'legacyId' as keyof Category, sortable: true },
    // {
    //   header: 'Image',
    //   accessor: (category: Category) => (
    //       <div className="flex items-center">
    //         <img
    //           src={category.image || 'https://via.placeholder.com/40'}
    //           alt={category.name}
    //           className="h-10 w-10 rounded-md object-cover"
    //         />
    //       </div>
    //   ),
    //   sortable: false,
    // },
    {
      header: 'Name',
      accessor: 'name' as keyof Category,
      sortable: true,
    },
    // {
    //   header: 'Slug',
    //   accessor: 'slug' as keyof Category,
    //   sortable: true,
    // },
    {
      header: 'Products',
      accessor: 'products' as keyof Category,
      sortable: true,
      cell: (category: Category) => category.products,
    },
    {
      header: 'Status',
      accessor: 'status' as keyof Category,
      sortable: true,
      cell: (category: Category) => {
        const statusClass = category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClass}`}>
            {category.status}
          </span>
        );
      },
    },
    {
      header: 'Created At',
      accessor: 'createdAt' as keyof Category,
      sortable: true,
      cell: (category: Category) => new Date(category.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: (category: Category) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" leftIcon={<Eye size={16} />} onClick={() => handleViewCategory(category)}>
            View
          </Button>
          <Button variant="outline" size="sm" leftIcon={<Edit size={16} />} onClick={() => handleEditCategory(category)}>
            Edit
          </Button>
          <Button variant="danger" size="sm" leftIcon={<Trash size={16} />} onClick={() => handleDeleteCategory(category)}>
            Delete
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleAddCategory}>
          Add Category
        </Button>
      </div>
      <DataTable columns={columns} data={categories} keyField="id" />
      {/* Category Form Modal */}
      <Modal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false);
    setCurrentCategory(null);
  }}
  title={currentCategory?.id ? 'Edit Category' : 'Add Category'}
  size="lg"
>
  <form onSubmit={handleSaveCategory} className="space-y-6">
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <input
          type="text"
          name="name"
          value={currentCategory?.name || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          value={currentCategory?.status || 'Active'}
          onChange={handleInputChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          rows={3}
          value={currentCategory?.description || ''}
          onChange={handleInputChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    </div>

    <div className="mt-4 flex justify-end space-x-2">
      <Button type="submit" variant="primary">
        {currentCategory?.id ? 'Update' : 'Save'}
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={() => {
          setIsModalOpen(false);
          setCurrentCategory(null);
        }}
      >
        Cancel
      </Button>
    </div>
  </form>
</Modal>

      {/* Category View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Category Details"
        size="lg"
        footer={
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        }
      >
        {categoryToView && (
          <div className="space-y-6">
            {/* <div className="flex justify-center mb-4">
              <img
                src={categoryToView.image || 'https://via.placeholder.com/300'}
                alt={categoryToView.name}
                className="h-48 w-auto rounded-md object-cover"
              />
            </div> */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category Name</h3>
                <p className="mt-1 text-sm text-gray-900">{categoryToView.name}</p>
              </div>
              {/* <div>
                <h3 className="text-sm font-medium text-gray-500">Slug</h3>
                <p className="mt-1 text-sm text-gray-900">{categoryToView.slug}</p>
              </div> */}
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span
                  className={`mt-1 inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${
                    categoryToView.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {categoryToView.status}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Products Count</h3>
                <p className="mt-1 text-sm text-gray-900">{categoryToView.products}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(categoryToView.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="sm:col-span-2">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{categoryToView.description}</p>
              </div>
            </div>
          </div>
        )}
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
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        size="sm"
        footer={
          <>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="mr-2">
              Cancel
            </Button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the category "{categoryToDelete?.name}"? This will also remove all associations with products.
        </p>
      </Modal>
    </div>
  );
};

export default Categories;