import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function ProtectedRoute() {
  const { user, loading, logout } = useAuth();
  
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error("Access denied. You do not have administrator privileges.", {
        toastId: "admin-access-denied"
      });
      logout();
    }
  }, [user, logout]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-xl animate-pulse">Checking credentials...</p>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    // If not logged in or not admin, redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  // If logged in as admin, render child routes (the dashboard)
  return <Outlet />;
}
