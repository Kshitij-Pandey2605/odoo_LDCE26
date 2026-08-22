import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Search, Bell, Menu, X, LogOut, Facebook, Twitter, Instagram } from 'lucide-react';

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
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'My Trips', path: '/trips' },
    { name: 'Explore', path: '/explore' },
    { name: 'Itinerary', path: '/itinerary' },
    { name: 'Budget', path: '/budget' },
    { name: 'Calendar', path: '/calendar' },
  ];

  // We highlight the current route, or if we're on /trips/create we might highlight Dashboard or My Trips depending on flow. Let's just do exact match.
  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname.includes('/trips/create')) return true; // Just to match the screenshot
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Navbar header */}
      <nav className="sticky top-0 z-40 bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            
            <div className="flex items-center">
              <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-[#0F172A] tracking-tight mr-8">
                <span className="text-xl">🏔️</span>
                <span>GlobeTrotter</span>
              </Link>
              
              <div className="hidden lg:flex space-x-1 h-16">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`inline-flex items-center px-4 pt-1 text-xs font-bold uppercase tracking-wide transition-colors border-b-2 ${
                      isActive(link.path)
                        ? 'border-[#F97316] text-[#F97316]'
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-6">
              <button className="text-slate-400 hover:text-slate-700 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <button className="text-slate-400 hover:text-slate-700 transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <div className="relative group cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200">
                   <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop" alt="User Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-premium border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-rose-600 hover:bg-slate-50 rounded-xl font-semibold flex items-center gap-2">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden">
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
          <div className="lg:hidden border-b border-slate-100 bg-white px-4 pt-2 pb-4 space-y-1 shadow-inner">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide transition-all ${
                  isActive(link.path)
                    ? 'bg-[#FFF7ED] text-[#F97316]'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <hr className="my-2 border-slate-100" />
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wide text-rose-600 hover:bg-rose-50 transition-all"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main page content area */}
      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* Footer matching design */}
      <footer className="bg-[#FFF7ED] pt-12 pb-8 mt-12 border-t border-[#FDE6D5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 text-lg font-bold text-[#0F172A] tracking-tight mb-4">
                <span className="text-xl">🏔️</span>
                <span>GlobeTrotter</span>
              </div>
              <p className="text-xs text-[#64748B] leading-relaxed">
                Curating authentic travel experiences with seamless precision. Your ultimate companion for the subcontinent.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-[#0F172A] mb-4 text-xs uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link to="#" className="text-xs text-[#64748B] hover:text-[#F97316]">About Us</Link></li>
                <li><Link to="#" className="text-xs text-[#64748B] hover:text-[#F97316]">Destinations</Link></li>
                <li><Link to="#" className="text-xs text-[#64748B] hover:text-[#F97316]">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] mb-4 text-xs uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li><Link to="#" className="text-xs text-[#64748B] hover:text-[#F97316]">Terms of Service</Link></li>
                <li><Link to="#" className="text-xs text-[#64748B] hover:text-[#F97316]">Privacy Policy</Link></li>
                <li><Link to="#" className="text-xs text-[#64748B] hover:text-[#F97316]">Cookie Policy</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#0F172A] mb-4 text-xs uppercase tracking-wider">Follow Us</h4>
              <div className="flex items-center gap-4">
                 <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#F97316] shadow-sm hover:bg-[#F97316] hover:text-white transition-colors">
                    <Facebook className="w-4 h-4" />
                 </a>
                 <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#F97316] shadow-sm hover:bg-[#F97316] hover:text-white transition-colors">
                    <Twitter className="w-4 h-4" />
                 </a>
                 <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#F97316] shadow-sm hover:bg-[#F97316] hover:text-white transition-colors">
                    <Instagram className="w-4 h-4" />
                 </a>
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-[#FDE6D5]">
             <p className="text-[10px] text-slate-400 font-medium">
               &copy; {new Date().getFullYear()} GlobeTrotter India. All rights reserved. Made with love for India.
             </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
