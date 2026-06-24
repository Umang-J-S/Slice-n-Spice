import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { specialSchema } from '../../lib/validations/adminValidations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type SpecialFormValues = {
  item: string;
  date: Date | string;
};

export default function SpecialForm() {
  const [items, setItems] = useState<any[]>([]);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SpecialFormValues>({
    resolver: yupResolver(specialSchema) as any,
    defaultValues: {
      item: '',
      date: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/v1/menu/full');
        const data = await res.json();
        if (data.success) {
          // Flatten the full menu to get all items
          let allItems: any[] = [];
          data.data.forEach((cat: any) => {
            allItems = [...allItems, ...cat.items];
          });
          setItems(allItems);
        }
      } catch (error) {
        console.error('Failed to fetch items', error);
      }
    };
    fetchItems();
  }, []);

  const onSubmit = async (data: SpecialFormValues) => {
    try {
      const res = await fetch('http://localhost:5000/api/v1/admin/specials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create special');
      }

      alert('Special added successfully!');
      reset();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="item">Select Menu Item</Label>
        <Controller
          name="item"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an item..." />
              </SelectTrigger>
              <SelectContent>
                {items.map((it) => (
                  <SelectItem key={it._id} value={it._id}>
                    {it.title} (${it.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.item && <p className="text-sm text-destructive">{errors.item.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date for Special</Label>
        <Input 
          id="date" 
          type="date" 
          {...register('date')} 
        />
        {errors.date && <p className="text-sm text-destructive">{errors.date.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Set Special'}
      </Button>
    </form>
  );
}
