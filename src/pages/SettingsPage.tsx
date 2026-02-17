import { Settings as SettingsIcon } from "lucide-react";

const Settings = () => (
  <div className="flex flex-col items-center justify-center h-64 text-center">
    <SettingsIcon className="h-12 w-12 text-muted-foreground/30 mb-3" />
    <h3 className="text-lg font-semibold text-foreground">Settings</h3>
    <p className="text-sm text-muted-foreground">Configure your distributor preferences and integrations.</p>
  </div>
);

export default Settings;
