import { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import halalLogo from '@/assets/halal_badge.png';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import SpecialEditModal from '@/components/admin/SpecialEditModal';
import { useToast } from '@/context/ToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi } from '@/api';

interface SpecialsSectionProps {
  activeSpecials: any[];
  isLoading?: boolean;
  user?: any;
  refreshMenu?: () => void;
}

/**
 * SpecialsSection Component
 * 
 * Renders the "Today's Specials" menu items using an organic, scattered scrapbook layout.
 * 
 * Experience Level Comment:
 * - We iterate over `activeSpecials` and apply unique CSS rotation and translation classes 
 *   based on the item's index (`rotationClass`) to give a realistic scattered look.
 * - `transition-all duration-300 ease-out` allows the items to smoothly snap back 
 *   to a straight 0-degree angle when hovered (`hover:rotate-0`).
 * - We check for `special.item || special` to support both fully populated Mongoose documents 
 *   or simple fallback objects if the backend is structured differently.
 */
export default function SpecialsSection({ activeSpecials, isLoading, user, refreshMenu }: SpecialsSectionProps) {
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const isAdmin = user?.role === 'admin';

  const deleteSpecialMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteSpecial(id),
    onSuccess: () => {
      setItemToDelete(null);
      toast.success('Special deleted successfully!');
      queryClient.invalidateQueries({ queryKey: ['specials'] });
      if (refreshMenu) refreshMenu();
    },
    onError: (err: any) => {
      console.error('Error removing special', err);
      toast.error(err.message || 'Error deleting item');
    }
  });

  const handleDelete = () => {
    if (!itemToDelete) return;
    deleteSpecialMutation.mutate(itemToDelete._id);
  };

  return (
    <section id="specials-section" className="py-24 bg-neutral-950">
      <div className="max-w-6xl mx-auto px-6 mb-16 text-center space-y-4">
        <div className="inline-flex items-center justify-center gap-1 bg-amber-400/10 text-amber-400 px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
          Today's Fresh Creations
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
          Today's Specials Menu
        </h2>
        <p className="text-white/60 text-sm md:text-base max-w-lg mx-auto">
          Enjoy exclusive selections crafted daily by our chefs, arranged in an artistic, scattered collage layout.
        </p>
      </div>

      {/* Scattered Scrapbook layout container */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-y-16 py-8">
        {isLoading ? (
          // Skeleton Loaders
          [...Array(4)].map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="bg-neutral-900/50 animate-pulse border border-white/5 rounded-xl h-[300px]"
            />
          ))
        ) : activeSpecials.length === 0 ? (
          <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-12 text-white/40 font-semibold border border-dashed border-white/10 rounded-2xl">
            No specials available today. Check back tomorrow!
          </div>
        ) : activeSpecials.map((special, index) => {
          // Apply slight random-like rotations and translations based on item index 
          // to achieve an organic scattered feel on desktop screens
          const rotationClass =
            index % 4 === 0
              ? "md:rotate-[-3deg] md:-translate-y-4 hover:rotate-0"
              : index % 4 === 1
              ? "md:rotate-[2deg] md:translate-y-4 hover:rotate-0"
              : index % 4 === 2
              ? "md:rotate-[-2deg] md:-translate-y-2 hover:rotate-0"
              : "md:rotate-[3deg] md:translate-y-2 hover:rotate-0";

          const specItem = special.item || special; // support both DB models and fallback flat items

          return (
            <div
              key={special._id || index}
              className={`transition-all duration-300 ease-out transform ${rotationClass} bg-gradient-to-tr from-neutral-950 to-neutral-900 border border-white/10 rounded-xl overflow-hidden hover:scale-105 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-400/5 group/card relative`}
            >
              {specItem.photoUrl && (
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={optimizeCloudinaryUrl(specItem.photoUrl, 500)}
                    alt={specItem.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Small tag floating over the top left corner */}
                  <div className="absolute top-2 left-2 bg-amber-400 text-black px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide z-10">
                    Chef's Choice
                  </div>
                  {/* Non-veg Halal Logo Overlay, reusing the newly uploaded logo */}
                  {!specItem.isVegetarian && !specItem.isVegan && (
                    <div className="absolute top-2 right-2 z-10">
                      <img src={halalLogo} alt="100% Halal" className="w-10 h-10 object-contain drop-shadow-lg" loading="lazy" />
                    </div>
                  )}

                  {/* Admin Actions Overlay */}
                  {isAdmin && (
                    <div className="absolute bottom-2 right-2 flex items-center gap-2 z-20 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={() => setItemToEdit(special)}
                        className="p-1.5 bg-black/70 backdrop-blur-md rounded-full border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors shadow-lg"
                        title="Edit Special Settings"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => setItemToDelete(special)}
                        className="p-1.5 bg-black/70 backdrop-blur-md rounded-full border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                        title="Remove Special"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              )}
              <div className="p-5 space-y-3">
                <h3 className="font-bold text-base text-white/95 line-clamp-1">
                  {specItem.title}
                </h3>
                <p className="text-xs text-white/50 line-clamp-3 leading-relaxed">
                  {specItem.description}
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/40">Limited Portions</span>
                  <span className="text-sm font-bold text-amber-400">
                    ${typeof specItem.price === "number" ? specItem.price.toFixed(2) : specItem.price}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Remove Special"
        description={`Are you sure you want to remove "${itemToDelete?.item?.title || 'this item'}" from Today's Specials?`}
        isLoading={deleteSpecialMutation.isPending}
        confirmText="Delete from Special"
      />

      {itemToEdit && (
        <SpecialEditModal 
          isOpen={!!itemToEdit}
          onClose={() => setItemToEdit(null)}
          special={itemToEdit}
          onSuccess={() => {
            if (refreshMenu) refreshMenu();
          }}
        />
      )}
    </section>
  );
}
