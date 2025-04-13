
import AppLayout from "@/components/layout/AppLayout";
import SettingsForm from "@/components/settings/SettingsForm";

const SettingsPage = () => {
  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-confidence-900 mb-6">Settings</h1>
        <SettingsForm />
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
