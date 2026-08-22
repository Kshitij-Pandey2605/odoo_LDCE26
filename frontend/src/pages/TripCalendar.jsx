import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, MapPin, 
  List, CheckCircle2, AlertCircle, Sparkles, Filter, X, Eye
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

// Mock schedule data indexed by day
const MOCK_EVENTS = {
  9: [
    { id: 101, time: '09:00 AM', title: 'City Palace Tour', location: 'Jaipur / Udaipur, Rajasthan', status: 'Confirmed', tag: 'Sightseeing' },
    { id: 102, time: '12:30 PM', title: 'Lunch at Ambrai', location: 'Reservation confirmed', status: 'Highlighted', tag: 'Dining' },
    { id: 103, time: '05:00 PM', title: 'Sunset Boat Ride', location: 'Lake Pichola, Udaipur', status: 'Confirmed', tag: 'Activity' }
  ],
  10: [
    { id: 104, time: '10:00 AM', title: 'Sajjangarh Monsoon Palace', location: 'Aravalli Hilltop', status: 'Confirmed', tag: 'Sightseeing' },
    { id: 105, time: '02:00 PM', title: 'Local Handicraft Market Visit', location: 'Hathi Pol Bazaar', status: 'Pending', tag: 'Shopping' }
  ],
  15: [
    { id: 106, time: '11:00 AM', title: 'Bagore Ki Haveli Folk Dance', location: 'Gangaur Ghat', status: 'Confirmed', tag: 'Culture' }
  ],
  22: [
    { id: 107, time: '08:00 AM', title: 'Kumbhalgarh Fort Day Excursion', location: 'Rajsamand District', status: 'Confirmed', tag: 'Adventure' }
  ]
};

