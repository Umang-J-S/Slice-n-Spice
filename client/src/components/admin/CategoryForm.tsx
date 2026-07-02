import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categorySchema } from '../../lib/validations/adminValidations';
import { useToast } from '../../context/ToastContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '../../api';

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
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
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

  const categoryMutation = useMutation({
    mutationFn: (data: CategoryFormValues) => {
      if (isEditMode && initialData?._id) {
        return adminApi.updateCategory(initialData._id, data);
      } else {
        return adminApi.createCategory(data);
      }
    },
    onSuccess: () => {
      toast.success(`Category ${isEditMode ? 'updated' : 'created'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['menu', 'full'] });
      if (!isEditMode) reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      console.error(error);
      toast.error(error.message || 'An error occurred');
    }
  });

  const onSubmit = (data: CategoryFormValues) => {
    categoryMutation.mutate(data);
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
          onFocus={(e) => e.target.select()}
          placeholder="0"
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.displayOrder && (
          <p className="text-sm text-red-400 font-medium">{errors.displayOrder.message}</p>
        )}
      </div>

      <Button type="submit" disabled={categoryMutation.isPending} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold shadow-lg shadow-amber-500/20 py-6 text-lg transition-all hover:scale-[1.02] mt-4">
        {categoryMutation.isPending ? 'Saving...' : isEditMode ? 'Update Category' : 'Add Category'}
      </Button>
    </form>
  );
}
