import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Wallet, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Download, 
  ArrowRight, 
  Calculator, 
  CreditCard, 
  Gift, 
  CheckCircle,
  HelpCircle,
  TrendingDown,
  Info,
  DollarSign
} from 'lucide-react';

const TripBudget = () => {
  const { tripId } = useParams();
  const [activeFilter, setActiveFilter] = useState('All');

  // Stats cards data
  const stats = [
    { label: 'Total Budget', value: '₹25,000', sub: 'Your planned budget', icon: Wallet, color: 'bg-orange-50 text-orange-600' },
    { label: 'Estimated Cost', value: '₹20,500', sub: '82% of total budget', icon: Calculator, color: 'bg-amber-50 text-amber-600' },
    { label: 'Actual Spending', value: '₹18,200', sub: '73% of total budget', icon: CreditCard, color: 'bg-rose-50 text-rose-600' },
    { label: 'Remaining Budget', value: '₹6,800', sub: 'Left to spend', icon: Gift, color: 'bg-emerald-50 text-emerald-600', isGreen: true }
  ];

  // Filters data
  const filters = ['All', 'Accommodation', 'Transport', 'Food', 'Activities', 'Other'];

  // Mock expenses data
  const allExpenses = [
    { id: 1, date: '12 Sep, 2026', category: 'Accommodation', desc: 'Hotel Lake Palace, Udaipur', amount: '₹3,500', method: 'Card', color: 'bg-[#FFF1F2] text-[#E11D48]' },
    { id: 2, date: '11 Sep, 2026', category: 'Transport', desc: 'Ahmedabad → Udaipur Train', amount: '₹620', method: 'UPI', color: 'bg-[#FFF7ED] text-[#EA580C]' },
    { id: 3, date: '11 Sep, 2026', category: 'Food', desc: 'Lunch at 1559 AD', amount: '₹850', method: 'Cash', color: 'bg-[#FEF9C3] text-[#A16207]' },
    { id: 4, date: '10 Sep, 2026', category: 'Activities', desc: 'City Palace Entry', amount: '₹300', method: 'Card', color: 'bg-[#F0FDF4] text-[#16A34A]' },
    { id: 5, date: '10 Sep, 2026', category: 'Transport', desc: 'Local Taxi - Udaipur', amount: '₹450', method: 'Cash', color: 'bg-[#FFF7ED] text-[#EA580C]' },
    { id: 6, date: '10 Sep, 2026', category: 'Other', desc: 'Snacks & Water', amount: '₹120', method: 'Cash', color: 'bg-[#F1F5F9] text-[#64748B]' }
  ];

  // Budget by Category progress bar data
  const categoriesProgress = [
    { name: 'Accommodation', amount: '₹8,200', pct: 40, color: 'bg-[#C2512C]' },
    { name: 'Transport', amount: '₹5,125', pct: 25, color: 'bg-[#F97316]' },
    { name: 'Food & Dining', amount: '₹3,690', pct: 18, color: 'bg-[#FB923C]' },
    { name: 'Activities & Tickets', amount: '₹2,460', pct: 12, color: 'bg-[#FDBA74]' },
    { name: 'Other', amount: '₹1,025', pct: 5, color: 'bg-[#CBD5E1]' }
  ];

  // Insights tips
  const tips = [
    { 
      type: 'Accommodation Tip', 
      desc: 'Accommodation takes 40% of your budget. Consider heritage homestays to save ~₹2,000.', 
      action: 'Explore Homestays', 
      icon: '🏨' 
    },
    { 
      type: 'Transport Tip', 
      desc: 'Use public transport for city travel to save 10-15% on transport cost.', 
      action: 'View Transport Options', 
      icon: '🚌' 
    },
    { 
      type: 'Food Tip', 
      desc: 'Try local food instead of fine dining to save ~₹1,000.', 
      action: 'Explore Local Food', 
      icon: '🍛' 
    }
  ];

  // Destination wise cost data
  const destinations = [
    { name: 'Udaipur', days: '3 Days', amount: '₹6,500', image: 'https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=400&q=80' },
    { name: 'Jodhpur', days: '2 Days', amount: '₹4,800', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80' },
    { name: 'Jaipur', days: '2 Days', amount: '₹5,200', image: '/hawamahal.jpg' },
    { name: 'Ahmedabad', days: '1 Day', amount: '₹4,000', image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=400&q=80' }
  ];

  const filteredExpenses = activeFilter === 'All' 
    ? allExpenses 
    : allExpenses.filter(e => e.category === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. Header Banner block */}
      <div 
        className="relative rounded-3xl overflow-hidden bg-cover bg-right border border-[#E2E8F0] p-8 min-h-[220px] flex flex-col justify-between"
        style={{ 
          backgroundImage: `linear-gradient(to right, rgba(255, 255, 255, 1) 40%, rgba(255, 255, 255, 0.7) 65%, rgba(255, 255, 255, 0) 100%), url('https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=800&q=80')` 
        }}
      >
        <div className="space-y-4 max-w-xl">
          {/* Breadcrumbs */}
          <div className="text-[11px] font-bold text-[#64748B] tracking-wide flex items-center gap-1.5 uppercase">
            <span>My Trips</span>
            <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
            <span>Rajasthan Adventure</span>
            <ChevronRight className="w-3 h-3 text-[#94A3B8]" />
            <span className="text-[#852C06]">Budget</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight flex items-center gap-2">
              Rajasthan Adventure Budget
              <button className="p-1 rounded-md text-[#94A3B8] hover:text-[#64748B] hover:bg-slate-50 transition-all">
                <Edit3 className="w-4.5 h-4.5" />
              </button>
            </h1>
            
            <div className="flex flex-wrap gap-2.5">
              <span className="bg-slate-100 text-[#475569] rounded px-2.5 py-0.5 text-xs font-bold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                10 Sep – 17 Sep, 2026
              </span>
              <span className="bg-slate-100 text-[#475569] rounded px-2.5 py-0.5 text-xs font-bold">
                7 Days
              </span>
              <span className="bg-slate-100 text-[#475569] rounded px-2.5 py-0.5 text-xs font-bold">
                4 Cities
              </span>
            </div>
            
            <p className="text-xs text-[#64748B] font-semibold">
              Track your expenses and stay on budget for a perfect Rajasthani journey.
            </p>
          </div>
        </div>

        {/* Right side CTA Action Buttons inside banner */}
        <div className="flex flex-wrap items-center gap-3 pt-6 sm:pt-0">
          <button className="flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-[#E2E8F0] text-[#0F172A] px-5 py-2.5 rounded-full font-bold transition-all shadow-sm text-xs hover:scale-[1.02]">
            <Download className="w-4 h-4 text-[#64748B]" />
            Download Report
          </button>
          <button className="flex items-center gap-1.5 bg-[#852C06] hover:bg-[#9A3412] text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md text-xs hover:scale-[1.02]">
            <Plus className="w-4 h-4 stroke-[3]" />
            Add Expense
          </button>
        </div>
      </div>

      {/* 2. Four Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between relative overflow-hidden h-[128px]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">{stat.label}</p>
                <p className={`text-2xl font-black mt-1 ${stat.isGreen ? 'text-[#16A34A]' : 'text-[#0F172A]'}`}>
                  {stat.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-2xl ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] font-semibold text-[#64748B]">{stat.sub}</p>
            
            {/* Orange/Yellow Bottom indicator bar */}
            <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${stat.isGreen ? 'bg-[#FCD34D]' : 'bg-[#E11D48]'}`} />
          </div>
        ))}
      </div>

      {/* 3. Budget Alert Container */}
      <div className="bg-[#F0FDF4] border border-[#DCFCE7] rounded-3xl p-5 shadow-sm flex items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="bg-emerald-100 p-2 rounded-full text-emerald-600 mt-0.5">
            <CheckCircle className="w-5 h-5 fill-emerald-100" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#15803D]">You are within budget! 🎉</h3>
            <p className="text-xs font-semibold text-[#16A34A] mt-0.5">
              You're doing great. Keep tracking your expenses to make the most of your trip.
            </p>
          </div>
        </div>

        {/* CSS/SVG Mock Character Illustration */}
        <div className="hidden md:block flex-shrink-0 w-24 h-16 relative">
          {/* Custom Traveler Girl SVG */}
          <svg viewBox="0 0 100 80" className="w-full h-full text-emerald-800">
            {/* Simple stylized walking traveler illustration */}
            <circle cx="50" cy="25" r="8" fill="#FDBA74" /> {/* Head */}
            <path d="M45,18 L55,18 C52,14 48,14 45,18 Z" fill="#852C06" /> {/* Hat */}
            <path d="M40,33 L60,33 L55,60 L45,60 Z" fill="#C2512C" /> {/* Dress/Coat */}
            <rect x="42" y="60" width="4" height="15" fill="#FDBA74" /> {/* Leg 1 */}
            <rect x="54" y="60" width="4" height="15" fill="#FDBA74" /> {/* Leg 2 */}
            <circle cx="65" cy="40" r="5" fill="#FDE047" /> {/* Map paper */}
          </svg>
        </div>
      </div>

      {/* 4. Main grid layout of expenses */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2/3 width) - Recent Expenses */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Recent Expenses</h2>
            
            {/* Horizontal Filter Capsules */}
            <div className="flex flex-wrap gap-1.5">
              {filters.map((filt) => {
                const isActive = activeFilter === filt;
                return (
                  <button
                    key={filt}
                    onClick={() => setActiveFilter(filt)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                      isActive
                        ? 'bg-[#852C06] text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-[#475569]'
                    }`}
                  >
                    {filt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expenses Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#94A3B8] font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Date</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Description</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3 pr-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9] text-[#475569]">
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4.5 pl-2 text-[#64748B]">{exp.date}</td>
                    <td className="py-4.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${exp.color}`}>
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-4.5 font-bold text-[#0F172A]">{exp.desc}</td>
                    <td className="py-4.5 font-bold text-[#0F172A]">{exp.amount}</td>
                    <td className="py-4.5 text-[#64748B]">{exp.method}</td>
                    <td className="py-4.5 pr-2 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button className="p-1 rounded text-[#94A3B8] hover:text-[#64748B] hover:bg-slate-100 transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button className="p-1 rounded text-[#94A3B8] hover:text-[#EF4444] hover:bg-red-50 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-center pt-2 border-t border-[#F1F5F9]">
            <button className="inline-flex items-center gap-1 text-xs font-bold text-[#852C06] hover:text-[#9A3412] hover:underline">
              View All Expenses
              <ArrowRight className="w-4.5 h-4.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Right Column (1/3 width) - Budget by Category */}
        <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between h-full min-h-[420px]">
          <div className="space-y-5">
            <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Budget by Category</h2>
            
            <div className="space-y-4">
              {categoriesProgress.map((cat, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-[#0F172A]">{cat.name}</span>
                    <div className="space-x-1.5 text-right">
                      <span className="text-[#0F172A]">{cat.amount}</span>
                      <span className="text-[#94A3B8] font-semibold">{cat.pct}%</span>
                    </div>
                  </div>
                  {/* Category Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color} rounded-full`} style={{ width: `${cat.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#F1F5F9] mt-6">
            <span className="text-sm font-extrabold text-[#0F172A]">Total Spent</span>
            <span className="text-xl font-black text-[#0F172A]">₹20,500</span>
          </div>
        </div>

      </div>

      {/* 5. Budget Tips & Insights */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Budget Tips & Insights</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Tip Cards */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {tips.map((tip, i) => (
              <div 
                key={i} 
                className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between min-h-[170px]"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-[#852C06] uppercase tracking-wide">
                      {tip.type}
                    </span>
                    <span className="text-base">{tip.icon}</span>
                  </div>
                  <p className="text-[11px] font-semibold text-[#64748B] leading-relaxed">
                    {tip.desc}
                  </p>
                </div>
                
                <button className="border border-[#852C06] hover:bg-[#852C06]/5 text-[#852C06] font-bold py-1.5 rounded-full text-[10px] transition-all shadow-sm">
                  {tip.action}
                </button>
              </div>
            ))}
          </div>

          {/* Jharokha Archway Thumbnail Card */}
          <div className="relative rounded-3xl overflow-hidden h-[180px] md:h-auto bg-slate-900 group shadow-sm">
            <img 
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80" 
              alt="Rajasthani Archway" 
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      </div>

      {/* 6. Destination wise Estimated Cost */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Destination-wise Estimated Cost</h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((dest, i) => (
            <div 
              key={i} 
              className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-premium hover-lift transition-all"
            >
              <div className="h-28 bg-slate-100 relative">
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="text-xs font-bold text-[#0F172A]">{dest.name}</h3>
                  <span className="text-[10px] font-semibold text-[#94A3B8]">{dest.days}</span>
                </div>
                <p className="text-sm font-black text-[#0F172A]">{dest.amount}</p>
                
                {/* Visual Progress Sub bar */}
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. Bottom CTA Banner */}
      <div className="bg-gradient-to-r from-[#C2512C] to-[#F97316] rounded-3xl p-8 text-white relative overflow-hidden shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">Plan smart. Travel better.</h2>
          <p className="text-xs text-orange-50 font-semibold leading-relaxed">
            Keep tracking your budget and enjoy a stress-free journey.
          </p>
        </div>

        <Link 
          to={`/trips/${tripId}/itinerary`} 
          className="relative z-10 inline-flex items-center gap-1 bg-white hover:bg-orange-50 text-[#C2512C] px-5 py-2.5 rounded-full font-bold transition-all text-xs shadow-md hover:scale-[1.02] flex-shrink-0"
        >
          Go to Itinerary
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>

    </div>
  );
};

export default TripBudget;
