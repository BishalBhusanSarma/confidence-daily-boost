
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingSurvey from "@/components/onboarding/OnboardingSurvey";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const OnboardingPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // If not authenticated, redirect to auth page
          navigate("/");
          return;
        }
        
        // Check if onboarding is already completed
        const { data: profileData } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', session.user.id)
          .single();
        
        if (profileData && profileData.onboarding_completed) {
          // If onboarding is completed, redirect to dashboard
          navigate("/dashboard");
          return;
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        navigate("/");
      }
    };
    
    checkAuth();
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
