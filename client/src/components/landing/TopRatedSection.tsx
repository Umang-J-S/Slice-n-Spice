import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronRight, Edit2, Trash2 } from 'lucide-react';
import halalLogo from '../../assets/halal_badge.png';
import { optimizeCloudinaryUrl } from '../../lib/cloudinary';
import ConfirmDialog from '../admin/ConfirmDialog';
import ItemEditModal from '../admin/ItemEditModal';
import { useToast } from '../../context/ToastContext';

interface TopRatedSectionProps {
  famousDishes: any[];
  isLoading?: boolean;
  user?: any;
  refreshMenu?: () => void;
}

/**
 * TopRatedSection Component
 * 
 * Renders an auto-scrolling horizontal list of top-rated signature dishes.
 * Features a mouse-tracking system that allows users to drag/scroll by moving
 * their mouse or finger across the container.
 * 
 * Experience Level Comment:
 * - We use `useRef` to hold mutable values like `animationRef` and `isHoveredRef` 
 *   that do not require a re-render when they change, making the animation loop highly performant.
 * - A custom `requestAnimationFrame` loop handles the continuous leftward scroll when idle.
 * - The mouse event handlers translate the cursor's X position into a percentage 
 *   to determine the exact scroll offset, creating a smooth "scrubbing" effect.
 */
