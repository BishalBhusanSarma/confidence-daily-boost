
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    
    if (isAuthenticated) {
      const onboardingCompleted = localStorage.getItem("onboardingCompleted") === "true";
      if (onboardingCompleted) {
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
  
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
};

export default Index;
