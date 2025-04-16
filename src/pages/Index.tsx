
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Immediately navigate to auth page
    navigate("/auth");
    
    // No need to check auth status here as we'll do that in ProtectedRoute
    // and the Auth page will handle redirection if the user is already logged in
  }, [navigate]);
  
  // Return null since we're immediately navigating
  return null;
};

export default Index;
