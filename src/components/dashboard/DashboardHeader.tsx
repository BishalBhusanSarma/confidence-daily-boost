
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Award, Settings } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
}

const DashboardHeader = ({ userName }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold text-confidence-900">
        Welcome, {userName || "Confidence Builder"}
      </h1>
      <div className="hidden md:flex space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/leaderboard")}
        >
          <Award className="h-4 w-4" />
          <span>Leaderboard</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
