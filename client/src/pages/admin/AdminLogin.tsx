import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import logo from "../../assets/logo.png";
import HeroSection from "../../components/landing/HeroSection";
import Navbar from "../../components/Navbar";

export default function AdminLogin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [rememberMe, setRememberMe] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl animate-pulse">Loading...</p>
      </div>
    );
  }

  // If already logged in, redirect to main landing page
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleGoogleLogin = () => {
    const duration = rememberMe ? "30" : "7";
    // Redirect to the backend Google OAuth endpoint
    const apiUrl = import.meta.env.VITE_API_URL || '';
    window.location.href = `${apiUrl}/api/v1/auth/google?keepLoggedIn=${duration}`;
  };

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Blurred Landing Page Background (Navbar + Hero) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none bg-black">
        <div className="w-full h-full filter blur-[12px] brightness-[0.5] transform scale-[1.02] origin-center">
          <Navbar />
          <HeroSection user={null} scrollToSection={() => {}} disableAnimation={true} />
        </div>
      </div>

      <Card className="w-full max-w-lg relative z-10 bg-black/40 backdrop-blur-[32px] border border-white/20 text-white shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden">
        {/* Subtle glass glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/10 to-transparent pointer-events-none"></div>

        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer z-50"
          aria-label="Back to Home"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <CardHeader className="space-y-1 text-center flex flex-col items-center pt-10 relative z-20">
          <img src={logo} alt="Slice 'n Spice Logo" className="w-40 h-auto mb-4 drop-shadow-lg" />
          <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">
            Login
          </CardTitle>
          <CardDescription className="text-white/60">
            Securely sign in using your Google account to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-6 relative z-20">
          <div className="flex items-center justify-between py-4 border-y border-white/10">
            <div className="flex flex-col space-y-1">
              <Label className="text-sm font-semibold text-white">
                Session Duration
              </Label>
              <span className="text-xs text-white/50">
                Keep logged in for {rememberMe ? "30 days" : "7 days"}.
              </span>
            </div>
            
            {/* Animated Pill Toggle */}
            <div className="relative flex p-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10 shadow-inner w-40 shrink-0">
              {/* Sliding Thumb */}
              <div 
                className={`absolute inset-y-1 w-[calc(50%-4px)] bg-gradient-to-r from-amber-400 to-amber-300 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.6)] transition-all duration-300 ease-out ${
                  rememberMe ? 'left-[calc(50%+2px)]' : 'left-1'
                }`}
              />
              
              <button
                type="button"
                onClick={() => setRememberMe(false)}
                className={`relative z-10 w-1/2 py-2 text-[11px] font-black uppercase tracking-wider transition-colors duration-300 ${
                  !rememberMe ? 'text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                type="button"
                onClick={() => setRememberMe(true)}
                className={`relative z-10 w-1/2 py-2 text-[11px] font-black uppercase tracking-wider transition-colors duration-300 ${
                  rememberMe ? 'text-black' : 'text-white/60 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          <Button size="lg" onClick={handleGoogleLogin} className="w-full text-lg bg-white text-black hover:bg-gray-100 font-bold border border-white/20 shadow-xl transition-all hover:scale-105 duration-300">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
