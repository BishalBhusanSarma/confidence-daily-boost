
import AppLayout from "@/components/layout/AppLayout";
import Leaderboard from "@/components/leaderboard/Leaderboard";

const LeaderboardPage = () => {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-confidence-900 mb-6">Leaderboard</h1>
        <Leaderboard />
      </div>
    </AppLayout>
  );
};

export default LeaderboardPage;
