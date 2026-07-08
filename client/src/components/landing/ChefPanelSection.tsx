import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { optimizeCloudinaryUrl } from '@/lib/cloudinary';

interface ChefPanelSectionProps {
  chefs: any[];
  isLoading?: boolean;
}

/**
 * ChefPanelSection Component
 * 
 * Renders a rotating display of the restaurant's culinary masters. 
 * Cycles through the `chefs` array every 12 seconds with a fade-in/fade-out effect.
 * 
 * Experience Level Comment:
 * - `currentChefIdx` tracks which chef is currently displayed.
 * - `chefFade` acts as a toggle for CSS transitions, allowing us to fade opacity to 0 
 *   before changing the index, then fading back to 100%.
 * - The `setInterval` handles the 12s delay. A `setTimeout` of 600ms inside it perfectly 
 *   matches our CSS `duration-700` so the text doesn't change abruptly while still visible.
 */
export default function ChefPanelSection({ chefs, isLoading }: ChefPanelSectionProps) {
  const [currentChefIdx, setCurrentChefIdx] = useState(0);
  const [chefFade, setChefFade] = useState(true);

  // Swipe State
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);

  // 12-second Chef Cycling Effect (Auto-rotates, resets on manual interaction)
  useEffect(() => {
    if (chefs.length === 0) return;

    const timer = setTimeout(() => {
      setChefFade(false);
      setTimeout(() => {
        setCurrentChefIdx((prev) => (prev + 1) % chefs.length);
        setChefFade(true);
      }, 600); 
    }, 12000);

    return () => clearTimeout(timer);
  }, [chefs, currentChefIdx]); // Dependency on currentChefIdx resets timer on manual interaction

  const handleManualChange = (newIdx: number) => {
    if (newIdx === currentChefIdx) return;
    setChefFade(false);
    setTimeout(() => {
      setCurrentChefIdx(newIdx);
      setChefFade(true);
    }, 300);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe || isRightSwipe) {
      const nextIdx = isLeftSwipe 
        ? (currentChefIdx + 1) % chefs.length 
        : (currentChefIdx - 1 + chefs.length) % chefs.length;
      handleManualChange(nextIdx);
    }
  };

  const currentChef = chefs[currentChefIdx] || null;

  return (
    <section id="chef-section" className="py-24 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center md:text-left mb-16">
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-400 mb-2">
            Culinary Artistry
          </p>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Meet Our Culinary Masters
          </h2>
        </div>

        {isLoading ? (
          // Skeleton Loader for Chef Panel
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-[280px] sm:w-[350px] aspect-[4/5] rounded-3xl bg-neutral-900/50 animate-pulse border border-white/5"></div>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <div className="h-6 w-32 bg-amber-400/20 rounded-full animate-pulse mb-3"></div>
              <div className="h-10 w-64 bg-neutral-900/50 rounded animate-pulse"></div>
              <div className="h-6 w-40 bg-neutral-900/50 rounded animate-pulse mt-1"></div>
              <div className="space-y-2 mt-4">
                <div className="h-4 w-full max-w-xl bg-neutral-900/50 rounded animate-pulse"></div>
                <div className="h-4 w-full max-w-lg bg-neutral-900/50 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        ) : currentChef && (
          <div
            className={`transition-all duration-700 ease-in-out ${
              chefFade ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
            }`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Chef Photo Frame */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group/photo w-[280px] sm:w-[350px] aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                  {currentChef.photoUrl ? (
                    <img
                      src={optimizeCloudinaryUrl(currentChef.photoUrl, 600)}
                      alt={currentChef.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <Clock className="h-12 w-12 text-white/20 animate-pulse" />
                    </div>
                  )}
                  {/* Bottom gradient overlay to make text visible */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6">
                    <p className="text-xs font-bold uppercase tracking-wider text-amber-400">
                      {currentChef.experienceYears || 10}+ Years Experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Chef Profile Details */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div>
                  <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-bold uppercase tracking-wider bg-amber-400/15 px-3 py-1 rounded-full mb-3">
                    Rotating Artist Profile
                  </span>
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white">
                    {currentChef.name}
                  </h3>
                  <p className="text-amber-300 font-medium text-sm sm:text-base mt-1">
                    {currentChef.role}
                  </p>
                </div>

                <p className="text-white/70 text-base sm:text-lg italic leading-relaxed font-light max-w-xl mx-auto lg:mx-0">
                  "{currentChef.bio}"
                </p>

                <div className="space-y-3">
                  <h4 className="text-xs uppercase tracking-widest text-white/50 font-bold">
                    Specialty Fields
                  </h4>
                  <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                    {currentChef.specialties?.map((spec: string, idx: number) => (
                      <span
                        key={idx}
                        className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-xs font-medium text-white/90 hover:border-amber-400/40 transition-colors"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Cycling indicators allow manual selection of a chef */}
                <div className="flex items-center justify-center lg:justify-start gap-2 pt-6">
                  {chefs.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleManualChange(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentChefIdx ? "w-8 bg-amber-400" : "w-2 bg-white/20"
                      }`}
                    />
                  ))}
                  
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
