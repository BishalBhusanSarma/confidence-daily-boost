
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import Leaderboard from "@/components/leaderboard/Leaderboard";
import { supabase } from "@/integrations/supabase/client";

const LeaderboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/");
      } else {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-confidence-600"></div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-confidence-900 mb-6">Leaderboard</h1>
        <Leaderboard />
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
