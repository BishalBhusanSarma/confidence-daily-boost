
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  
  const checkAuthAndRedirect = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Check if user is already logged in
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Auth session check error:", error);
        setError("Failed to check authentication. Please try again.");
        setIsLoading(false);
        return;
      }
      
      if (data.session) {
        // User is logged in
        navigate('/dashboard');
      } else {
        // If not logged in, go to auth page
        navigate('/auth');
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    // Check auth on component mount
    checkAuthAndRedirect();
    
    // Add a shorter timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.error("Auth check timeout reached");
        setError("Connection timeout. Please try again.");
        setIsLoading(false);
      }
    }, 3000); // Reduced timeout to 3 seconds
    
    return () => clearTimeout(timeoutId);
  }, [navigate, isRetrying]); // Added isRetrying to dependencies to trigger a re-check
  
  const handleRetry = () => {
    setIsRetrying(!isRetrying); // Toggle to trigger useEffect again
  };
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-confidence-50 to-white p-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <Button 
            onClick={handleRetry} 
            className="px-4 py-2 bg-confidence-600 text-white rounded-md hover:bg-confidence-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            {isLoading ? "Trying again..." : "Try Again"}
          </Button>
        </div>
      </div>
    );
  }
  
  // Show loading spinner while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-confidence-50 to-white">
      <div className="flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-confidence-600 animate-spin" />
        <p className="mt-4 text-confidence-800 font-medium">Checking authentication...</p>
      </div>
    </div>
  );
};

export default Index;
