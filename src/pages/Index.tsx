
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Check if user is already logged in
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Auth session check error:", error);
          setError("Failed to check authentication. Please refresh the page.");
          setIsLoading(false);
          return;
        }
        
        if (data.session) {
          // If logged in, check onboarding status
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', data.session.user.id)
            .single();
            
          if (profileError) {
            console.error("Profile check error:", profileError);
            setError("Failed to fetch your profile. Please refresh the page.");
            setIsLoading(false);
            return;
          }
            
          if (profileData && !profileData.onboarding_completed) {
            navigate('/onboarding');
          } else {
            navigate('/dashboard');
          }
        } else {
          // If not logged in, go to auth page
          navigate('/auth');
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred. Please refresh the page.");
        setIsLoading(false);
      }
    };
    
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (isLoading) {
        console.error("Auth check timeout reached");
        setError("Connection timeout. Please refresh the page.");
        setIsLoading(false);
      }
    }, 5000);
    
    checkAuthAndRedirect();
    
    return () => clearTimeout(timeoutId);
  }, [navigate]);
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-confidence-50 to-white p-4">
        <div className="text-center max-w-md">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-confidence-600 text-white rounded-md hover:bg-confidence-700 transition-colors"
          >
            Refresh Page
          </button>
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
