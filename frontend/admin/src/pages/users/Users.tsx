import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, Eye, Lock, Mail, Shield } from 'lucide-react';
import DataTable, { Column } from '../../components/ui/DataTable';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive" | "suspended";
  lastLogin: string;
  createdAt: string;
  avatar?: string;
}

const BACKEND_URL = "http://localhost:5000";

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [userToView, setUserToView] = useState<User | null>(null);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<User | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/user`);
      const data = await response.json();
      if (!Array.isArray(data)) return;

      const mappedUsers = data.map((user: any) => ({
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role as "admin" | "user",
        status: user.status || 'active',
        lastLogin: user.lastLogin ? new Date(user.lastLogin).toISOString() : '-',
        createdAt: user.createdAt,
        avatar: user.avatar ? `${BACKEND_URL}${user.avatar}` : undefined,
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameInput = (document.getElementById('user-name') as HTMLInputElement).value;
    const [firstName, lastName] = nameInput.split(' ');
    const email = (document.getElementById('user-email') as HTMLInputElement).value;
    const role = (document.getElementById('user-role') as HTMLSelectElement).value.toLowerCase();
    const status = (document.getElementById('user-status') as HTMLSelectElement).value;

    const formData = new FormData();
    formData.append('firstName', firstName || '');
    formData.append('lastName', lastName || '');
    formData.append('email', email);
    formData.append('role', role);
    formData.append('status', status);
    if (avatarFile) formData.append('avatar', avatarFile);

    if (!currentUser) {
      const password = (document.getElementById('user-password') as HTMLInputElement).value;
      formData.append('password', password);
    }

    try {
      let response;
      if (currentUser) {
        response = await fetch(`${BACKEND_URL}/api/users/user/${currentUser.id}`, {
          method: 'PUT',
          body: formData,
        });
      } else {
        response = await fetch(`${BACKEND_URL}/api/users/user`, {
          method: 'POST',
          body: formData,
        });
      }

      if (response.ok) {
        fetchUsers();
        setIsModalOpen(false);
        setCurrentUser(null);
        setAvatarFile(null);
      } else {
        const errorData = await response.json();
        console.error('Error saving user:', errorData.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error saving user:', err);
    }
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/user/${userToDelete.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchUsers();
        setIsDeleteModalOpen(false);
        setUserToDelete(null);
      } else {
        const errorData = await response.json();
        console.error('Error deleting user:', errorData.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleConfirmResetPassword = async () => {
    if (!userToResetPassword) return;
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/user/${userToResetPassword.id}/reset-password`, {
        method: 'POST',
      });
      if (response.ok) {
        alert('Password reset successfully.');
        setIsResetPasswordModalOpen(false);
        setUserToResetPassword(null);
      } else {
        const errorData = await response.json();
        console.error('Error resetting password:', errorData.message || 'Unknown error');
      }
    } catch (err) {
      console.error('Error resetting password:', err);
    }
  };

  const handleAddUser = () => {
    setCurrentUser(null);
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setCurrentUser(user);
    setAvatarFile(null);
    setIsModalOpen(true);
  };

  const handleViewUser = (user: User) => {
    setUserToView(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const handleResetPassword = (user: User) => {
    setUserToResetPassword(user);
    setIsResetPasswordModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (currentUser) {
      setCurrentUser({
        ...currentUser,
        [e.target.id.replace('user-', '')]: e.target.value
      });
    }
  };

  const getRoleIcon = (role: string) => (
    <Shield size={16} className={role === 'admin' ? 'text-red-500' : 'text-gray-500'} />
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const columns: Column<User>[] = [
    {
      header: 'User',
      accessor: (user: User) => (
        <div className="flex items-center">
          <img
            src={user.avatar || 'https://via.placeholder.com/40'}
            alt={user.name}
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Role',
      accessor: 'role',
      sortable: true,
      cell: (user: User) => (
        <div className="flex items-center">
          {getRoleIcon(user.role)}
          <span className="ml-1.5">{user.role}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (user: User) => (
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
          {user.status}
        </span>
      ),
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin',
      sortable: true,
      cell: (user: User) => user.lastLogin === '-' ? '-' : new Date(user.lastLogin).toLocaleString(),
    },
    {
      header: 'Created At',
      accessor: 'createdAt',
      sortable: true,
      cell: (user: User) => new Date(user.createdAt).toLocaleDateString(),
    },
    {
      header: 'Actions',
      accessor: (user: User) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" leftIcon={<Eye size={16} />} onClick={() => handleViewUser(user)}>View</Button>
          <Button variant="outline" size="sm" leftIcon={<Edit size={16} />} onClick={() => handleEditUser(user)}>Edit</Button>
          <Button variant="outline" size="sm" leftIcon={<Lock size={16} />} onClick={() => handleResetPassword(user)}>Reset</Button>
          <Button variant="danger" size="sm" leftIcon={<Trash size={16} />} onClick={() => handleDeleteUser(user)} disabled={user.role === 'admin'}>Delete</Button>
        </div>
      ),
    },
  ];


  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <Button variant="primary" leftIcon={<Plus size={16} />} onClick={handleAddUser}>
          Add User
        </Button>
      </div>
      <DataTable columns={columns} data={users} keyField="id" />

      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={currentUser ? 'Edit User' : 'Add User'}
        size="lg"
        footer={null} // footer bỏ đi, dùng button trong form
      >
        <form onSubmit={handleSaveUser} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="user-name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="user-name"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={currentUser?.name || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="user-email"
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                defaultValue={currentUser?.email || ''}
                onChange={handleInputChange}
                required
              />
            </div>
            {!currentUser && (
              <div>
                <label htmlFor="user-password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type="password"
                  id="user-password"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>
            )}
            <div>
              <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="user-role"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue={currentUser?.role || 'user'}
                onChange={handleInputChange}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <div>
              <label htmlFor="user-status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="user-status"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                defaultValue={currentUser?.status || 'active'}
                onChange={handleInputChange}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Profile Image</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={e => setAvatarFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end space-x-2">
            <Button type="submit" variant="primary">
              {currentUser ? 'Update' : 'Save'}
            </Button>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* User View Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="User Details"
        size="lg"
        footer={
          <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
            Close
          </Button>
        }
      >
        {userToView && (
          <div className="space-y-6">
            <div className="flex flex-col items-center mb-6">
              <img
                src={userToView.avatar || 'https://via.placeholder.com/100'}
                alt={userToView.name}
                className="h-24 w-24 rounded-full object-cover mb-4"
              />
              <h2 className="text-xl font-medium text-gray-900">{userToView.name}</h2>
              <div className="flex items-center mt-1">
                <Mail size={16} className="text-gray-500 mr-1" />
                <span className="text-sm text-gray-500">{userToView.email}</span>
              </div>
              <div className="flex items-center mt-2">
                {getRoleIcon(userToView.role)}
                <span
                  className={`ml-1.5 px-2 text-xs leading-5 font-semibold rounded-full ${
                    userToView.role === 'admin'
                      ? 'bg-red-100 text-red-800'
                      : userToView.role === 'user'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {userToView.role}
                </span>
              </div>
            </div>
            <div className="border-t border-b border-gray-200 py-4">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <span className={`mt-1 inline-flex px-2 text-xs leading-5 font-semibold rounded-full ${getStatusColor(userToView.status)}`}>
                    {userToView.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Last Login</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {userToView.lastLogin === '-' ? 'Never' : new Date(userToView.lastLogin).toLocaleString()}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1 text-sm text-gray-900">{new Date(userToView.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-900">Recent Activity</h3>
              <div className="bg-gray-50 rounded-md p-4">
                <p className="text-sm text-gray-500 italic">No recent activity to display.</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
      {/* Reset Password Modal */}
      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={() => setIsResetPasswordModalOpen(false)}
        title="Reset Password"
        size="md"
        footer={
          <>
            <Button variant="primary" onClick={handleConfirmResetPassword}>
              Reset Password
            </Button>
            <Button variant="outline" onClick={() => setIsResetPasswordModalOpen(false)} className="mr-2">
              Cancel
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-500">
            Are you sure you want to reset the password for {userToResetPassword?.name}? A new password will be generated and sent to their email address.
          </p>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  This action cannot be undone. The user will need to use the new password to log in.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete User"
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
          Are you sure you want to delete the user "{userToDelete?.name}"? This action cannot be undone and will permanently remove the user and all associated data.
        </p>
      </Modal>
    </div>
  );
};

export default Users;