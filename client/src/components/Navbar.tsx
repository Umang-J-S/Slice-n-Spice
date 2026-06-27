import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import logo from "../assets/logo.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: id } });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <nav className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-5xl border border-white/10 backdrop-blur-md px-6 py-3 shadow-2xl transition-colors duration-300 ${mobileMenuOpen ? 'rounded-2xl bg-black/90' : 'rounded-full bg-black/40'}`}>
      <div className="flex items-center justify-between">
        {/* Left Side: Logo */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { navigate("/"); window.scrollTo(0, 0); }}>
          <img src={logo} alt="Logo" className="w-9 h-9 object-contain" />
          <span className="font-extrabold tracking-wider text-sm md:text-base bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent uppercase">
            Slice 'n Spice
          </span>
        </div>

        {/* Middle: Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide text-white">
          <button
            onClick={() => { navigate("/"); window.scrollTo(0, 0); }}
            className="hover:text-amber-400 transition-colors duration-200 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => { navigate("/menu"); window.scrollTo(0, 0); }}
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
            <div className="flex items-center gap-3">
              <div
                className="flex items-center gap-2 border border-white/10 bg-white/5 py-1 px-3 rounded-full cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => navigate("/admin")}
                title="Go to Admin Dashboard"
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
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logout()}
                className="text-white/60 hover:text-white hover:bg-white/10 rounded-full h-8 px-3"
              >
                Logout
              </Button>
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
            onClick={() => { setMobileMenuOpen(false); navigate("/"); window.scrollTo(0, 0); }}
            className="text-left py-1 text-white hover:text-amber-400 font-bold"
          >
            Home
          </button>
          <button
            onClick={() => { setMobileMenuOpen(false); navigate("/menu"); window.scrollTo(0, 0); }}
            className="text-left py-1 text-white hover:text-amber-400 font-bold"
          >
            Menu
          </button>
          <button
            onClick={() => scrollToSection("specials-section")}
            className="text-left py-1 text-white hover:text-amber-400 font-bold"
          >
            Specials
          </button>
          <button
            onClick={() => scrollToSection("chef-section")}
            className="text-left py-1 text-white hover:text-amber-400 font-bold"
          >
            Chef Panel
          </button>
          <button
            onClick={() => scrollToSection("footer-section")}
            className="text-left py-1 text-white hover:text-amber-400 font-bold"
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
          <div className="pt-2 border-t border-white/10 flex flex-col gap-3">
            {user ? (
              <div className="flex items-center justify-between">
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="text-white/60 hover:text-red-400 hover:bg-red-400/10"
                >
                  Logout
                </Button>
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
  );
}
