import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

interface SizeGuide {
  id: string;
  name: string;
  category: string;
  type: 'Frames' | 'Lenses' | 'Sunglasses';
  measurements: {
    [key: string]: string;
  };
  image?: string;
  createdAt: string;
  updatedAt: string;
}

const SizeGuides: React.FC = () => {
  const [sizeGuides, setSizeGuides] = useState<SizeGuide[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSizeGuide, setCurrentSizeGuide] = useState<SizeGuide | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sizeGuideToDelete, setSizeGuideToDelete] = useState<SizeGuide | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [sizeGuideToView, setSizeGuideToView] = useState<SizeGuide | null>(null);
  const [measurements, setMeasurements] = useState<{ key: string; value: string }[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSizeGuides();
  }, []);

  const fetchSizeGuides = async () => {
    try {
      const res = await fetch('/api/sizeguides');
      const data = await res.json();

      console.log('API response:', data);

      // Chuyển _id thành id, đảm bảo measurements luôn là object
      let guidesArray: any[] = [];
      if (Array.isArray(data)) {
        guidesArray = data;
      } else if (data.sizeGuides && Array.isArray(data.sizeGuides)) {
        guidesArray = data.sizeGuides;
      }

      const mappedData: SizeGuide[] = guidesArray.map((guide: any) => ({
        ...guide,
        id: guide._id,
        measurements: guide.measurements || {}, // tránh undefined
      }));

      setSizeGuides(mappedData);
    } catch (error) {
      console.error('Error fetching size guides:', error);
    }
  };

  const handleAddSizeGuide = () => {
    setCurrentSizeGuide(null);
    setMeasurements([
      { key: 'Frame Width', value: '' },
      { key: 'Lens Width', value: '' },
      { key: 'Bridge Width', value: '' },
      { key: 'Temple Length', value: '' },
    ]);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleEditSizeGuide = (sizeGuide: SizeGuide) => {
    setCurrentSizeGuide(sizeGuide);
    const measurementArray = Object.entries(sizeGuide.measurements || {}).map(([key, value]) => ({
      key,
      value,
    }));
    setMeasurements(measurementArray);
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleViewSizeGuide = (sizeGuide: SizeGuide) => {
    setSizeGuideToView(sizeGuide);
    setIsViewModalOpen(true);
  };

  const handleDeleteSizeGuide = (sizeGuide: SizeGuide) => {
    setSizeGuideToDelete(sizeGuide);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!sizeGuideToDelete) return;
    try {
      await fetch(`/api/sizeguides/${sizeGuideToDelete.id}`, { method: 'DELETE' });
      fetchSizeGuides();
    } catch (error) {
      console.error('Error deleting size guide:', error);
    }
    setIsDeleteModalOpen(false);
    setSizeGuideToDelete(null);
  };

  const handleSaveSizeGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = (document.getElementById('size-guide-name') as HTMLInputElement).value;
    const category = (document.getElementById('size-guide-category') as HTMLSelectElement).value;
    const type = (document.getElementById('size-guide-type') as HTMLSelectElement).value as
      | 'Frames'
      | 'Lenses'
      | 'Sunglasses';

    const measurementsObj = measurements.reduce((acc, { key, value }) => {
      if (key.trim() !== '' && value.trim() !== '') {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {} as { [key: string]: string });

    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('type', type);
    formData.append('measurements', JSON.stringify(measurementsObj));
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      let response;
      if (currentSizeGuide) {
        response = await fetch(`/api/sizeguides/${currentSizeGuide.id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch('/api/sizeguides', {
          method: 'POST',
          body: formData,
        });
      }

      if (response.ok) {
        fetchSizeGuides();
        setIsModalOpen(false);
      } else {
        console.error('Error saving size guide');
      }
    } catch (error) {
      console.error('Error saving size guide:', error);
    }
  };

  const handleAddMeasurement = () => setMeasurements([...measurements, { key: '', value: '' }]);
  const handleRemoveMeasurement = (index: number) => setMeasurements(measurements.filter((_, i) => i !== index));
  const handleMeasurementChange = (index: number, field: 'key' | 'value', value: string) => {
    const newMeasurements = [...measurements];
    newMeasurements[index][field] = value;
    setMeasurements(newMeasurements);
  };

const columns: Column<SizeGuide>[] = [
  {
    header: 'Image',
    accessor: (guide) => (
      <img
        src={guide.image || 'https://via.placeholder.com/40'}
        alt={guide.name}
        className="h-10 w-10 rounded-md object-cover"
      />
    ),
  },
  {
    header: 'Name',
    accessor: 'name', // keyof SizeGuide
    sortable: true,
  },
  {
    header: 'Category',
    accessor: 'category', // keyof SizeGuide
    sortable: true,
  },
  {
    header: 'Type',
    accessor: 'type', // keyof SizeGuide
    sortable: true,
  },
  {
    header: 'Measurements',
    accessor: (guide) => (
      <div>{Object.keys(guide.measurements || {}).length} measurements</div>
    ),
  },
  {
    header: 'Last Updated',
    accessor: (guide) => new Date(guide.updatedAt).toLocaleDateString(),
    // Nếu muốn sortable theo updatedAt, có thể thêm: accessor: 'updatedAt' và cell để hiển thị
  },
  {
    header: 'Actions',
    accessor: (guide) => (
      <div className="flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => handleViewSizeGuide(guide)}>
          <Eye size={16} />
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleEditSizeGuide(guide)}>
          <Edit size={16} />
        </Button>
        <Button variant="danger" size="sm" onClick={() => handleDeleteSizeGuide(guide)}>
          <Trash size={16} />
        </Button>
      </div>
    ),
  },
];



  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Size Guides</h1>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleAddSizeGuide}>
          Add Size Guide
        </Button>
      </div>
      <DataTable columns={columns} data={sizeGuides} keyField="id" />
      {/* Size Guide Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentSizeGuide ? 'Edit Size Guide' : 'Add Size Guide'}
        size="lg"
        footer={
          <div className="flex justify-end space-x-2">
            <button
              type="submit"
              form="size-guide-form"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {currentSizeGuide ? 'Update' : 'Save'}
            </button>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        }
      >
        <form id="size-guide-form" onSubmit={handleSaveSizeGuide} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Guide Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={currentSizeGuide?.name || ''}
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <select
                id="category"
                name="category"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue={currentSizeGuide?.category || ''}
                required
              >
                <option value="">Select Category</option>
                <option value="Eyeglasses">Eyeglasses</option>
                <option value="Sunglasses">Sunglasses</option>
                <option value="Contact Lenses">Contact Lenses</option>
                <option value="Kids Eyewear">Kids Eyewear</option>
                <option value="Sports Eyewear">Sports Eyewear</option>
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <select
                id="type"
                name="type"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue={currentSizeGuide?.type || 'Frames'}
                required
              >
                <option value="Frames">Frames</option>
                <option value="Lenses">Lenses</option>
                <option value="Sunglasses">Sunglasses</option>
              </select>
            </div>
            {/* Measurements */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Measurements</label>
              {measurements.map((measurement, index) => (
                <div key={index} className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    placeholder="Measurement Name"
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={measurement.key}
                    onChange={e => handleMeasurementChange(index, 'key', e.target.value)}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Value"
                    className="flex-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={measurement.value}
                    onChange={e => handleMeasurementChange(index, 'value', e.target.value)}
                    required
                  />
                  <Button variant="danger" size="sm" onClick={() => handleRemoveMeasurement(index)}>
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddMeasurement} className="mt-2">
                <Plus size={16} className="mr-2" />
                Add Measurement
              </Button>
            </div>
            {/* Image Upload */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Size Guide Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={e => setImageFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Size Guide Details"
        size="lg"
        footer={<Button variant="outline" onClick={() => setIsViewModalOpen(false)}>Close</Button>}
      >
        {sizeGuideToView && (
          <div className="space-y-6">
            <img
              src={sizeGuideToView.image || 'https://via.placeholder.com/300'}
              alt={sizeGuideToView.name}
              className="h-48 w-auto rounded-md object-cover mx-auto"
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Guide Name</h3>
                <p className="mt-1 text-sm text-gray-900">{sizeGuideToView.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1 text-sm text-gray-900">{sizeGuideToView.category}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                <p className="mt-1 text-sm text-gray-900">{sizeGuideToView.type}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Last Updated</h3>
                <p className="mt-1 text-sm text-gray-900">{new Date(sizeGuideToView.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Measurements</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Measurement</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(sizeGuideToView.measurements).map(([key, value], index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Size Guide"
        size="sm"
        footer={
          <>
            <Button variant="danger" onClick={confirmDelete}>Delete</Button>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} className="mr-2">Cancel</Button>
          </>
        }
      >
        <p className="text-sm text-gray-500">
          Are you sure you want to delete the size guide "{sizeGuideToDelete?.name}"? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default SizeGuides;
