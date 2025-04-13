
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface LeaderboardUser {
  id: string;
  full_name: string | null;
  points: number;
  isCurrentUser: boolean;
}

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<LeaderboardUser | null>(null);
  const [currentUserRank, setCurrentUserRank] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setIsLoading(true);
        
        // First, get the current user
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }
        
        const currentUserId = sessionData.session?.user.id;
        
        // Fetch top 100 users by points
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, points')
          .order('points', { ascending: false })
          .limit(100);
        
        if (error) {
          throw error;
        }
        
        // Transform and sort the data
        const formattedData: LeaderboardUser[] = data.map((user) => ({
          id: user.id,
          full_name: user.full_name || `User ${user.id.substring(0, 4)}`,
          points: user.points,
          isCurrentUser: user.id === currentUserId
        }));
        
        setLeaderboardData(formattedData);
        
        // Find current user in the leaderboard
        const userInLeaderboard = formattedData.find(user => user.isCurrentUser);
        if (userInLeaderboard) {
          setCurrentUser(userInLeaderboard);
          setCurrentUserRank(formattedData.findIndex(user => user.id === userInLeaderboard.id) + 1);
        } else if (currentUserId) {
          // If current user is not in top 100, fetch their data separately
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('id, full_name, points')
            .eq('id', currentUserId)
            .single();
            
          if (userData && !userError) {
            const userInfo = {
              id: userData.id,
              full_name: userData.full_name || `User ${userData.id.substring(0, 4)}`,
              points: userData.points,
              isCurrentUser: true
            };
            setCurrentUser(userInfo);
            
            // Get user's rank by counting profiles with higher points
            const { count, error: countError } = await supabase
              .from('profiles')
              .select('id', { count: 'exact', head: true })
              .gt('points', userData.points);
              
            if (!countError && count !== null) {
              setCurrentUserRank(count + 1);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        toast({
          variant: "destructive",
          title: "Couldn't load leaderboard",
          description: "Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboardData();
  }, [toast]);

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
      
      {isLoading ? (
        <div className="flex justify-center p-6">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-current border-t-transparent text-confidence-600"></div>
        </div>
      ) : (
        <>
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
                {leaderboardData.length > 0 ? (
                  leaderboardData.map((user, index) => (
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
                          <span className="ml-2">{user.full_name}</span>
                        </div>
                      </div>
                      <div className="font-medium">{user.points}</div>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-12 text-center text-muted-foreground">
                    No users found. Be the first to complete tasks and get on the leaderboard!
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default Leaderboard;
