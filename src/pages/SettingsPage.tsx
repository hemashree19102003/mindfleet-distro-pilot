import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  Building2, Clock, MapPin, Users,
  Save, ChevronDown, Bell, Globe, Package,
  Shield, AlertTriangle, CheckCircle2, Info,
  Sparkles, ChevronUp
} from "lucide-react";
import { useUserStore } from "@/store";
import { toast } from "sonner";
import {
  UsersOverview,
  InviteUserForm,
  OnboardedStaffTable
} from "@/components/settings/users";

// ─── Types ───────────────────────────────────────────────────────
type SettingsTab = 'business' | 'notifications' | 'account' | 'users';

// ─── Mock Data ──────────────────────────────────────────────────


const MOCK_STATS = {
  total: 12,
  active: 8,
  pending: 3,
  disabled: 1
};

// ─── Section Component ──────────────────────────────────────────
function Section({ title, subtitle, icon: Icon, children }: {
  title: string;
  subtitle?: string;
  icon: any;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-purple-600 flex items-center justify-center flex-shrink-0">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      <div className="px-6 py-5 space-y-5">{children}</div>
    </div>
  );
}

// ─── Field Row ──────────────────────────────────────────────────
function FieldRow({ label, description, children }: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-6">
      <div className="flex-1 min-w-0">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        {description && <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{description}</p>}
      </div>
      <div className="flex-shrink-0 w-64">{children}</div>
    </div>
  );
}

// ─── Toggle Switch ──────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors flex-shrink-0 ${checked ? 'bg-green-500' : 'bg-gray-200'
        }`}
    >
      <div className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'
        }`} />
    </button>
  );
}

