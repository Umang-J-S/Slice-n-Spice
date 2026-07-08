import { Link, useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChefHat, Home, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NotFound() {
  const error = useRouteError();
  
  let errorMessage = "The page you're looking for seems to have gone missing or an error occurred.";
  let errorCode = "404";
  let errorTitle = "Page Not Found";

  if (isRouteErrorResponse(error)) {
    errorCode = error.status.toString();
    errorTitle = error.statusText;
    if (error.status === 404) {
      errorMessage = "We couldn't find the page you were looking for. It might have been moved or doesn't exist.";
    } else {
      errorMessage = error.data?.message || errorMessage;
    }
  } else if (error instanceof Error) {
    errorCode = "Oops!";
    errorTitle = "Something went wrong";
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col font-sans text-white">
      <Helmet>
        <title>{errorCode} {errorTitle} | Slice 'n Spice</title>
      </Helmet>
      
      <Navbar />

      <main className="flex-grow flex items-center justify-center relative overflow-hidden pt-24 pb-12">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-700/10 rounded-full blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="max-w-3xl mx-auto px-6 w-full z-10 text-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden group">
            {/* Glossy reflection effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="flex justify-center mb-8">
              <div className="relative">
                <ChefHat className="w-24 h-24 text-amber-500/80 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" />
                <div className="absolute -bottom-2 -right-2 bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded-md border border-red-500/30 backdrop-blur-md">
                  Error
                </div>
              </div>
            </div>
            
            <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 mb-2 drop-shadow-sm">
              {errorCode}
            </h1>
            
            <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-6 tracking-tight">
              {errorTitle}
            </h2>
            
            <p className="text-white/60 text-lg md:text-xl max-w-lg mx-auto mb-10 leading-relaxed">
              {errorMessage}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold transition-all duration-300 hover:scale-[1.02]"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </button>
              
              <Link 
                to="/"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-black font-bold shadow-lg shadow-amber-500/20 transition-all duration-300 hover:scale-[1.02]"
              >
                <Home className="w-5 h-5" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
