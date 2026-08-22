import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Wallet, 
  Calendar, 
  Clock, 
  MapPin, 
  TrendingDown, 
  Compass, 
  Briefcase, 
  Share2, 
  Copy, 
  Globe 
} from 'lucide-react';

const TripDetails = () => {
  const { tripId } = useParams();

  // Mock timeline day cards matching the design exactly
  const timelineDays = [
    {
      dayNum: 1,
      title: 'Day 1: Ahmedabad Arrival',
      date: '10 SEPTEMBER',
      tag: 'Heritage',
      tagBg: 'bg-[#FFF1F2] text-[#E11D48] border-[#FFE4E6]',
      description: "Arrive in India's first UNESCO World Heritage City. Settle into the hotel and head straight for a heritage walk through the ancient 'Pols' (neighborhoods) before visiting the iconic Sabarmati Ashram.",
      stops: ['Sabarmati Ashram', 'Manek Chowk Night Market'],
      image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80'
    },
    {
      dayNum: 3,
      title: 'Day 3: The City of Lakes',
      date: '12 SEPTEMBER',
      tag: 'Romance',
      tagBg: 'bg-[#FFF1F2] text-[#DB2777] border-[#FFE4E6]',
      description: 'Drive to Udaipur. The landscape shifts from flat plains to the dramatic Aravalli hills. Spend the afternoon exploring the labyrinthine City Palace, ending with a sunset boat ride on Lake Pichola.',
      stops: ['City Palace Tour', 'Jag Mandir Sunset'],
      image: 'https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=600&q=80'
    },
    {
      dayNum: 5,
      title: 'Day 5: Blue City Heights',
      date: '14 SEPTEMBER',
      tag: 'Architecture',
      tagBg: 'bg-[#FFF7ED] text-[#EA580C] border-[#FFEDD5]',
      description: "Arrive in Jodhpur. The colossal Mehrangarh Fort dominates the skyline. We'll spend hours getting lost in its history, followed by a walk down into the blue-washed alleyways of the old city for local sweets.",
      stops: ['Mehrangarh Fort', 'Toorji Ka Jhalra (Stepwell)'],
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
    }
  ];

  // Stats cards metadata
  const stats = [
    { label: 'EST. BUDGET', value: '₹25,000', icon: Wallet, bg: 'bg-[#FFF1F2]', text: 'text-[#E11D48]' },
    { label: 'DURATION', value: '7 Days', icon: Calendar, bg: 'bg-[#FFF7ED]', text: 'text-[#EA580C]' },
    { label: 'DESTINATIONS', value: '4 Cities', icon: Compass, bg: 'bg-[#FFF1F2]', text: 'text-[#DB2777]' },
    { label: 'PACE', value: 'Moderate', icon: Briefcase, bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]' }
  ];

  return (
    <div className="space-y-12 animate-fade-in">
      
      {/* 1. Header Hero Banner Block */}
      <div 
        className="relative w-full h-[320px] bg-cover bg-center flex flex-col justify-end pb-8"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.65) 100%), url('/jalmahal.png')` 
        }}
      >
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-orange-400 tracking-wider uppercase">
              10-17 SEP • 7 DAYS
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Rajasthan Adventure
            </h1>
            
            {/* Curator avatar stack */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex -space-x-2">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" 
                  alt="Curator" 
                  className="w-7 h-7 rounded-full object-cover border border-[#1E293B]"
                />
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" 
                  alt="Curator" 
                  className="w-7 h-7 rounded-full object-cover border border-[#1E293B]"
                />
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-[10px] font-bold text-[#852C06] border border-[#1E293B]">
                  +3
                </div>
              </div>
              <span className="text-xs text-white/90 font-bold">
                Curated by Rahul & Friends
              </span>
            </div>
          </div>

          {/* Right Logo Tag inside Hero */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex flex-col items-center justify-center text-center shadow-lg w-40 sm:self-end">
            <span className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Created With</span>
            <div className="flex items-center gap-1.5 mt-1.5 h-6">
              <img src="/logo.png" alt="GlobeTrotter Logo" className="h-full object-contain brightness-0 invert" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Page Container (2-Column Grid) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column (2/3 width) - Overview & Timeline */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* 01 Trip Overview */}
            <div className="space-y-4">
              <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                01 Trip Overview
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] font-semibold leading-relaxed">
                A vibrant journey through the heart of western India, starting from the bustling streets of Ahmedabad and winding into the regal landscapes of Rajasthan. This itinerary blends architectural marvels, rich culinary experiences, and the tranquil beauty of desert lakes. Designed for those who seek both cultural depth and moments of quiet reflection.
              </p>
              
              {/* Stats Cards Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-3">
                {stats.map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div 
                      key={i} 
                      className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm flex flex-col justify-between h-[108px]"
                    >
                      <div className={`p-2.5 rounded-2xl ${stat.bg} ${stat.text} w-fit`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[9px] font-bold text-[#94A3B8] uppercase tracking-wider">{stat.label}</p>
                        <p className="text-sm font-black text-[#0F172A] mt-0.5">{stat.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 02 Day-by-Day Journey */}
            <div className="space-y-8">
              <h2 className="text-xl font-extrabold text-[#0F172A] tracking-tight">
                02 Day-by-Day Journey
              </h2>

              {/* Vertical timeline line container */}
              <div className="relative border-l-2 border-orange-100 ml-4 pl-8 space-y-8 py-2">
                {timelineDays.map((day, i) => (
                  <div key={i} className="relative">
                    {/* Circle marker dot */}
                    <span className="absolute -left-[43px] top-6 w-6 h-6 rounded-full bg-[#FFF8F6] border-2 border-[#852C06] flex items-center justify-center shadow-sm">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#852C06]" />
                    </span>

                    {/* Timeline card content */}
                    <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col sm:flex-row gap-6 hover-lift transition-all">
                      {/* Image */}
                      <div className="w-full sm:w-44 h-32 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                        <img 
                          src={day.image} 
                          alt={day.title} 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Content details */}
                      <div className="flex-grow flex flex-col justify-between space-y-3">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-[10px] font-bold text-[#94A3B8] tracking-wider uppercase">{day.date}</p>
                              <h3 className="text-base font-bold text-[#0F172A] mt-0.5">{day.title}</h3>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[9px] font-bold border ${day.tagBg}`}>
                              {day.tag}
                            </span>
                          </div>
                          
                          <p className="text-xs text-[#64748B] font-semibold leading-relaxed mt-2.5">
                            {day.description}
                          </p>
                        </div>

                        {/* Stops list pins */}
                        <div className="flex flex-wrap gap-x-5 gap-y-1.5 pt-3 border-t border-[#F1F5F9] text-xs font-bold text-[#64748B]">
                          {day.stops.map((stop, sIdx) => (
                            <span key={sIdx} className="flex items-center gap-1">
                              <MapPin className="w-4 h-4 text-[#F97316]" />
                              {stop}
                            </span>
                          ))}
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (1/3 width) - Sidebar Cards */}
          <div className="space-y-6">
            
            {/* The Route Card */}
            <div className="bg-white rounded-3xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-[#0F172A]">The Route</h3>
                <p className="text-[11px] font-bold text-[#64748B] mt-0.5">
                  Ahmedabad → Udaipur → Jodhpur
                </p>
              </div>

              {/* Static Map visual cropped screenshot container */}
              <div className="h-52 bg-slate-100 rounded-2xl overflow-hidden border border-[#E2E8F0]">
                <img 
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=400&q=80" 
                  alt="Static Route Map" 
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-[#F1F5F9]">
                <span className="text-[#0F172A]">Total Distance</span>
                <span className="text-[#0F172A]">~450 km</span>
              </div>
              
              {/* Orange bottom accent line */}
              <div className="w-16 h-1.5 bg-[#F97316] rounded-full mt-1.5" />
            </div>

            {/* Love this trip CTA Card */}
            <div className="bg-gradient-to-br from-[#852C06] to-[#F97316] rounded-3xl p-6 text-white space-y-5 shadow-md relative overflow-hidden">
              {/* Decorative background blob */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
              
              <div className="space-y-2 relative z-10">
                <h3 className="text-lg font-extrabold tracking-tight">Love this trip?</h3>
                <p className="text-xs font-semibold text-orange-50 leading-relaxed">
                  Make it yours. Copy this itinerary to your dashboard and adjust it to fit your travel style.
                </p>
              </div>

              <div className="space-y-3 relative z-10 pt-2">
                <button className="w-full flex items-center justify-center gap-1.5 bg-white hover:bg-orange-50 text-[#852C06] font-bold py-3 rounded-full text-xs transition-all shadow-md">
                  <Copy className="w-4 h-4 stroke-[2.5]" />
                  Copy & Customize
                </button>
                <button className="w-full flex items-center justify-center gap-1.5 bg-transparent border border-white/40 hover:bg-white/10 text-white font-bold py-3 rounded-full text-xs transition-all shadow-sm">
                  <Share2 className="w-4 h-4 stroke-[2.5]" />
                  Share Itinerary
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default TripDetails;
