
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        onComplete();
      }, 500); // Wait for fade-out animation to complete
    }, 2000); // Show splash for 2 seconds

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-confidence-50 to-white transition-opacity duration-500 ${
        isAnimating ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex flex-col items-center">
        <Sparkles className="h-20 w-20 text-confidence-600 animate-pulse" />
        <h1 className="mt-6 text-3xl font-bold text-confidence-900">Confidence Boost</h1>
        <p className="mt-2 text-confidence-700">Daily tasks to build your confidence</p>
      </div>
    </div>
  );
};

export default SplashScreen;
