
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { tasksByProfession } from "@/data/tasksByProfession";

interface SurveyQuestion {
  id: number;
  question: string;
  forRoles: string[];
}

const allSurveyQuestions: SurveyQuestion[] = [
  { id: 1, question: "Do you often avoid public speaking opportunities?", forRoles: ["all"] },
  { id: 2, question: "Do you find it difficult to start challenging tasks?", forRoles: ["all"] },
  { id: 3, question: "Do you worry about what others think of your work?", forRoles: ["all"] },
  { id: 4, question: "Do you hesitate to share your ideas in group settings?", forRoles: ["all"] },
  { id: 5, question: "Do you feel uncomfortable receiving praise or recognition?", forRoles: ["all"] },
  { id: 6, question: "Do you experience work-related stress that affects your confidence?", forRoles: ["professional", "freelancer"] },
  { id: 7, question: "Do you find it difficult to maintain work-life balance?", forRoles: ["professional", "freelancer"] },
  { id: 8, question: "Do you worry about exams or academic performance?", forRoles: ["student"] },
  { id: 9, question: "Do you feel uncomfortable participating in class discussions?", forRoles: ["student"] },
  { id: 10, question: "Do you feel pressure from academic expectations?", forRoles: ["student"] },
  { id: 11, question: "Do you experience social anxiety in academic settings?", forRoles: ["student"] },
  { id: 12, question: "Do you find it challenging to present your work to colleagues?", forRoles: ["professional"] },
  { id: 13, question: "Does negotiating prices/contracts make you anxious?", forRoles: ["freelancer"] },
  { id: 14, question: "Do you struggle with imposter syndrome?", forRoles: ["professional", "freelancer"] },
  { id: 15, question: "Do you find it difficult to ask for help or clarification?", forRoles: ["all"] },
];

const OnboardingSurvey = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);
  const [userName, setUserName] = useState("");
  const [userOccupation, setUserOccupation] = useState("");
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          navigate("/");
          return;
        }
        
        // Get user metadata
        const { data: userData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', session.user.id)
          .single();
        
        if (userData?.full_name) {
          setUserName(userData.full_name);
        }
        
        // Get user occupation
        const { data: prefData } = await supabase
          .from('user_preferences')
          .select('occupation')
          .eq('user_id', session.user.id)
          .single();
        
        const occupation = prefData?.occupation || "other";
        setUserOccupation(occupation);
        
        // Filter questions based on occupation
        const filteredQuestions = allSurveyQuestions.filter(q => 
          q.forRoles.includes("all") || q.forRoles.includes(occupation)
        );
        
        setSurveyQuestions(filteredQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [navigate]);
  
  if (loading) {
    return (
      <Card className="w-full max-w-md animate-fade-in">
        <CardContent className="flex justify-center items-center h-48">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-confidence-600"></div>
        </CardContent>
      </Card>
    );
  }
  
  const currentQuestion = surveyQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex) / surveyQuestions.length) * 100;
  
  const handleAnswer = (answer: boolean) => {
    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    
    if (currentQuestionIndex < surveyQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleCompletion(newAnswers);
    }
  };
  
  const handleCompletion = async (finalAnswers: Record<number, boolean>) => {
    setIsCompleted(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;
      
      // Generate initial tasks based on survey answers and occupation
      const confidenceAreas = [];
      Object.entries(finalAnswers).forEach(([questionId, answer]) => {
        if (answer) {
          const question = allSurveyQuestions.find(q => q.id === parseInt(questionId));
          if (question?.id === 1) confidenceAreas.push("public speaking");
          if (question?.id === 2) confidenceAreas.push("task initiation");
          if (question?.id === 3) confidenceAreas.push("self-confidence");
          if (question?.id === 4) confidenceAreas.push("idea sharing");
          if (question?.id === 5) confidenceAreas.push("receiving recognition");
          if (question?.id === 6) confidenceAreas.push("work stress");
          if (question?.id === 7) confidenceAreas.push("work-life balance");
          if (question?.id === 8) confidenceAreas.push("academic performance");
          if (question?.id === 9) confidenceAreas.push("class participation");
          if (question?.id === 10) confidenceAreas.push("academic pressure");
          if (question?.id === 11) confidenceAreas.push("social anxiety");
          if (question?.id === 12) confidenceAreas.push("presentation skills");
          if (question?.id === 13) confidenceAreas.push("negotiation");
          if (question?.id === 14) confidenceAreas.push("imposter syndrome");
          if (question?.id === 15) confidenceAreas.push("asking for help");
        }
      });
      
      // Update user profile to mark onboarding as completed
      await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', session.user.id);
      
      // Get appropriate tasks based on occupation
      const appropriateTasks = tasksByProfession.filter(task => 
        task.forProfessions.includes(userOccupation) || 
        task.forProfessions.includes('all')
      );
      
      // Randomly select 5 tasks
      const selectedTasks = appropriateTasks
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
      
      // Assign initial tasks to the user
      if (selectedTasks.length > 0) {
        const userTasks = selectedTasks.map(task => ({
          user_id: session.user.id,
          task_id: task.id,
          status: 'assigned'
        }));
        
        await supabase
          .from('user_tasks')
          .insert(userTasks);
      }
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  };
  
  const goToDashboard = () => {
    toast({
      title: "Onboarding complete!",
      description: "Your personalized tasks have been prepared.",
    });
    navigate("/dashboard");
  };
  
  if (isCompleted) {
    return (
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">All Set, {userName}!</CardTitle>
          <CardDescription className="text-center">
            Thank you for completing the survey. We've prepared personalized tasks to boost your confidence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center rounded-full p-8 bg-success-100">
            <Check className="h-12 w-12 text-success-600" />
          </div>
          <p>Your confidence journey begins now!</p>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={goToDashboard} 
            className="w-full bg-confidence-600 hover:bg-confidence-700"
          >
            Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Quick Survey, {userName}</CardTitle>
        <CardDescription className="text-center">
          Help us understand your confidence areas. Question {currentQuestionIndex + 1} of {surveyQuestions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-confidence-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="py-6">
          <h3 className="text-xl font-medium text-center mb-8">{currentQuestion?.question}</h3>
          
          <div className="flex justify-center gap-6">
            <Button
              onClick={() => handleAnswer(true)}
              variant="outline"
              size="lg"
              className="h-20 w-24 flex flex-col items-center justify-center border-2 gap-2 hover:bg-confidence-50 hover:border-confidence-400"
            >
              <span>Yes</span>
              <Check className="h-6 w-6 text-confidence-600" />
            </Button>
            
            <Button
              onClick={() => handleAnswer(false)}
              variant="outline"
              size="lg"
              className="h-20 w-24 flex flex-col items-center justify-center border-2 gap-2 hover:bg-confidence-50 hover:border-confidence-400"
            >
              <span>No</span>
              <X className="h-6 w-6 text-confidence-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingSurvey;
