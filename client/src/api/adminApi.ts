import { fetcher } from '@/api/apiClient';

export const adminApi = {
  // Items
  deleteItem: (id: string) => fetcher(`/api/v1/admin/items/${id}`, { method: 'DELETE' }),
  createItem: (data: any) => fetcher(`/api/v1/admin/items`, { method: 'POST', body: JSON.stringify(data) }),
  updateItem: (id: string, data: any) => fetcher(`/api/v1/admin/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Specials
  deleteSpecial: (id: string) => fetcher(`/api/v1/admin/specials/${id}`, { method: 'DELETE' }),
  createSpecial: (data: any) => fetcher(`/api/v1/admin/specials`, { method: 'POST', body: JSON.stringify(data) }),
  updateSpecial: (id: string, data: any) => fetcher(`/api/v1/admin/specials/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Chefs
  deleteChef: (id: string) => fetcher(`/api/v1/admin/chefs/${id}`, { method: 'DELETE' }),
  createChef: (data: any) => fetcher(`/api/v1/admin/chefs`, { method: 'POST', body: JSON.stringify(data) }),
  updateChef: (id: string, data: any) => fetcher(`/api/v1/admin/chefs/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Categories
  createCategory: (data: any) => fetcher(`/api/v1/admin/categories`, { method: 'POST', body: JSON.stringify(data) }),
  updateCategory: (id: string, data: any) => fetcher(`/api/v1/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteCategory: (id: string) => fetcher(`/api/v1/admin/categories/${id}`, { method: 'DELETE' }),

  // Upload
  uploadFile: (file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return fetcher(`/api/v1/admin/upload`, { method: 'POST', body: formData });
  },

  // Search
  search: (query: string) => fetcher(`/api/v1/admin/search?q=${encodeURIComponent(query)}`),
};
