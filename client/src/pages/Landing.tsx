import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { menuApi } from '../api';

// Components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import HeroSection from "../components/landing/HeroSection";
import TopRatedSection from "../components/landing/TopRatedSection";
import SpecialsSection from "../components/landing/SpecialsSection";
import ChefPanelSection from "../components/landing/ChefPanelSection";

/**
 * Landing Page Container Component
 * 
 * Experience Level Comment:
 * - This component acts purely as a "Smart Component" or Container. 
 *   Its main responsibilities are:
 *   1. Fetching data (Specials, Chefs, Famous Dishes) asynchronously on mount.
 *   2. Passing this data down to "Dumb" presentation components via props.
 * - This separation of concerns (Logic vs UI) vastly improves readability, 
 *   makes the codebase modular, and prevents unnecessary re-renders across disjointed sections.
 */
export default function Landing() {
  const { user } = useAuth();

  const { data: specialsRes, isLoading: isLoadingSpecials, refetch: refetchSpecials } = useQuery({ 
    queryKey: ['specials'], 
    queryFn: menuApi.getSpecials 
  });
  
  const { data: chefsRes, isLoading: isLoadingChefs } = useQuery({ 
    queryKey: ['chefs'], 
    queryFn: menuApi.getChefs 
  });
  
  const { data: topRatedRes, isLoading: isLoadingTopRated, refetch: refetchTopRated } = useQuery({ 
    queryKey: ['top-rated'], 
    queryFn: menuApi.getTopRated 
  });

  const specials = specialsRes?.data || [];
  const chefs = chefsRes?.data || [];
  const famousDishes = topRatedRes?.data || [];
  const isLoading = isLoadingSpecials || isLoadingChefs || isLoadingTopRated;

  // Provide a refetch function to child components to trigger updates if they delete/modify
  const fetchData = () => {
    refetchSpecials();
    refetchTopRated();
  };

  const location = useLocation();

  // Handle scrolling when navigating from another page with a target section in state
  useEffect(() => {
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
      // Clean up the state so it doesn't scroll again on re-renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  /**
   * Smooth scroll helper function passed down to the HeroSection 
   * so buttons can elegantly scroll users to specific page sections.
   */
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden flex flex-col relative">
      <Helmet>
        <title>Slice 'n Spice | Premium Cloud Kitchen</title>
        <meta name="description" content="Experience the finest wood-fired pizzas and gourmet specials in London. Order fresh, premium meals from our expert chefs right to your door." />
      </Helmet>

      {/* Decorative gradient overlay */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-900/10 via-black to-black opacity-60 z-0"></div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section with the Halal badge */}
      <HeroSection user={user} scrollToSection={scrollToSection} />

      {/* Interactive Top Rated Dishes Slider */}
      <TopRatedSection famousDishes={famousDishes} isLoading={isLoading} user={user} refreshMenu={fetchData} />

      {/* Today's Specials scattered grid layout */}
      <SpecialsSection activeSpecials={specials} isLoading={isLoading} user={user} refreshMenu={fetchData} />

      {/* Rotating 12-second Chef profiles */}
      <ChefPanelSection chefs={chefs} isLoading={isLoading} />

      {/* Standard Footer */}
      <Footer />
    </div>
  );
}
