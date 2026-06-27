import React, { useState, useEffect } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Fast 0-100% counter (takes about 1.5 seconds)
    const duration = 1500; // ms
    const intervalTime = 30; // ms
    const increment = (100 / (duration / intervalTime));

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + increment;
        if (next >= 100) {
          clearInterval(timer);
          return 100;
        }
        return next;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => setFading(true), 300); // Wait a tiny bit at 100%
      setTimeout(onComplete, 800); // 500ms fade duration + 300ms wait
    }
  }, [progress, onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/30 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Chicken Leg SVG Animation */}
        <div className="w-48 h-48 mb-2 relative drop-shadow-2xl hover:scale-105 transition-transform duration-300">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl filter">
            <defs>
              <mask id="bite-mask">
                <rect x="0" y="0" width="100" height="100" fill="white" />
                
                {/* Bite 1: Top Right */}
                {progress >= 25 && (
                  <g fill="black">
                    <circle cx="58" cy="28" r="10" />
                    <circle cx="50" cy="32" r="9" />
                    <circle cx="62" cy="38" r="9" />
                  </g>
                )}
                
                {/* Bite 2: Bottom Center */}
                {progress >= 50 && (
                  <g fill="black">
                    <circle cx="40" cy="72" r="11" />
                    <circle cx="28" cy="68" r="9" />
                    <circle cx="52" cy="65" r="9" />
                  </g>
                )}
                
                {/* Bite 3: Front Left */}
                {progress >= 75 && (
                  <g fill="black">
                    <circle cx="15" cy="50" r="12" />
                    <circle cx="22" cy="36" r="10" />
                    <circle cx="22" cy="64" r="10" />
                    <circle cx="28" cy="50" r="10" />
                  </g>
                )}
                
                {/* Bite 4: Clean bone */}
                {progress >= 95 && <rect x="0" y="0" width="100" height="100" fill="black" />}
              </mask>
            </defs>

            <g transform="rotate(-20 50 50)">
              {/* BONE */}
              <path 
                d="M 40 44 L 70 44 C 75 30, 92 35, 80 50 C 92 65, 75 70, 70 56 L 40 56 A 6 6 0 0 1 40 44 Z" 
                fill="#f8fafc" 
                stroke="#cbd5e1"
                strokeWidth="1"
              />
              
              {/* BONE DETAIL / SHADOW */}
              <path 
                d="M 80 50 C 88 62, 76 68, 70 56" 
                stroke="#e2e8f0" 
                strokeWidth="2.5" 
                strokeLinecap="round"
                fill="none" 
              />
              <line x1="45" y1="53" x2="65" y2="53" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />

              {/* MEAT */}
              <g mask="url(#bite-mask)">
                <path 
                  d="M 40 25 
                     C 55 25, 60 35, 65 40 
                     L 65 60 
                     C 60 65, 55 75, 40 75 
                     A 25 25 0 0 1 40 25 Z" 
                  fill="#ea580c" 
                  stroke="#9a3412"
                  strokeWidth="2"
                />
                
                {/* MEAT HIGHLIGHT */}
                <path
                  d="M 40 30 C 50 30, 55 36, 60 40"
                  stroke="#fdba74"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.8"
                />
                
                {/* MEAT TEXTURE / CRISPY DOTS */}
                <circle cx="30" cy="40" r="2" fill="#9a3412" opacity="0.6" />
                <circle cx="25" cy="55" r="2.5" fill="#9a3412" opacity="0.6" />
                <circle cx="45" cy="60" r="2" fill="#9a3412" opacity="0.6" />
                <circle cx="35" cy="65" r="2.5" fill="#9a3412" opacity="0.6" />
                <circle cx="20" cy="45" r="1.5" fill="#9a3412" opacity="0.6" />
                <circle cx="50" cy="45" r="1.5" fill="#9a3412" opacity="0.6" />
              </g>
            </g>
          </svg>
        </div>
        
        <h2 className="text-white font-extrabold uppercase tracking-widest text-sm animate-pulse mt-8 drop-shadow-md bg-black/40 px-4 py-1 rounded-full">
          Preparing your meal
        </h2>
        
        {/* Halal Branding Badge */}
        <div className="mt-5 flex items-center gap-2 bg-emerald-600 border border-emerald-400 px-5 py-2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-white font-extrabold text-sm uppercase tracking-wide">100% Halal Certified</span>
        </div>
      </div>
    </div>
  );
}
