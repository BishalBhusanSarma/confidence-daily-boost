
import OnboardingSurvey from "@/components/onboarding/OnboardingSurvey";

const OnboardingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-confidence-50 to-white">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-confidence-900">Let's Get Started</h1>
        <p className="text-confidence-700 mt-2">Help us personalize your confidence journey</p>
      </div>
      
      <OnboardingSurvey />
    </div>
  );
};

export default OnboardingPage;
