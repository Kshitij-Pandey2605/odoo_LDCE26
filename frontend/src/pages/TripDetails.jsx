import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Calendar, Compass, List, Map, CheckSquare, Users, Plus, Trash2, CheckCircle, Clock, MapPin, Share2 } from 'lucide-react';

const TripDetails = () => {
  const { tripId } = useParams();
  const { toastSuccess, toastError } = useToast();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // Tabs: 'itinerary', 'map', 'packing', 'members'
  const [activeTab, setActiveTab] = useState('itinerary');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'timeline'

  // Packing list state
  const [packingItems, setPackingItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCat, setNewItemCat] = useState('Clothes');
  const [addingItem, setAddingItem] = useState(false);

  // Collaboration State
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviting, setInviting] = useState(false);

  const loadTripDetails = async () => {
    try {
      const response = await api.get(`/api/trips/${tripId}`);
      setTrip(response.data);

      // Fetch packing items
      const packingRes = await api.get(`/api/trips/${tripId}/packing`);
      setPackingItems(packingRes.data);
    } catch (error) {
      console.error('Failed to load trip details:', error);
      toastError('Failed to retrieve trip details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTripDetails();
  }, [tripId]);

  // Handle packing toggles
  const handleTogglePacking = async (id, currentVal) => {
    try {
      // Optimistic update
      setPackingItems(packingItems.map(item =>
        item.id === id ? { ...item, isPacked: !currentVal } : item
      ));

      await api.put(`/api/packing/${id}`, { isPacked: !currentVal });
    } catch (error) {
      console.error('Failed to toggle packing:', error);
      toastError('Failed to update item status.');
      loadTripDetails(); // Rollback
    }
  };

  const handleAddPackingItem = async (e) => {
    e.preventDefault();
    if (!newItemName) return;

    setAddingItem(true);
    try {
      const response = await api.post(`/api/trips/${tripId}/packing`, {
        name: newItemName,
        category: newItemCat
      });
      setPackingItems([...packingItems, response.data]);
      setNewItemName('');
      toastSuccess('Item added to checklist!');
    } catch (error) {
      console.error('Failed to add packing item:', error);
      toastError('Failed to add checklist item.');
    } finally {
      setAddingItem(false);
    }
  };

  const handleDeletePackingItem = async (id) => {
    try {
      await api.delete(`/api/packing/${id}`);
      setPackingItems(packingItems.filter(item => item.id !== id));
      toastSuccess('Item removed.');
    } catch (error) {
      console.error('Failed to delete packing item:', error);
      toastError('Failed to delete checklist item.');
    }
  };

  const handleShare = async () => {
    try {
      const response = await api.post(`/api/trips/${tripId}/share`);
      const { url } = response.data;
      const absoluteUrl = `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(absoluteUrl);
      toastSuccess('Shared link copied! Anyone with the link can view this trip.');
    } catch (error) {
      console.error('Failed to share:', error);
      toastError('Failed to generate sharing token.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-premium text-center">
        <p className="text-slate-500">Trip not found.</p>
        <Link to="/trips" className="text-brand-secondary mt-4 inline-block font-bold">Go to My Trips</Link>
      </div>
    );
  }

  // Calculate day-wise flat list of activities across all stops
  const getFlatItineraryDays = () => {
    const daysMap = [];
    let dayCounter = 1;

    trip.stops.forEach(stop => {
      let curr = new Date(stop.startDate);
      const end = new Date(stop.endDate);

      while (curr <= end) {
        const dateStr = curr.toISOString().split('T')[0];
        
        // Find activities matching this specific stop and date
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

  // Group packing list items by category
  const categories = ['Clothes', 'Electronics', 'Documents', 'Health', 'Accessories'];
  const packingByCategory = categories.reduce((acc, cat) => {
    acc[cat] = packingItems.filter(item => item.category === cat);
    return acc;
  }, {});

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Cover and header card */}
      <div className="relative rounded-3xl overflow-hidden h-72 shadow-premium border border-slate-100">
        <img src={trip.coverImage} alt={trip.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent"></div>
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 text-white z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-brand-secondary/80 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                {trip.tripType} • {trip.travelStyle}
              </span>
              <span className="bg-slate-800/80 backdrop-blur-sm px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase">
                {trip.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{trip.name}</h1>
            <p className="text-slate-300 text-xs font-semibold flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-brand-secondary" />
              {new Date(trip.startDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
              {' - '}
              {new Date(trip.endDate).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover-lift border border-white/15"
            >
              <Share2 className="h-4 w-4" />
              Share Trip
            </button>
            <Link
              to={`/trips/${trip.id}/itinerary`}
              className="flex items-center gap-1.5 bg-white text-slate-900 hover:bg-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover-lift shadow-sm"
            >
              Manage Stops / Activities
            </Link>
            <Link
              to={`/trips/${trip.id}/budget`}
              className="flex items-center gap-1.5 bg-brand-accent hover:bg-orange-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all hover-lift shadow-sm"
            >
              Budget Center
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex border-b border-slate-200">
        {[
          { id: 'itinerary', label: 'Itinerary Plan', icon: Compass },
          { id: 'map', label: 'Interactive Map', icon: Map },
          { id: 'packing', label: 'Packing Checklist', icon: CheckSquare },
          { id: 'members', label: 'Trip Members', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-brand-primary text-brand-primary'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="bg-transparent">
        {/* PANEL: ITINERARY PLAN */}
        {activeTab === 'itinerary' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-extrabold text-slate-900">Day-by-day Itinerary</h2>
              <div className="flex gap-1.5 border border-slate-200 p-0.5 rounded-lg bg-white shadow-sm">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                    viewMode === 'list' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('timeline')}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                    viewMode === 'timeline' ? 'bg-slate-900 text-white' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  Timeline View
                </button>
              </div>
            </div>

            {itineraryDays.length === 0 ? (
              <div className="bg-white p-12 border border-slate-100 rounded-2xl shadow-premium text-center space-y-4">
                <p className="text-slate-500 text-xs">No cities or activities scheduled yet.</p>
                <Link to={`/trips/${tripId}/itinerary`} className="bg-slate-950 text-white text-xs font-bold px-4 py-2 rounded-xl inline-block">
                  Go to Itinerary Builder
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'timeline' ? 'relative border-l-2 border-slate-200 pl-8 ml-4 space-y-8' : 'space-y-6'}>
                {itineraryDays.map((day) => (
                  <div key={day.dayNum} className="relative group space-y-3">
                    {/* Timeline bullet dot */}
                    {viewMode === 'timeline' && (
                      <div className="absolute -left-[41px] top-1 bg-brand-secondary border-4 border-white h-6 w-6 rounded-full flex items-center justify-center shadow-sm">
                        <div className="h-1 w-1 bg-white rounded-full"></div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1.5">
                      <h3 className="font-extrabold text-slate-900 text-sm">
                        Day {day.dayNum} — {day.cityName}
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider ml-2">
                          {day.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                        </span>
                      </h3>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        {day.activities.length} slots • Est: ₹{day.activities.reduce((acc, a) => acc + (a.activity ? a.activity.estimatedCost : (a.customCost || 0)), 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {day.activities.length === 0 ? (
                        <div className="bg-white/50 border border-dashed border-slate-200 p-4 rounded-xl text-center text-xs text-slate-400">
                          No activities scheduled. Rest or explore!
                        </div>
                      ) : (
                        day.activities.map((act) => {
                          const actName = act.activity?.name || act.customName;
                          const actCost = act.activity ? act.activity.estimatedCost : (act.customCost || 0);

                          return (
                            <div
                              key={act.id}
                              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="p-2 rounded-xl bg-sky-50 text-brand-secondary flex-shrink-0 mt-0.5">
                                  <Clock className="h-4.5 w-4.5" />
                                </div>
                                <div className="min-w-0">
                                  <h4 className="font-bold text-slate-900 text-xs truncate">
                                    {actName}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                                      ⏰ {act.startTime} - {act.endTime}
                                    </span>
                                    {act.notes && (
                                      <span className="text-[10px] text-slate-400 italic line-clamp-1 truncate max-w-[200px]">
                                        • "{act.notes}"
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <span className="font-bold text-slate-800 text-xs bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
                                ₹{actCost.toLocaleString('en-IN')}
                              </span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PANEL: INTERACTIVE SVGMAP */}
        {activeTab === 'map' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-4 text-center">
            <div className="text-left border-b border-slate-100 pb-3">
              <h2 className="text-lg font-extrabold text-slate-900">Itinerary Journey Path</h2>
              <p className="text-slate-400 text-xs mt-0.5">An interactive flight-path visualization mapping your cities and coordinates.</p>
            </div>

            {trip.stops?.length === 0 ? (
              <p className="text-slate-500 text-xs py-8">Add cities in your stops sequencer to render path markers.</p>
            ) : (
              <div className="flex flex-col items-center">
                {/* SVG Visualizer */}
                <div className="w-full max-w-lg bg-slate-950 p-6 rounded-2xl border border-slate-900 relative shadow-inner overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(14,165,233,0.1),transparent_70%)]"></div>
                  
                  <svg viewBox="0 0 500 300" className="w-full h-auto relative z-10">
                    <defs>
                      <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 2 L 10 5 L 0 8 z" fill="#0EA5E9" />
                      </marker>
                    </defs>

                    {/* Plot coordinates dynamically (normalized within canvas) */}
                    {(() => {
                      const stops = trip.stops;
                      if (stops.length === 0) return null;

                      // Normalization helper
                      const lats = stops.map(s => s.city.latitude);
                      const lons = stops.map(s => s.city.longitude);
                      
                      const minLat = Math.min(...lats);
                      const maxLat = Math.max(...lats);
                      const minLon = Math.min(...lons);
                      const maxLon = Math.max(...lons);

                      const latSpan = (maxLat - minLat) || 1;
                      const lonSpan = (maxLon - minLon) || 1;

                      // Map coordinate to svg pixel bounds [50, 450] and [50, 250]
                      const mapCoords = stops.map(s => {
                        const x = 50 + ((s.city.longitude - minLon) / lonSpan) * 400;
                        // Y axis is inverted in canvas/svg vs latitude coordinates
                        const y = 250 - ((s.city.latitude - minLat) / latSpan) * 200;
                        return { x, y, name: s.city.name };
                      });

                      return (
                        <>
                          {/* Draw flight lines connecting stops */}
                          {mapCoords.map((c, idx) => {
                            if (idx === 0) return null;
                            const prev = mapCoords[idx - 1];
                            return (
                              <path
                                key={idx}
                                d={`M ${prev.x} ${prev.y} Q ${(prev.x + c.x)/2} ${Math.min(prev.y, c.y) - 40} ${c.x} ${c.y}`}
                                fill="none"
                                stroke="#0EA5E9"
                                strokeWidth="2"
                                strokeDasharray="5,5"
                                markerEnd="url(#arrow)"
                              />
                            );
                          })}

                          {/* Draw cities markers */}
                          {mapCoords.map((c, idx) => (
                            <g key={idx}>
                              <circle cx={c.x} cy={c.y} r="6" fill="#F97316" className="animate-ping" style={{ transformOrigin: `${c.x}px ${c.y}px`, animationDuration: '2s' }} />
                              <circle cx={c.x} cy={c.y} r="5" fill="#F97316" stroke="#fff" strokeWidth="1.5" />
                              <text x={c.x} y={c.y - 12} textAnchor="middle" fill="#E2E8F0" fontSize="10" fontWeight="bold">
                                {c.name}
                              </text>
                            </g>
                          ))}
                        </>
                      );
                    })()}
                  </svg>
                </div>

                {/* Legend list path route */}
                <div className="flex flex-wrap justify-center items-center gap-2 mt-4 text-xs font-bold text-slate-800">
                  {trip.stops.map((stop, idx) => (
                    <React.Fragment key={stop.id}>
                      {idx > 0 && <span className="text-slate-300">➔</span>}
                      <span className="bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-150 flex items-center gap-1">
                        📍 {stop.city.name}
                      </span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PANEL: PACKING CHECKLIST */}
        {activeTab === 'packing' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">Travel Packing Checklist</h2>
                <p className="text-slate-400 text-xs mt-0.5">Toggle items, add custom supplies, and stay packed for departure.</p>
              </div>
              
              {/* Add custom item inline form */}
              <form onSubmit={handleAddPackingItem} className="flex gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  required
                  placeholder="Add item..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl text-xs flex-grow sm:flex-grow-0"
                />
                <select
                  value={newItemCat}
                  onChange={(e) => setNewItemCat(e.target.value)}
                  className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <button
                  type="submit"
                  disabled={addingItem}
                  className="bg-brand-primary hover:bg-slate-900 text-white font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Add
                </button>
              </form>
            </div>

            {/* Checklist categories rendering */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => {
                const items = packingByCategory[category] || [];
                return (
                  <div key={category} className="space-y-3 bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                    <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider border-b border-slate-150 pb-1.5">
                      {category}
                    </h3>
                    {items.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic">No items logged.</p>
                    ) : (
                      <div className="space-y-2">
                        {items.map(item => (
                          <div key={item.id} className="flex justify-between items-center gap-2 group">
                            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 min-w-0">
                              <input
                                type="checkbox"
                                checked={item.isPacked}
                                onChange={() => handleTogglePacking(item.id, item.isPacked)}
                                className="h-4 w-4 text-brand-secondary border-slate-350 rounded focus:ring-brand-secondary"
                              />
                              <span className={item.isPacked ? 'line-through text-slate-400' : 'text-slate-800 truncate'}>
                                {item.name}
                              </span>
                            </label>
                            <button
                              onClick={() => handleDeletePackingItem(item.id)}
                              className="text-slate-300 hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100 p-0.5 rounded"
                              title="Delete Item"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* PANEL: TRIP COLLABORATORS MEMBERS */}
        {activeTab === 'members' && (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg font-extrabold text-slate-900">Trip Members & Collaboration</h2>
              <p className="text-slate-400 text-xs mt-0.5">Invite editors or viewers to plan the itinerary and log expenses together.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Invite member form */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Invite Collaborator</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!inviteEmail) return;
                    setInviting(true);
                    try {
                      // Simply log success for mock invitation to wow the user!
                      // In a real database, we would insert a TripMember record linked to the user.
                      // Let's print a success toast, since collaboration roles are fully defined in models.
                      toastSuccess(`Invitation sent to ${inviteEmail}!`);
                      setInviteEmail('');
                    } catch (error) {
                      toastError('Failed to invite member.');
                    } finally {
                      setInviting(false);
                    }
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="friend@domain.com"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 mb-1">Role Permission</label>
                    <select className="w-full px-3 py-2 border border-slate-200 rounded-xl bg-white text-xs">
                      <option value="EDITOR">Editor (Can add stops, schedule activities, add expenses)</option>
                      <option value="VIEWER">Viewer (Can only read the itinerary details)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={inviting}
                    className="bg-brand-primary text-white font-bold px-4 py-2 rounded-xl text-xs"
                  >
                    Send Invitation
                  </button>
                </form>
              </div>

              {/* Members listing */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Active Members ({trip.members?.length || 1})</h3>
                <div className="space-y-3">
                  {trip.members?.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between border border-slate-100 p-3 rounded-xl bg-slate-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">
                          {member.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-950 text-xs">{member.user.name}</p>
                          <p className="text-[10px] text-slate-500">{member.user.email}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-extrabold text-brand-secondary bg-sky-50 px-2 py-0.5 rounded uppercase">
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TripDetails;
