
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = "/auth" 
}: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth check error:", error);
          setIsAuthenticated(false);
          setIsCheckingAuth(false);
          return;
        }
        
        setIsAuthenticated(!!data.session);
        setIsCheckingAuth(false);
      } catch (error) {
        console.error("Auth check error:", error);
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
      }
    };
    
    // First check auth directly
    checkAuth();
    
    // Then set up auth state listener for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Using a synchronous update to prevent circular invocations
        setIsAuthenticated(!!session);
        setIsCheckingAuth(false);
      }
    );
    
    // Add a shorter timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isCheckingAuth) {
        console.log("Auth check timeout reached");
        setIsCheckingAuth(false);
        setIsAuthenticated(false);
      }
    }, 3000);
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Show loading while checking authentication, but limit to a few seconds max
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-confidence-50 to-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 text-confidence-600 animate-spin" />
          <p className="mt-4 text-confidence-800 font-medium">Verifying authentication...</p>
        </div>
      </div>
    );
  }
  
  // Redirect if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }
  
  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;
