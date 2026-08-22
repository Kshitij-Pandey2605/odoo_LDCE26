import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Wallet, 
  Plane, 
  Compass
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Mock data to match the design screenshot exactly
  const stats = [
    { label: 'Upcoming Trips', value: '2', icon: Plane, bg: 'bg-[#FFF1F2]', text: 'text-[#E11D48]' },
    { label: 'Total Budget', value: '₹45,000', icon: Wallet, bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]' },
    { label: 'Days to Travel', value: '18', icon: Calendar, bg: 'bg-[#FFF7ED]', text: 'text-[#EA580C]' },
    { label: 'States', value: '3', icon: MapPin, bg: 'bg-[#FFF1F2]', text: 'text-[#DB2777]' }
  ];

  const trips = [
    {
      id: 1,
      name: 'Rajasthan Adventure',
      destinations: 'Jaipur, Udaipur, Jodhpur',
      countdown: 'In 12 Days',
      startDate: 'Oct 15',
      endDate: 'Oct 25',
      tags: ['Culture', 'Heritage'],
      image: '/hawamahal.jpg'
    },
    {
      id: 2,
      name: 'Kerala Escape',
      destinations: 'Kochi, Munnar, Alleppey',
      countdown: 'In 40 Days',
      startDate: 'Nov 20',
      endDate: 'Nov 28',
      tags: ['Nature', 'Relaxation'],
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const budgetCategories = [
    { name: 'Transport', value: 40, color: '#F97316' },   // Orange
    { name: 'Stay', value: 30, color: '#D97706' },        // Amber
    { name: 'Food', value: 20, color: '#EAB308' },        // Yellow
    { name: 'Activities', value: 10, color: '#8B5CF6' }   // Purple
  ];

  const destinations = [
    { id: 1, name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Goa', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Udaipur', image: 'https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=600&q=80' }
  ];

  return (
    <div className="space-y-12">
      
      {/* 1. Full-Width Hero Section */}
      <div 
        className="relative w-full h-[440px] bg-cover bg-[center_top_20%] flex flex-col items-center justify-center text-center px-4"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(248, 250, 252, 0.2) 40%, rgba(248, 250, 252, 1) 100%), url('/hawamahal.jpg')` 
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
            Where will your next adventure take you?
          </h1>
          <p className="text-sm sm:text-base text-[#475569] max-w-xl mx-auto font-semibold leading-relaxed">
            Discover the magic of India. Plan seamless itineraries, track your budget, and explore hidden gems.
          </p>
          
          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link 
              to="/trips/create" 
              className="flex items-center gap-2 bg-[#852C06] hover:bg-[#9A3412] text-white px-7 py-3.5 rounded-full font-bold transition-all shadow-md text-sm hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              Plan New Trip
            </Link>
            <Link 
              to="/cities" 
              className="flex items-center gap-2 bg-white/40 backdrop-blur-sm border border-[#852C06] hover:bg-[#852C06]/5 text-[#852C06] px-7 py-3.5 rounded-full font-bold transition-all shadow-sm text-sm hover:scale-[1.02]"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </div>

      {/* Main Page Container (padded and max-width aligned) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
        
        {/* 2. Stats Overlay Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 -mt-24 relative z-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={index} 
                className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-premium flex items-center gap-4"
              >
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.text}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">{stat.label}</p>
                  <p className="text-xl sm:text-2xl font-black text-[#0F172A] mt-0.5">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3. Main Content Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
          
          {/* Left Column (2/3 width) - Upcoming Trips */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center px-1">
              <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Upcoming Trips</h2>
              <Link 
                to="/trips" 
                className="text-xs font-bold text-[#F97316] hover:text-[#EA580C] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {trips.map((trip) => (
                <div 
                  key={trip.id}
                  className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col sm:flex-row hover-lift"
                >
                  {/* Trip Thumbnail */}
                  <div className="w-full sm:w-48 h-36 sm:h-auto relative bg-slate-100 flex-shrink-0">
                    <img 
                      src={trip.image} 
                      alt={trip.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-black/45 backdrop-blur-[2px] px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1 shadow-sm">
                      <Clock className="w-3.5 h-3.5 text-white" />
                      {trip.countdown}
                    </div>
                  </div>

                  {/* Trip Info Details */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="text-base font-bold text-[#0F172A] hover:text-[#F97316] transition-colors">
                          {trip.name}
                        </h3>
                        <button className="text-[#94A3B8] hover:text-[#64748B] p-1 rounded-full hover:bg-slate-50">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/></svg>
                        </button>
                      </div>
                      <p className="text-xs text-[#64748B] flex items-center gap-1 mt-1 font-semibold">
                        <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                        {trip.destinations}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {trip.tags.map((tag, i) => (
                          <span 
                            key={i} 
                            className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-[#FFF7ED] text-[#F97316]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Trip Card Bottom */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#F1F5F9]">
                      <p className="text-xs text-[#64748B] font-bold flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {trip.startDate} - {trip.endDate}
                      </p>
                      <Link 
                        to={`/trips/${trip.id}`} 
                        className="text-xs font-extrabold text-[#F97316] hover:text-[#EA580C] flex items-center gap-0.5"
                      >
                        View Details
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column (1/3 width) - Budget Overview */}
          <div className="space-y-4">
            <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight px-1">Budget Overview</h2>
            
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col justify-between h-[342px]">
              {/* Chart Area */}
              <div className="relative h-44 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={budgetCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {budgetCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Centered Ring Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Total</span>
                  <span className="text-2xl font-black text-[#0F172A] mt-0.5">₹45k</span>
                </div>
              </div>

              {/* Categorized Progress Breakdown */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2 pt-2 border-t border-[#F1F5F9]">
                {budgetCategories.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-[#64748B]">{cat.name}</span>
                    </div>
                    <span className="text-[#0F172A]">{cat.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* 4. Popular Destinations Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-lg font-extrabold text-[#0F172A] tracking-tight">Popular Destinations</h2>
            <div className="flex gap-1.5">
              <button className="p-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-full text-[#64748B] transition-all shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-full text-[#64748B] transition-all shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Carousel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destinations.map((dest) => (
              <Link 
                key={dest.id}
                to="/cities" 
                className="relative rounded-3xl overflow-hidden h-64 bg-slate-900 group shadow-sm hover:shadow-premium hover-lift transition-all"
              >
                <img 
                  src={dest.image} 
                  alt={dest.name} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="text-lg font-black text-white tracking-wide">{dest.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 5. AI Planner Banner */}
        <div className="bg-gradient-to-r from-[#C2512C] to-[#F97316] rounded-3xl p-8 text-white relative overflow-hidden shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Background blobs */}
          <div className="absolute -top-10 -left-10 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          {/* Left Copy */}
          <div className="relative z-10 max-w-xl space-y-3">
            <span className="inline-flex items-center gap-1 bg-white/25 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 fill-white text-[#F97316]" />
              AI Planner
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Not sure where to start?</h2>
            <p className="text-sm text-orange-50 font-medium leading-relaxed">
              Let our AI Travel Planner craft the perfect itinerary based on your preferences, budget, and travel style.
            </p>
            <div className="pt-2">
              <Link 
                to="/trips/create" 
                className="inline-flex items-center gap-1.5 bg-white hover:bg-orange-50 text-[#C2512C] px-5 py-2.5 rounded-full font-bold transition-all text-xs shadow-md hover:scale-[1.02]"
              >
                Try AI Planner
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Right CSS Mock Visual */}
          <div className="relative z-10 w-full md:w-80 flex-shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-xl text-xs space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 fill-white" />
                  AI Recommendation
                </span>
                <span className="opacity-80 font-semibold text-[10px]">Day 1 - Udaipur</span>
              </div>
              
              <div className="space-y-2">
                <div className="bg-white/10 p-2 rounded-lg border border-white/10 flex items-start gap-2">
                  <span className="text-base mt-0.5">🌅</span>
                  <div>
                    <h4 className="font-bold">Sunrise at Lake Pichola</h4>
                    <p className="opacity-80 text-[10px] mt-0.5">Boat ride near Jag Mandir Palace</p>
                  </div>
                </div>
                
                <div className="bg-white/10 p-2 rounded-lg border border-white/10 flex items-start gap-2">
                  <span className="text-base mt-0.5">🏰</span>
                  <div>
                    <h4 className="font-bold">City Palace Museum</h4>
                    <p className="opacity-80 text-[10px] mt-0.5">Explore Rajput architecture history</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
