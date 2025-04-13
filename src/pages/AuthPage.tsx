
import AuthForm from "@/components/auth/AuthForm";
import { Sparkles } from "lucide-react";

const AuthPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-confidence-50 to-white">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center mb-2">
          <Sparkles className="h-12 w-12 text-confidence-600" />
        </div>
        <h1 className="text-3xl font-bold text-confidence-900">Confidence Boost</h1>
        <p className="text-confidence-700 mt-2">Daily tasks to build your confidence</p>
      </div>
      
      <AuthForm />
      
      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>Boost your confidence with simple daily tasks.</p>
        <p>Complete them to earn points and track your progress!</p>
      </div>
    </div>
  );
};

export default AuthPage;
