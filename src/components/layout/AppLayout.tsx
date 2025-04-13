
import React, { useState } from "react";
import { Outlet, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Award, User, Settings, LogOut, LayoutDashboard } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState("dashboard");
  
  const handleLogout = () => {
    // In a real app, we would use Supabase to log out
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    navigate("/");
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Award className="h-6 w-6 text-confidence-600 mr-2" />
            <span className="font-bold text-xl text-confidence-900">Confidence Boost</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-gray-500 hover:text-confidence-800"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>
      
      {/* Bottom Navigation (for mobile) */}
      <nav className="md:hidden bg-white border-t border-gray-200 fixed bottom-0 left-0 right-0 z-10">
        <div className="flex justify-around">
          <Link 
            to="/dashboard" 
            className={`flex flex-col items-center py-3 px-6 ${
              activePage === "dashboard" 
                ? "text-confidence-600" 
                : "text-gray-500 hover:text-confidence-600"
            }`}
            onClick={() => setActivePage("dashboard")}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs mt-1">Dashboard</span>
          </Link>
          
          <Link 
            to="/leaderboard" 
            className={`flex flex-col items-center py-3 px-6 ${
              activePage === "leaderboard" 
                ? "text-confidence-600" 
                : "text-gray-500 hover:text-confidence-600"
            }`}
            onClick={() => setActivePage("leaderboard")}
          >
            <Award className="h-5 w-5" />
            <span className="text-xs mt-1">Leaderboard</span>
          </Link>
          
          <Link 
            to="/settings" 
            className={`flex flex-col items-center py-3 px-6 ${
              activePage === "settings" 
                ? "text-confidence-600" 
                : "text-gray-500 hover:text-confidence-600"
            }`}
            onClick={() => setActivePage("settings")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default AppLayout;
