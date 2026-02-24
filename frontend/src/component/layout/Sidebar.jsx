import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from 'lucide-react';

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeOnMobile = () => {
    if (window.innerWidth < 768) toggleSidebar();
  };

  const isRouteActive = (to) => {
    if (to === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname === to || location.pathname.startsWith(`${to}/`);
  };

  const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, text: 'Dashboard' },
    { to: '/documents', icon: FileText, text: 'Documents' },
    { to: '/flashcards', icon: BookOpen, text: 'Flashcards' },
    { to: '/profile', icon: User, text: 'Profile' },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeOnMobile}
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-white border-r shadow-lg z-50 transform transition-transform duration-300 flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-sm">
              <BrainCircuit size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-semibold text-slate-900">AI Learning</h1>
              <p className="text-xs text-slate-500">Assistant</p>
            </div>
          </div>

          <button
            onClick={closeOnMobile}
            className="md:hidden p-1 rounded-lg hover:bg-slate-100"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-4 pt-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.08em] text-emerald-700">Signed in as</p>
            <p className="mt-1 truncate text-sm font-semibold text-slate-800">
              {user?.username || 'User'}
            </p>
            <p className="truncate text-xs text-slate-500">
              {user?.email || 'user@example.com'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
            Main navigation
          </p>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeOnMobile}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive || isRouteActive(link.to)
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                    : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <link.icon size={18} strokeWidth={2.4} />
              <span className="flex-1">{link.text}</span>
              {(isRouteActive(link.to) || location.pathname === link.to) && (
                <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
              )}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="w-full p-4 border-t mt-auto">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} strokeWidth={2.5} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
