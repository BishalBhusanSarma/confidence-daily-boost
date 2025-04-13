
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import TaskCard from "@/components/dashboard/TaskCard";
import PointsDisplay from "@/components/dashboard/PointsDisplay";
import MotivationalTip from "@/components/dashboard/MotivationalTip";
import { Award, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(1);
  
  useEffect(() => {
    // In a real app, we would fetch this data from Supabase
    const savedPoints = localStorage.getItem("points");
    const savedStreak = localStorage.getItem("streak");
    
    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedStreak) setStreak(parseInt(savedStreak));
  }, []);
  
  const handleCompleteTask = (earnedPoints: number) => {
    const newPoints = points + earnedPoints;
    const newStreak = streak + 1;
    
    setPoints(newPoints);
    setStreak(newStreak);
    
    localStorage.setItem("points", newPoints.toString());
    localStorage.setItem("streak", newStreak.toString());
  };
  
  const handleSkipTask = () => {
    const newPoints = Math.max(0, points - 5);
    setPoints(newPoints);
    localStorage.setItem("points", newPoints.toString());
  };
  
  return (
    <AppLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <h1 className="text-2xl font-bold text-confidence-900">Today's Confidence Task</h1>
          <TaskCard onComplete={handleCompleteTask} onSkip={handleSkipTask} />
          <MotivationalTip />
        </div>
        
        <div className="space-y-6">
          <PointsDisplay points={points} streak={streak} />
          
          <div className="hidden md:flex flex-col space-y-4">
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/leaderboard">
                <Award className="mr-2 h-5 w-5 text-confidence-600" />
                View Leaderboard
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full justify-start">
              <Link to="/settings">
                <Settings className="mr-2 h-5 w-5 text-confidence-600" />
                Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
