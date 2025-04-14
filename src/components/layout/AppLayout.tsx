
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Award, Settings, LogOut, LayoutDashboard, Bell } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import NotificationService, { TaskNotification } from "@/services/NotificationService";

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState("dashboard");
  const [notifications, setNotifications] = useState<TaskNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Set active page based on location
    const path = location.pathname.split('/')[1];
    if (path) {
      setActivePage(path);
    }
    
    // Get notifications
    const fetchNotifications = async () => {
      const notificationService = NotificationService.getInstance();
      const notifications = await notificationService.getNotifications();
      setNotifications(notifications);
      setUnreadCount(notifications.filter(n => !n.read).length);
    };
    
    fetchNotifications();
    
    // Set up interval to check for new notifications
    const interval = setInterval(fetchNotifications, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [location.pathname]);
  
  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out. Please try again.",
      });
    }
  };
  
  const handleNotificationClick = async (notification: TaskNotification) => {
    // Mark notification as read
    const notificationService = NotificationService.getInstance();
    await notificationService.markAsRead(notification.id);
    
    // Update notifications state
    setNotifications(notifications.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));
    setUnreadCount(Math.max(0, unreadCount - 1));
    
    // If this is a task notification, could navigate to specific task view
    // For now, just show toast
    toast({
      title: notification.title,
      description: notification.body,
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Award className="h-6 w-6 text-confidence-600 mr-2" />
            <span className="font-bold text-xl text-confidence-900">Confidence Boost</span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative text-gray-500 hover:text-confidence-800"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-confidence-600"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-medium">Notifications</div>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No notifications yet
                    </div>
                  ) : (
                    notifications
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .slice(0, 10)
                      .map(notification => (
                        <DropdownMenuItem 
                          key={notification.id}
                          className={`p-3 cursor-pointer ${!notification.read ? 'bg-gray-50' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="font-medium text-sm">{notification.title}</div>
                            <div className="text-xs text-gray-500">{notification.body}</div>
                            <div className="text-xs text-gray-400">
                              {new Date(notification.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </DropdownMenuItem>
                      ))
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-gray-500 hover:text-confidence-800"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 overflow-y-auto pb-16 md:pb-0">
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
