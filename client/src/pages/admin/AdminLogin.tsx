import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import logo from "../../assets/logo.png";

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
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <Card className="w-full max-w-md relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Back to Home"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <CardHeader className="space-y-1 text-center flex flex-col items-center pt-10">
          <img src={logo} alt="Slice 'n Spice Logo" className="w-40 h-auto mb-4" />
          <CardTitle className="text-3xl font-bold">Admin Login</CardTitle>
          <CardDescription>
            Securely sign in using your Google account to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 py-6">
          <div className="flex items-center justify-between py-2 border-y border-border/50">
            <div className="flex flex-col space-y-1">
              <Label htmlFor="remember-me" className="text-sm font-semibold cursor-pointer">
                Remember Me
              </Label>
              <span className="text-xs text-muted-foreground">
                Keep me logged in for {rememberMe ? "30 days" : "7 days"}
              </span>
            </div>
            <button
              id="remember-me"
              type="button"
              role="switch"
              aria-checked={rememberMe}
              onClick={() => setRememberMe(!rememberMe)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                rememberMe ? "bg-primary" : "bg-muted"
              }`}
            >
              <span
                className={`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ease-in-out ${
                  rememberMe ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <Button size="lg" onClick={handleGoogleLogin} className="w-full text-lg">
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