// ─── Select ─────────────────────────────────────────────────────
function Select({ value, onChange, options }: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all pr-8"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── Input ──────────────────────────────────────────────────────
function Input({ value, onChange, placeholder, type = "text", disabled = false }: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium outline-none focus:border-gray-400 focus:ring-1 focus:ring-gray-200 transition-all ${disabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'
        }`}
    />
  );
}

// ─── Main Component ─────────────────────────────────────────────
const SettingsPage = () => {
  const { currentUser } = useUserStore();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<SettingsTab>('business');

  // Sync tab with route
  useEffect(() => {
    if (location.pathname === '/settings/users') {
      setActiveTab('users');
    }
  }, [location.pathname]);

  // ─── Local state for form fields ──────────────────────────────
  const [businessName, setBusinessName] = useState("MindFleet Distribution");
  const [businessPhone, setBusinessPhone] = useState("+91 44 2815 7200");
  const [businessEmail, setBusinessEmail] = useState("ops@mindfleet.in");
  const [gstNumber, setGstNumber] = useState("33AADCM1234A1Z5");
  const [warehouseAddr, setWarehouseAddr] = useState("Plot 12, Industrial Estate, Ambattur, Chennai 600058");
  const [currency, setCurrency] = useState("INR");
  const [timezone, setTimezone] = useState("IST");
  const [language, setLanguage] = useState("en");

  const [deliveryWindow, setDeliveryWindow] = useState("6:00 AM - 2:00 PM");

  // Notification settings
  const [notifyDeliveryComplete, setNotifyDeliveryComplete] = useState(true);
  const [notifyDeliveryFailed, setNotifyDeliveryFailed] = useState(true);
  const [notifyLowStock, setNotifyLowStock] = useState(true);
  const [notifyPaymentOverdue, setNotifyPaymentOverdue] = useState(true);
  const [notifyStaffIdle, setNotifyStaffIdle] = useState(false);
  const [notifySlaRisk, setNotifySlaRisk] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [dailyReport, setDailyReport] = useState(true);
  const [reportTime, setReportTime] = useState("08:00 PM");

  // Account settings
  const [twoFaEnabled, setTwoFaEnabled] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState("8");
  const [dataRetention, setDataRetention] = useState("365");

  const [hasChanges, setHasChanges] = useState(false);

  const markChanged = () => { if (!hasChanges) setHasChanges(true); };

  const handleSave = () => {
    setHasChanges(false);
    toast.success("Settings saved successfully", {
      description: "All configuration changes have been applied.",
    });
  };

  const tabs: { id: SettingsTab; label: string; icon: any; adminOnly?: boolean }[] = [
    { id: 'business', label: 'Business', icon: Building2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'account', label: 'Account & Security', icon: Shield },
    { id: 'users', label: 'Users & Access', icon: Users, adminOnly: true },
  ];

  const filteredTabs = tabs.filter(t => !t.adminOnly || currentUser.role === 'ADMIN');

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-fade-in">

      {/* ─── Header ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Settings</h1>
          <p className="text-sm text-gray-400 mt-1">Manage your business configuration and preferences</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all active:scale-95 ${hasChanges
            ? 'bg-gray-900 text-white shadow-lg hover:bg-gray-800'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          <Save className="h-4 w-4" />
          Save Changes
        </button>
      </div>

      {/* ─── Tabs ────────────────────────────────────────────── */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        {filteredTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all flex-1 justify-center ${activeTab === tab.id
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
              }`}
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ─── Tab Content ─────────────────────────────────────── */}
      <div className="space-y-5">

        {/* ════════════════ BUSINESS TAB ════════════════ */}
        {activeTab === 'business' && (
          <>
            <Section title="Company Information" subtitle="Your registered business details" icon={Building2}>
              <FieldRow label="Business Name" description="Legal entity name as registered">
                <Input value={businessName} onChange={(v) => { setBusinessName(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="GST / Tax ID">
                <Input value={gstNumber} onChange={(v) => { setGstNumber(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Contact Phone">
                <Input value={businessPhone} onChange={(v) => { setBusinessPhone(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Operations Email">
                <Input value={businessEmail} onChange={(v) => { setBusinessEmail(v); markChanged(); }} />
              </FieldRow>
            </Section>

            <Section title="Warehouse & Depot" subtitle="Primary distribution center location" icon={MapPin}>
              <FieldRow label="Warehouse Address" description="GPS-tagged dispatch origin point">
                <Input value={warehouseAddr} onChange={(v) => { setWarehouseAddr(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Operating Hours">
                <Input value={deliveryWindow} onChange={(v) => { setDeliveryWindow(v); markChanged(); }} />
              </FieldRow>
            </Section>

            <Section title="Regional Preferences" icon={Globe}>
              <FieldRow label="Currency">
                <Select value={currency} onChange={(v) => { setCurrency(v); markChanged(); }} options={[
                  { value: 'INR', label: '₹ INR — Indian Rupee' },
                  { value: 'USD', label: '$ USD — US Dollar' },
                  { value: 'EUR', label: '€ EUR — Euro' },
                ]} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Timezone">
                <Select value={timezone} onChange={(v) => { setTimezone(v); markChanged(); }} options={[
                  { value: 'IST', label: 'IST — India Standard Time' },
                  { value: 'UTC', label: 'UTC — Coordinated Universal Time' },
                  { value: 'SGT', label: 'SGT — Singapore Time' },
                ]} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Language">
                <Select value={language} onChange={(v) => { setLanguage(v); markChanged(); }} options={[
                  { value: 'en', label: 'English' },
                  { value: 'ta', label: 'தமிழ் (Tamil)' },
                  { value: 'hi', label: 'हिन्दी (Hindi)' },
                ]} />
              </FieldRow>
            </Section>
          </>
        )}


        {/* ════════════════ NOTIFICATIONS TAB ════════════════ */}
        {activeTab === 'notifications' && (
          <>
            <Section title="Delivery Alerts" subtitle="Real-time notifications for field operations" icon={Bell}>
              <FieldRow label="Delivery Completed" description="Notify when a stop is marked as delivered">
                <Toggle checked={notifyDeliveryComplete} onChange={(v) => { setNotifyDeliveryComplete(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Delivery Failed" description="Alert when a delivery attempt fails">
                <Toggle checked={notifyDeliveryFailed} onChange={(v) => { setNotifyDeliveryFailed(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="SLA At Risk" description="Warning when a stop may miss its delivery window">
                <Toggle checked={notifySlaRisk} onChange={(v) => { setNotifySlaRisk(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Staff Idle > 30 min" description="Flag when a staff member hasn't moved for 30 minutes">
                <Toggle checked={notifyStaffIdle} onChange={(v) => { setNotifyStaffIdle(v); markChanged(); }} />
              </FieldRow>
            </Section>

            <Section title="Inventory & Finance" subtitle="Stock and payment related alerts" icon={Package}>
              <FieldRow label="Low Stock Warning" description="Alert when SKU falls below safety threshold">
                <Toggle checked={notifyLowStock} onChange={(v) => { setNotifyLowStock(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Payment Overdue" description="Notify when shop balance exceeds credit limit">
                <Toggle checked={notifyPaymentOverdue} onChange={(v) => { setNotifyPaymentOverdue(v); markChanged(); }} />
              </FieldRow>
            </Section>

            <Section title="Reports & Channels" subtitle="How and when you receive updates" icon={Clock}>
              <FieldRow label="SMS Alerts" description="Send critical alerts via SMS to admin phone">
                <Toggle checked={smsAlerts} onChange={(v) => { setSmsAlerts(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Daily Summary Report" description="Automated end-of-day performance email">
                <Toggle checked={dailyReport} onChange={(v) => { setDailyReport(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Report Send Time">
                <Select value={reportTime} onChange={(v) => { setReportTime(v); markChanged(); }} options={[
                  { value: '06:00 PM', label: '6:00 PM' },
                  { value: '08:00 PM', label: '8:00 PM' },
                  { value: '10:00 PM', label: '10:00 PM' },
                  { value: '06:00 AM', label: '6:00 AM (Next Day)' },
                ]} />
              </FieldRow>
            </Section>
          </>
        )}

        {/* ════════════════ ACCOUNT & SECURITY TAB ════════════════ */}
        {activeTab === 'account' && (
          <>
            <Section title="Account Details" icon={Users}>
              <FieldRow label="Full Name">
                <Input value={currentUser.name} onChange={() => { }} disabled />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Role">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-500">{currentUser.role}</span>
                </div>
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="User ID">
                <Input value={currentUser.id} onChange={() => { }} disabled />
              </FieldRow>
            </Section>

            <Section title="Security" subtitle="Authentication and session management" icon={Shield}>
              <FieldRow label="Two-Factor Authentication" description="Require OTP for login and critical operations">
                <Toggle checked={twoFaEnabled} onChange={(v) => { setTwoFaEnabled(v); markChanged(); }} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Session Timeout (hours)" description="Auto-logout after inactivity period">
                <Select value={sessionTimeout} onChange={(v) => { setSessionTimeout(v); markChanged(); }} options={[
                  { value: '2', label: '2 hours' },
                  { value: '4', label: '4 hours' },
                  { value: '8', label: '8 hours' },
                  { value: '24', label: '24 hours' },
                ]} />
              </FieldRow>
              <div className="border-t border-gray-50" />
              <FieldRow label="Data Retention (days)" description="How long delivery logs and GPS traces are kept">
                <Select value={dataRetention} onChange={(v) => { setDataRetention(v); markChanged(); }} options={[
                  { value: '90', label: '90 days' },
                  { value: '180', label: '180 days' },
                  { value: '365', label: '1 year' },
                  { value: '730', label: '2 years' },
                ]} />
              </FieldRow>
            </Section>

            {/* Info Card */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5 flex items-start gap-4">
              <Info className="h-5 w-5 text-purple-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-purple-900">Data & Compliance</p>
                <p className="text-xs text-purple-700 mt-1 leading-relaxed">
                  All delivery records, GPS traces, and payment data are encrypted at rest (AES-256) and in transit (TLS 1.3).
                  Data is stored in India-region servers compliant with IT Act 2000 and DPDP Act 2023.
                  Contact your administrator for data export or deletion requests.
                </p>
              </div>
            </div>
          </>
        )}

        {/* ════════════════ USERS & ACCESS TAB ════════════════ */}
        {activeTab === 'users' && currentUser.role === 'ADMIN' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <UsersOverview stats={MOCK_STATS} />
            <InviteUserForm />
            <OnboardedStaffTable />
          </div>
        )}
      </div>

      {/* ─── Floating Save Bar ───────────────────────────────── */}
      {hasChanges && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-4 bg-gray-900 text-white rounded-2xl px-6 py-3.5 shadow-2xl shadow-gray-900/30">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-sm font-medium">You have unsaved changes</span>
            <button
              onClick={() => { setHasChanges(false); toast.info("Changes discarded"); }}
              className="text-sm font-semibold text-gray-400 hover:text-white transition-colors"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-white text-gray-900 rounded-xl px-4 py-2 text-sm font-bold hover:bg-gray-100 active:scale-95 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
