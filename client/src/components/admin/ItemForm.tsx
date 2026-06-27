import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { itemSchema } from '../../lib/validations/adminValidations';
import { useToast } from '../../context/ToastContext';
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
  isNonVeg: boolean;
  category: string;
};

interface ItemFormProps {
  initialData?: any;
  isEditMode?: boolean;
  onSuccess?: () => void;
}

export default function ItemForm({ initialData, isEditMode, onSuccess }: ItemFormProps = {}) {
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.photoUrl || null);
  const { toast } = useToast();

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ItemFormValues>({
    resolver: yupResolver(itemSchema) as any,
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      price: initialData?.price || 0,
      photoUrl: initialData?.photoUrl || '',
      isVegetarian: initialData?.dietaryAttributes?.isVegetarian || false,
      isVegan: initialData?.dietaryAttributes?.isVegan || false,
      isNonVeg: initialData?.dietaryAttributes?.isNonVeg || false,
      category: initialData?.category?._id || initialData?.category || '',
    },
  });

  const descriptionValue = watch('description') || '';

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        price: initialData.price || 0,
        photoUrl: initialData.photoUrl || '',
        isVegetarian: initialData.dietaryAttributes?.isVegetarian || false,
        isVegan: initialData.dietaryAttributes?.isVegan || false,
        isNonVeg: initialData.dietaryAttributes?.isNonVeg || false,
        category: initialData.category?._id || initialData.category || '',
      });
      setPreviewUrl(initialData.photoUrl || null);
    }
  }, [initialData, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/menu/full`);
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
      let finalPhotoUrl = data.photoUrl;

      // 1. Upload photo if a new file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', selectedFile);

        const uploadRes = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/admin/upload`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
        });

        if (!uploadRes.ok) {
          throw new Error('Failed to upload photo');
        }
        
        const uploadData = await uploadRes.json();
        finalPhotoUrl = uploadData.data.photoUrl;
      } else if (!finalPhotoUrl) {
        throw new Error('Please select a photo to upload');
      }

      // 2. Submit the item payload
      const payload = {
        title: data.title,
        description: data.description,
        price: data.price,
        photoUrl: finalPhotoUrl,
        category: data.category,
        dietaryAttributes: {
          isVegetarian: data.isVegetarian,
          isVegan: data.isVegan,
          isNonVeg: data.isNonVeg,
        }
      };

      const url = isEditMode && initialData?._id 
        ? `${import.meta.env.VITE_API_URL}/api/v1/admin/items/${initialData._id}` 
        : `${import.meta.env.VITE_API_URL}/api/v1/admin/items`;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} item`);
      }

      toast.success(`Item ${isEditMode ? 'updated' : 'added'} successfully!`);
      if (!isEditMode) reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-white/80 font-semibold">Item Title</Label>
        <Input 
          id="title" 
          {...register('title')} 
          placeholder="e.g. Margherita Pizza" 
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.title && <p className="text-sm text-destructive font-medium">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-white/80 font-semibold">Description</Label>
          <span className={`text-xs ${512 - descriptionValue.length === 0 ? 'text-amber-400 font-bold' : 'text-white/40'}`}>
            {512 - descriptionValue.length} characters remaining
          </span>
        </div>
        <Textarea 
          id="description" 
          maxLength={512}
          {...register('description')} 
          placeholder="Delicious fresh tomatoes..." 
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors min-h-[120px] p-4 resize-y"
        />
        {errors.description && <p className="text-sm text-destructive font-medium">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="price" className="text-white/80 font-semibold">Price ($)</Label>
            <Input 
            id="price" 
            type="number" 
            step="0.01" 
            {...register('price')} 
            placeholder="0.00" 
            className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
          />
          {errors.price && <p className="text-sm text-destructive font-medium">{errors.price.message}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-white/80 font-semibold">Category</Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="bg-white/5 border border-white/10 focus:ring-amber-500/50 text-white rounded-xl hover:bg-white/10 transition-colors h-12 px-4">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-neutral-950 border-white/10 text-white rounded-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id} className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && <p className="text-sm text-destructive font-medium">{errors.category.message}</p>}
        </div>
      </div>

      {/* File Upload Field */}
      <div className="space-y-3">
        <Label htmlFor="photo" className="text-white/80 font-semibold">Item Photo</Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input 
              id="photo" 
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white file:bg-amber-500 file:text-black file:rounded-full file:border-0 file:px-4 file:py-1.5 file:mr-4 file:font-semibold hover:file:bg-amber-400 file:transition-colors rounded-xl cursor-pointer py-2 h-auto hover:bg-white/10 transition-colors"
            />
          </div>
          {previewUrl && (
            <div className="w-16 h-16 rounded-xl overflow-hidden border border-white/10 flex-shrink-0 bg-black">
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-6 py-4 border-t border-white/5">
        <div className="flex items-center space-x-3 bg-black/40 hover:bg-white/10 transition-colors px-4 py-3 rounded-xl border border-white/10">
          <Controller
            name="isVegetarian"
            control={control}
            render={({ field }) => (
              <Checkbox id="isVegetarian" checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500 h-5 w-5" />
            )}
          />
          <Label htmlFor="isVegetarian" className="font-semibold text-emerald-100 cursor-pointer">Vegetarian</Label>
        </div>
        <div className="flex items-center space-x-3 bg-black/40 hover:bg-white/10 transition-colors px-4 py-3 rounded-xl border border-white/10">
          <Controller
            name="isVegan"
            control={control}
            render={({ field }) => (
              <Checkbox id="isVegan" checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-emerald-400 data-[state=checked]:border-emerald-400 h-5 w-5" />
            )}
          />
          <Label htmlFor="isVegan" className="font-semibold text-emerald-50 cursor-pointer">Vegan</Label>
        </div>
        <div className="flex items-center space-x-3 bg-black/40 hover:bg-white/10 transition-colors px-4 py-3 rounded-xl border border-white/10">
          <Controller
            name="isNonVeg"
            control={control}
            render={({ field }) => (
              <Checkbox id="isNonVeg" checked={field.value} onCheckedChange={field.onChange} className="data-[state=checked]:bg-red-500 data-[state=checked]:border-red-500 h-5 w-5" />
            )}
          />
          <Label htmlFor="isNonVeg" className="font-semibold text-red-200 cursor-pointer">Non-Veg</Label>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold shadow-lg shadow-amber-500/20 py-6 text-lg transition-all hover:scale-[1.02]">
        {isSubmitting ? 'Uploading & Saving...' : isEditMode ? 'Update Menu Item' : 'Add Menu Item'}
      </Button>
    </form>
  );
}