export default function TopRatedSection({ famousDishes, isLoading, user, refreshMenu }: TopRatedSectionProps) {
  // sliderOffset represents the pixel translation of the slider track
  const [sliderOffset, setSliderOffset] = useState(0);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  
  // We track hover state to pause the auto-scroll when the user interacts
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const animationRef = useRef<number | null>(null);
  const { toast } = useToast();

  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  // Auto-scrolling effect using requestAnimationFrame for 60fps smoothness
  useEffect(() => {
    const animate = () => {
      // Only auto-scroll if the user is NOT hovering/interacting
      if (!isHoveredRef.current && sliderContainerRef.current && sliderTrackRef.current) {
        const track = sliderTrackRef.current;
        const trackWidth = track.scrollWidth;
        
        // We doubled the items. The exact pixel distance of one full set (including the gap after it)
        // is (trackWidth + gap) / 2. Our gap is 'gap-6' which is 24px.
        const resetPoint = (trackWidth + 24) / 2;

        setSliderOffset((prev) => {
          let next = prev - 0.5; // Controls the speed of the auto-scroll
          if (next <= -resetPoint) {
            return next + resetPoint; // Seamless loop by keeping the fractional remainder
          }
          return next;
        });
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Cleanup the animation frame on unmount to prevent memory leaks
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  /**
   * Handle Mouse movement inside Top Rated slider to drag/scroll.
   * We calculate the mouse's relative X position within the container and 
   * map it linearly to the maximum scrollable width.
   */
  const handleSliderMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!sliderContainerRef.current || !sliderTrackRef.current) return;
    const container = sliderContainerRef.current;
    const track = sliderTrackRef.current;
    const containerRect = container.getBoundingClientRect();
    const trackWidth = track.scrollWidth;
    const containerWidth = containerRect.width;

    if (trackWidth <= containerWidth) return; // No need to scroll if content fits

    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX; // Support for mobile touch drag
    } else {
      clientX = (e as React.MouseEvent).clientX; // Support for desktop mouse drag
    }

    // Calculate mouse position inside container from 0.0 to 1.0 (percentage)
    const mouseX = clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / containerWidth));

    // Translate percentage to slide offset: 0% -> 0px, 100% -> -(resetPoint)
    // This allows the user to scrub exactly one full cycle of the infinite loop
    const resetPoint = (trackWidth + 24) / 2;
    const offset = -percentage * resetPoint;
    setSliderOffset(offset);
  };

  const handleSliderMouseEnter = () => setIsHovered(true);
  const handleSliderMouseLeave = () => setIsHovered(false);
  const handleSliderTouchStart = () => setIsHovered(true);
  const handleSliderTouchEnd = () => setIsHovered(false);

  const handleDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`http://localhost:5000/api/v1/admin/items/${itemToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to delete item');
      
      setItemToDelete(null);
      toast.success('Item deleted successfully!');
      if (refreshMenu) refreshMenu();
    } catch (err: any) {
      console.error('Error deleting item', err);
      toast.error(err.message || 'Error deleting item');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <section id="menu-section" className="py-24 bg-black border-y border-white/5">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest font-semibold text-amber-400 mb-2">
              Curated Favorites
            </p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Top Rated Culinary Works
            </h2>
          </div>
          <p className="text-white/60 text-sm max-w-xs md:text-right">
            Our 8 most acclaimed signature dishes, prepared by hand and rated highly by our regular patrons.
          </p>
        </div>
      </div>

      {/* Interactive mouse-tracking slider container */}
      <div
        ref={sliderContainerRef}
        onMouseEnter={handleSliderMouseEnter}
        onMouseMove={handleSliderMouseMove}
        onMouseLeave={handleSliderMouseLeave}
        onTouchStart={handleSliderTouchStart}
        onTouchMove={handleSliderMouseMove}
        onTouchEnd={handleSliderTouchEnd}
        className="w-full overflow-hidden py-4 cursor-ew-resize relative group"
      >
        <div
          ref={sliderTrackRef}
          style={{
            transform: `translateX(${sliderOffset}px)`,
            // Add a smooth cubic-bezier transition when hovering to avoid jittering
            transition: isHovered ? "transform 0.3s cubic-bezier(0.1, 0.8, 0.25, 1)" : "none",
          }}
          className="flex gap-6 px-6 w-max"
        >
          {isLoading ? (
            // Skeleton Loaders
            [...Array(6)].map((_, idx) => (
              <div key={`skeleton-${idx}`} className="w-[280px] sm:w-[320px] h-[360px] bg-neutral-900/50 animate-pulse rounded-2xl border border-white/5 flex-shrink-0" />
            ))
          ) : [...famousDishes, ...famousDishes].map((dish, index) => (
            <div
              key={`${dish._id}-${index}`}
              className="w-[280px] sm:w-[320px] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all duration-300 flex-shrink-0 group/card"
            >
              {/* Food Image */}
              <div className="h-[200px] overflow-hidden relative">
                <img
                  src={optimizeCloudinaryUrl(dish.photoUrl, 500) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"}
                  alt={dish.title}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/15 z-10">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold">{dish.rating || "4.5"}</span>
                </div>
                {/* Non-veg Halal Logo Overlay */}
                {!dish.isVegetarian && !dish.isVegan && (
                  <div className="absolute top-3 left-3 z-10">
                    <img src={halalLogo} alt="100% Halal" className="w-12 h-12 object-contain drop-shadow-lg" loading="lazy" />
                  </div>
                )}

                {/* Admin Actions Overlay */}
                {isAdmin && (
                  <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={() => setItemToEdit(dish)}
                      className="p-2 bg-black/70 backdrop-blur-md rounded-full border border-amber-400/30 text-amber-400 hover:bg-amber-400 hover:text-black transition-colors shadow-lg"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => setItemToDelete(dish)}
                      className="p-2 bg-black/70 backdrop-blur-md rounded-full border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-lg"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Details */}
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-base sm:text-lg group-hover/card:text-amber-300 transition-colors line-clamp-1">
                    {dish.title}
                  </h3>
                  <span className="text-sm font-bold text-amber-400">${typeof dish.price === 'number' ? dish.price.toFixed(2) : dish.price}</span>
                </div>
                <p className="text-xs sm:text-sm text-white/50 line-clamp-2 leading-relaxed">
                  {dish.description}
                </p>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                  <span>Signature dish</span>
                  <ChevronRight className="h-4 w-4 text-amber-400/50 group-hover/card:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Menu Item"
        description={`Are you sure you want to permanently delete "${itemToDelete?.title}"? This action cannot be undone.`}
        isLoading={isDeleting}
      />

      {itemToEdit && (
        <ItemEditModal 
          isOpen={!!itemToEdit}
          onClose={() => setItemToEdit(null)}
          item={itemToEdit}
          onSuccess={() => {
            if (refreshMenu) refreshMenu();
          }}
        />
      )}
    </section>
  );
}
