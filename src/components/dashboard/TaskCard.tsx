
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { Award, Clock, SkipForward, CheckCircle2 } from "lucide-react";

interface TaskCardProps {
  onComplete: (points: number) => void;
  onSkip: () => void;
}

const TIMER_DURATION = 300; // 5 minutes in seconds

const TaskCard = ({ onComplete, onSkip }: TaskCardProps) => {
  const [timeRemaining, setTimeRemaining] = useState(TIMER_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();
  
  // Sample task data - in real app would come from API/database
  const task = {
    id: 1,
    title: "Speak Up in Your Next Meeting",
    description: "In your next meeting or conversation, challenge yourself to share at least one idea or opinion. It doesn't need to be perfect - the goal is simply to participate.",
    category: "Public Speaking",
    difficulty: "Medium",
    points: 20,
  };
  
  useEffect(() => {
    let interval: number | undefined;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000) as unknown as number;
    } else if (isActive && timeRemaining === 0) {
      clearInterval(interval);
      handleTimerComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);
  
  const handleStartTimer = () => {
    setIsActive(true);
    toast({
      title: "Timer started!",
      description: "You have 5 minutes to complete this task.",
    });
  };
  
  const handleCompleteTask = () => {
    setIsActive(false);
    setIsCompleted(true);
    
    // Calculate points based on time remaining
    const earnedPoints = timeRemaining > 0 ? task.points : Math.floor(task.points / 2);
    
    onComplete(earnedPoints);
    toast({
      title: "Task completed!",
      description: `You earned ${earnedPoints} points!`,
    });
  };
  
  const handleTimerComplete = () => {
    setIsActive(false);
    toast({
      title: "Time's up!",
      description: "You can still complete the task for partial points.",
    });
  };
  
  const handleSkipTask = () => {
    setIsActive(false);
    onSkip();
    toast({
      title: "Task skipped",
      description: "You can try a different task tomorrow.",
      variant: "destructive",
    });
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const progressPercent = (timeRemaining / TIMER_DURATION) * 100;
  
  return (
    <Card className="w-full task-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{task.title}</CardTitle>
            <CardDescription className="mt-1">{task.category}</CardDescription>
          </div>
          <Badge variant="outline" className="flex items-center gap-1 bg-confidence-50 text-confidence-700 border-confidence-200">
            <Award className="h-3 w-3" />
            {task.points} points
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        
        {isActive && (
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1 text-confidence-600" />
                Time remaining
              </span>
              <span className="font-medium">{formatTime(timeRemaining)}</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-4 pt-2">
        {!isActive && !isCompleted ? (
          <Button 
            onClick={handleStartTimer} 
            className="w-full bg-confidence-600 hover:bg-confidence-700"
          >
            Start 5-Minute Timer
          </Button>
        ) : isActive ? (
          <>
            <Button 
              onClick={handleCompleteTask} 
              className="flex-1 bg-success-600 hover:bg-success-700"
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Complete
            </Button>
            <Button 
              onClick={handleSkipTask} 
              variant="outline" 
              className="flex-1"
            >
              <SkipForward className="mr-2 h-4 w-4" /> Skip
            </Button>
          </>
        ) : (
          <div className="w-full text-center p-2 bg-success-50 text-success-700 rounded-md">
            <CheckCircle2 className="inline-block mr-2 h-5 w-5" />
            Task completed!
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
