import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  SlidersHorizontal, 
  Heart, 
  Plus, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Briefcase,
  Sun,
  DollarSign
} from 'lucide-react';

const CitySearch = () => {
  const [activeRegion, setActiveRegion] = useState('All Regions');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState({});

  // Mock data matching the screenshot exactly
  const initialCities = [
    {
      id: 1,
      name: 'Jaipur',
      region: 'West',
      location: 'Rajasthan, India',
      rating: '4.8',
      price: '₹₹ out of ₹₹',
      category: 'CULTURE',
      categoryBg: 'bg-[#C2512C] text-white',
      image: '/hawamahal.jpg'
    },
    {
      id: 2,
      name: 'Manali',
      region: 'North',
      location: 'Himachal Pradesh',
      rating: '4.9',
      price: '₹₹ out of ₹₹',
      category: 'ADVENTURE',
      categoryBg: 'bg-[#EA580C] text-white',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Munnar',
      region: 'South',
      location: 'Kerala, India',
      rating: '4.8',
      price: '₹₹ out of ₹₹',
      category: 'NATURE',
      categoryBg: 'bg-[#15803D] text-white',
      image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Goa',
      region: 'West',
      location: 'Goa, India',
      rating: '4.7',
      price: '₹₹₹ out of ₹₹',
      category: 'BEACH',
      categoryBg: 'bg-[#0369A1] text-white',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Popular this month trending list
  const popularDestinations = [
    { name: 'Agra', state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=300&q=80' },
    { name: 'Varanasi', state: 'Uttar Pradesh', image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0db?auto=format&fit=crop&w=300&q=80' },
    { name: 'Alleppey', state: 'Kerala', image: 'https://images.unsplash.com/photo-1593693411515-c202e974eb17?auto=format&fit=crop&w=300&q=80' },
    { name: 'Mumbai', state: 'Maharashtra', image: 'https://images.unsplash.com/photo-1562979314-bee7453e911c?auto=format&fit=crop&w=300&q=80' }
  ];

  const regions = ['All Regions', 'North', 'South', 'East', 'West', 'Central India'];

  const toggleFavorite = (id) => {
    setFavorites(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Filter logic
  const filteredCities = initialCities.filter((city) => {
    // Region Filter
    if (activeRegion !== 'All Regions' && city.region !== activeRegion) {
      return false;
    }
    // Search Query Filter
    return (
      city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-12">
      
      {/* 1. Search Header Banner */}
      <div 
        className="relative w-full h-[280px] bg-cover flex flex-col items-center justify-center text-center px-4"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(255, 255, 255, 0.35) 20%, rgba(255, 255, 255, 0.95) 100%), url('/india.jpg')`,
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] tracking-tight leading-tight">
            Explore Incredible India 🇮🇳
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] max-w-xl mx-auto font-semibold">
            Discover your next unforgettable destination across the subcontinent.
          </p>
          
          {/* Main search bar capsule */}
          <div className="relative w-full max-w-xl mx-auto mt-6">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-[#94A3B8]" />
            </span>
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-24 py-3 rounded-full border border-[#E2E8F0] text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#852C06] focus:border-[#852C06] w-full bg-white shadow-sm font-semibold" 
            />
            <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-[#852C06] hover:bg-[#9A3412] text-white px-5 rounded-full font-bold text-xs transition-all shadow-sm">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Main Page Container (padded and max-width aligned) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-10">
        
        {/* 2. Filters Section */}
        <div className="space-y-5">
          {/* Region Capsules Row */}
          <div className="flex flex-wrap gap-2.5 pb-2">
            {regions.map((reg) => {
              const isActive = activeRegion === reg;
              return (
                <button
                  key={reg}
                  onClick={() => setActiveRegion(reg)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                    isActive
                      ? 'bg-[#852C06] text-white'
                      : 'bg-[#FFF7ED] hover:bg-[#FFF1F2] text-[#852C06]'
                  }`}
                >
                  {reg}
                </button>
              );
            })}
          </div>

          {/* Dropdown Filters row */}
          <div className="flex flex-wrap justify-between items-center gap-4 pt-2 border-t border-slate-100">
            <div className="flex flex-wrap gap-3">
              {/* Budget dropdown */}
              <button className="flex items-center gap-1.5 px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 bg-white text-[#64748B] hover:text-[#0F172A] rounded-full text-xs font-bold transition-all shadow-sm">
                <DollarSign className="w-3.5 h-3.5" />
                Budget
                <span className="text-[10px] text-[#94A3B8] font-bold">▼</span>
              </button>
              
              {/* Popularity dropdown */}
              <button className="flex items-center gap-1.5 px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 bg-white text-[#64748B] hover:text-[#0F172A] rounded-full text-xs font-bold transition-all shadow-sm">
                <TrendingUp className="w-3.5 h-3.5" />
                Popularity
                <span className="text-[10px] text-[#94A3B8] font-bold">▼</span>
              </button>
              
              {/* Travel Type dropdown */}
              <button className="flex items-center gap-1.5 px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 bg-white text-[#64748B] hover:text-[#0F172A] rounded-full text-xs font-bold transition-all shadow-sm">
                <Briefcase className="w-3.5 h-3.5" />
                Travel Type
                <span className="text-[10px] text-[#94A3B8] font-bold">▼</span>
              </button>
              
              {/* Season dropdown */}
              <button className="flex items-center gap-1.5 px-4 py-2 border border-[#E2E8F0] hover:bg-slate-50 bg-white text-[#64748B] hover:text-[#0F172A] rounded-full text-xs font-bold transition-all shadow-sm">
                <Sun className="w-3.5 h-3.5" />
                Season
                <span className="text-[10px] text-[#94A3B8] font-bold">▼</span>
              </button>
            </div>

            {/* All Filters trigger */}
            <button className="flex items-center gap-1.5 px-4 py-2 text-[#852C06] hover:text-[#9A3412] font-bold text-xs">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              All Filters
            </button>
          </div>
        </div>

        {/* 3. Destinations Card Grid */}
        {filteredCities.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-[#E2E8F0] shadow-premium text-center space-y-4">
            <div className="text-5xl">🏔️</div>
            <h3 className="font-extrabold text-[#0F172A] text-base">No destinations found</h3>
            <p className="text-[#64748B] text-xs max-w-sm mx-auto">
              We couldn't find any destinations matching your criteria. Try adjusting your region or searching for another city!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCities.map((city) => (
              <div 
                key={city.id}
                className="bg-white rounded-3xl border border-[#E2E8F0] overflow-hidden shadow-sm hover:shadow-premium hover-lift transition-all"
              >
                {/* Destination Thumbnail */}
                <div className="h-48 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={city.image} 
                    alt={city.name} 
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Category Pill Tag Overlay bottom-left */}
                  <div className={`absolute bottom-3 left-3 px-3 py-1 rounded-full text-[9px] font-extrabold tracking-wider ${city.categoryBg}`}>
                    {city.category}
                  </div>
                  
                  {/* Like/Favorite Overlay button top-right */}
                  <button 
                    onClick={() => toggleFavorite(city.id)}
                    className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm p-1.5 rounded-full shadow-sm text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Heart className={`w-4 h-4 ${favorites[city.id] ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                  </button>
                </div>

                {/* Destination Info Content */}
                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-[#0F172A]">{city.name}</h3>
                    <span className="bg-orange-50 text-[#F97316] font-bold px-2 py-0.5 rounded text-[10px] flex items-center gap-0.5 border border-orange-100">
                      ★ {city.rating}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-[#64748B] flex items-center gap-1 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                      {city.location}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider pl-4.5">
                      {city.price}
                    </p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2.5 pt-2 border-t border-[#F1F5F9] mt-2">
                    <Link 
                      to={`/cities`} 
                      className="flex-1 flex items-center justify-center border border-[#852C06] hover:bg-[#852C06]/5 text-[#852C06] font-bold py-2 rounded-xl text-xs transition-all shadow-sm"
                    >
                      Details
                    </Link>
                    <button className="flex-1 flex items-center justify-center bg-[#852C06] hover:bg-[#9A3412] text-white font-bold py-2 rounded-xl text-xs transition-all shadow-sm">
                      Add Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Popular This Month Section */}
        <div className="space-y-5 pt-4 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">Popular This Month</h2>
              <p className="text-xs text-[#64748B] font-semibold mt-0.5">Trending destinations curated for you.</p>
            </div>
            <div className="flex gap-1.5">
              <button className="p-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-full text-[#64748B] transition-all shadow-sm">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-2 bg-white hover:bg-slate-50 border border-[#E2E8F0] rounded-full text-[#64748B] transition-all shadow-sm">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row of Popular items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, i) => (
              <div 
                key={i} 
                className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-sm hover:shadow-premium hover-lift transition-all flex items-center gap-4 cursor-pointer"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
                  <img 
                    src={dest.image} 
                    alt={dest.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#0F172A]">{dest.name}</h4>
                  <p className="text-xs text-[#94A3B8] font-semibold mt-0.5">{dest.state}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default CitySearch;
