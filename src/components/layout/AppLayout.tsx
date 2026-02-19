import { useState, ReactNode } from "react";
import AppSidebar from "./AppSidebar";
import TopBar from "./TopBar";
import MobileNav from "./MobileNav";
import { useUserStore } from "@/store";

const AppLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentUser } = useUserStore();



  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <TopBar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 md:p-6 pb-20 lg:pb-6 overflow-auto">
          {children}
        </main>
        {/* Mobile bottom nav */}
        <div className="lg:hidden">
          <MobileNav />
        </div>
      </div>
    </div>
  );
};

export default AppLayout;
