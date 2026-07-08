import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { specialSchema } from '@/lib/validations/adminValidations';
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
import { useToast } from '@/context/ToastContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { menuApi, adminApi } from '@/api';

type SpecialFormValues = {
  item: string;
  date: Date | string;
};

interface SpecialFormProps {
  initialData?: any;
  isEditMode?: boolean;
  onSuccess?: () => void;
}

export default function SpecialForm({ initialData, isEditMode, onSuccess }: SpecialFormProps = {}) {
  const [expirationOption, setExpirationOption] = useState<string>('24h');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: menuData } = useQuery({
    queryKey: ['menu', 'full'],
    queryFn: menuApi.getFullMenu,
  });

  const items = menuData?.data ? menuData.data.reduce((acc: any[], cat: any) => [...acc, ...cat.items], []) : [];

  const getComputedExpiration = (opt: string) => {
    if (opt === 'always') return null;
    const date = new Date();
    if (opt === '24h') date.setHours(date.getHours() + 24);
    if (opt === '48h') date.setHours(date.getHours() + 48);
    if (opt === '7d') date.setDate(date.getDate() + 7);
    return date;
  };
  const computedDate = getComputedExpiration(expirationOption);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SpecialFormValues>({
    resolver: yupResolver(specialSchema) as any,
    defaultValues: {
      item: initialData?.item?._id || initialData?.item || '',
      date: initialData?.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        item: initialData.item?._id || initialData.item || '',
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      });
      if (!initialData.expiresAt) {
        setExpirationOption('always');
      }
    }
  }, [initialData, reset]);

  // Extracted logic to React Query above

  const specialMutation = useMutation({
    mutationFn: (data: SpecialFormValues) => {
      const submitData = {
        ...data,
        expiresAt: computedDate ? computedDate.toISOString() : null,
      };

      if (isEditMode && initialData?._id) {
        return adminApi.updateSpecial(initialData._id, submitData);
      } else {
        return adminApi.createSpecial(submitData);
      }
    },
    onSuccess: () => {
      toast.success(`Special ${isEditMode ? 'updated' : 'added'} successfully!`);
      queryClient.invalidateQueries({ queryKey: ['specials'] });
      if (!isEditMode) reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: any) => {
      toast.error(error.message || 'An error occurred');
    }
  });

  const onSubmit = (data: SpecialFormValues) => {
    specialMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <Label htmlFor="item" className="text-white/80 font-semibold">Select Menu Item</Label>
        <Controller
          name="item"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="bg-white/5 border border-white/10 focus:ring-amber-500/50 text-white rounded-xl hover:bg-white/10 transition-colors h-12 px-4">
                <SelectValue placeholder="Choose an item..." />
              </SelectTrigger>
              <SelectContent className="bg-neutral-950 border-white/10 text-white rounded-xl max-h-72 overflow-y-auto">
                {items.map((it: any) => (
                  <SelectItem key={it._id} value={it._id} className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">
                    {it.title} (${it.price})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.item && <p className="text-sm text-red-400 font-medium">{errors.item.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date" className="text-white/80 font-semibold">Date for Special</Label>
        <Input 
          id="date" 
          type="date" 
          {...register('date')} 
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.date && <p className="text-sm text-red-400 font-medium">{errors.date.message}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-white/80 font-semibold">Expiration Time</Label>
        <Select onValueChange={setExpirationOption} value={expirationOption}>
          <SelectTrigger className="bg-white/5 border border-white/10 focus:ring-amber-500/50 text-white rounded-xl hover:bg-white/10 transition-colors h-12 px-4">
            <SelectValue placeholder="Select expiration..." />
          </SelectTrigger>
          <SelectContent className="bg-neutral-950 border-white/10 text-white rounded-xl">
            <SelectItem value="24h" className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">24 Hours</SelectItem>
            <SelectItem value="48h" className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">48 Hours</SelectItem>
            <SelectItem value="7d" className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">7 Days</SelectItem>
            <SelectItem value="always" className="focus:bg-amber-500/20 focus:text-amber-300 cursor-pointer">Always (No Expiration)</SelectItem>
          </SelectContent>
        </Select>
        <div className="p-3 bg-amber-400/10 border border-amber-400/20 rounded-xl backdrop-blur-sm mt-3 flex items-start gap-2">
          <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-amber-200/90 leading-relaxed font-medium">
            {computedDate 
              ? `This item will automatically expire on ${computedDate.toLocaleString()}`
              : 'This item will remain active indefinitely until manually disabled.'}
          </p>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold shadow-lg shadow-amber-500/20 py-6 text-lg transition-all hover:scale-[1.02] mt-4">
        {isSubmitting ? 'Saving...' : isEditMode ? 'Update Special' : 'Set Special'}
      </Button>
    </form>
  );
}
