import { Bell, ChevronDown, User } from "lucide-react";
import { useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/": "Command Center",
  "/dashboard": "Dashboard",
  "/dispatch": "Dispatch",
  "/deliveries": "Deliveries",
  "/shops": "Shops",
  "/inventory": "Inventory",
  "/invoices": "Invoices & Payments",
  "/staff": "Staff",
  "/insights": "Insights",
  "/settings": "Settings",
};

const TopBar = () => {
  const location = useLocation();
  const title = pageTitles[location.pathname] || "MindFleet";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>

      <div className="flex items-center gap-4">
        {/* Tenant */}
        <div className="hidden md:flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sri Ganesh Distributors</span>
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">Admin</span>
        </div>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:bg-muted">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            3
          </span>
        </button>

        {/* Profile */}
        <button className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 transition-colors hover:bg-muted">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <User className="h-3.5 w-3.5" />
          </div>
          <span className="hidden md:block text-sm font-medium text-foreground">Admin</span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </header>
  );
};

export default TopBar;
