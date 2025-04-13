
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, User } from "lucide-react";

// Mock data - would come from API/database in real app
const leaderboardData = Array(100).fill(null).map((_, i) => ({
  id: i + 1,
  name: `User ${i + 1}`,
  points: Math.floor(Math.random() * 1000) + 100,
  isCurrentUser: i === 15, // Just for demo purposes
})).sort((a, b) => b.points - a.points);

const Leaderboard = () => {
  const currentUser = leaderboardData.find(user => user.isCurrentUser);
  const currentUserRank = currentUser ? leaderboardData.findIndex(user => user.id === currentUser.id) + 1 : 0;
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <Trophy className="h-5 w-5 text-warning-500 mr-2" />
          Leaderboard
        </CardTitle>
        <CardDescription>
          Top 100 confident users this month
        </CardDescription>
      </CardHeader>
      
      {currentUser && (
        <div className="px-6 py-3 bg-confidence-50 border-y border-confidence-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-confidence-200 text-confidence-800 font-medium">
                {currentUserRank}
              </div>
              <div className="ml-4 flex items-center">
                <div className="w-8 h-8 rounded-full bg-confidence-600 flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <span className="ml-2 font-medium">You</span>
              </div>
            </div>
            <div className="font-bold">{currentUser.points}</div>
          </div>
        </div>
      )}
      
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <div className="divide-y">
            {leaderboardData.map((user, index) => (
              <div 
                key={user.id}
                className={`flex items-center justify-between px-6 py-3 ${
                  user.isCurrentUser ? "bg-confidence-50" : "hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    index < 3 
                      ? ["bg-yellow-100 text-yellow-800", "bg-gray-100 text-gray-800", "bg-amber-100 text-amber-800"][index]
                      : "bg-gray-100 text-gray-800"
                  } font-medium`}>
                    {index + 1}
                  </div>
                  <div className="ml-4 flex items-center">
                    <div className={`w-8 h-8 rounded-full ${
                      index < 3 
                        ? ["bg-yellow-500", "bg-gray-400", "bg-amber-600"][index]
                        : "bg-gray-300"
                    } flex items-center justify-center`}>
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="ml-2">{user.name}</span>
                  </div>
                </div>
                <div className="font-medium">{user.points}</div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
