import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Compass, Calendar, User, LogOut, Menu, X, BarChart3, HelpCircle } from 'lucide-react';

const MainLayout = () => {
  const { user, logout } = useAuth();
  const { toastSuccess } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toastSuccess('Logged out successfully.');
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: Calendar },
    { name: 'My Trips', path: '/trips', icon: Compass },
    { name: 'Discover Cities', path: '/cities', icon: Compass },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar header */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2.5 text-xl font-extrabold text-brand-dark tracking-tight">
                <img src="/logo.png" alt="GlobeTrotter Logo" className="h-9 w-9 object-contain rounded-lg shadow-sm" />
                <span>GlobeTrotter</span>
              </Link>
              <div className="hidden md:flex ml-10 space-x-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                        isActive(link.path)
                          ? 'bg-slate-900 text-white shadow-premium'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-secondary/15 flex items-center justify-center font-bold text-brand-secondary border border-brand-secondary/20">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="text-left">
                  <p className="text-xs font-semibold text-slate-800 leading-3">{user?.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all ${
                    isActive(link.path)
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {link.name}
                </Link>
              );
            })}
            <hr className="my-2 border-slate-100" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-base font-semibold text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main page content area */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} GlobeTrotter Personalized Travel Platform. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
