import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import logo from "../../assets/logo.png";
import heroBg from "../../assets/hero_bg.png";

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
    window.location.href = `http://localhost:5000/api/v1/auth/google?keepLoggedIn=${duration}`;
  };

  return (
    <div className="relative min-h-screen text-white flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image Container with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-20 filter brightness-[0.7] contrast-[1.05]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/90 to-neutral-950"></div>
      </div>

      <Card className="w-full max-w-md relative z-10 bg-black/40 backdrop-blur-xl border border-white/10 text-white shadow-2xl rounded-3xl overflow-hidden">
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
            Admin Login
          </CardTitle>
          <CardDescription className="text-white/60">
            Securely sign in using your Google account to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-6 relative z-20">
          <div className="flex items-center justify-between py-2 border-y border-white/10">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="remember-me" className="text-sm font-semibold cursor-pointer text-white">
                Remember Me
              </Label>
              <span className="text-xs text-white/50">
                Keep me logged in for {rememberMe ? "30 days" : "7 days"}
              </span>
            </div>
            <button
              id="remember-me"
              type="button"
              role="switch"
              aria-checked={rememberMe}
              onClick={() => setRememberMe(!rememberMe)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                rememberMe ? "bg-amber-400" : "bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                  rememberMe ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
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
