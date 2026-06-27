import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Helmet } from 'react-helmet-async';

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

  // State Management for our three main data models
  const [specials, setSpecials] = useState<any[]>([]);
  const [chefs, setChefs] = useState<any[]>([]);
  const [famousDishes, setFamousDishes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Extract fetch logic into a reusable function so child components can trigger a refresh after editing/deleting
  const fetchData = () => {
    setIsLoading(true);
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/menu/specials`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/chefs`).then(res => res.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/v1/menu/top-rated`).then(res => res.json())
    ])
    .then(([specialsData, chefsData, topRatedData]) => {
      if (specialsData.success && specialsData.data) setSpecials(specialsData.data);
      if (chefsData.success && chefsData.data) setChefs(chefsData.data);
      if (topRatedData.success && topRatedData.data) {
        setFamousDishes(topRatedData.data);
      }
    })
    .catch((err) => console.error("Error fetching landing data:", err))
    .finally(() => {
      setIsLoading(false);
    });
  };

  const location = useLocation();

  // Fetch data on initial mount
  useEffect(() => {
    fetchData();
  }, []);

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
