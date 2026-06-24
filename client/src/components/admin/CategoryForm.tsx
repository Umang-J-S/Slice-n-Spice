import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { categorySchema } from '../../lib/validations/adminValidations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type CategoryFormValues = {
  name: string;
  displayOrder: number;
};

export default function CategoryForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormValues>({
    resolver: yupResolver(categorySchema) as any,
    defaultValues: {
      name: '',
      displayOrder: 0,
    },
  });

  const onSubmit = async (data: CategoryFormValues) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create category');
      }

      alert('Category created successfully!');
      reset();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input id="name" {...register('name')} placeholder="e.g. Desserts" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input
          id="displayOrder"
          type="number"
          {...register('displayOrder')}
          placeholder="0"
        />
        {errors.displayOrder && (
          <p className="text-sm text-destructive">{errors.displayOrder.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add Category'}
      </Button>
    </form>
  );
}
