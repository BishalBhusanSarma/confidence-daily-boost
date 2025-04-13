
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // First get session data to check if user is authenticated
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User is authenticated, now check if onboarding is completed
          const { data: profileData } = await supabase
            .from('profiles')
            .select('onboarding_completed')
            .eq('id', session.user.id)
            .single();
          
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
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthAndNavigate();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-confidence-50 to-white">
      {loading ? (
        <div className="flex flex-col items-center">
          <Loader2 className="h-16 w-16 text-confidence-600 animate-spin" />
          <p className="mt-4 text-confidence-800 font-medium">Loading...</p>
        </div>
      ) : null}
    </div>
  );
};

export default Index;
