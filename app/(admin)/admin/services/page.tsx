// Complete: app/(admin)/admin/services/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useToast } from '../../../contexts/ToastContext';
import { useAuth } from "@/app/contexts/AuthContext";
import { log } from 'console';

interface Service {
  _id: string;
  providerId: {
    _id: string;
    name: string;
    email: string;
  } | null;
  categoryId: {
    _id: string;
    name: string;
  } | null;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  currency: string;
  priceUnit: string;
  minHours?: number;
  includes: string[];
  exclusions: string[];
  media: string[];
  isActive: boolean;
  isVisible: boolean;
  featured?: boolean;
  approvalStatus?: string;
  ratingSummary: {
    avg: number;
    count: number;
  };
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const {logout} = useAuth();
  const [filters, setFilters] = useState({
    isActive: '',
    search: '',
    page: 1,
    limit: 10
  });

  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceForm, setPriceForm] = useState({
    basePrice: 0,
    priceUnit: ''
  });

  const { showToast } = useToast();

  useEffect(() => {
    fetchServices();
  }, [filters]);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.isActive) params.append('isActive', filters.isActive);
      if (filters.search) params.append('search', filters.search);
      params.append('page', filters.page.toString());
      params.append('limit', filters.limit.toString());

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/service/admin/all?${params}`, {
        credentials: 'include',
      });
      
      if (res.ok) {
        const data = await res.json();
        setServices(data.data || []);
        setPagination(data.pagination || {});
      }
    } catch (error) {
      logout();
      console.error('Failed to fetch services:', error);

    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const toggleVisibility = async (serviceId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/service/admin/${serviceId}/toggle-visibility`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Visibility updated successfully', 'success');
        fetchServices();
      } else {
        showToast('Failed to update visibility', 'error');
      }
    } catch (error) {
      showToast('Network error occurred', 'error');
    }
  };

  const approveService = async (serviceId: string, status: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/service/admin/${serviceId}/approve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ approvalStatus: status }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Service approved successfully', 'success');
        fetchServices();
      } else {
        showToast('Failed to approve service', 'error');
      }
    } catch (error) {
      showToast('Network error occurred', 'error');
    }
  };

  const toggleFeature = async (serviceId: string, featured: boolean) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/service/admin/${serviceId}/feature`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ featured }),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || `Service ${featured ? 'featured' : 'unfeatured'} successfully`, 'success');
        fetchServices();
      } else {
        showToast('Failed to update feature status', 'error');
      }
    } catch (error) {
      showToast('Network error occurred', 'error');
    }
  };

  const updatePricing = async (serviceId: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/service/admin/${serviceId}/pricing`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(priceForm),
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Pricing updated successfully', 'success');
        setEditingPrice(null);
        fetchServices();
      } else {
        showToast('Failed to update pricing', 'error');
      }
    } catch (error) {
      showToast('Network error occurred', 'error');
    }
  };

  const startEditPrice = (service: Service) => {
    setEditingPrice(service._id);
    setPriceForm({
      basePrice: service.basePrice,
      priceUnit: service.priceUnit
    });
  };

  const deleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/service/admin/${serviceId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        showToast(data.message || 'Service deleted successfully', 'success');
        fetchServices();
      } else {
        showToast('Failed to delete service', 'error');
      }
    } catch (error) {
      showToast('Network error occurred', 'error');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <div className="text-sm text-gray-600">
          Total: {pagination.total} services
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.isActive}
            onChange={(e) => handleFilterChange('isActive', e.target.value)}
          >
            <option value="">All Services</option>
            <option value="true">Active Only</option>
            <option value="false">Inactive Only</option>
          </select>
          
          <input
            type="text"
            placeholder="Search services..."
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
          
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={filters.limit}
            onChange={(e) => handleFilterChange('limit', e.target.value)}
          >
            <option value="5">5 per page</option>
            <option value="10">10 per page</option>
            <option value="20">20 per page</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium">Services ({services.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Provider</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service._id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {service.media[0] && (
                        <img 
                          src={service.media[0]} 
                          alt={service.title}
                          className="w-12 h-12 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{service.title}</div>
                        <div className="text-sm text-gray-500">{service.slug}</div>
                        {service.featured && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Featured</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {service.providerId ? (
                      <div>
                        <div className="font-medium text-gray-900">{service.providerId.name}</div>
                        <div className="text-gray-500">{service.providerId.email}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400">No Provider</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {editingPrice === service._id ? (
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={priceForm.basePrice}
                          onChange={(e) => setPriceForm({...priceForm, basePrice: Number(e.target.value)})}
                          className="w-20 px-2 py-1 border rounded"
                        />
                        <select
                          value={priceForm.priceUnit}
                          onChange={(e) => setPriceForm({...priceForm, priceUnit: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-xs"
                        >
                          <option value="per_hour">Per Hour</option>
                          <option value="per_service">Per Service</option>
                        </select>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => updatePricing(service._id)}
                            className="text-xs bg-green-600 text-white px-2 py-1 rounded"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingPrice(null)}
                            className="text-xs bg-gray-600 text-white px-2 py-1 rounded"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <span className="font-medium">{service.currency} {service.basePrice}</span>
                        <div className="text-gray-500">{service.priceUnit}</div>
                        <button
                          onClick={() => startEditPrice(service)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Edit Price
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="ml-1">{service.ratingSummary.avg.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({service.ratingSummary.count})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.isVisible ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {service.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => toggleVisibility(service._id)}
                        className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                      >
                        {service.isVisible ? 'Hide' : 'Show'}
                      </button>
                      
                      <button
                        onClick={() => approveService(service._id, 'approved')}
                        className="text-xs px-2 py-1 rounded bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        Approve
                      </button>
                      
                      <button
                        onClick={() => toggleFeature(service._id, !service.featured)}
                        className={`text-xs px-2 py-1 rounded ${
                          service.featured 
                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {service.featured ? 'Unfeature' : 'Feature'}
                      </button>
                      
                      <button
                        onClick={() => deleteService(service._id)}
                        className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {pagination.totalPages > 1 && (
        <div className="flex justify-between items-center mt-6">
          <div className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
