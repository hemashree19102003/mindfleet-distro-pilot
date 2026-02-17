import { NavLink, useLocation } from "react-router-dom";
import {
  Sparkles,
  LayoutDashboard,
  Truck,
  Package,
  Store,
  Boxes,
  FileText,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";

const navItems = [
  { title: "Command Center", path: "/", icon: Sparkles, ai: true },
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "Dispatch", path: "/dispatch", icon: Truck },
  { title: "Deliveries", path: "/deliveries", icon: Package },
  { title: "Shops", path: "/shops", icon: Store },
  { title: "Inventory", path: "/inventory", icon: Boxes },
  { title: "Invoices & Payments", path: "/invoices", icon: FileText },
  { title: "Staff", path: "/staff", icon: Users },
  { title: "Insights", path: "/insights", icon: BarChart3 },
  { title: "Settings", path: "/settings", icon: Settings },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-60 flex-col bg-sidebar text-sidebar-foreground">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-sidebar-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Sparkles className="h-4 w-4 text-accent-foreground" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-sidebar-primary">MindFleet</h1>
          <p className="text-[10px] text-sidebar-foreground/50 tracking-wider uppercase">Distributor OS</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150 ${
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              } ${item.ai && isActive ? "ai-glow" : ""}`}
            >
              <item.icon className={`h-[18px] w-[18px] ${item.ai ? "text-accent" : ""}`} />
              <span>{item.title}</span>
              {item.ai && (
                <span className="ml-auto flex h-5 items-center rounded-full bg-accent/20 px-2 text-[10px] font-semibold text-accent">
                  AI
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4">
        <p className="text-[11px] text-sidebar-foreground/40">v1.0.0 · MindFleet</p>
      </div>
    </aside>
  );
};

export default AppSidebar;
