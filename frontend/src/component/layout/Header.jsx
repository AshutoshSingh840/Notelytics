import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Menu, User } from "lucide-react";

const Header = ({ isSidebarOpen, toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between">
      
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        <h1 className="text-lg font-semibold text-gray-700">
          Dashboard
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="bg-gray-200 p-2 rounded-full">
            <User size={18} strokeWidth={2.5} />
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-gray-800">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-500">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
};

export default Header;
