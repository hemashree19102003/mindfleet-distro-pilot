import { NavLink } from "react-router-dom";
import { Sparkles, Truck, Boxes, FileText, Store } from "lucide-react";

const mobileNavItems = [
    { title: "AI", path: "/", icon: Sparkles },
    { title: "Dispatch", path: "/dispatch", icon: Truck },
    { title: "Inventory", path: "/inventory", icon: Boxes },
    { title: "Invoices", path: "/invoices", icon: FileText },
    { title: "Shops", path: "/shops", icon: Store },
];

const MobileNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-30 flex border-t border-purple-100 bg-white/95 backdrop-blur-md">
        {mobileNavItems.map((item) => (
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

export default MobileNav;
