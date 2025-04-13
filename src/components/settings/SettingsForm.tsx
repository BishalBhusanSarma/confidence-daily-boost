
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Clock, BellRing, Save } from "lucide-react";

const occupations = [
  { value: "student", label: "Student" },
  { value: "professional", label: "Professional" },
  { value: "entrepreneur", label: "Entrepreneur" },
  { value: "other", label: "Other" }
];

const notificationTimes = [
  { value: "morning", label: "Morning (8-10 AM)" },
  { value: "afternoon", label: "Afternoon (12-2 PM)" },
  { value: "evening", label: "Evening (6-8 PM)" }
];

const SettingsForm = () => {
  const [occupation, setOccupation] = useState("professional");
  const [notificationTime, setNotificationTime] = useState("morning");
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  
  const { toast } = useToast();
  
  const handleSave = () => {
    setIsBusy(true);
    
    // In a real app, we would save these settings to Supabase
    setTimeout(() => {
      setIsBusy(false);
      localStorage.setItem("settings", JSON.stringify({
        occupation,
        notificationTime,
        enableNotifications
      }));
      
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated",
      });
    }, 1000);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl">User Settings</CardTitle>
        <CardDescription>
          Customize your experience with Confidence Boost
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="occupation" className="font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-confidence-600" />
            Occupation Mode
          </Label>
          <Select value={occupation} onValueChange={setOccupation}>
            <SelectTrigger id="occupation">
              <SelectValue placeholder="Select your occupation" />
            </SelectTrigger>
            <SelectContent>
              {occupations.map((occ) => (
                <SelectItem key={occ.value} value={occ.value}>
                  {occ.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            We'll adjust task timing based on typical busy hours for your occupation.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <Label className="font-medium flex items-center">
                <BellRing className="h-4 w-4 mr-2 text-confidence-600" />
                Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive reminders to complete your daily tasks.
              </p>
            </div>
            <Switch 
              checked={enableNotifications} 
              onCheckedChange={setEnableNotifications} 
            />
          </div>
          
          {enableNotifications && (
            <div className="pl-6 border-l-2 border-confidence-100">
              <Label htmlFor="notification-time" className="text-sm font-medium">
                Preferred Time
              </Label>
              <Select value={notificationTime} onValueChange={setNotificationTime}>
                <SelectTrigger id="notification-time" className="mt-1">
                  <SelectValue placeholder="Select notification time" />
                </SelectTrigger>
                <SelectContent>
                  {notificationTimes.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          className="w-full bg-confidence-600 hover:bg-confidence-700"
          disabled={isBusy}
        >
          <Save className="mr-2 h-4 w-4" />
          {isBusy ? "Saving..." : "Save Settings"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SettingsForm;
