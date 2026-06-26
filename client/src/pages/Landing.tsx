import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

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
      fetch("http://localhost:5000/api/v1/menu/specials").then(res => res.json()),
      fetch("http://localhost:5000/api/v1/chefs").then(res => res.json()),
      fetch("http://localhost:5000/api/v1/menu/full").then(res => res.json())
    ])
    .then(([specialsData, chefsData, menuData]) => {
      if (specialsData.success && specialsData.data) setSpecials(specialsData.data);
      if (chefsData.success && chefsData.data) setChefs(chefsData.data);
      if (menuData.success && menuData.data) {
        const allItems = menuData.data.flatMap((cat: any) => cat.items || []);
        setFamousDishes(allItems.slice(0, 8));
      }
    })
    .catch((err) => console.error("Error fetching landing data:", err))
    .finally(() => {
      setIsLoading(false);
    });
  };

  // Fetch data on initial mount
  useEffect(() => {
    fetchData();
  }, []);

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
    <div className="min-h-screen bg-black text-white font-sans antialiased overflow-x-hidden">
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
