
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LightbulbIcon } from "lucide-react";
import { useEffect, useState } from "react";

const tips = [
  "Small steps every day lead to big improvements over time.",
  "The only way to build confidence is to do the things that scare you.",
  "Your comfort zone is a beautiful place, but nothing grows there.",
  "Confidence isn't 'they will like me.' It's 'I'll be fine if they don't.'",
  "The expert in anything was once a beginner.",
  "Don't wait for confidence to find you - build it through action.",
  "Mistakes are proof that you're trying.",
  "Confidence comes from accepting your true self, flaws and all.",
  "Focus on progress, not perfection.",
  "Every time you face a fear, you grow stronger."
];

const MotivationalTip = () => {
  const [tip, setTip] = useState("");
  
  useEffect(() => {
    // Get a random tip on mount
    const randomIndex = Math.floor(Math.random() * tips.length);
    setTip(tips[randomIndex]);
  }, []);
  
  return (
    <Card className="bg-gradient-to-r from-confidence-50 to-confidence-100 border-confidence-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-confidence-800 flex items-center">
          <LightbulbIcon className="h-4 w-4 mr-2 text-confidence-600" />
          Today's Tip
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-confidence-800 italic">{tip}</p>
      </CardContent>
    </Card>
  );
};

export default MotivationalTip;
