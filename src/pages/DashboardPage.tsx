
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import TaskCard from "@/components/dashboard/TaskCard";
import PointsDisplay from "@/components/dashboard/PointsDisplay";
import MotivationalTip from "@/components/dashboard/MotivationalTip";
import { supabase } from "@/integrations/supabase/client";
import NotificationService from "@/services/NotificationService";
import { getTasksForUser, TaskData } from "@/data/tasksByProfession";
import { Button } from "@/components/ui/button";
import { Settings, Award } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  points: number;
  user_task_id?: string;
  status?: string;
}

interface DashboardPageProps {
  userName?: string;
}

const DashboardPage = ({ userName = "" }: DashboardPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [userProfession, setUserProfession] = useState("other");
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          navigate("/");
          return;
        }
        
        // Fetch user profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('points, streak, onboarding_completed, full_name')
          .eq('id', session.user.id)
          .single();
        
        if (profileData) {
          setPoints(profileData.points);
          setStreak(profileData.streak);
          
          // Redirect to onboarding if not completed
          if (!profileData.onboarding_completed) {
            navigate("/onboarding");
            return;
          }
        }

        // Get user preferences including profession
        const { data: prefData } = await supabase
          .from('user_preferences')
          .select('occupation')
          .eq('user_id', session.user.id)
          .single();
        
        if (prefData?.occupation) {
          setUserProfession(prefData.occupation);
        }
        
        // Fetch tasks assigned to user
        const { data: userTasks } = await supabase
          .from('user_tasks')
          .select(`
            id,
            status,
            task_id,
            tasks (
              id, title, description, category, difficulty, points
            )
          `)
          .eq('user_id', session.user.id)
          .eq('status', 'assigned')
          .limit(5);
        
        if (userTasks && userTasks.length > 0) {
          const formattedTasks = userTasks.map((ut: any) => ({
            id: ut.tasks.id,
            title: ut.tasks.title,
            description: ut.tasks.description,
            category: ut.tasks.category,
            difficulty: ut.tasks.difficulty,
            points: ut.tasks.points,
            user_task_id: ut.id,
            status: ut.status
          }));
          
          setTasks(formattedTasks);
        } else {
          // If no tasks are assigned, fetch appropriate tasks based on profession
          const appropriateTasks = getTasksForUser(prefData?.occupation || 'other');
          const randomTasks = appropriateTasks
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);
          
          // Convert to Task format
          const tasksToAssign = randomTasks.map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            category: task.category,
            difficulty: task.difficulty,
            points: task.points
          }));
          
          // Create user_tasks records
          const userTasksToInsert = tasksToAssign.map(task => ({
            user_id: session.user.id,
            task_id: task.id,
            status: 'assigned'
          }));
          
          const { data: newUserTasks } = await supabase
            .from('user_tasks')
            .insert(userTasksToInsert)
            .select();
          
          if (newUserTasks) {
            // Update task display with user_task_id
            const updatedTasks = tasksToAssign.map((task, index) => ({
              ...task,
              user_task_id: newUserTasks[index]?.id,
              status: 'assigned'
            }));
            
            setTasks(updatedTasks);
          } else {
            // Fallback if insertion fails
            setTasks(tasksToAssign);
          }
        }
        
        // Initialize notification service
        const notificationService = NotificationService.getInstance();
        notificationService.scheduleNotifications();
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [navigate]);
  
  const handleTaskComplete = async (taskId: string, userTaskId: string, points: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      
      // Update the task status
      await supabase
        .from('user_tasks')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          points_earned: points
        })
        .eq('id', userTaskId);
      
      // Update the user's points
      const { data: profileData } = await supabase
        .from('profiles')
        .select('points')
        .eq('id', session.user.id)
        .single();
      
      if (profileData) {
        const newPoints = profileData.points + points;
        
        await supabase
          .from('profiles')
          .update({
            points: newPoints,
            streak: streak + 1
          })
          .eq('id', session.user.id);
        
        setPoints(newPoints);
        setStreak(streak + 1);
      }
      
      // Update the local task list
      setTasks(tasks.filter(task => task.id !== taskId));
      
      // Get user preferences for appropriate new task
      const { data: prefData } = await supabase
        .from('user_preferences')
        .select('occupation')
        .eq('user_id', session.user.id)
        .single();
      
      // Get appropriate tasks based on profession
      const appropriateTasks = getTasksForUser(prefData?.occupation || userProfession);
      const currentTaskIds = tasks.map(t => t.id);
      const availableTasks = appropriateTasks.filter(t => !currentTaskIds.includes(t.id));
      
      // Select a random new task
      if (availableTasks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTasks.length);
        const newTask = availableTasks[randomIndex];
        
        // Assign the new task to the user
        const { data: newUserTask } = await supabase
          .from('user_tasks')
          .insert({
            user_id: session.user.id,
            task_id: newTask.id,
            status: 'assigned'
          })
          .select()
          .single();
        
        if (newUserTask) {
          // Add the new task to the list
          setTasks([...tasks.filter(task => task.id !== taskId), {
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            category: newTask.category,
            difficulty: newTask.difficulty,
            points: newTask.points,
            user_task_id: newUserTask.id,
            status: 'assigned'
          }]);
        }
      }
    } catch (error) {
      console.error("Error completing task:", error);
    }
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
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-confidence-900">
            Welcome, {userName || "Confidence Builder"}
          </h1>
          <div className="hidden md:flex space-x-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/leaderboard")}
            >
              <Award className="h-4 w-4" />
              <span>Leaderboard</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => navigate("/settings")}
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </Button>
          </div>
        </div>
        
        <p className="text-confidence-700 mb-6">Here are your confidence tasks for today</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <PointsDisplay points={points} streak={streak} />
          <div className="md:col-span-2">
            <MotivationalTip />
          </div>
        </div>
        
        <h2 className="text-xl font-semibold text-confidence-800 mb-4">Your Tasks</h2>
        <div className="grid grid-cols-1 gap-4">
          {tasks.length === 0 ? (
            <div className="bg-confidence-50 rounded-lg p-6 text-center">
              <p className="text-confidence-700">No tasks available right now. Check back later!</p>
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onComplete={() => handleTaskComplete(task.id, task.user_task_id || '', task.points)}
              />
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
