import { Menu, Bell, Search, Sparkles } from "lucide-react";
import { useUserStore } from "@/store";
import { useState } from "react";

interface Props {
  onMenuClick: () => void;
}

const TopBar = ({ onMenuClick }: Props) => {
  const { currentUser, users, setCurrentUser } = useUserStore();
  const [showRolePicker, setShowRolePicker] = useState(false);

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-purple-100 bg-white/90 backdrop-blur-md px-4 md:px-6">
      {/* Menu button - mobile/tablet */}
      <button
        onClick={onMenuClick}
        className="lg:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors"
      >
        <Menu className="h-4 w-4" />
      </button>

      {/* Logo - mobile only */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg purple-gradient">
          <Sparkles className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-bold text-gray-900">MindFleet</span>
      </div>

      {/* Search - hidden on mobile */}
      <div className="hidden md:flex flex-1 max-w-sm items-center gap-2 rounded-xl border border-purple-100 bg-purple-50/50 px-3 py-2 transition-all focus-within:border-purple-400 focus-within:bg-white focus-within:shadow-sm">
        <Search className="h-3.5 w-3.5 text-purple-400 shrink-0" />
        <input
          type="text"
          placeholder="Search shops, staff, invoices…"
          className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-purple-100 text-gray-500 hover:bg-purple-50 hover:text-purple-600 transition-colors">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-purple-600 ring-2 ring-white" />
        </button>

        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRolePicker(!showRolePicker)}
            className="flex items-center gap-2 rounded-xl border border-purple-100 bg-purple-50 px-3 py-1.5 transition-all hover:border-purple-300 hover:bg-purple-100"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full purple-gradient text-white text-[10px] font-bold">
              {currentUser.name[0]}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-gray-800 leading-none">{currentUser.name.split(' ')[0]}</p>
              <p className="text-[10px] text-purple-500">{currentUser.role}</p>
            </div>
          </button>

          {showRolePicker && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-purple-100 bg-white shadow-xl z-50 overflow-hidden animate-fade-in">
              <div className="px-4 py-3 border-b border-purple-50">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Switch Role</p>
              </div>
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => { setCurrentUser(user); setShowRolePicker(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-purple-50 ${currentUser.id === user.id ? 'bg-purple-50' : ''
                    }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full purple-gradient text-white text-xs font-bold shrink-0">
                    {user.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user.name}</p>
                    <p className="text-[10px] text-purple-500">{user.role}</p>
                  </div>
                  {currentUser.id === user.id && (
                    <div className="ml-auto h-2 w-2 rounded-full bg-purple-600" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
