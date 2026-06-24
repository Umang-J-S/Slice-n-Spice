import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TwitterIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);
import logo from "../assets/logo.png";
import heroBg from "../assets/hero_bg.png";

// 8 Famous dishes fallback static list
const FAMOUS_DISHES = [
  {
    id: "f1",
    title: "Truffle Mushroom Risotto",
    price: 24.99,
    rating: 4.9,
    description: "Creamy Carnaroli rice cooked with wild porchini, fresh herbs, and white truffle essence.",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f2",
    title: "Wood-Fired Margherita",
    price: 18.99,
    rating: 4.8,
    description: "San Marzano tomatoes, fresh buffalo mozzarella, fragrant basil, and extra virgin olive oil.",
    image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f3",
    title: "Pistachio Lamb Cutlets",
    price: 36.99,
    rating: 4.95,
    description: "Grass-fed lamb racks encrusted in crushed pistachios, served with red wine reduction.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f4",
    title: "Artisanal Lobster Ravioli",
    price: 31.99,
    rating: 4.85,
    description: "Handmade pasta pockets filled with Atlantic lobster in a rich saffron-infused cream sauce.",
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f5",
    title: "Wagyu Beef Ribeye",
    price: 64.99,
    rating: 5.0,
    description: "A5 Grade Japanese Wagyu cooked over open wood-fire coals, served with smoked butter.",
    image: "https://images.unsplash.com/photo-1546964124-0cce460f38ef?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f6",
    title: "Saffron Seafood Risotto",
    price: 33.99,
    rating: 4.75,
    description: "Luxe saffron rice layered with tiger prawns, scallops, fresh mussels, and baby squid.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f7",
    title: "Tiramisu Classico",
    price: 11.99,
    rating: 4.9,
    description: "House-baked ladyfingers soaked in espresso, layered with whipped mascarpone cream.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "f8",
    title: "Seared Atlantic Salmon",
    price: 28.99,
    rating: 4.8,
    description: "Crispy skin salmon fillet resting on braised asparagus, drizzled with dill lemon glaze.",
    image: "https://images.unsplash.com/photo-1485921325814-a5341f61173c?q=80&w=400&auto=format&fit=crop",
  },
];

// Fallback specials list
const FALLBACK_SPECIALS = [
  {
    _id: "s1",
    item: {
      title: "Handmade Squid Ink Tagliolini",
      description: "Squid ink pasta tossed with calamari, cherry tomatoes, white wine, garlic, and chili.",
      price: 27.99,
      photoUrl: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=500&auto=format&fit=crop",
    },
    date: new Date().toISOString(),
  },
  {
    _id: "s2",
    item: {
      title: "Wood-Fired Honey Fig Prosciutto Pizza",
      description: "Caramelized black mission figs, salty Parma ham, gorgonzola cheese, wild arugula, and dark honey drizzle.",
      price: 22.99,
      photoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=500&auto=format&fit=crop",
    },
    date: new Date().toISOString(),
  },
  {
    _id: "s3",
    item: {
      title: "Rosemary Infused Venison Tenderloin",
      description: "Pan-roasted wild venison medallion with juniper berry glaze, parsnip mash, and roasted baby carrots.",
      price: 45.99,
      photoUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=500&auto=format&fit=crop",
    },
    date: new Date().toISOString(),
  },
  {
    _id: "s4",
    item: {
      title: "Cardamom Panna Cotta",
      description: "Velvety cream panna cotta flavored with fresh green cardamom, topped with blood orange reduction.",
      price: 13.99,
      photoUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=500&auto=format&fit=crop",
    },
    date: new Date().toISOString(),
  },
];

