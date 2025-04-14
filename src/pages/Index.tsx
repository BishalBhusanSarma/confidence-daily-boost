
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated, check onboarding status
          const { data: profileData } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single();
          
          if (profileData?.onboarding_completed) {
            navigate("/dashboard");
          } else {
            navigate("/onboarding");
          }
        } else {
          // User is not authenticated, navigate to auth page
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error checking authentication status:", error);
        // Navigate to auth page in case of error
        navigate("/auth");
      }
    };
    
    // Immediately navigate to auth page
    navigate("/auth");
    
    // Check auth status in the background
    checkAuthAndNavigate();
  }, [navigate]);
  
  // Return null since we're immediately navigating
  return null;
};

export default Index;

