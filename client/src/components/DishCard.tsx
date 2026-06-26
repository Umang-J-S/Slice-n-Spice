import { Star, ChevronRight } from 'lucide-react';
import { optimizeCloudinaryUrl } from '../lib/cloudinary';

interface DishCardProps {
  title: string;
  price: number | string;
  description: string;
  image: string;
  rating?: number | string;
}

export default function DishCard({ title, price, description, image, rating = "4.5" }: DishCardProps) {
  const displayPrice = typeof price === 'number' ? price.toFixed(2) : price;

  return (
    <div className="w-[280px] sm:w-[320px] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all duration-300 flex-shrink-0 group/card">
      {/* Food Image */}
      <div className="h-[200px] overflow-hidden relative">
        <img
          src={optimizeCloudinaryUrl(image, 500) || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=400&auto=format&fit=crop"}
          alt={title}
          className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/15">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="text-xs font-bold">{rating}</span>
        </div>
      </div>

      {/* Card Details */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-base sm:text-lg group-hover/card:text-amber-300 transition-colors line-clamp-1">
            {title}
          </h3>
          <span className="text-sm font-bold text-amber-400">${displayPrice}</span>
        </div>
        <p className="text-xs sm:text-sm text-white/50 line-clamp-2 leading-relaxed">
          {description}
        </p>
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
          <span>Signature dish</span>
          <ChevronRight className="h-4 w-4 text-amber-400/50 group-hover/card:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}
