
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingSurvey from "@/components/onboarding/OnboardingSurvey";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const OnboardingPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        if (!session) {
          // If not authenticated, redirect to auth page
          navigate("/");
          return;
        }
        
        // Check if onboarding is already completed
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();
        
        if (profileError) {
          throw profileError;
        }
        
        if (profileData && profileData.onboarding_completed) {
          // If onboarding is completed, redirect to dashboard
          navigate("/dashboard");
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setError("Failed to check onboarding status. Please try again.");
        setLoading(false);
      }
    };
    
    // Add a timeout to prevent infinite loading if supabase is slow to respond
    const timeoutId = setTimeout(() => {
      if (loading) {
        setLoading(false);
        setError("Connection timed out. Please try refreshing the page.");
      }
    }, 8000); // 8 second timeout
    
    checkAuth();
    
    // Clear timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, [navigate]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-confidence-50 to-white">
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-confidence-600 animate-spin" />
          <p className="mt-4 text-confidence-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-confidence-50 to-white p-4">
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
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-confidence-50 to-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-confidence-900">Let's Get Started</h1>
        <p className="text-confidence-700 mt-2">Help us personalize your confidence journey</p>
      </div>
      
      <OnboardingSurvey />
    </div>
  );
};

export default OnboardingPage;
