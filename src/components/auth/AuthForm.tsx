
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { LockKeyhole, Mail, User } from "lucide-react";

type AuthMode = "login" | "register";

export const AuthForm = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    setEmail("");
    setPassword("");
    setName("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // This is a mock authentication - in a real app, we would use Supabase here
      if (mode === "register") {
        // Registration logic would go here
        localStorage.setItem("user", JSON.stringify({ email, name }));
        localStorage.setItem("isAuthenticated", "true");
        toast({
          title: "Account created!",
          description: "Welcome to Confidence Boost",
        });
        navigate("/onboarding");
      } else {
        // Login logic would go here
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("user", JSON.stringify({ email }));
        toast({
          title: "Welcome back!",
          description: "Successfully logged in",
        });
        navigate("/dashboard");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: "Please check your credentials and try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md animate-fade-in">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {mode === "login" ? "Welcome Back" : "Create an Account"}
        </CardTitle>
        <CardDescription className="text-center">
          {mode === "login" 
            ? "Enter your credentials to access your account" 
            : "Fill in the details below to create your account"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {mode === "register" && (
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="relative">
              <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-confidence-600 hover:bg-confidence-700" 
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Sign Up"}
          </Button>
          
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              className="text-confidence-600 hover:underline font-medium"
              onClick={toggleMode}
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
