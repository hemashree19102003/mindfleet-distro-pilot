import { NavLink } from "react-router-dom";
import { MapPin, List, BarChart2, User, Sparkles, Truck, Package, Boxes, FileText, Store } from "lucide-react";
import { useUserStore } from "@/store";

const ADMIN_NAV_ITEMS = [
    { title: "AI", path: "/", icon: Sparkles },
    { title: "Dispatch", path: "/dispatch", icon: Truck },
    { title: "Deliveries", path: "/deliveries", icon: Package },
    { title: "Inventory", path: "/inventory", icon: Boxes },
    { title: "Invoices", path: "/invoices", icon: FileText },
    { title: "Shops", path: "/shops", icon: Store },
];

const STAFF_NAV_ITEMS = [
    { title: "Route", path: "/route", icon: MapPin },
    { title: "Stops", path: "/stops", icon: List },
    { title: "Summary", path: "/summary", icon: BarChart2 },
    { title: "Profile", path: "/profile", icon: User },
];

const MobileNav = () => {
    const { currentUser } = useUserStore();
    const navItems = currentUser.role === 'STAFF' ? STAFF_NAV_ITEMS : ADMIN_NAV_ITEMS;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-purple-100 bg-white/95 backdrop-blur-md">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `flex flex-1 flex-col items-center gap-1 py-2.5 px-1 text-[10px] font-medium transition-colors ${isActive ? "text-purple-600" : "text-gray-400 hover:text-purple-500"
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            <div className={`flex h-8 w-8 items-center justify-center rounded-xl transition-all ${isActive ? "purple-gradient shadow-md" : ""
                                }`}>
                                <item.icon className={`h-4 w-4 ${isActive ? "text-white" : ""}`} />
                            </div>
                            <span>{item.title}</span>
                        </>
                    )}
                </NavLink>
            ))}
        </nav>
    );
};

export default MobileNav;