// Fallback chefs list
const FALLBACK_CHEFS = [
  {
    _id: "c1",
    name: "Chef Marco Pierre",
    role: "Executive Culinary Director",
    bio: "With over 18 years in Michelin-starred establishments, Chef Marco merges ancient wood-fire grilling methods with boundary-pushing molecular gastronomy to craft unforgettable tastes.",
    photoUrl: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?q=80&w=600&auto=format&fit=crop",
    specialties: ["Artisanal Sourdough", "Dry-Aged Meats", "Plating Artistry"],
    experienceYears: 18,
  },
  {
    _id: "c2",
    name: "Chef Elena Rostova",
    role: "Head Pastry Artist",
    bio: "Elena elevates pastry creation to visual masterwork. Her desserts balance texture and subtle cardamon, saffron elements, ensuring a grand and sweet conclusion to your culinary journey.",
    photoUrl: "https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=600&auto=format&fit=crop",
    specialties: ["French Macarons", "Tempered Chocolate", "Sourdough Crûst"],
    experienceYears: 12,
  },
  {
    _id: "c3",
    name: "Chef Kenji Tanaka",
    role: "Master of Grills & Fire",
    bio: "Tanaka is a fire sculptor. He oversees our live wood-burning hearth, orchestrating the precise levels of smoke, heat, and ash that give Slice 'n Spice its distinctive trademark flavor.",
    photoUrl: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop",
    specialties: ["Hardwood Selection", "Smoked Infusions", "Seafood Sear"],
    experienceYears: 14,
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Mobile menu open state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Specials and Chefs state (fetched or fallbacks)
  const [specials, setSpecials] = useState<any[]>([]);
  const [chefs, setChefs] = useState<any[]>([]);

  // Chef cycle variables
  const [currentChefIdx, setCurrentChefIdx] = useState(0);
  const [chefFade, setChefFade] = useState(true);

  // Auto-slider mouse tracking variables
  const [sliderOffset, setSliderOffset] = useState(0);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderTrackRef = useRef<HTMLDivElement>(null);

  // Fetch data
  useEffect(() => {
    // Fetch Today's Specials
    fetch("http://localhost:5000/api/v1/menu/specials")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setSpecials(data.data);
        } else {
          setSpecials(FALLBACK_SPECIALS);
        }
      })
      .catch(() => setSpecials(FALLBACK_SPECIALS));

    // Fetch Chefs
    fetch("http://localhost:5000/api/v1/chefs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && data.data.length > 0) {
          setChefs(data.data);
        } else {
          setChefs(FALLBACK_CHEFS);
        }
      })
      .catch(() => setChefs(FALLBACK_CHEFS));
  }, []);

  // 12-second Chef Cycling
  useEffect(() => {
    const activeChefs = chefs.length > 0 ? chefs : FALLBACK_CHEFS;
    if (activeChefs.length === 0) return;

    const interval = setInterval(() => {
      setChefFade(false);
      setTimeout(() => {
        setCurrentChefIdx((prev) => (prev + 1) % activeChefs.length);
        setChefFade(true);
      }, 600); // 600ms fade transition out
    }, 12000); // 12 seconds

    return () => clearInterval(interval);
  }, [chefs]);

  // Handle Mouse movement inside Top Rated slider to drag/scroll
  const handleSliderMouseMove = (e: React.MouseEvent) => {
    if (!sliderContainerRef.current || !sliderTrackRef.current) return;
    const container = sliderContainerRef.current;
    const track = sliderTrackRef.current;
    const containerRect = container.getBoundingClientRect();
    const trackWidth = track.scrollWidth;
    const containerWidth = containerRect.width;

    if (trackWidth <= containerWidth) return;

    // Calculate mouse position inside container from 0 to 1
    const mouseX = e.clientX - containerRect.left;
    const percentage = Math.max(0, Math.min(1, mouseX / containerWidth));

    // Translate percentage to slide offset: 0% -> 0px, 100% -> -(trackWidth - containerWidth)
    const maxScroll = trackWidth - containerWidth;
    const offset = -percentage * maxScroll;
    setSliderOffset(offset);
  };

  const handleSliderMouseLeave = () => {
    // Return to center when mouse leaves
    if (!sliderContainerRef.current || !sliderTrackRef.current) return;
    const trackWidth = sliderTrackRef.current.scrollWidth;
    const containerWidth = sliderContainerRef.current.getBoundingClientRect().width;
    if (trackWidth > containerWidth) {
      setSliderOffset(-(trackWidth - containerWidth) / 2);
    }
  };

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activeChefs = chefs.length > 0 ? chefs : FALLBACK_CHEFS;
  const currentChef = activeChefs[currentChefIdx];
  const activeSpecials = specials.length > 0 ? specials : FALLBACK_SPECIALS;

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden">
      {/* 1. FLOATING NAVIGATION BAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-6 py-3 shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          {/* Left Side: Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
            <span className="font-extrabold tracking-wider text-sm md:text-base bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent uppercase">
              Slice 'n Spice
            </span>
          </div>

          {/* Middle: Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-white/80">
            <button
              onClick={() => scrollToSection("menu-section")}
              className="hover:text-amber-400 transition-colors duration-200 cursor-pointer"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection("specials-section")}
              className="hover:text-amber-400 transition-colors duration-200 cursor-pointer"
            >
              Specials
            </button>
            <button
              onClick={() => scrollToSection("chef-section")}
              className="hover:text-amber-400 transition-colors duration-200 cursor-pointer"
            >
              Chef Panel
            </button>
            <button
              onClick={() => scrollToSection("footer-section")}
              className="hover:text-amber-400 transition-colors duration-200 cursor-pointer"
            >
              About Us
            </button>
            {user && user.role === 'admin' && (
              <button
                onClick={() => navigate("/admin")}
                className="text-amber-400 hover:text-amber-300 font-bold transition-colors duration-200 cursor-pointer"
              >
                Admin Access
              </button>
            )}
          </div>

          {/* Right Side: Login profile or login button */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div
                className="flex items-center gap-2 border border-white/10 bg-white/5 py-1 px-3 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => navigate("/admin")}
              >
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt="Avatar"
                    className="w-6 h-6 rounded-full object-cover border border-amber-400/50"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    {user.displayName?.charAt(0) || user.email?.charAt(0)}
                  </div>
                )}
                <span className="text-xs font-semibold text-white/90">
                  {user.displayName || user.email.split("@")[0]}
                </span>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/login")}
                className="rounded-full border-amber-400/40 text-white hover:bg-amber-400 hover:text-black font-semibold hover:border-amber-400"
              >
                Login
              </Button>
            )}
          </div>

          {/* Hamburger Icon on Mobile */}
          <button
            className="md:hidden text-white/90 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-white/10 flex flex-col gap-3 pb-2 animate-in slide-in-from-top duration-300">
            <button
              onClick={() => scrollToSection("menu-section")}
              className="text-left py-1 text-white/80 hover:text-amber-400 font-medium"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection("specials-section")}
              className="text-left py-1 text-white/80 hover:text-amber-400 font-medium"
            >
              Specials
            </button>
            <button
              onClick={() => scrollToSection("chef-section")}
              className="text-left py-1 text-white/80 hover:text-amber-400 font-medium"
            >
              Chef Panel
            </button>
            <button
              onClick={() => scrollToSection("footer-section")}
              className="text-left py-1 text-white/80 hover:text-amber-400 font-medium"
            >
              About Us
            </button>
            {user && user.role === 'admin' && (
              <button
                onClick={() => navigate("/admin")}
                className="text-left py-1 text-amber-400 hover:text-amber-300 font-bold"
              >
                Admin Access
              </button>
            )}
            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              {user ? (
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => navigate("/admin")}
                >
                  {user.photo ? (
                    <img
                      src={user.photo}
                      alt="Avatar"
                      className="w-7 h-7 rounded-full border border-amber-400"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                      {user.displayName?.charAt(0) || user.email?.charAt(0)}
                    </div>
                  )}
                  <span className="text-sm font-semibold">{user.displayName || user.email}</span>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/admin/login")}
                  className="w-full rounded-full border-amber-400/40 text-white"
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* 2. HERO SECTION */}
      <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
        {/* Background Image Container with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroBg}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-35 scale-105 filter brightness-[0.7] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-start gap-6 mt-12 md:mt-0 animate-in fade-in duration-1000">
          <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider">
            <Sparkles className="h-3 w-3" />
            Wood-Fired & Artisanal Gastronomy
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight max-w-3xl leading-tight">
            Artisanal Taste, <br />
            <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 bg-clip-text text-transparent">
              Crafted with Fire.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-white/70 max-w-xl leading-relaxed">
            Experience the exquisite harmony of fresh, local ingredients baked in our traditional
            stone hearth. From rich, bubbling cheese margins to smoked heritage cutlets.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
            <Button
              size="lg"
              onClick={() => scrollToSection("menu-section")}
              className="w-full sm:w-auto rounded-full bg-amber-400 hover:bg-amber-500 text-black font-extrabold text-base px-8 shadow-lg shadow-amber-400/25 transition-all hover:scale-105 duration-300"
            >
              Explore Menu
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("specials-section")}
              className="w-full sm:w-auto rounded-full border-white/20 text-white hover:bg-white/5 font-semibold text-base px-8 hover:border-white/40"
            >
              Today's Specials
            </Button>
            {user && user.role === 'admin' && (
              <Button
                size="lg"
                onClick={() => navigate("/admin")}
                className="w-full sm:w-auto rounded-full bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-600 hover:to-amber-500 text-black font-extrabold text-base px-8 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 duration-300"
              >
                Admin Access
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 3. TOP RATED DISHES AUTO-SLIDER SECTION */}
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
          onMouseMove={handleSliderMouseMove}
          onMouseLeave={handleSliderMouseLeave}
          className="w-full overflow-hidden py-4 cursor-ew-resize relative group"
        >
          <div
            ref={sliderTrackRef}
            style={{
              transform: `translateX(${sliderOffset}px)`,
              transition: "transform 0.3s cubic-bezier(0.1, 0.8, 0.25, 1)",
            }}
            className="flex gap-6 px-6 w-max"
          >
            {FAMOUS_DISHES.map((dish) => (
              <div
                key={dish.id}
                className="w-[280px] sm:w-[320px] bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/10 rounded-2xl overflow-hidden hover:border-amber-400/40 transition-all duration-300 flex-shrink-0 group/card"
              >
                {/* Food Image */}
                <div className="h-[200px] overflow-hidden relative">
                  <img
                    src={dish.image}
                    alt={dish.title}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border border-white/15">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold">{dish.rating}</span>
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base sm:text-lg group-hover/card:text-amber-300 transition-colors line-clamp-1">
                      {dish.title}
                    </h3>
                    <span className="text-sm font-bold text-amber-400">${dish.price}</span>
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
      </section>

      {/* 4. TODAY'S SPECIALS COLLAGE / SCATTERED GRID */}
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
          {activeSpecials.map((special, index) => {
            // Apply slight random-like rotations and translations based on item index to achieve organic scattered feel
            const rotationClass =
              index === 0
                ? "md:rotate-[-3deg] md:-translate-y-4 hover:rotate-0"
                : index === 1
                ? "md:rotate-[2deg] md:translate-y-4 hover:rotate-0"
                : index === 2
                ? "md:rotate-[-2deg] md:-translate-y-2 hover:rotate-0"
                : "md:rotate-[3deg] md:translate-y-2 hover:rotate-0";

            const specItem = special.item || special; // support both DB models and fallback flat items

            return (
              <div
                key={special._id || index}
                className={`transition-all duration-300 ease-out transform ${rotationClass} bg-gradient-to-tr from-neutral-950 to-neutral-900 border border-white/10 rounded-xl overflow-hidden hover:scale-105 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-400/5`}
              >
                {specItem.photoUrl && (
                  <div className="h-44 overflow-hidden relative">
                    <img
                      src={specItem.photoUrl}
                      alt={specItem.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-amber-400 text-black px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wide">
                      Chef's Choice
                    </div>
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
      </section>

      {/* 5. CHEF PANEL SECTION WITH 12S ROTATING TRANSITION */}
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

          {currentChef && (
            <div
              className={`transition-all duration-700 ease-in-out ${
                chefFade ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Chef Photo Frame */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative group/photo w-[280px] sm:w-[350px] aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    {currentChef.photoUrl ? (
                      <img
                        src={currentChef.photoUrl}
                        alt={currentChef.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover/photo:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                        <Clock className="h-12 w-12 text-white/20 animate-pulse" />
                      </div>
                    )}
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

                  {/* Cycling indicators */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 pt-6">
                    {activeChefs.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setChefFade(false);
                          setTimeout(() => {
                            setCurrentChefIdx(idx);
                            setChefFade(true);
                          }, 300);
                        }}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentChefIdx ? "w-8 bg-amber-400" : "w-2 bg-white/20"
                        }`}
                      />
                    ))}
                    <span className="text-[10px] text-white/40 ml-2">Updates every 12s</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 6. REGULAR FOOTER */}
      <footer id="footer-section" className="bg-neutral-950 pt-20 pb-10 border-t border-white/5 text-white/70">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
          {/* Logo & Description */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent uppercase">
                Slice 'n Spice
              </span>
            </div>
            <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-sm">
              Slice 'n Spice combines heritage cooking techniques, hand-stretched sourdough, and open
              flames to yield the perfect wood-fired dining experience.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black transition-colors">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black transition-colors">
                <FacebookIcon className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black transition-colors">
                <TwitterIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white text-xs uppercase tracking-widest font-bold">Quick Navigation</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button onClick={() => scrollToSection("menu-section")} className="hover:text-amber-400 transition-colors">
                  Our Menu
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("specials-section")} className="hover:text-amber-400 transition-colors">
                  Today's Specials
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("chef-section")} className="hover:text-amber-400 transition-colors">
                  Chef Panel
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/admin/login")} className="hover:text-amber-400 transition-colors">
                  Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="md:col-span-4 space-y-4 text-xs sm:text-sm">
            <h4 className="text-white text-xs uppercase tracking-widest font-bold">Restaurant Location</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-white/60">104 Woodfired Alley, Gastronomy Plaza, NY 10013</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-white/60">+1 (555) 492-9102</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
                <span className="text-white/60">reservations@slicenspice.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="max-w-6xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} Slice 'n Spice. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
