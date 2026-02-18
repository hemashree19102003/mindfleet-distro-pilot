import { Settings, User, Shield, Bell, Palette } from "lucide-react";
import { useUserStore } from "@/store";

const SettingsPage = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <User className="h-4 w-4 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Profile</h3>
        </div>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full purple-gradient text-white text-2xl font-bold">
            {currentUser.name[0]}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{currentUser.name}</p>
            <p className="text-sm text-purple-600">{currentUser.role}</p>
          </div>
        </div>
        <div className="space-y-3">
          {[
            { label: "Full Name", value: currentUser.name },
            { label: "Role", value: currentUser.role },
            { label: "User ID", value: currentUser.id },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-medium text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Permissions */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Permissions</h3>
        </div>
        <div className="space-y-2">
          {[
            { label: "View Dispatch", allowed: true },
            { label: "Approve Drafts", allowed: currentUser.role !== 'STAFF' },
            { label: "Manage Inventory", allowed: currentUser.role !== 'STAFF' },
            { label: "Manage Staff", allowed: currentUser.role === 'ADMIN' },
            { label: "View Insights", allowed: currentUser.role !== 'STAFF' },
            { label: "System Settings", allowed: currentUser.role === 'ADMIN' },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2">
              <span className="text-sm text-gray-700">{item.label}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${item.allowed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
                }`}>
                {item.allowed ? 'Allowed' : 'Restricted'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* App Info */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Palette className="h-4 w-4 text-purple-600" />
          <h3 className="font-semibold text-gray-900">App Info</h3>
        </div>
        <div className="space-y-2">
          {[
            { label: "Version", value: "v1.0.0" },
            { label: "Mode", value: "Mock Data (Offline)" },
            { label: "Theme", value: "Purple / White" },
            { label: "Build", value: "MindFleet Distributor OS" },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50">
              <span className="text-sm text-gray-500">{item.label}</span>
              <span className="text-sm font-medium text-gray-800">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
