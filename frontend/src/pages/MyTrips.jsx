import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  FileText, 
  Pencil, 
  Eye 
} from 'lucide-react';

const MyTrips = () => {
  const [activeTab, setActiveTab] = useState('Upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  // Realistic mock data matching the screenshot exactly
  const allTrips = [
    {
      id: 1,
      name: 'Rajasthan Adventure',
      dates: '10 - 17 Sep 2024',
      route: 'Jaipur • Udaipur • Jaisalmer',
      budget: '₹20,000 Budget',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80' // Beautiful Mehrangarh Fort / Jodhpur view
    },
    {
      id: 2,
      name: 'Kerala Escape',
      dates: '20 - 26 Dec 2024',
      route: 'Kochi • Munnar',
      budget: '₹25,000 Budget',
      status: 'Upcoming',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80' // Kerala backwaters houseboat
    }
  ];

  const tabs = ['All', 'Upcoming', 'Ongoing', 'Completed', 'Drafts'];

  // Filter trips based on tab and search query
  const filteredTrips = allTrips.filter((trip) => {
    // Tab filter
    if (activeTab !== 'All' && trip.status !== activeTab) {
      if (activeTab === 'Drafts' && trip.status === 'Draft') {
        // match draft
      } else {
        return false;
      }
    }
    // Search query filter
    return (
      trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.route.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight">My Trips</h1>
          <p className="text-sm font-semibold text-[#64748B] mt-1">
            Manage your journeys, from dreams to memories.
          </p>
        </div>
        
        {/* Right Header Search and Action */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-[#94A3B8]" />
            </span>
            <input 
              type="text" 
              placeholder="Search trips..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-full border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#852C06] focus:border-[#852C06] w-full sm:w-64 bg-white/50" 
            />
          </div>
          <Link 
            to="/trips/create" 
            className="flex items-center gap-1.5 bg-[#852C06] hover:bg-[#9A3412] text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md text-xs hover:scale-[1.02] flex-shrink-0"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            New Trip
          </Link>
        </div>
      </div>

      {/* 2. Filter Tabs capsules row */}
      <div className="flex flex-wrap gap-2.5 pb-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                isActive
                  ? 'bg-[#852C06] text-white'
                  : 'bg-[#FFF7ED] hover:bg-[#FFF1F2] text-[#852C06]'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 3. Grid of trip cards */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-[#E2E8F0] shadow-premium text-center space-y-4">
          <div className="text-5xl">🏝️</div>
          <h3 className="font-extrabold text-[#0F172A] text-base">No trips found</h3>
          <p className="text-[#64748B] text-xs max-w-sm mx-auto">
            We couldn't find any travel plans matching your criteria. Start planning your next dream itinerary now!
          </p>
          <Link 
            to="/trips/create" 
            className="inline-block bg-[#852C06] hover:bg-[#9A3412] text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md transition-all hover:scale-[1.02]"
          >
            Plan a Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTrips.map((trip) => (
            <div 
              key={trip.id}
              className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col hover-lift"
            >
              {/* Trip Card Image Thumbnail */}
              <div className="h-56 bg-slate-100 relative overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.name} 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay Top-Left status label */}
                <div className="absolute top-4 left-4 bg-[#FDE047] text-[#854D0E] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-sm border border-[#FEF08A]">
                  <Clock className="w-3.5 h-3.5 text-[#854D0E]" />
                  {trip.status}
                </div>

                {/* Overlay Top-Right menu trigger */}
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-[#94A3B8] hover:text-[#64748B] p-1.5 rounded-full shadow-sm">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/></svg>
                </button>
              </div>

              {/* Trip Card details content */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div className="space-y-2.5">
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    {trip.name}
                  </h3>
                  
                  <div className="space-y-1.5">
                    {/* Dates */}
                    <p className="text-xs text-[#64748B] flex items-center gap-2 font-semibold">
                      <Calendar className="w-4 h-4 text-[#94A3B8]" />
                      {trip.dates}
                    </p>
                    
                    {/* Destinations / Route */}
                    <p className="text-xs text-[#64748B] flex items-center gap-2 font-semibold">
                      <MapPin className="w-4 h-4 text-[#F97316]" />
                      {trip.route}
                    </p>
                    
                    {/* Budget */}
                    <p className="text-xs text-[#64748B] flex items-center gap-2 font-semibold">
                      <FileText className="w-4 h-4 text-[#94A3B8]" />
                      {trip.budget}
                    </p>
                  </div>
                </div>

                {/* Card Action buttons */}
                <div className="flex gap-4 pt-3 border-t border-[#F1F5F9] mt-2">
                  <Link 
                    to="/trips/create" 
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#852C06] font-bold py-2.5 rounded-2xl text-xs transition-all shadow-sm"
                  >
                    <Pencil className="h-3.5 w-3.5 stroke-[2.5]" />
                    Edit
                  </Link>
                  <Link 
                    to={`/trips/${trip.id}`} 
                    className="flex-1 flex items-center justify-center gap-1.5 bg-[#852C06] hover:bg-[#9A3412] text-white font-bold py-2.5 rounded-2xl text-xs transition-all shadow-sm"
                  >
                    <Eye className="h-3.5 w-3.5 stroke-[2.5]" />
                    View Itinerary
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyTrips;
