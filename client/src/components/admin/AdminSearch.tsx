import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Search, Loader2, Utensils, ChefHat, Tag, Star, AlertCircle } from 'lucide-react';

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
  const [results, setResults] = useState<SearchResults>({
    categories: [],
    items: [],
    chefs: [],
    specials: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults({ categories: [], items: [], chefs: [], specials: [] });
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(`http://localhost:5000/api/v1/admin/search?q=${encodeURIComponent(debouncedQuery)}`, {
          method: 'GET',
          credentials: 'include',
        });

        if (!res.ok) {
          throw new Error('Failed to retrieve search results');
        }

        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        } else {
          throw new Error(data.message || 'Something went wrong');
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred during search');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const hasResults =
    results.categories.length > 0 ||
    results.items.length > 0 ||
    results.chefs.length > 0 ||
    results.specials.length > 0;

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search categories, menu items, chefs, or specials..."
          className="pl-10 h-11 pr-10 text-base"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 text-destructive border border-destructive/20 rounded-lg bg-destructive/10">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{error}</span>
        </div>
      )}

      {/* When no query is entered */}
      {!query.trim() && !isLoading && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card text-muted-foreground">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">Type anything to start searching the database.</p>
        </div>
      )}

      {/* When query is entered but nothing is found */}
      {query.trim() && !isLoading && !hasResults && !error && (
        <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card text-muted-foreground">
          <AlertCircle className="h-10 w-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No results match your search query "{query}".</p>
        </div>
      )}

      {/* Loading Skeletons */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="border border-border">
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardHeader>
              <CardContent className="h-16 bg-muted/50 rounded-b-xl"></CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Search Results Display */}
      {!isLoading && hasResults && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* 1. Category Section */}
          {results.categories.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Tag className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold tracking-tight">Categories ({results.categories.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {results.categories.map((cat) => (
                  <Card key={cat._id} className="hover:shadow-md transition-shadow duration-200">
                    <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0">
                      <div>
                        <CardTitle className="text-base font-bold">{cat.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">ID: {cat._id}</CardDescription>
                      </div>
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                        Order: {cat.displayOrder}
                      </span>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* 2. Menu Items Section */}
          {results.items.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Utensils className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold tracking-tight">Menu Items ({results.items.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {results.items.map((item) => (
                  <Card key={item._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col sm:flex-row h-full">
                      {item.photoUrl && (
                        <div className="sm:w-32 h-32 sm:h-auto overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={item.photoUrl}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // If image fails to load, hide or replace
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-base font-bold">{item.title}</CardTitle>
                            <span className="text-sm font-semibold text-primary">${item.price.toFixed(2)}</span>
                          </div>
                          <CardDescription className="line-clamp-2 text-xs">{item.description}</CardDescription>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 items-center justify-between">
                          <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {item.category?.name || 'Uncategorized'}
                          </span>
                          <div className="flex gap-1.5">
                            {item.dietaryAttributes?.isVegetarian && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                Veg
                              </span>
                            )}
                            {item.dietaryAttributes?.isVegan && (
                              <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-600 dark:text-green-400 border border-green-500/20">
                                Vegan
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
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <ChefHat className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold tracking-tight">Chefs ({results.chefs.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {results.chefs.map((chef) => (
                  <Card key={chef._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    <div className="flex flex-col sm:flex-row h-full">
                      {chef.photoUrl && (
                        <div className="sm:w-32 h-32 sm:h-auto overflow-hidden flex-shrink-0 bg-muted">
                          <img
                            src={chef.photoUrl}
                            alt={chef.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-4 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <CardTitle className="text-base font-bold">{chef.name}</CardTitle>
                            <span className="text-xs font-medium text-muted-foreground">{chef.role}</span>
                          </div>
                          <CardDescription className="line-clamp-2 text-xs">{chef.bio}</CardDescription>
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex flex-wrap gap-1">
                            {chef.specialties.map((spec, idx) => (
                              <span key={idx} className="inline-flex items-center rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                                {spec}
                              </span>
                            ))}
                          </div>
                          {chef.experienceYears !== undefined && (
                            <p className="text-xs text-muted-foreground font-medium">
                              Experience: <strong className="text-foreground">{chef.experienceYears} Years</strong>
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
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <Star className="h-5 w-5 text-primary" />
                <h4 className="text-lg font-semibold tracking-tight">Today's Specials ({results.specials.length})</h4>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {results.specials.map((special) => (
                  <Card key={special._id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                    {special.item ? (
                      <div className="flex flex-col h-full justify-between p-4">
                        <div className="flex gap-3">
                          {special.item.photoUrl && (
                            <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 bg-muted">
                              <img src={special.item.photoUrl} alt={special.item.title} className="w-full h-full object-cover" />
                            </div>
                          )}
                          <div className="space-y-0.5">
                            <h5 className="font-bold text-sm leading-snug">{special.item.title}</h5>
                            <p className="text-xs text-primary font-semibold">${special.item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <div className="mt-4 pt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
                          <span>Special Date:</span>
                          <strong className="text-foreground">
                            {new Date(special.date).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-xs text-muted-foreground">
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
  );
}
