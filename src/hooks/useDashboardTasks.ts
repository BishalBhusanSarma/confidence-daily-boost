
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getTasksForUser } from "@/data/tasksByProfession";
import { useToast } from "@/components/ui/use-toast";
import { v4 as uuidv4 } from 'uuid';

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  points: number;
  user_task_id?: string;
  status?: string;
}

export const useDashboardTasks = (userId: string | null, userProfession: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { toast } = useToast();

  const fetchTasks = async () => {
    if (!userId) return;
    
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
      .eq('user_id', userId)
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
      await assignNewTasks();
    }
  };

  const assignNewTasks = async () => {
    if (!userId) return;
    
    const appropriateTasks = getTasksForUser(userProfession);
    const randomTasks = appropriateTasks
      .sort(() => Math.random() - 0.5)
      .slice(0, 5);
    
    const tasksToAssign = randomTasks.map(task => ({
      ...task,
      id: uuidv4()
    }));
    
    const { data: newTasks, error: taskError } = await supabase
      .from('tasks')
      .insert(tasksToAssign.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        difficulty: task.difficulty,
        points: task.points
      })))
      .select();
    
    if (taskError) {
      console.error("Error creating tasks:", taskError);
      toast({
        variant: "destructive",
        title: "Failed to load tasks",
        description: "There was an error creating your tasks.",
      });
      return;
    }
    
    if (newTasks) {
      const userTasksToInsert = newTasks.map(task => ({
        user_id: userId,
        task_id: task.id,
        status: 'assigned'
      }));
      
      const { data: newUserTasks, error } = await supabase
        .from('user_tasks')
        .insert(userTasksToInsert)
        .select();
      
      if (newUserTasks) {
        const updatedTasks = newTasks.map((task, index) => ({
          id: task.id,
          title: task.title,
          description: task.description,
          category: task.category,
          difficulty: task.difficulty,
          points: task.points,
          user_task_id: newUserTasks[index]?.id,
          status: 'assigned'
        }));
        
        setTasks(updatedTasks);
      }
    }
  };

  const completeTask = async (taskId: string, userTaskId: string, points: number) => {
    if (!userId) {
      toast({
        variant: "destructive",
        title: "Authentication error",
        description: "Please login again to complete tasks.",
      });
      return;
    }
    
    await supabase
      .from('user_tasks')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        points_earned: points
      })
      .eq('id', userTaskId)
      .eq('user_id', userId);
    
    const { data: profileData } = await supabase
      .from('profiles')
      .select('points, streak')
      .eq('id', userId)
      .single();
    
    if (profileData) {
      const newPoints = (profileData.points || 0) + points;
      const newStreak = (profileData.streak || 0) + 1;
      
      await supabase
        .from('profiles')
        .update({
          points: newPoints,
          streak: newStreak
        })
        .eq('id', userId);
      
      toast({
        title: "Task completed!",
        description: `You earned ${points} points. Your new total is ${newPoints}.`,
      });
    }
    
    setTasks(prev => prev.filter(task => task.id !== taskId));
    await assignNewTasks();
  };

  return {
    tasks,
    fetchTasks,
    completeTask
  };
};
