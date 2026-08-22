import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Compass, Calendar, Copy, Check, PlaneTakeoff, Clock, MapPin } from 'lucide-react';

const SharedItinerary = () => {
  const { shareToken } = useParams();
  const { isAuthenticated } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const [cloning, setCloning] = useState(false);

  useEffect(() => {
    const loadSharedTrip = async () => {
      try {
        const response = await api.get(`/api/share/${shareToken}`);
        setTrip(response.data);
      } catch (error) {
        console.error('Failed to load shared trip:', error);
        toastError('This itinerary is not available or is no longer public.');
      } finally {
        setLoading(false);
      }
    };

    loadSharedTrip();
  }, [shareToken]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      toastSuccess('Itinerary link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      toastError('Failed to copy link.');
    }
  };

  const handleCloneTrip = async () => {
    if (!isAuthenticated) {
      toastInfo('Please log in or create an account to copy this trip to your dashboard.');
      navigate('/login');
      return;
    }

    setCloning(true);
    try {
      const response = await api.post(`/api/share/${shareToken}/copy`);
      toastSuccess('Trip copied to your dashboard! You can now customize it.');
      navigate(`/trips/${response.data.id}`);
    } catch (error) {
      console.error('Cloning shared trip failed:', error);
      toastError('Failed to copy this trip.');
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-premium text-center space-y-4 max-w-sm">
          <p className="text-slate-500 text-sm">Shared trip not found or link has expired.</p>
          <Link to="/login" className="bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs inline-block">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  // Calculate day-wise flat itinerary list
  const getFlatItineraryDays = () => {
    const daysMap = [];
    let dayCounter = 1;

    trip.stops.forEach(stop => {
      let curr = new Date(stop.startDate);
      const end = new Date(stop.endDate);

      while (curr <= end) {
        const dateStr = curr.toISOString().split('T')[0];
        
        const acts = stop.activities.filter(act => {
          const actDateStr = new Date(act.date).toISOString().split('T')[0];
          return actDateStr === dateStr;
        }).sort((a, b) => a.startTime.localeCompare(b.startTime));

        daysMap.push({
          dayNum: dayCounter,
          date: new Date(curr),
          cityName: stop.city.name,
          cityCountry: stop.city.country,
          activities: acts
        });

        dayCounter++;
        curr.setDate(curr.getDate() + 1);
      }
    });

    return daysMap;
  };

  const itineraryDays = getFlatItineraryDays();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <nav className="bg-white border-b border-slate-100 py-4 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <Link to="/dashboard" className="flex items-center gap-2.5 text-lg font-extrabold text-brand-dark tracking-tight">
          <img src="/logo.png" alt="GlobeTrotter Logo" className="h-8 w-8 object-contain rounded-lg shadow-sm" />
          <span>GlobeTrotter</span>
        </Link>
        {isAuthenticated ? (
          <Link to="/dashboard" className="text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-all">
            Go to Dashboard
          </Link>
        ) : (
          <Link to="/login" className="text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 px-4 py-2 rounded-xl transition-all">
            Login / Signup
          </Link>
        )}
      </nav>

      {/* Main Content Area */}
      <main className="max-w-4xl w-full mx-auto px-4 py-8 flex-grow space-y-6">
        {/* Cover banner */}
        <div className="relative rounded-3xl overflow-hidden h-64 shadow-premium border border-slate-100">
          <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-white z-10">
            <div className="space-y-1">
              <span className="bg-brand-secondary/85 backdrop-blur-sm px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase">
                Shared Plan • {trip.travelStyle}
              </span>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight mt-1.5">{trip.name}</h1>
              <p className="text-slate-300 text-xs font-semibold flex items-center gap-1.5 mt-0.5">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(trip.startDate).toLocaleDateString(undefined, { dateStyle: 'medium' })} - {new Date(trip.endDate).toLocaleDateString(undefined, { dateStyle: 'medium' })}
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={handleCopyLink}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-white/15 flex items-center gap-1.5"
              >
                {copiedLink ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                Copy Link
              </button>
              <button
                onClick={handleCloneTrip}
                disabled={cloning}
                className="bg-brand-accent hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              >
                <PlaneTakeoff className="h-4 w-4" />
                {cloning ? 'Copying...' : 'Copy and Customize'}
              </button>
            </div>
          </div>
        </div>

        {/* Content list */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Itinerary Details */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-base font-extrabold text-slate-900 border-b border-slate-200 pb-2">Shared Day-by-day Plan</h2>
            <div className="relative border-l-2 border-slate-200 pl-8 ml-4 space-y-6">
              {itineraryDays.map((day) => (
                <div key={day.dayNum} className="relative space-y-3">
                  <div className="absolute -left-[41px] top-1 bg-brand-secondary border-4 border-white h-6 w-6 rounded-full flex items-center justify-center shadow-sm" />
                  
                  <h3 className="font-bold text-slate-800 text-xs">
                    Day {day.dayNum} — {day.cityName}
                    <span className="text-[10px] text-slate-400 font-semibold uppercase ml-2">
                      {day.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 gap-2.5">
                    {day.activities.length === 0 ? (
                      <div className="bg-slate-50/50 border border-slate-100 p-3 rounded-xl text-slate-400 text-xs italic">
                        No scheduled spots for this day.
                      </div>
                    ) : (
                      day.activities.map((act) => {
                        const actName = act.activity?.name || act.customName;
                        return (
                          <div key={act.id} className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <Clock className="h-4 w-4 text-slate-400" />
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 text-xs truncate">{actName}</h4>
                                <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 block">
                                  {act.startTime} - {act.endTime}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Route Map & Budget */}
          <div className="space-y-6">
            {/* Travel Path Visualization */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-850 text-xs uppercase tracking-wider">Itinerary Route Map</h3>
              <div className="w-full bg-slate-950 p-4 rounded-xl relative shadow-inner overflow-hidden">
                <svg viewBox="0 0 500 300" className="w-full h-auto relative z-10">
                  {(() => {
                    const stops = trip.stops;
                    if (stops.length === 0) return null;

                    const lats = stops.map(s => s.city.latitude);
                    const lons = stops.map(s => s.city.longitude);
                    const minLat = Math.min(...lats);
                    const maxLat = Math.max(...lats);
                    const minLon = Math.min(...lons);
                    const maxLon = Math.max(...lons);

                    const latSpan = (maxLat - minLat) || 1;
                    const lonSpan = (maxLon - minLon) || 1;

                    const mapCoords = stops.map(s => {
                      const x = 50 + ((s.city.longitude - minLon) / lonSpan) * 400;
                      const y = 250 - ((s.city.latitude - minLat) / latSpan) * 200;
                      return { x, y, name: s.city.name };
                    });

                    return (
                      <>
                        {mapCoords.map((c, idx) => {
                          if (idx === 0) return null;
                          const prev = mapCoords[idx - 1];
                          return (
                            <line
                              key={idx}
                              x1={prev.x}
                              y1={prev.y}
                              x2={c.x}
                              y2={c.y}
                              stroke="#0EA5E9"
                              strokeWidth="1.5"
                              strokeDasharray="4,4"
                            />
                          );
                        })}
                        {mapCoords.map((c, idx) => (
                          <g key={idx}>
                            <circle cx={c.x} cy={c.y} r="4.5" fill="#F97316" stroke="#fff" strokeWidth="1" />
                            <text x={c.x} y={c.y - 10} textAnchor="middle" fill="#E2E8F0" fontSize="8" fontWeight="bold">
                              {c.name}
                            </text>
                          </g>
                        ))}
                      </>
                    );
                  })()}
                </svg>
              </div>
            </div>

            {/* Budget Highlights */}
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-sm text-xs">
              <h3 className="font-extrabold text-brand-secondary text-xs uppercase tracking-wider">Estimated Budget Highlight</h3>
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-slate-400">Total Budget Managed:</span>
                <span className="font-bold">₹{trip.budget.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Cities Added:</span>
                <span className="font-bold">{trip.stops?.length || 0} stops</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} GlobeTrotter Personalized Travel Platform.
      </footer>
    </div>
  );
};

export default SharedItinerary;
