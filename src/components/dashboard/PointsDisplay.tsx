
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, TrendingUp, Calendar } from "lucide-react";

interface PointsDisplayProps {
  points: number;
  streak: number;
}

const PointsDisplay = ({ points, streak }: PointsDisplayProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Your Progress</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col items-center justify-center p-4 bg-confidence-50 rounded-md">
          <Award className="h-8 w-8 text-confidence-600 mb-2" />
          <span className="text-2xl font-bold text-confidence-800">{points}</span>
          <span className="text-xs text-confidence-600">Total Points</span>
        </div>
        
        <div className="flex flex-col items-center justify-center p-4 bg-warning-50 rounded-md">
          <Calendar className="h-8 w-8 text-warning-600 mb-2" />
          <span className="text-2xl font-bold text-warning-800">{streak}</span>
          <span className="text-xs text-warning-600">Day Streak</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;
