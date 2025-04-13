
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import SettingsPage from "./pages/SettingsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import SplashScreen from "./components/SplashScreen";
import NotificationService from "./services/NotificationService";
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      
      if (data.session) {
        setIsAuthenticated(true);
        
        // Get user name
        const userId = data.session.user.id;
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', userId)
          .single();
          
        if (profileData?.full_name) {
          setUserName(profileData.full_name);
        }
        
        // Initialize notification service
        const notificationService = NotificationService.getInstance();
        notificationService.scheduleNotifications();
      }
      
      setSessionChecked(true);
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setIsAuthenticated(!!session);
        
        if (session) {
          // Get user name
          const userId = session.user.id;
          const { data: profileData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', userId)
            .single();
            
          if (profileData?.full_name) {
            setUserName(profileData.full_name);
          }
          
          // Initialize notification service
          const notificationService = NotificationService.getInstance();
          notificationService.scheduleNotifications();
        } else {
          // Clean up notifications when logging out
          const notificationService = NotificationService.getInstance();
          notificationService.cleanup();
        }
      }
    );
    
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Loading state while checking session
  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-light">
          <div className="flex items-center justify-center">
            <div className="h-16 w-16 text-confidence-600">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/>
                <path d="M4 6h.01"/>
                <path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/>
                <path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/>
                <path d="M12 18h.01"/>
                <path d="M17.99 11.95a5 5 0 0 1-2.56 4.43"/>
                <path d="M11.99 22.66a9.97 9.97 0 0 0 6.33-3.03"/>
              </svg>
            </div>
          </div>
          <p className="mt-4 text-confidence-800 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />
            } />
            
            <Route path="/onboarding" element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage userName={userName} />
              </ProtectedRoute>
            } />
            
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/settings" element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
