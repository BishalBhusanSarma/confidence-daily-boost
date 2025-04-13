
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = "/" 
}: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
  useEffect(() => {
    // In a real app, we would check Supabase authentication status
    const authStatus = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authStatus);
  }, []);
  
  // Show nothing while checking authentication
  if (isAuthenticated === null) {
    return null;
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
