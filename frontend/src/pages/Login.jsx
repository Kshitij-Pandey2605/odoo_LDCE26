import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toastError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      toastSuccess('Welcome back to GlobeTrotter!');
      navigate('/dashboard');
    } else {
      toastError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left Column - Image Showcase */}
      <div className="hidden lg:flex lg:w-[45%] relative bg-slate-900 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1599661559905-2453883a9d70?q=80&w=2573&auto=format&fit=crop" 
          alt="Hawa Mahal, Jaipur, India" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Subtle gradient overlay to make text readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Dotted curve overlay decoration (approximated with CSS) */}
        <svg className="absolute inset-0 w-full h-full z-0 opacity-40 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path d="M0,70 Q25,80 50,65 T100,20" fill="none" stroke="white" strokeWidth="0.2" strokeDasharray="1 1" />
          <circle cx="20" cy="72" r="0.8" fill="white" />
          <circle cx="80" cy="40" r="0.8" fill="white" />
        </svg>

        {/* Text content overlay */}
        <div className="absolute bottom-16 left-12 right-12 z-10 text-white pr-12">
          <h1 className="text-5xl font-serif font-bold mb-4 leading-tight tracking-tight shadow-sm">
            Discover India's Heritage
          </h1>
          <p className="text-lg text-slate-100 font-medium">
            Your premium concierge for curating unforgettable journeys across the subcontinent.
          </p>
        </div>
        
        {/* Browser title-like branding */}
        <div className="absolute top-6 left-6 flex items-center text-white/90 z-10 text-sm font-semibold">
           <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
           </svg>
           Login / Signup - GlobeTrotter India
        </div>
      </div>

      {/* Right Column - Form Container */}
      <div className="w-full lg:w-[55%] flex items-center justify-center bg-[#FFF7ED] p-6 sm:p-12">
        <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/50">
          
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="GlobeTrotter Logo" className="h-12 w-12 object-contain rounded-xl shadow-md" />
            <span className="text-2xl font-extrabold text-[#431407] tracking-tight">GlobeTrotter</span>
          </div>

          <h2 className="text-3xl font-serif font-bold text-[#0F172A] tracking-tight">
            Welcome Back <span className="inline-block animate-wave origin-bottom-right">👋</span>
          </h2>
          <p className="text-[#64748B] text-sm mt-2 mb-8">
            Sign in to access your planned trips.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-[#0F172A] tracking-wide uppercase mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-[#FFF7ED]/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors text-[#0F172A] placeholder-slate-400"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-xs font-bold text-[#0F172A] tracking-wide uppercase">
                  Password
                </label>
                <a href="#" className="text-xs font-bold text-[#D05114] hover:text-[#F97316] transition-colors">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-[#FFF7ED]/50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] transition-colors text-[#0F172A] placeholder-slate-400 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1 pb-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-[#D05114] border-slate-300 rounded focus:ring-[#D05114] cursor-pointer"
              />
              <label htmlFor="remember-me" className="ml-2.5 block text-xs font-medium text-[#64748B] cursor-pointer">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C84F14] hover:bg-[#A93D0E] text-white py-3.5 rounded-xl text-sm font-bold shadow-md shadow-[#C84F14]/20 transition-all disabled:opacity-70 flex items-center justify-center"
            >
              {loading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                'Login'
              )}
            </button>
            
            {/* Divider */}
            <div className="relative py-2 flex items-center">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink-0 mx-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Or Continue With
              </span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* Google Login */}
            <button
              type="button"
              className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-[#0F172A] py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Google
            </button>

            {/* Signup Link */}
            <p className="text-center text-xs text-[#64748B] mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-[#C84F14] font-bold hover:underline underline-offset-2">
                Create Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
