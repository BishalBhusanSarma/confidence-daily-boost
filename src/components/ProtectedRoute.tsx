
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const checkAuth = async () => {
    try {
      setIsCheckingAuth(true);
      setError(null);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth check error:", error);
        setError("Authentication check failed. Please try again.");
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }
      
      setIsAuthenticated(!!data.session);
      setIsCheckingAuth(false);
    } catch (error) {
      console.error("Auth check error:", error);
      setError("Authentication check failed. Please try again.");
      setIsAuthenticated(false);
      setIsCheckingAuth(false);
    }
  };
  
  useEffect(() => {
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
        setError("Authentication check timed out. Please try again.");
      }
    }, 2000); // Even shorter timeout (2 seconds)
    
    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [isRetrying]); // Added isRetrying to dependencies to allow manual retry
  
  const handleRetry = () => {
    setIsRetrying(!isRetrying); // Toggle to trigger the useEffect again
  };
  
  // Show error with retry button if there's an error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-confidence-50 to-white p-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button 
            onClick={handleRetry} 
            className="px-4 py-2 bg-confidence-600 text-white rounded-md hover:bg-confidence-700 transition-colors"
            disabled={isCheckingAuth}
          >
            {isCheckingAuth ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isCheckingAuth ? "Trying again..." : "Try Again"}
          </Button>
        </div>
      </div>
    );
  }
  
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
