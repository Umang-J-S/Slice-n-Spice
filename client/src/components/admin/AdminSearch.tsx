import { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search, Loader2, Utensils, ChefHat, Tag, Star, AlertCircle, Pencil, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import CategoryForm from './CategoryForm';
import ItemForm from './ItemForm';
import SpecialForm from './SpecialForm';
import ChefForm from './ChefForm';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from '../../context/ToastContext';

interface CategoryResult {
  _id: string;
  name: string;
  displayOrder: number;
}

interface ItemResult {
  _id: string;
  title: string;
  description: string;
  price: number;
  photoUrl?: string;
  category?: {
    name: string;
  };
  dietaryAttributes?: {
    isVegetarian: boolean;
    isVegan: boolean;
    isNonVeg?: boolean;
  };
}

interface ChefResult {
  _id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl?: string;
  specialties: string[];
  experienceYears?: number;
}

interface SpecialResult {
  _id: string;
  item: {
    _id: string;
    title: string;
    description: string;
    price: number;
    photoUrl?: string;
  };
  date: string;
  expiresAt?: string;
  isActive?: boolean;
}

interface SearchResults {
  categories: CategoryResult[];
  items: ItemResult[];
  chefs: ChefResult[];
  specials: SpecialResult[];
}

export default function AdminSearch() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: searchData, isLoading, error: queryError } = useQuery({
    queryKey: ['admin', 'search', debouncedQuery],
    queryFn: () => adminApi.search(debouncedQuery),
    enabled: !!debouncedQuery.trim(),
    retry: false,
  });

  const results: SearchResults = searchData?.success ? searchData.data : {
    categories: [],
    items: [],
    chefs: [],
    specials: [],
  };

  const error = queryError ? (queryError as Error).message : null;

  const [editingItem, setEditingItem] = useState<{type: 'category' | 'item' | 'special' | 'chef', data: any} | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'categories' | 'items' | 'specials' | 'chefs', name?: string } | null>(null);

  const handleDeleteClick = (id: string, type: 'categories' | 'items' | 'specials' | 'chefs', name: string = 'this item') => {
    setItemToDelete({ id, type, name });
  };

  const deleteMutation = useMutation({
    mutationFn: ({ id, type }: { id: string; type: 'categories' | 'items' | 'specials' | 'chefs' }) => {
      if (type === 'categories') return adminApi.deleteCategory(id);
      if (type === 'items') return adminApi.deleteItem(id);
      if (type === 'specials') return adminApi.deleteSpecial(id);
      if (type === 'chefs') return adminApi.deleteChef(id);
      throw new Error('Invalid type');
    },
    onSuccess: (_, { type }) => {
      toast.success('Deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['admin', 'search'] });
      queryClient.invalidateQueries({ queryKey: ['menu', 'full'] });
      if (type === 'specials') queryClient.invalidateQueries({ queryKey: ['specials'] });
      if (type === 'chefs') queryClient.invalidateQueries({ queryKey: ['chefs'] });
      if (type === 'items') queryClient.invalidateQueries({ queryKey: ['top-rated'] });
      setItemToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to delete');
    }
  });

  const confirmDelete = () => {
    if (!itemToDelete) return;
    deleteMutation.mutate({ id: itemToDelete.id, type: itemToDelete.type });
  };

  const hasResults =
    results.categories.length > 0 ||
    results.items.length > 0 ||
    results.chefs.length > 0 ||
    results.specials.length > 0;

  return (
    <div className="relative w-full z-50">
      {/* Premium Search Input Box */}
      <div className="relative w-full group z-50">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-amber-600/20 rounded-xl blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
        <div className="relative flex items-center bg-black/60 backdrop-blur-md border border-white/10 shadow-lg rounded-xl overflow-hidden transition-all duration-300 focus-within:shadow-amber-400/10 focus-within:border-amber-400/50">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/50 group-focus-within:text-amber-400 transition-colors duration-300" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories, items, chefs..."
            className="pl-12 pr-12 h-12 w-full text-base bg-transparent border-none shadow-none focus-visible:ring-0 placeholder:text-white/40 text-white"
          />
          {isLoading && (
            <Loader2 className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-amber-400" />
          )}
          {query && !isLoading && (
            <button 
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Results Area */}
      {(query.trim() || isLoading) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-neutral-950/95 backdrop-blur-xl border border-white/10 shadow-2xl rounded-2xl overflow-hidden z-50 max-h-[75vh] overflow-y-auto">
          <div className="p-4 space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 text-red-400 border border-red-500/20 rounded-xl bg-red-500/10">
                <AlertCircle className="h-5 w-5" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}



      {/* When query is entered but nothing is found */}
      {query.trim() && !isLoading && !hasResults && !error && (
        <div className="text-center py-12 border border-dashed border-white/20 rounded-xl bg-white/5 text-white/50 shadow-inner">
          <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-50 text-amber-400" />
          <p className="text-sm">No results match your search query "{query}".</p>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-white/10 bg-white/5 rounded-xl p-4">
              <div className="space-y-3">
                <div className="h-4 bg-white/10 rounded w-1/3"></div>
                <div className="h-3 bg-white/10 rounded w-2/3"></div>
              </div>
              <div className="mt-4 h-16 bg-white/5 rounded-lg"></div>
            </div>
          ))}
        </div>
      )}

      {/* Search Results Display */}
      {!isLoading && hasResults && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* 1. Category Section */}
          {results.categories.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Tag className="h-5 w-5 text-amber-400" />
                <h4 className="text-lg font-semibold tracking-tight text-white">Categories ({results.categories.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {results.categories.map((cat) => (
                  <Card key={cat._id} className="bg-white/5 border-white/10 text-white hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 transition-all duration-300 rounded-xl relative group">
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base font-bold text-amber-400">{cat.name}</CardTitle>
                        <CardDescription className="text-xs mt-1 text-white/50">ID: {cat._id}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="inline-flex items-center rounded-md bg-amber-400/10 px-2 py-1 text-xs font-semibold text-amber-400 ring-1 ring-inset ring-amber-400/20">
                          Order: {cat.displayOrder}
                        </span>
                        <div className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex gap-2">
                          <button onClick={() => setEditingItem({ type: 'category', data: cat })} className="p-1.5 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 rounded-md transition-colors" title="Edit">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDeleteClick(cat._id, 'categories', cat.name)} className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-md transition-colors" title="Delete">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 2. Menu Items Section */}
          {results.items.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Utensils className="h-5 w-5 text-amber-400" />
                <h4 className="text-lg font-semibold tracking-tight text-white">Menu Items ({results.items.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {results.items.map((item) => (
                  <Card key={item._id} className="bg-white/5 border-white/10 text-white overflow-hidden hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 transition-all duration-300 rounded-xl relative group">
                    <div className="absolute top-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                      <button onClick={() => setEditingItem({ type: 'item', data: item })} className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-blue-400 hover:text-blue-300 hover:bg-black/80 rounded-lg transition-colors shadow-lg" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(item._id, 'items', item.title)} className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-red-400 hover:text-red-300 hover:bg-black/80 rounded-lg transition-colors shadow-lg" title="Delete">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row h-full">
                      {item.photoUrl && (
                        <div className="sm:w-32 h-32 sm:h-auto overflow-hidden flex-shrink-0 bg-black/40">
                          <img
                            src={item.photoUrl}
                            alt={item.title}
                            className="w-full h-full object-cover opacity-90"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-base font-bold text-amber-400">{item.title}</CardTitle>
                            <span className="text-sm font-bold text-amber-400">${item.price.toFixed(2)}</span>
                          </div>
                          <CardDescription className="line-clamp-2 text-xs text-white/60">{item.description}</CardDescription>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                          <span className="inline-flex items-center rounded-full bg-white/10 px-2 py-0.5 text-xs font-medium text-white/80">
                            {item.category?.name || 'Uncategorized'}
                          </span>
                          <div className="flex gap-1.5">
                            {item.dietaryAttributes?.isVegetarian && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                                Veg
                              </span>
                            )}
                            {item.dietaryAttributes?.isVegan && (
                              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-400 border border-green-500/20">
                                Vegan
                              </span>
                            )}
                            {item.dietaryAttributes?.isNonVeg && (
                              <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-0.5 text-xs font-medium text-red-400 border border-red-500/20">
                                Non-Veg
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 3. Chefs Section */}
          {results.chefs.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <ChefHat className="h-5 w-5 text-amber-400" />
                <h4 className="text-lg font-semibold tracking-tight text-white">Chefs ({results.chefs.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {results.chefs.map((chef) => (
                  <Card key={chef._id} className="bg-white/5 border-white/10 text-white overflow-hidden hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 transition-all duration-300 rounded-xl relative group">
                    <div className="absolute top-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                      <button onClick={() => setEditingItem({ type: 'chef', data: chef })} className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-blue-400 hover:text-blue-300 hover:bg-black/80 rounded-lg transition-colors shadow-lg" title="Edit Chef">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(chef._id, 'chefs', chef.name)} className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-red-400 hover:text-red-300 hover:bg-black/80 rounded-lg transition-colors shadow-lg" title="Delete Chef">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row h-full">
                      {chef.photoUrl && (
                        <div className="sm:w-32 h-32 sm:h-auto overflow-hidden flex-shrink-0 bg-black/40">
                          <img
                            src={chef.photoUrl}
                            alt={chef.name}
                            className="w-full h-full object-cover opacity-90"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-base font-bold text-amber-400">{chef.name}</CardTitle>
                            <span className="text-xs font-semibold text-white/70">{chef.role}</span>
                          </div>
                          <CardDescription className="line-clamp-2 text-xs text-white/60">{chef.bio}</CardDescription>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {chef.specialties.map((spec, idx) => (
                              <span key={idx} className="inline-flex items-center rounded bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                                {spec}
                              </span>
                            ))}
                          </div>
                          {chef.experienceYears !== undefined && (
                            <p className="text-xs text-white/50 font-medium">
                              Experience: <strong className="text-white">{chef.experienceYears} Years</strong>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 4. Today's Specials Section */}
          {results.specials.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-2">
                <Star className="h-5 w-5 text-amber-400" />
                <h4 className="text-lg font-semibold tracking-tight text-white">Today's Specials ({results.specials.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {results.specials.map((special) => (
                  <Card key={special._id} className="bg-white/5 border-white/10 text-white overflow-hidden hover:border-amber-400/50 hover:shadow-lg hover:shadow-amber-400/5 transition-all duration-300 rounded-xl relative group">
                    <div className="absolute top-2 right-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity flex gap-2 z-10">
                      <button onClick={() => setEditingItem({ type: 'special', data: special })} className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-blue-400 hover:text-blue-300 hover:bg-black/80 rounded-lg transition-colors shadow-lg" title="Edit Special Settings">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeleteClick(special._id, 'specials', special.item?.title || 'this special')} className="p-2 bg-black/60 backdrop-blur-md border border-white/10 text-red-400 hover:text-red-300 hover:bg-black/80 rounded-lg transition-colors shadow-lg" title="Remove Special">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {special.item ? (
                      <div className="flex flex-col h-full justify-between p-4">
                        <div className="flex gap-3">
                          {special.item.photoUrl && (
                            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-black/40">
                              <img src={special.item.photoUrl} alt={special.item.title} className="w-full h-full object-cover opacity-90" />
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <h5 className="font-bold text-sm leading-snug text-amber-400">{special.item.title}</h5>
                            <p className="text-xs text-white/70 font-semibold">${special.item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                          <span>Special Date:</span>
                          <strong className="text-white">
                            {new Date(special.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-xs text-white/50">
                        Linked item has been deleted.
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editingItem} onOpenChange={(open) => !open && setEditingItem(null)}>
        <DialogContent className="bg-neutral-950 border border-white/10 text-white sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-amber-400 font-bold">
              Edit {editingItem?.type === 'category' ? 'Category' : editingItem?.type === 'special' ? 'Special' : editingItem?.type === 'chef' ? 'Chef' : 'Item'}
            </DialogTitle>
            <DialogDescription className="text-white/60">
              Make changes to this {editingItem?.type} below.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 max-h-[70vh] overflow-y-auto px-1">
            {editingItem?.type === 'category' && (
              <CategoryForm 
                initialData={editingItem.data} 
                isEditMode={true} 
                onSuccess={() => setEditingItem(null)} 
              />
            )}
            {editingItem?.type === 'item' && (
              <ItemForm 
                initialData={editingItem.data} 
                isEditMode={true} 
                onSuccess={() => setEditingItem(null)} 
              />
            )}
            {editingItem?.type === 'special' && (
              <SpecialForm 
                initialData={editingItem.data} 
                isEditMode={true} 
                onSuccess={() => setEditingItem(null)} 
              />
            )}
            {editingItem?.type === 'chef' && (
              <ChefForm 
                initialData={editingItem.data} 
                isEditMode={true} 
                onSuccess={() => setEditingItem(null)} 
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        title={`Delete ${itemToDelete?.type === 'categories' ? 'Category' : itemToDelete?.type === 'specials' ? 'Special' : itemToDelete?.type === 'chefs' ? 'Chef' : 'Item'}`}
        description={`Are you sure you want to delete "${itemToDelete?.name}"? ${itemToDelete?.type === 'items' ? 'It will be hidden from the menu.' : 'This action cannot be undone.'}`}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
      />
    </div>
  );
}
