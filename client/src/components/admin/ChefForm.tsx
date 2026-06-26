import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { chefSchema } from '../../lib/validations/adminValidations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '../../context/ToastContext';

type ChefFormValues = {
  name: string;
  role: string;
  bio: string;
  photoUrl: string;
  experienceYears?: number | null;
  specialties?: string;
};

export default function ChefForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: ChefFormValues) => {
    try {
      let finalPhotoUrl = data.photoUrl;

      // 1. Upload photo if a new file is selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append('photo', selectedFile);

        const uploadRes = await fetch('http://localhost:5000/api/v1/admin/upload', {
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

      // Transform specialties from comma-separated string to array
      const payload = {
        ...data,
        photoUrl: finalPhotoUrl,
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

      toast.success('Chef added successfully!');
      reset();
      setPreviewUrl(null);
      setSelectedFile(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add chef');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-lg mx-auto">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white/80 font-semibold">Full Name</Label>
        <Input 
          id="name" 
          {...register('name')} 
          placeholder="e.g. Gordon Ramsay" 
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.name && <p className="text-sm text-destructive font-medium">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-white/80 font-semibold">Role</Label>
        <Input 
          id="role" 
          {...register('role')} 
          placeholder="e.g. Executive Chef" 
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.role && <p className="text-sm text-destructive font-medium">{errors.role.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-white/80 font-semibold">Biography</Label>
        <Textarea 
          id="bio" 
          {...register('bio')} 
          placeholder="A short bio about the chef..." 
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors min-h-[120px] p-4 resize-y"
        />
        {errors.bio && <p className="text-sm text-destructive font-medium">{errors.bio.message}</p>}
      </div>

      {/* File Upload Field */}
      <div className="space-y-3">
        <Label htmlFor="photo" className="text-white/80 font-semibold">Chef Photo</Label>
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

      <div className="space-y-2">
        <Label htmlFor="experienceYears" className="text-white/80 font-semibold">Experience (Years)</Label>
        <Input
          id="experienceYears"
          type="number"
          {...register('experienceYears')}
          placeholder="e.g. 15"
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.experienceYears && <p className="text-sm text-destructive font-medium">{errors.experienceYears.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="specialties" className="text-white/80 font-semibold">Specialties (comma separated)</Label>
        <Input
          id="specialties"
          {...register('specialties')}
          placeholder="e.g. Italian, Pastries, Seafood"
          className="bg-white/5 border border-white/10 focus-visible:ring-amber-500/50 text-white placeholder:text-white/30 rounded-xl hover:bg-white/10 transition-colors h-12 px-4"
        />
        {errors.specialties && <p className="text-sm text-destructive font-medium">{errors.specialties.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-extrabold shadow-lg shadow-amber-500/20 py-6 text-lg transition-all hover:scale-[1.02] mt-4">
        {isSubmitting ? 'Uploading & Saving...' : 'Add Chef'}
      </Button>
    </form>
  );
}
