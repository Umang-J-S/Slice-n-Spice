import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { itemSchema } from '../../lib/validations/adminValidations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type ItemFormValues = {
  title: string;
  description: string;
  price: number;
  photoUrl: string;
  isVegetarian: boolean;
  isVegan: boolean;
  category: string;
};

export default function ItemForm() {
  const [categories, setCategories] = useState<any[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: yupResolver(itemSchema) as any,
    defaultValues: {
      title: '',
      description: '',
      price: 0,
      photoUrl: '',
      isVegetarian: false,
      isVegan: false,
      category: '',
    },
  });

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/menu/full');
        const data = await res.json();
        if (data.success) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  const onSubmit = async (data: ItemFormValues) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create item');
      }

      alert('Item added successfully!');
      reset();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" {...register('title')} placeholder="e.g. Margherita Pizza" />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register('description')} placeholder="Delicious fresh tomatoes..." />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" step="0.01" {...register('price')} placeholder="0.00" />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="photoUrl">Photo URL</Label>
        <Input id="photoUrl" {...register('photoUrl')} placeholder="https://..." />
        {errors.photoUrl && <p className="text-sm text-destructive">{errors.photoUrl.message}</p>}
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 py-2">
        <div className="flex items-center space-x-2">
          <Controller
            name="isVegetarian"
            control={control}
            render={({ field }) => (
              <Checkbox id="isVegetarian" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="isVegetarian" className="font-normal cursor-pointer">Vegetarian</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Controller
            name="isVegan"
            control={control}
            render={({ field }) => (
              <Checkbox id="isVegan" checked={field.value} onCheckedChange={field.onChange} />
            )}
          />
          <Label htmlFor="isVegan" className="font-normal cursor-pointer">Vegan</Label>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add Item'}
      </Button>
    </form>
  );
}
