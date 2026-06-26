import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Assets
import heroBg from '../../assets/hero_bg.png';
import halalLogo from '../../assets/halal_badge.png'; // Using the transparent PNG logo

interface HeroSectionProps {
  user: any; // We receive user from the parent component
  scrollToSection: (id: string) => void;
}

/**
 * HeroSection Component
 * 
 * Renders the top-most part of the landing page containing the main CTA,
 * background image, and the 100% Halal certification badge.
 * 
 * Experience Level Comment:
 * - We use tailwind CSS `animate-in fade-in` for smooth load animations on mount.
 * - `relative` positioning on the <section> is crucial here so absolute elements 
 *   (like the background container and Halal badge) are confined to its dimensions.
 */
export default function HeroSection({ user, scrollToSection }: HeroSectionProps) {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center bg-black overflow-hidden">
      {/* Background Image Container with Overlay */}
      {/* We use absolute inset-0 to stretch across the whole section and z-0 to sit behind the text content */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-35 scale-105 filter brightness-[0.7] contrast-[1.05]"
        />
        {/* Gradient overlays add depth, blending the image into the black page background and making text readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-20 flex flex-col items-start gap-6 mt-12 md:mt-0 animate-in fade-in duration-1000">
        <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-300 text-xs px-3 py-1 rounded-full font-normal uppercase tracking-wider">
          <Sparkles className="h-3 w-3" />
          Premium Cloud Kitchen
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight max-w-3xl leading-tight">
          Delicious Food, <br />
          <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-200 bg-clip-text text-transparent font-['Dancing_Script'] font-normal pb-2 inline-block">
            Made Fresh Every Day.
          </span>
        </h1>

        <p className="text-base sm:text-xl text-white/70 max-w-xl leading-relaxed">
          Your favorite meals, prepared with care and delivered straight from our <span className="text-amber-300 font-['Dancing_Script'] font-normal px-1">cloud kitchen</span>. Enjoy <span className="text-amber-300 font-['Dancing_Script'] font-normal px-1">hassle-free takeaway</span>, <span className="text-amber-300 font-['Dancing_Script'] font-normal px-1">fast delivery</span>, and <span className="text-amber-300 font-['Dancing_Script'] font-normal px-1">catering for events of all sizes</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
          <Button
            size="lg"
            onClick={() => {
              navigate("/menu");
              window.scrollTo(0, 0);
            }}
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

      {/* Halal Badge Component */}
      {/* Absolute positioning pushes this element to the top right of the section */}
      <div className="absolute top-20 sm:top-28 md:top-36 right-4 sm:right-6 md:right-16 lg:right-24 xl:right-32 z-20 animate-in fade-in zoom-in-75 duration-1000 delay-300">
        <img 
          src={halalLogo} 
          alt="100% Halal Certified - Genuine Halal Food" 
          className="w-20 sm:w-28 md:w-36 lg:w-44 object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] hover:scale-105 transition-transform duration-500 cursor-pointer" 
        />
      </div>
    </section>
  );
}
