import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { chefSchema } from '../../lib/validations/adminValidations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type ChefFormValues = {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  experienceYears?: number | null;
  specialties?: string;
};

export default function ChefForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChefFormValues>({
    resolver: yupResolver(chefSchema) as any,
    defaultValues: {
      name: '',
      role: '',
      bio: '',
      photoUrl: '',
      specialties: '',
    },
  });

  const onSubmit = async (data: ChefFormValues) => {
    try {
      // Transform specialties from comma-separated string to array
      const payload = {
        ...data,
        specialties: data.specialties ? data.specialties.split(',').map((s) => s.trim()) : [],
      };

      const res = await fetch('http://localhost:5000/api/v1/admin/chefs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to create chef');
      }

      alert('Chef added successfully!');
      reset();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register('name')} placeholder="e.g. Gordon Ramsay" />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Input id="role" {...register('role')} placeholder="e.g. Executive Chef" />
        {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biography</Label>
        <Textarea id="bio" {...register('bio')} placeholder="A short bio about the chef..." />
        {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photoUrl">Photo URL</Label>
        <Input id="photoUrl" {...register('photoUrl')} placeholder="https://..." />
        {errors.photoUrl && <p className="text-sm text-destructive">{errors.photoUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="experienceYears">Experience (Years)</Label>
        <Input
          id="experienceYears"
          type="number"
          {...register('experienceYears')}
          placeholder="e.g. 15"
        />
        {errors.experienceYears && <p className="text-sm text-destructive">{errors.experienceYears.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialties">Specialties (comma separated)</Label>
        <Input
          id="specialties"
          {...register('specialties')}
          placeholder="e.g. Italian, Pastries, Seafood"
        />
        {errors.specialties && <p className="text-sm text-destructive">{errors.specialties.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Add Chef'}
      </Button>
    </form>
  );
}