const TripCalendar = () => {
  const { toastSuccess, toastError } = useToast();
  
  // Navigation & View States
  const [currentView, setCurrentView] = useState('Calendar'); // 'Calendar' | 'Timeline' | 'List'
  const [selectedDay, setSelectedDay] = useState(9);
  const [currentMonth, setCurrentMonth] = useState('September 2026');
  
  // Add Event Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('10:00 AM');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventTag, setNewEventTag] = useState('Sightseeing');

  // Dynamic Event Map State
  const [eventsMap, setEventsMap] = useState(MOCK_EVENTS);

  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const prevMonthDays = [30, 31];
  const nextMonthDays = [1, 2, 3];

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEventTitle) {
      toastError('Event title is required.');
      return;
    }

    const newEv = {
      id: Date.now(),
      time: newEventTime,
      title: newEventTitle,
      location: newEventLocation || 'Specified Location',
      status: 'Confirmed',
      tag: newEventTag
    };

    setEventsMap(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newEv]
    }));

    toastSuccess(`Added "${newEventTitle}" for Sept ${selectedDay}!`);
    setNewEventTitle('');
    setNewEventLocation('');
    setShowAddModal(false);
  };

  const selectedEvents = eventsMap[selectedDay] || [];

  return (
    <div className="pb-10 max-w-7xl mx-auto space-y-6">
      
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Home</Link>
            <span>/</span>
            <span className="text-[#F97316] font-semibold">Calendar</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Trip Calendar</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage your travel schedule and activities.</p>
        </div>

        {/* View Toggle Tabs */}
        <div className="bg-white p-1 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1 self-start md:self-auto">
          {['Calendar', 'Timeline', 'List'].map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentView === view
                  ? 'bg-[#F97316] text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Main Views Switcher */}
      {currentView === 'Calendar' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ── LEFT SECTION: Month Calendar Grid (8 cols) ── */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
            
            {/* Calendar Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h2 className="text-lg font-bold text-[#0F172A]">{currentMonth}</h2>
                <button className="p-1.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-[#F97316] hover:bg-[#C84F14] text-white px-4 py-2 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Event
              </button>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 text-center border-b border-slate-100 pb-3">
              {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
                <span key={day} className="text-[11px] font-bold text-slate-400 tracking-wider">
                  {day}
                </span>
              ))}
            </div>

            {/* 7x5 Month Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Previous month muted days */}
              {prevMonthDays.map((d) => (
                <div key={`prev-${d}`} className="h-16 rounded-2xl p-2 text-slate-300 text-xs font-semibold bg-slate-50/50">
                  {d}
                </div>
              ))}

              {/* Current month days */}
              {daysInMonth.map((day) => {
                const isSelected = selectedDay === day;
                const dayEvents = eventsMap[day] || [];
                const hasEvents = dayEvents.length > 0;

                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`h-16 rounded-2xl p-2 text-left relative transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-[#FFF7ED] border-2 border-[#F97316] shadow-sm'
                        : 'border border-slate-100 hover:border-slate-200 bg-white'
                    }`}
                  >
                    <span className={`text-xs font-bold ${isSelected ? 'text-[#F97316]' : 'text-slate-700'}`}>
                      {day}
                    </span>

                    {/* Indicators */}
                    {hasEvents && (
                      <div className="space-y-1">
                        {isSelected ? (
                          <div className="space-y-0.5">
                            <div className="h-1 w-full bg-[#F97316] rounded-full" />
                            <div className="h-1 w-3/4 bg-[#F97316]/70 rounded-full" />
                          </div>
                        ) : (
                          <div className="h-1 w-full bg-[#F97316] rounded-full" />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Next month muted days */}
              {nextMonthDays.map((d) => (
                <div key={`next-${d}`} className="h-16 rounded-2xl p-2 text-slate-300 text-xs font-semibold bg-slate-50/50">
                  {d}
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT SECTION: Day Schedule Sidebar (4 cols) ── */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Featured Day Header Image */}
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
              <div className="relative h-36">
                <img
                  src="https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Destination"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <span className="absolute top-3 left-3 bg-[#F97316] text-white text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-md tracking-wider">
                  Udaipur Trip
                </span>
                <div className="absolute bottom-3 left-4 text-white">
                  <h3 className="text-xl font-bold">September {selectedDay}</h3>
                </div>
              </div>

              {/* Events Timeline List */}
              <div className="p-6 space-y-5">
                {selectedEvents.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 space-y-2">
                    <CalendarIcon className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-medium">No events scheduled for Sept {selectedDay}.</p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="text-xs text-[#F97316] font-bold hover:underline"
                    >
                      + Add Activity
                    </button>
                  </div>
                ) : (
                  <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pl-5">
                    {selectedEvents.map((ev) => (
                      <div key={ev.id} className="relative group">
                        {/* Timeline dot */}
                        <div className={`absolute -left-[27px] top-1.5 w-3 h-3 rounded-full border-2 border-white ${
                          ev.status === 'Highlighted' ? 'bg-[#F97316] ring-4 ring-[#F97316]/20' : 'bg-[#F97316]'
                        }`} />

                        {/* Event Card Container */}
                        <div className={`p-3.5 rounded-2xl transition-all ${
                          ev.status === 'Highlighted'
                            ? 'bg-[#EEF2FF] border border-[#C7D2FE]'
                            : 'bg-slate-50 hover:bg-slate-100/80 border border-slate-100'
                        }`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-extrabold text-[#F97316] uppercase tracking-wider flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {ev.time}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase bg-white px-2 py-0.5 rounded-md border border-slate-100">
                              {ev.tag}
                            </span>
                          </div>
                          
                          <h4 className="text-xs font-bold text-[#0F172A] mt-1">{ev.title}</h4>
                          
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" /> {ev.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Quick Event Button */}
                <button
                  onClick={() => setShowAddModal(true)}
                  className="w-full py-2.5 border-2 border-dashed border-slate-200 hover:border-[#F97316] rounded-2xl text-xs font-bold text-slate-500 hover:text-[#F97316] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add Event for Sept {selectedDay}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Timeline View Mode */}
      {currentView === 'Timeline' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-[#0F172A] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F97316]" /> Full Trip Chronological Timeline
          </h3>

          <div className="relative border-l-2 border-[#FDE6D5] ml-4 space-y-8 pl-6">
            {Object.keys(eventsMap).map((dayKey) => (
              <div key={dayKey} className="space-y-3">
                <div className="relative">
                  <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#F97316] border-2 border-white" />
                  <h4 className="text-sm font-bold text-[#F97316]">September {dayKey}, 2026</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {eventsMap[dayKey].map((item) => (
                    <div key={item.id} className="bg-[#FFF7ED] border border-[#FDE6D5] p-4 rounded-2xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-[#C84F14]">{item.time}</span>
                        <span className="text-[10px] font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full">{item.tag}</span>
                      </div>
                      <h5 className="text-xs font-bold text-[#0F172A]">{item.title}</h5>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {item.location}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* List View Mode */}
      {currentView === 'List' && (
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0F172A]">All Scheduled Activities</h3>
            <span className="text-xs font-bold text-slate-400">Total: 6 Activities</span>
          </div>

          <div className="divide-y divide-slate-100">
            {Object.entries(eventsMap).flatMap(([day, evList]) =>
              evList.map((ev) => (
                <div key={ev.id} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-50 px-3 rounded-xl transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#FFF7ED] border border-[#FDE6D5] flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] font-extrabold text-[#F97316] uppercase">SEP</span>
                      <span className="text-xs font-bold text-[#0F172A] leading-none">{day}</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F172A]">{ev.title}</h4>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" /> {ev.time} • {ev.location}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#F97316] bg-[#FFF7ED] px-3 py-1 rounded-full border border-[#FDE6D5]">
                    {ev.tag}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal: Add Event */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-fade-in border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#F97316]" /> Add Event for Sept {selectedDay}
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddEventSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dinner at Jagmandir Island"
                  value={newEventTitle}
                  onChange={(e) => setNewEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#F97316]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">Tag Category</label>
                  <select
                    value={newEventTag}
                    onChange={(e) => setNewEventTag(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#F97316]"
                  >
                    <option value="Sightseeing">Sightseeing</option>
                    <option value="Dining">Dining</option>
                    <option value="Activity">Activity</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Culture">Culture</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Location / Notes</label>
                <input
                  type="text"
                  placeholder="Location or address details..."
                  value={newEventLocation}
                  onChange={(e) => setNewEventLocation(e.target.value)}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#F97316]"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#F97316] hover:bg-[#C84F14] text-white py-3 rounded-xl font-bold text-xs shadow-md transition-all"
              >
                Save Event to Calendar
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TripCalendar;
