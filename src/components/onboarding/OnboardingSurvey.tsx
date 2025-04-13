
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowRight, Check, X } from "lucide-react";

interface SurveyQuestion {
  id: number;
  question: string;
}

const surveyQuestions: SurveyQuestion[] = [
  { id: 1, question: "Do you often avoid public speaking opportunities?" },
  { id: 2, question: "Do you find it difficult to start challenging tasks?" },
  { id: 3, question: "Do you worry about what others think of your work?" },
  { id: 4, question: "Do you hesitate to share your ideas in group settings?" },
  { id: 5, question: "Do you feel uncomfortable receiving praise or recognition?" },
];

const OnboardingSurvey = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  
  const handleCompletion = (finalAnswers: Record<number, boolean>) => {
    setIsCompleted(true);
    
    // In a real app, we would save these answers to Supabase
    localStorage.setItem("onboardingCompleted", "true");
    localStorage.setItem("surveyAnswers", JSON.stringify(finalAnswers));
    
    // Generate initial tasks based on survey answers
    const confidenceAreas = [];
    if (finalAnswers[1]) confidenceAreas.push("public speaking");
    if (finalAnswers[2]) confidenceAreas.push("task initiation");
    if (finalAnswers[3]) confidenceAreas.push("self-confidence");
    if (finalAnswers[4]) confidenceAreas.push("idea sharing");
    if (finalAnswers[5]) confidenceAreas.push("receiving recognition");
    
    localStorage.setItem("confidenceAreas", JSON.stringify(confidenceAreas));
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
          <CardTitle className="text-2xl font-bold text-center">All Set!</CardTitle>
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
        <CardTitle className="text-2xl font-bold text-center">Quick Survey</CardTitle>
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
          <h3 className="text-xl font-medium text-center mb-8">{currentQuestion.question}</h3>
          
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
