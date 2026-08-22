import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { Compass, Calendar, Plus, Trash2, ArrowUp, ArrowDown, MapPin, AlertTriangle, Clock, ChevronRight } from 'lucide-react';

// Distance estimator between coordinate pairs
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  const drivingSpeedKmh = 60;
  const hours = distance / drivingSpeedKmh;
  const mins = Math.round((hours % 1) * 60);

  return {
    km: Math.round(distance),
    time: `${Math.floor(hours)}h ${mins}m`
  };
};

// Helper to convert "HH:MM" string to minutes from midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Helper to convert minutes from midnight to "HH:MM AM/PM" string
const minutesToTime = (min) => {
  const hours24 = Math.floor(min / 60);
  const minutes = min % 60;
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minsStr = minutes < 10 ? `0${minutes}` : minutes;
  return `${hours12}:${minsStr} ${ampm}`;
};

const ItineraryBuilder = () => {
  const { tripId } = useParams();
  const { toastSuccess, toastError, toastWarning } = useToast();

  const [trip, setTrip] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected stop for scheduling activities
  const [activeStop, setActiveStop] = useState(null);

  // Add stop state
  const [showAddStop, setShowAddStop] = useState(false);
  const [newCityId, setNewCityId] = useState('');
  const [newStopStart, setNewStopStart] = useState('');
  const [newStopEnd, setNewStopEnd] = useState('');

  // Add activity form state
  const [showAddActivity, setShowAddActivity] = useState(false);
  const [selectedActId, setSelectedActId] = useState('');
  const [customName, setCustomName] = useState('');
  const [customCost, setCustomCost] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [notes, setNotes] = useState('');
  const [submittingAct, setSubmittingAct] = useState(false);

  const loadTripData = async () => {
    try {
      const [tripRes, citiesRes] = await Promise.all([
        api.get(`/api/trips/${tripId}`),
        api.get('/api/cities')
      ]);
      setTrip(tripRes.data);
      setCities(citiesRes.data);

      if (tripRes.data.stops?.length > 0) {
        // Carry active stop reference
        const currentActive = activeStop
          ? tripRes.data.stops.find(s => s.id === activeStop.id)
          : tripRes.data.stops[0];
        setActiveStop(currentActive || tripRes.data.stops[0]);
      } else {
        setActiveStop(null);
      }
    } catch (error) {
      console.error('Failed to load trip builder details:', error);
      toastError('Failed to load itinerary planner.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTripData();
  }, [tripId]);

  const handleAddStop = async (e) => {
    e.preventDefault();
    if (!newCityId || !newStopStart || !newStopEnd) {
      toastWarning('All stop fields are required.');
      return;
    }

    try {
      await api.post(`/api/trips/${tripId}/stops`, {
        cityId: newCityId,
        startDate: newStopStart,
        endDate: newStopEnd
      });

      toastSuccess('City added to trip sequence!');
      setShowAddStop(false);
      setNewCityId('');
      setNewStopStart('');
      setNewStopEnd('');
      loadTripData();
    } catch (error) {
      console.error('Add stop failed:', error);
      toastError(error.response?.data?.error || 'Failed to add stop.');
    }
  };

  const handleDeleteStop = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name} from this trip?`)) return;

    try {
      await api.delete(`/api/stops/${id}`);
      toastSuccess(`${name} stop removed.`);
      loadTripData();
    } catch (error) {
      console.error('Failed to delete stop:', error);
      toastError('Failed to remove stop.');
    }
  };

  const handleMoveStop = async (index, direction) => {
    if (!trip || !trip.stops) return;
    const stops = [...trip.stops];
    const targetIdx = index + direction;

    if (targetIdx < 0 || targetIdx >= stops.length) return;

    // Swap elements
    const temp = stops[index];
    stops[index] = stops[targetIdx];
    stops[targetIdx] = temp;

    try {
      await api.put(`/api/trips/${tripId}/reorder`, {
        stopIds: stops.map(s => s.id)
      });
      loadTripData();
    } catch (error) {
      console.error('Reorder stops failed:', error);
      toastError('Failed to save stop sequence.');
    }
  };

  const handleScheduleActivity = async (e) => {
    e.preventDefault();
    if (!activeStop || (!selectedActId && !customName) || !activityDate) {
      toastWarning('Please select an activity and date.');
      return;
    }

    setSubmittingAct(true);
    try {
      const response = await api.post('/api/trip-activities', {
        tripStopId: activeStop.id,
        activityId: selectedActId || null,
        customName: selectedActId ? null : customName,
        customCost: selectedActId ? null : (customCost ? parseFloat(customCost) : 0),
        date: activityDate,
        startTime,
        endTime,
        notes
      });

      if (response.data.conflict) {
        toastWarning(`Scheduled, but: ${response.data.conflict}`);
      } else {
        toastSuccess('Activity added to day itinerary!');
      }

      setShowAddActivity(false);
      setSelectedActId('');
      setCustomName('');
      setCustomCost('');
      setNotes('');
      loadTripData();
    } catch (error) {
      console.error('Activity schedule failed:', error);
      toastError(error.response?.data?.error || 'Failed to schedule activity.');
    } finally {
      setSubmittingAct(false);
    }
  };

  const handleDeleteActivity = async (actId) => {
    try {
      await api.delete(`/api/trip-activities/${actId}`);
      toastSuccess('Activity removed.');
      loadTripData();
    } catch (error) {
      console.error('Failed to remove activity:', error);
      toastError('Failed to remove activity.');
    }
  };

  // Generate date array for active stop days
  const getStopDates = (stop) => {
    if (!stop) return [];
    const dates = [];
    let curr = new Date(stop.startDate);
    const end = new Date(stop.endDate);

    while (curr <= end) {
      dates.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return dates;
  };

  // Calculate day-wise activities list & conflicts & free times for activeStop
  const getDayDetails = (date) => {
    if (!activeStop || !activeStop.activities) return { activities: [], freeTimes: [] };
    const dateStr = date.toISOString().split('T')[0];

    const dayActivities = activeStop.activities.filter(act => {
      const actDateStr = new Date(act.date).toISOString().split('T')[0];
      return actDateStr === dateStr;
    }).sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));

    // Calculate free time slots
    const freeTimes = [];
    let lastEnd = 480; // 08:00 AM start

    dayActivities.forEach(act => {
      const start = timeToMinutes(act.startTime);
      const end = timeToMinutes(act.endTime);

      if (start > lastEnd + 15) {
        freeTimes.push({
          start: minutesToTime(lastEnd),
          end: minutesToTime(start)
        });
      }
      lastEnd = Math.max(lastEnd, end);
    });

    if (lastEnd < 1200) { // 08:00 PM cap
      freeTimes.push({
        start: minutesToTime(lastEnd),
        end: minutesToTime(1200)
      });
    }

    // Detect conflicts within list
    const conflicts = {};
    for (let i = 0; i < dayActivities.length; i++) {
      const actA = dayActivities[i];
      const startA = timeToMinutes(actA.startTime);
      const endA = timeToMinutes(actA.endTime);

      for (let j = i + 1; j < dayActivities.length; j++) {
        const actB = dayActivities[j];
        const startB = timeToMinutes(actB.startTime);
        const endB = timeToMinutes(actB.endTime);

        if (startA < endB && endA > startB) {
          conflicts[actA.id] = true;
          conflicts[actB.id] = true;
        }
      }
    }

    return { activities: dayActivities, freeTimes, conflicts };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-secondary"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
      {/* Left 1 column: Stops Sequence Sequencer */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-extrabold text-slate-900 text-sm">Trip Stops Sequence</h2>
            <button
              onClick={() => setShowAddStop(!showAddStop)}
              className="text-xs bg-slate-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm"
            >
              + Add City
            </button>
          </div>

          {/* Add stop inline form */}
          {showAddStop && (
            <form onSubmit={handleAddStop} className="p-4 bg-slate-50 border border-slate-150 rounded-xl space-y-3 animate-slide-down">
              <div>
                <label className="block text-[9px] font-bold text-slate-500 mb-0.5">City</label>
                <select
                  required
                  value={newCityId}
                  onChange={(e) => setNewCityId(e.target.value)}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white text-xs"
                >
                  <option value="">Select City</option>
                  {cities.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.country})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newStopStart}
                    onChange={(e) => setNewStopStart(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">End Date</label>
                  <input
                    type="date"
                    required
                    value={newStopEnd}
                    onChange={(e) => setNewStopEnd(e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded-lg text-xs"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-brand-primary text-white text-xs font-bold py-1.5 rounded-lg shadow-sm"
              >
                Confirm Add
              </button>
            </form>
          )}

          {/* Stop Cards list */}
          {trip?.stops?.length === 0 ? (
            <div className="text-center py-8 space-y-2 text-xs text-slate-400">
              <p>No cities added to this trip yet.</p>
              <button onClick={() => setShowAddStop(true)} className="text-brand-secondary font-bold hover:underline">
                Add your first destination stop
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {trip?.stops?.map((stop, index) => {
                const distanceInfo = index > 0
                  ? calculateDistance(
                      trip.stops[index - 1].city.latitude,
                      trip.stops[index - 1].city.longitude,
                      stop.city.latitude,
                      stop.city.longitude
                    )
                  : null;

                return (
                  <div key={stop.id} className="space-y-4">
                    {/* Distance separator arrow */}
                    {distanceInfo && (
                      <div className="flex items-center gap-2 pl-6 py-1">
                        <div className="flex flex-col items-center">
                          <span className="text-slate-300">↓</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-semibold italic flex items-center gap-1.5 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg shadow-sm">
                          🚗 {distanceInfo.km} km ({distanceInfo.time})
                        </div>
                      </div>
                    )}

                    {/* Stop card */}
                    <div
                      onClick={() => setActiveStop(stop)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                        activeStop?.id === stop.id
                          ? 'border-brand-secondary bg-sky-50/20 shadow-sm'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <h3 className="font-bold text-slate-900 text-xs truncate">{stop.city.name}</h3>
                        </div>
                        <p className="text-[9px] font-semibold text-slate-400 mt-0.5 uppercase tracking-wider">{stop.city.country}</p>
                        <p className="text-[9px] text-slate-500 font-medium flex items-center gap-1 mt-1.5">
                          <Calendar className="h-3 w-3" />
                          {new Date(stop.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          {' - '}
                          {new Date(stop.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>

                      {/* Control arrows */}
                      <div className="flex items-center gap-1.5">
                        <div className="flex flex-col gap-0.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveStop(index, -1); }}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 rounded disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleMoveStop(index, 1); }}
                            disabled={index === trip.stops.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 bg-slate-50 rounded disabled:opacity-30 disabled:pointer-events-none"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteStop(stop.id, stop.city.name); }}
                          className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Remove Stop"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Global info banner */}
        <div className="bg-slate-900 text-slate-200 p-5 rounded-2xl space-y-2.5 shadow-sm text-xs border border-slate-850">
          <h4 className="font-bold text-white flex items-center gap-1.5">
            <Compass className="h-4 w-4 text-brand-secondary" /> Itinerary Summary
          </h4>
          <p className="text-[11px]">
            Trip Dates: <strong>{new Date(trip?.startDate).toLocaleDateString()} to {new Date(trip?.endDate).toLocaleDateString()}</strong>
          </p>
          <p className="text-[11px]">
            Trip Budget: <strong>₹{trip?.budget.toLocaleString('en-IN')}</strong>
          </p>
          <p className="text-[11px]">
            Stops Count: <strong>{trip?.stops?.length || 0} Cities</strong>
          </p>
        </div>
      </div>

      {/* Right 2 columns: Day plan details & activities */}
      <div className="lg:col-span-2 space-y-6">
        {activeStop ? (
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-premium space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <span className="text-[9px] font-bold text-brand-secondary bg-sky-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  📍 Active Stop Itinerary
                </span>
                <h2 className="text-xl font-extrabold text-slate-950 mt-1">{activeStop.city.name}</h2>
                <p className="text-slate-500 text-xs mt-0.5">{activeStop.city.region}, {activeStop.city.country}</p>
              </div>

              <button
                onClick={() => {
                  setActivityDate(activeStop.startDate.split('T')[0]);
                  setShowAddActivity(!showAddActivity);
                }}
                className="flex items-center gap-1 bg-brand-primary hover:bg-slate-900 text-white px-4 py-2 rounded-xl font-bold transition-all hover-lift shadow-sm text-xs"
              >
                <Plus className="h-4 w-4" /> Add Activity
              </button>
            </div>

            {/* Add activity form popover */}
            {showAddActivity && (
              <form onSubmit={handleScheduleActivity} className="p-5 bg-slate-50 border border-slate-150 rounded-xl space-y-4 animate-slide-down text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-800">Schedule Activity inside {activeStop.city.name}</h4>
                  <button type="button" onClick={() => setShowAddActivity(false)} className="text-slate-400 hover:text-slate-600">
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select preset activity vs custom */}
                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Preset Activities</label>
                    <select
                      value={selectedActId}
                      onChange={(e) => {
                        setSelectedActId(e.target.value);
                        if (e.target.value) {
                          setCustomName('');
                          setCustomCost('');
                        }
                      }}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      <option value="">-- Or Create Custom Activity below --</option>
                      {cities.find(c => c.id === activeStop.cityId)?.activities?.map(act => (
                        <option key={act.id} value={act.id}>
                          {act.name} (est. ₹{act.estimatedCost})
                        </option>
                      ))}
                    </select>
                  </div>

                  {!selectedActId && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Custom Name</label>
                        <input
                          type="text"
                          required={!selectedActId}
                          value={customName}
                          onChange={(e) => setCustomName(e.target.value)}
                          placeholder="e.g. Visit local marketplace"
                          className="w-full px-2 py-1 border border-slate-200 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Estimated Cost (₹)</label>
                        <input
                          type="number"
                          value={customCost}
                          onChange={(e) => setCustomCost(e.target.value)}
                          placeholder="0"
                          className="w-full px-2 py-1 border border-slate-200 rounded-lg"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Scheduled Date</label>
                    <select
                      required
                      value={activityDate}
                      onChange={(e) => setActivityDate(e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded-lg bg-white"
                    >
                      {getStopDates(activeStop).map(date => {
                        const dateStr = date.toISOString().split('T')[0];
                        return (
                          <option key={dateStr} value={dateStr}>
                            {date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Start Time</label>
                      <input
                        type="time"
                        required
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-slate-500 mb-0.5">End Time</label>
                      <input
                        type="time"
                        required
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full px-2 py-1 border border-slate-200 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-bold text-slate-500 mb-0.5">Add Notes (Optional)</label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Meet guide at main gates, carry water bottles..."
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingAct}
                  className="w-full bg-slate-900 text-white font-bold py-2 rounded-lg"
                >
                  {submittingAct ? 'Adding...' : 'Add to Day Schedule'}
                </button>
              </form>
            )}

            {/* Day-by-day Itinerary Lists */}
            <div className="space-y-8">
              {getStopDates(activeStop).map((date, dateIdx) => {
                const { activities, freeTimes, conflicts } = getDayDetails(date);

                return (
                  <div key={dateIdx} className="space-y-4 border-l-2 border-slate-100 pl-6 relative">
                    {/* Day badge indicator */}
                    <div className="absolute -left-[9px] top-0 bg-white border-2 border-brand-secondary h-4 w-4 rounded-full flex items-center justify-center">
                      <div className="h-1.5 w-1.5 bg-brand-secondary rounded-full"></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <h3 className="font-bold text-slate-800 text-sm">
                        Day {dateIdx + 1} — {date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                      </h3>
                      {activities.length > 0 && (
                        <span className="text-[10px] text-slate-400 font-semibold">
                          {activities.length} activities scheduled
                        </span>
                      )}
                    </div>

                    {/* Free time intervals alerts */}
                    {activities.length > 0 && freeTimes.length > 0 && (
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span>
                          Available Free Gaps: {freeTimes.map(f => `${f.start} - ${f.end}`).join(', ')}
                        </span>
                      </div>
                    )}

                    {/* Activities List */}
                    {activities.length === 0 ? (
                      <div className="text-[11px] text-slate-400 italic py-2 pl-2">
                        No activities scheduled for this day. Click "+ Add Activity" above to schedule.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {activities.map((act) => {
                          const actName = act.activity?.name || act.customName;
                          const actCategory = act.activity?.category || 'Custom';
                          const actCost = act.activity ? act.activity.estimatedCost : (act.customCost || 0);
                          const isConflicting = conflicts[act.id];

                          return (
                            <div
                              key={act.id}
                              className={`p-3.5 rounded-xl border flex justify-between items-start gap-4 transition-colors ${
                                isConflicting
                                  ? 'bg-rose-50/30 border-rose-100'
                                  : 'bg-white border-slate-100 hover:border-slate-200'
                              }`}
                            >
                              <div className="flex items-start gap-3 min-w-0">
                                <div className="text-right flex-shrink-0 pt-0.5">
                                  <p className="font-bold text-slate-900 text-xs leading-none">
                                    {act.startTime}
                                  </p>
                                  <p className="text-[9px] text-slate-400 font-semibold mt-1 uppercase">
                                    to {act.endTime}
                                  </p>
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <h4 className="font-bold text-slate-900 text-xs truncate">
                                      {actName}
                                    </h4>
                                    <span className="text-[9px] font-semibold bg-slate-100 text-slate-500 px-1.5 py-0.25 rounded uppercase">
                                      {actCategory}
                                    </span>
                                  </div>
                                  {act.notes && (
                                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 italic">
                                      "{act.notes}"
                                    </p>
                                  )}

                                  {/* Conflict warning badge */}
                                  {isConflicting && (
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-rose-600 mt-2 bg-rose-50 px-2 py-0.5 rounded-lg max-w-max border border-rose-100 animate-pulse">
                                      <AlertTriangle className="h-3.5 w-3.5" />
                                      Time Slot Conflict Detected!
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-800 text-xs">
                                  ₹{actCost.toLocaleString('en-IN')}
                                </span>
                                <button
                                  onClick={() => handleDeleteActivity(act.id)}
                                  className="text-slate-300 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors"
                                  title="Remove Activity"
                                >
                                  <Trash2 className="h-4.5 w-4.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-2xl border border-slate-100 shadow-premium text-center space-y-4">
            <div className="text-5xl">📍</div>
            <h3 className="font-bold text-slate-800 text-base">Select a stop to begin scheduling</h3>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Choose one of the cities in your trip sequence on the left to plan activities, configure date segments, and view conflicts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryBuilder;
