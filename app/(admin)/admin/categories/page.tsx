// Update: app/(admin)/admin/categories/page.tsx
"use client";
import { useState, useEffect } from 'react';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setFormData({ name: '', slug: '', description: '' });
        setShowForm(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const updateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          description: formData.description
        }),
      });

      if (res.ok) {
        setFormData({ name: '', slug: '', description: '' });
        setEditingCategory(null);
        setShowForm(false);
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const toggleCategory = async (categoryId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/categories/${categoryId}/toggle`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (res.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Failed to toggle category:', error);
    }
  };

  const startEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description
    });
    setShowForm(true);
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '' });
    setShowForm(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Categories Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Create New Category'}
          </h3>
          <form onSubmit={editingCategory ? updateCategory : createCategory} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Category Name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            {!editingCategory && (
              <div>
                <input
                  type="text"
                  placeholder="Slug"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            )}
            <div>
              <textarea
                placeholder="Description"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                {editingCategory ? 'Update Category' : 'Create Category'}
              </button>
              {editingCategory && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">All Categories ({categories.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {category.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(category.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <button
                      onClick={() => startEdit(category)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => toggleCategory(category._id)}
                      className={`${
                        category.active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                      }`}
                    >
                      {category.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
