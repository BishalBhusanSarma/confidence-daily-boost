
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      // Check if user is already logged in
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        // If logged in, check onboarding status
        const { data: profileData } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', data.session.user.id)
          .single();
          
        if (profileData && !profileData.onboarding_completed) {
          navigate('/onboarding');
        } else {
          navigate('/dashboard');
        }
      } else {
        // If not logged in, go to auth page
        navigate('/auth');
      }
    };
    
    checkAuthAndRedirect();
  }, [navigate]);
  
  // Return null since we're immediately navigating
  return null;
};

export default Index;
