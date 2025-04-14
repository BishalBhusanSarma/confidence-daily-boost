
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // First get session data to check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (session) {
          // User is authenticated, now check if onboarding is completed
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single();
          
          if (profileError) {
            throw profileError;
          }
          
          if (profileData && profileData.onboarding_completed) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
        } else {
          // User is not authenticated, navigate to auth page
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        setError("Failed to check authentication status. Please try refreshing the page.");
        // Still navigate to auth page in case of error
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    // Add a timeout to prevent infinite loading if supabase is slow to respond
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Connection timed out. Please try refreshing the page.");
        navigate("/");
      }
    }, 8000); // 8 second timeout
    
    checkAuthAndNavigate();
    
    // Clear timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-confidence-50 to-white">
      {loading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-confidence-600 animate-spin" />
          <p className="mt-4 text-confidence-800 font-medium">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center text-center max-w-md px-4">
          <p className="text-red-600 font-medium mb-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-confidence-600 text-white rounded-md hover:bg-confidence-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default Index;
