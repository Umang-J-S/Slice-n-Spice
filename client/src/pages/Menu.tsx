import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import DishCard from "../components/DishCard";
import { UtensilsCrossed } from "lucide-react";

export default function Menu() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when page loads
    window.scrollTo(0, 0);

    fetch(`${import.meta.env.VITE_API_URL}/api/v1/menu/full`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setCategories(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden flex flex-col">
      <Helmet>
        <title>Our Menu | Slice 'n Spice</title>
        <meta name="description" content="Explore our full menu of wood-fired pizzas, handcrafted pastas, and signature desserts. See real customer ratings and discover your next favorite meal." />
      </Helmet>
      
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 bg-black overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/40 via-black to-black"></div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 text-center flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            <UtensilsCrossed className="h-3 w-3" />
            Discover Our Offerings
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Our <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 bg-clip-text text-transparent">Culinary</span> Selection
          </h1>
          <p className="text-white/60 max-w-xl text-sm md:text-base leading-relaxed mt-2">
            Explore our meticulously crafted menu, featuring a symphony of flavors
            designed to delight your palate and elevate your dining experience.
          </p>
        </div>
      </section>

      {/* Menu Categories */}
      <section className="flex-grow pb-32 bg-black relative z-10 border-t border-white/5 pt-16">
        <div className="max-w-6xl mx-auto px-6">
          {loading ? (
            <div className="space-y-28">
              {[1, 2].map((categoryIndex) => (
                <div key={`skeleton-category-${categoryIndex}`} className="animate-in fade-in duration-700">
                  {/* Category Header Skeleton */}
                  <div className="flex flex-col items-center mb-12 space-y-3">
                    <div className="h-8 md:h-10 w-48 bg-neutral-900/50 rounded-lg animate-pulse"></div>
                    <div className="w-16 h-1.5 bg-neutral-800 rounded-full animate-pulse"></div>
                  </div>

                  {/* Food Items Grid Skeleton */}
                  <div className="flex flex-wrap justify-center gap-8">
                    {[1, 2, 3, 4].map((itemIndex) => (
                      <div 
                        key={`skeleton-item-${itemIndex}`} 
                        className="w-[280px] sm:w-[320px] h-[380px] bg-neutral-900/50 animate-pulse rounded-2xl border border-white/5 flex-shrink-0"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-white/50">
              <p>No menu items available at the moment. Please check back later.</p>
            </div>
          ) : (
            <div className="space-y-28">
              {categories.map((category) => (
                <div key={category._id || category.name} className="animate-in fade-in duration-700">
                  {/* Category Header */}
                  <div className="flex flex-col items-center mb-12 space-y-3">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white capitalize drop-shadow-sm">
                      {category.name}
                    </h2>
                    <div className="w-16 h-1.5 bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"></div>
                  </div>

                  {/* Food Items Grid */}
                  <div className="flex flex-wrap justify-center gap-8">
                    {category.items && category.items.length > 0 ? (
                      category.items.map((dish: any) => (
                        <DishCard
                          key={dish._id}
                          _id={dish._id}
                          title={dish.title}
                          price={dish.price}
                          description={dish.description}
                          image={dish.photoUrl}
                          rating={dish.avgRating}
                          reviewCount={dish.reviewCount}
                          onReviewSuccess={() => {
                            // Refetch the menu to update ratings
                            fetch(`${import.meta.env.VITE_API_URL}/api/v1/menu/full`)
                              .then((res) => res.json())
                              .then((data) => {
                                if (data.success && data.data) {
                                  setCategories(data.data);
                                }
                              });
                          }}
                          onDeleteSuccess={() => {
                            // Refetch the menu to remove deleted item
                            fetch(`${import.meta.env.VITE_API_URL}/api/v1/menu/full`)
                              .then((res) => res.json())
                              .then((data) => {
                                if (data.success && data.data) {
                                  setCategories(data.data);
                                }
                              });
                          }}
                        />
                      ))
                    ) : (
                      <p className="text-white/40 italic">No items in this category.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
