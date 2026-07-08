import { useNavigate, useLocation } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import logo from '@/assets/logo.png';

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

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
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
    <footer id="footer-section" className="bg-neutral-950 pt-20 pb-10 border-t border-white/5 text-white/70">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/5">
        {/* Logo & Description */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {
            if (location.pathname !== "/") {
              navigate("/");
            } else {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}>
            <img src={logo} alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-extrabold tracking-wider text-sm bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent uppercase">
              Slice 'n Spice
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/50 leading-relaxed max-w-sm">
            Slice 'n Spice combines heritage cooking techniques, hand-stretched sourdough, and open
            flames to yield the perfect wood-fired dining experience.
            <br/><br/>
            <span className="text-amber-400 font-semibold uppercase tracking-wider">We cater for parties & events!</span>
          </p>
          <div className="flex items-center gap-3 pt-2">
            <a href="https://www.instagram.com/caribbeanslicenspice?igsh=dGk2dW9iYzhuN3Y2" target="_blank" rel="noopener noreferrer" title="@caribbeanslicenspice" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black transition-colors">
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a href="https://www.facebook.com/caribbeanslicenspice" target="_blank" rel="noopener noreferrer" title="@caribbeanslicenspice" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-amber-400 hover:text-black transition-colors">
              <FacebookIcon className="h-4 w-4" />
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

          </ul>
        </div>

        {/* Contact Details */}
        <div className="md:col-span-4 space-y-4 text-xs sm:text-sm">
          <h4 className="text-white text-xs uppercase tracking-widest font-bold">Restaurant Location</h4>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-white/60">Barnet, London</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-white/60">+44 7930 633017</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <span className="text-white/60">caribbeanslicenspice@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="max-w-6xl mx-auto px-6 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
        <p>© {new Date().getFullYear()} Slice 'n Spice. All rights reserved.</p>
        <div className="flex gap-4">
          <button onClick={() => navigate("/privacy")} className="hover:text-amber-400 transition-colors">Privacy Policy</button>
          <button onClick={() => navigate("/terms")} className="hover:text-amber-400 transition-colors">Terms of Service</button>
        </div>
      </div>
    </footer>
  );
}
