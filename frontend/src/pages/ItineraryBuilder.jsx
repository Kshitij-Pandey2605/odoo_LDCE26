import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  Plus, 
  Clock, 
  Map, 
  Eye, 
  AlertTriangle, 
  Car, 
  Compass, 
  Info,
  DollarSign,
  Tag
} from 'lucide-react';

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const [activeDay, setActiveDay] = useState(1);

  // Journey route timeline data
  const routeStops = [
    { name: 'Ahmedabad', status: 'START', type: 'filled' },
    { name: 'Udaipur', status: '2 NIGHTS', type: 'outlined', distance: '260 km • 5h' },
    { name: 'Jodhpur', status: '2 NIGHTS', type: 'outlined', distance: '250 km • 5h' },
    { name: 'Jaipur', status: '3 NIGHTS', type: 'outlined', distance: '330 km • 6h' }
  ];

  // Days list mock data
  const days = [
    { num: 1, title: 'Ahmedabad Arrival', date: '10 Sep' },
    { num: 2, title: 'Drive to Udaipur', date: '11 Sep' },
    { num: 3, title: 'Udaipur City Tour', date: '12 Sep' },
    { num: 4, title: 'Drive to Jodhpur', date: '13 Sep' },
    { num: 5, title: 'Mehrangarh Fort', date: '14 Sep' }
  ];

  // Activities database for each day
  const dailyActivities = {
    1: [
      {
        time: '10 AM',
        title: 'Sabarmati Ashram',
        category: 'HERITAGE',
        categoryBg: 'bg-[#EFF6FF] text-[#2563EB]',
        description: "Experience the tranquility of Mahatma Gandhi's former residence. A deeply moving start to the Rajasthan and Gujarat journey, focusing on Gandhi's life and philosophy.",
        duration: '10:00 AM - 12:30 PM',
        cost: 'Free Entry',
        costColor: 'text-[#16A34A] bg-[#F0FDF4]',
        image: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '2 PM',
        title: 'Adalaj Stepwell',
        category: 'ARCHITECTURE',
        categoryBg: 'bg-[#FFF7ED] text-[#EA580C]',
        description: 'Marvel at the stunning five-story deep stepwell, a masterpiece of Indo-Islamic architecture built in 1498. Offers a cool retreat from the sun and beautiful photo locations.',
        duration: '2:00 PM - 4:00 PM',
        cost: '₹50 / person',
        costColor: 'text-[#64748B] bg-[#F1F5F9]',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '6 PM',
        title: 'Sabarmati Riverfront',
        category: 'LEISURE',
        categoryBg: 'bg-[#ECFDF5] text-[#10B981]',
        description: 'Evening stroll along the beautifully developed riverfront. Perfect time to enjoy the sunset, local street food snacks, and the vibrant local evening atmosphere.',
        duration: '6:00 PM - 8:30 PM',
        cost: 'Free (Food extra)',
        costColor: 'text-[#16A34A] bg-[#F0FDF4]',
        image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80'
      }
    ],
    2: [
      {
        time: '9 AM',
        title: 'Road Trip to Udaipur',
        category: 'TRAVEL',
        categoryBg: 'bg-[#F0FDF4] text-[#16A34A]',
        description: 'Check out from Ahmedabad and drive to Udaipur. Enjoy the changing landscape as you enter the scenic Aravalli hills range.',
        duration: '9:00 AM - 2:00 PM',
        cost: 'Included in Transport',
        costColor: 'text-[#64748B] bg-[#F1F5F9]',
        image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '5 PM',
        title: 'Sunset Boat Cruise at Lake Pichola',
        category: 'LEISURE',
        categoryBg: 'bg-[#ECFDF5] text-[#10B981]',
        description: 'Scenic sunset boat ride passing by the iconic Lake Palace and Jag Mandir. Captures the best evening reflections of the City Palace facade.',
        duration: '5:00 PM - 6:30 PM',
        cost: '₹400 / person',
        costColor: 'text-[#2563EB] bg-[#EFF6FF]',
        image: 'https://images.unsplash.com/photo-1598977123418-45f04b616a4e?auto=format&fit=crop&w=600&q=80'
      }
    ],
    3: [
      {
        time: '10 AM',
        title: 'Udaipur City Palace',
        category: 'HERITAGE',
        categoryBg: 'bg-[#EFF6FF] text-[#2563EB]',
        description: 'Explore the grand City Palace complex, featuring ornate courtyards, detailed mosaics, mirrors, and historic weapon collections of the Mewar kings.',
        duration: '10:00 AM - 1:00 PM',
        cost: '₹250 / person',
        costColor: 'text-[#64748B] bg-[#F1F5F9]',
        image: 'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '3 PM',
        title: 'Saheliyon-ki-Bari Garden',
        category: 'LEISURE',
        categoryBg: 'bg-[#ECFDF5] text-[#10B981]',
        description: 'Walk through the historical Courtyard of the Maidens, featuring lotus pools, marble pavilions, and unique rain-mimicking fountains.',
        duration: '3:00 PM - 4:30 PM',
        cost: '₹50 / person',
        costColor: 'text-[#64748B] bg-[#F1F5F9]',
        image: 'https://images.unsplash.com/photo-1585128792020-803d29415281?auto=format&fit=crop&w=600&q=80'
      }
    ],
    4: [
      {
        time: '8 AM',
        title: 'Drive to Jodhpur via Ranakpur',
        category: 'TRAVEL',
        categoryBg: 'bg-[#F0FDF4] text-[#16A34A]',
        description: 'Embark on the road trip to Jodhpur. Make a midway stop at the famous 15th-century Ranakpur Jain Temple, renowned for its 1,444 uniquely carved pillars.',
        duration: '8:00 AM - 2:00 PM',
        cost: '₹100 entry fee',
        costColor: 'text-[#64748B] bg-[#F1F5F9]',
        image: 'https://images.unsplash.com/photo-1601999109332-542b18dbec57?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '5 PM',
        title: 'Explore Clock Tower & Sadar Market',
        category: 'CULTURE',
        categoryBg: 'bg-[#FFF1F2] text-[#DB2777]',
        description: 'Vibrant local bazaar walk filled with colorful textiles, authentic spices, hand-crafted leather items, and traditional Jodhpuri sweets.',
        duration: '5:00 PM - 7:30 PM',
        cost: 'Free entry',
        costColor: 'text-[#16A34A] bg-[#F0FDF4]',
        image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80'
      }
    ],
    5: [
      {
        time: '9 AM',
        title: 'Mehrangarh Fort Tour',
        category: 'HERITAGE',
        categoryBg: 'bg-[#EFF6FF] text-[#2563EB]',
        description: 'Visit the massive clifftop Mehrangarh Fort. Walk through its palatial rooms, look out over Jodhpur\'s famous blue houses, and see the historic royal palanquin collections.',
        duration: '9:00 AM - 12:30 PM',
        cost: '₹200 / person',
        costColor: 'text-[#64748B] bg-[#F1F5F9]',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80'
      },
      {
        time: '2 PM',
        title: 'Jaswant Thada Memorial',
        category: 'ARCHITECTURE',
        categoryBg: 'bg-[#FFF7ED] text-[#EA580C]',
        description: 'A peaceful white marble cenotaph dedicated to Maharaja Jaswant Singh II, located near the fort lake. Known as the Taj Mahal of Marwar.',
        duration: '2:00 PM - 3:30 PM',
        cost: '₹50 / person',
        costColor: 'text-[#64748B] bg-[#F1F5F9]',
        image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80'
      }
    ]
  };

  const currentActivities = dailyActivities[activeDay] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FFE2E2] text-[#EF4444] rounded px-2.5 py-0.5 text-xs font-bold tracking-wide uppercase">
              Custom Itinerary
            </span>
            <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#94A3B8]" />
              10-17 Sep 2026
            </span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0F172A] tracking-tight mt-1">
            Rajasthan Adventure
          </h1>
        </div>
        
        {/* Header CTA Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-[#0F172A] border border-[#E2E8F0] px-5 py-2.5 rounded-full font-bold transition-all shadow-sm text-xs hover:scale-[1.02] flex-1 sm:flex-initial">
            <Map className="w-4 h-4 text-[#64748B]" />
            Map View
          </button>
          <button className="flex items-center justify-center gap-1.5 bg-[#852C06] hover:bg-[#9A3412] text-white px-5 py-2.5 rounded-full font-bold transition-all shadow-md text-xs hover:scale-[1.02] flex-1 sm:flex-initial">
            <Eye className="w-4 h-4 stroke-[2.5]" />
            Preview
          </button>
        </div>
      </div>

      {/* 2. Journey Route Progress Timeline */}
      <div className="bg-[#FFF8F6] border border-[#FFE2E2] rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex justify-between items-center text-xs font-bold text-[#852C06]">
          <span className="uppercase tracking-wider">Journey Route</span>
          <div className="flex items-center gap-3 text-[#64748B]">
            <span className="flex items-center gap-1">
              <Compass className="w-4 h-4 text-[#94A3B8]" />
              940 km total
            </span>
            <span className="flex items-center gap-1">
              <Car className="w-4 h-4 text-[#94A3B8]" />
              ~18h driving
            </span>
          </div>
        </div>

        {/* Timeline dots and connections */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-4 relative px-2">
          {routeStops.map((stop, index) => (
            <React.Fragment key={index}>
              {/* Stop Node */}
              <div className="flex flex-row md:flex-col items-center gap-3 md:gap-2 flex-grow-0 z-10">
                {stop.type === 'filled' ? (
                  <span className="w-5 h-5 rounded-full bg-[#852C06] border-4 border-[#FFF8F6] ring-2 ring-[#852C06]" />
                ) : (
                  <span className="w-5 h-5 rounded-full bg-white border-4 border-[#852C06]" />
                )}
                <div className="text-left md:text-center">
                  <p className="text-sm font-extrabold text-[#0F172A]">{stop.name}</p>
                  <p className="text-[10px] font-bold text-[#852C06] uppercase tracking-wider mt-0.5">{stop.status}</p>
                </div>
              </div>

              {/* Connecting Line (drawn for intermediate segments) */}
              {index < routeStops.length - 1 && (
                <div className="hidden md:flex flex-col flex-grow items-center justify-center -mt-6">
                  <span className="text-[9px] font-extrabold text-[#852C06] bg-[#FFF2EE] px-2 py-0.5 rounded-full mb-1 border border-[#FFE2E2]">
                    {routeStops[index + 1].distance}
                  </span>
                  <div className="w-full h-0.5 bg-[#852C06]/35" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* 3. Itinerary Grid details block */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column - Days Sidebar (1/4 width) */}
        <div className="space-y-3 lg:col-span-1">
          <p className="text-[11px] font-extrabold text-[#94A3B8] uppercase tracking-wider px-1">Itinerary</p>
          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {days.map((day) => {
              const isActive = activeDay === day.num;
              return (
                <button
                  key={day.num}
                  onClick={() => setActiveDay(day.num)}
                  className={`flex items-center justify-between gap-4 p-4 rounded-2xl text-left border transition-all text-xs font-bold w-48 lg:w-full flex-shrink-0 shadow-sm ${
                    isActive
                      ? 'bg-[#852C06] text-white border-[#852C06]'
                      : 'bg-white hover:bg-slate-50 text-[#0F172A] border-[#E2E8F0]'
                  }`}
                >
                  <div className="space-y-0.5">
                    <p className={isActive ? 'text-white' : 'text-[#0F172A]'}>Day {day.num}</p>
                    <p className={`text-[10px] ${isActive ? 'text-orange-200' : 'text-[#64748B]'} font-semibold truncate max-w-[120px] lg:max-w-[150px]`}>
                      {day.title}
                    </p>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider ${isActive ? 'text-orange-200' : 'text-[#94A3B8]'} font-bold`}>
                    {day.date}
                  </span>
                </button>
              );
            })}
            
            {/* Add destination button */}
            <button className="flex items-center gap-2 p-4 rounded-2xl text-left border border-dashed border-[#E2E8F0] bg-white text-[#94A3B8] hover:text-[#64748B] hover:border-slate-300 transition-all text-xs font-bold w-48 lg:w-full flex-shrink-0">
              <Plus className="w-4 h-4" />
              Add destination...
            </button>
          </div>
        </div>

        {/* Right Column - Day Schedule Content (3/4 width) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center px-1">
            <div>
              <h2 className="text-xl font-extrabold text-[#0F172A]">Day {activeDay} — {days.find(d => d.num === activeDay)?.title}</h2>
              <p className="text-xs text-[#64748B] font-semibold mt-0.5">Thursday, 10 September 2026</p>
            </div>
            <button className="flex items-center gap-1 bg-[#FFF7ED] hover:bg-[#FFF1F2] text-[#852C06] font-bold px-4 py-2 rounded-full text-xs transition-all shadow-sm">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              Add Activity
            </button>
          </div>

          {/* Schedule Overlap Warning (specifically for Day 1 as shown in mock) */}
          {activeDay === 1 && (
            <div className="bg-[#FFE2E2] border border-[#FCA5A5]/40 text-[#B91C1C] p-4 rounded-2xl flex items-start gap-3 shadow-sm">
              <AlertTriangle className="w-5 h-5 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold">Schedule Overlap Detected</p>
                <p className="text-[11px] font-semibold text-[#C2410C] mt-0.5">
                  Sabarmati Ashram visit overlaps with planned lunch. Please adjust timings.
                </p>
              </div>
            </div>
          )}

          {/* Activity Cards Timeline */}
          <div className="relative border-l border-[#E2E8F0] ml-3 pl-8 space-y-8 py-2">
            {currentActivities.map((act, index) => (
              <div key={index} className="relative">
                {/* Timeline timestamp marker dot */}
                <span className="absolute -left-[45px] top-6 bg-[#F8FAFC] text-[10px] font-bold text-[#852C06] px-2 py-0.5 rounded-full border border-[#E2E8F0] shadow-sm whitespace-nowrap">
                  {act.time}
                </span>

                {/* Activity card wrapper */}
                <div className="bg-white rounded-3xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-premium transition-all duration-300 flex flex-col sm:flex-row gap-5 hover-lift">
                  
                  {/* Activity Picture */}
                  <div className="w-full sm:w-40 h-28 bg-slate-100 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={act.image} 
                      alt={act.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Activity Details info */}
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-0.5">
                          <span className={`inline-block text-[9px] font-extrabold px-2.5 py-0.5 rounded-full tracking-wider ${act.categoryBg}`}>
                            {act.category}
                          </span>
                          <h4 className="text-base font-bold text-[#0F172A] mt-1">{act.title}</h4>
                        </div>
                        
                        {/* More Action Menu */}
                        <button className="text-[#94A3B8] hover:text-[#64748B]">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/></svg>
                        </button>
                      </div>
                      
                      <p className="text-xs text-[#64748B] font-medium leading-relaxed mt-2">
                        {act.description}
                      </p>
                    </div>

                    {/* Metadata indicators */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-3 border-t border-[#F1F5F9] text-xs font-bold text-[#64748B]">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#94A3B8]" />
                        {act.duration}
                      </span>
                      <span className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${act.costColor}`}>
                        <Tag className="w-3.5 h-3.5 text-[#94A3B8]" />
                        {act.cost}
                      </span>
                    </div>

                  </div>
                </div>
              </div>
            ))}

            {/* Dash border + Add Evening Activity placeholder */}
            <div className="relative">
              <div className="border-2 border-dashed border-[#E2E8F0] hover:border-slate-350 hover:bg-slate-50/30 rounded-3xl p-6 transition-all shadow-sm text-center flex flex-col items-center justify-center cursor-pointer">
                <button className="flex items-center gap-1.5 text-xs font-bold text-[#852C06]">
                  <span className="bg-[#FFF7ED] p-1.5 rounded-full flex items-center justify-center border border-[#FFE2E2]">
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </span>
                  Add Evening Activity
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ItineraryBuilder;
