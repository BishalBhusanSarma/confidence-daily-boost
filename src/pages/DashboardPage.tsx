
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import TaskList from "@/components/dashboard/TaskList";
import PointsDisplay from "@/components/dashboard/PointsDisplay";
import MotivationalTip from "@/components/dashboard/MotivationalTip";
import { supabase } from "@/integrations/supabase/client";
import NotificationService from "@/services/NotificationService";
import { useToast } from "@/components/ui/use-toast";
import { useDashboardTasks } from "@/hooks/useDashboardTasks";

interface DashboardPageProps {
  userName?: string;
}

const DashboardPage = ({ userName = "" }: DashboardPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userProfession, setUserProfession] = useState("other");
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { tasks, fetchTasks, completeTask } = useDashboardTasks(userId, userProfession);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/auth");
          return;
        }
        
        setUserId(session.user.id);
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('points, streak, onboarding_completed')
          .eq('id', session.user.id)
          .single();
        
        if (profileData) {
          setPoints(profileData.points || 0);
          setStreak(profileData.streak || 0);
          
          if (!profileData.onboarding_completed) {
            navigate("/onboarding");
            return;
          }
        }

        const { data: prefData } = await supabase
          .from('user_preferences')
          .select('occupation')
          .eq('user_id', session.user.id)
          .single();
        
        if (prefData?.occupation) {
          setUserProfession(prefData.occupation);
        }
        
        await fetchTasks();
        
        const notificationService = NotificationService.getInstance();
        notificationService.scheduleNotifications();
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error loading dashboard",
          description: "Please try refreshing the page.",
        });
      }
    };
    
    fetchDashboardData();
  }, [navigate, toast, fetchTasks]);

  const handleTaskComplete = async (taskId: string, userTaskId: string, points: number) => {
    await completeTask(taskId, userTaskId, points);
    // Update local state after task completion
    setPoints(prevPoints => prevPoints + points);
    setStreak(prevStreak => prevStreak + 1);
  };
  
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
      <div className="max-w-4xl mx-auto pb-24 md:pb-16">
        <DashboardHeader userName={userName} />
        
        <p className="text-confidence-700 mb-6">Here are your confidence tasks for today</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PointsDisplay points={points} streak={streak} />
          <div className="md:col-span-2">
            <MotivationalTip />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-confidence-800 mb-4">Your Tasks</h2>
        <TaskList tasks={tasks} onCompleteTask={handleTaskComplete} />
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
