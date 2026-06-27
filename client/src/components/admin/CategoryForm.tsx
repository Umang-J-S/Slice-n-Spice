import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categorySchema } from '../../lib/validations/adminValidations';
import { useToast } from '../../context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CategoryFormValues = {
  name: string;
  displayOrder: number;
};

interface CategoryFormProps {
  initialData?: any;
  isEditMode?: boolean;
  onSuccess?: () => void;
}

export default function CategoryForm({ initialData, isEditMode, onSuccess }: CategoryFormProps = {}) {
  const [, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      displayOrder: initialData?.displayOrder || 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        displayOrder: initialData.displayOrder,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: CategoryFormValues) => {
    setIsLoading(true);
    try {
      const url = isEditMode && initialData?._id 
        ? `${import.meta.env.VITE_API_URL}/api/v1/admin/categories/${initialData._id}` 
        : `${import.meta.env.VITE_API_URL}/api/v1/admin/categories`;
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || `Failed to ${isEditMode ? 'update' : 'create'} category`);
      }

      toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully!`);
      if (!isEditMode) reset();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white/80 font-semibold">Category Name</Label>
        <Input 
          id="name" 
          {...register('name')} 
          placeholder="e.g. Desserts" 
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.name && <p className="text-sm text-red-400 font-medium">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayOrder" className="text-white/80 font-semibold">Display Order</Label>
        <Input
          id="displayOrder"
          type="number"
          {...register('displayOrder')}
          placeholder="0"
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.displayOrder && (
          <p className="text-sm text-red-400 font-medium">{errors.displayOrder.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold shadow-lg shadow-amber-500/20 py-6 text-lg transition-all hover:scale-[1.02] mt-4">
        {isSubmitting ? 'Saving...' : isEditMode ? 'Update Category' : 'Add Category'}
      </Button>
    </form>
  );
}
