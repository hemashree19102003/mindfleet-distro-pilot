import { NavLink, useLocation } from "react-router-dom";
import {
  Sparkles, LayoutDashboard, Truck, Package, Store,
  Boxes, FileText, Users, BarChart3, Settings, X,
  MapPin, List, User
} from "lucide-react";
import { useUserStore } from "@/store";

const ADMIN_NAV_ITEMS = [
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

const STAFF_NAV_ITEMS = [
  { title: "My Route", path: "/route", icon: MapPin },
  { title: "My Stops", path: "/stops", icon: List },
  { title: "Day Summary", path: "/summary", icon: BarChart3 },
  { title: "My Profile", path: "/profile", icon: User },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const AppSidebar = ({ open, onClose }: Props) => {
  const location = useLocation();
  const { currentUser } = useUserStore();
  const navItems = currentUser.role === 'STAFF' ? STAFF_NAV_ITEMS : ADMIN_NAV_ITEMS;

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-white border-r border-purple-100 shadow-lg transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 px-5 border-b border-purple-100">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl purple-gradient shadow-md">
            <Sparkles className="h-4.5 w-4.5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-gray-900">MindFleet</h1>
            <p className="text-[10px] text-purple-500 tracking-wider uppercase font-medium">Distributor OS</p>
          </div>
          {/* Close button - mobile only */}
          <button
            onClick={onClose}
            className="lg:hidden rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`sidebar-nav-item ${isActive ? "active" : ""}`}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" />
                <span className="flex-1">{item.title}</span>
                {(item as any).ai && (
                  <span className={`flex h-5 items-center rounded-full px-2 text-[10px] font-bold ${isActive ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"
                    }`}>
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-purple-100 p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full purple-gradient text-white text-xs font-bold shrink-0">
              {currentUser.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800 truncate">{currentUser.name}</p>
              <p className="text-[10px] text-purple-500">{currentUser.role}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AppSidebar;
