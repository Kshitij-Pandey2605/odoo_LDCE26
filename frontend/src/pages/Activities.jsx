import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Plus, Heart, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';

// ─── Mock Data ───────────────────────────────────────────────────────────────
const MOCK_ACTIVITIES = [
  {
    id: 1,
    title: 'City Palace',
    location: 'Udaipur, Rajasthan',
    category: 'Exploration',
    duration: '3-4 hrs',
    rating: 4.8,
    reviews: 2340,
    price: 500,
    description:
      'Explore the magnificent royal complex of Udaipur. Discover ornate architecture, stunning lake views, and curated exhibits reflecting centuries of Mewar heritage.',
    img: 'https://images.pexels.com/photos/2387793/pexels-photo-2387793.jpeg?auto=compress&cs=tinysrgb&w=600',
    saved: false,
  },
  {
    id: 2,
    title: 'Lake Pichola Boat Ride',
    location: 'Udaipur, Rajasthan',
    category: 'Exploration',
    duration: '2-3 hrs',
    rating: 4.9,
    reviews: 1870,
    price: 700,
    description:
      'Drift across the serene waters of Lake Pichola and witness the iconic Jag Mandir and City Palace rising majestically from the shoreline at golden hour.',
    img: 'https://images.pexels.com/photos/3225531/pexels-photo-3225531.jpeg?auto=compress&cs=tinysrgb&w=600',
    saved: false,
  },
  {
    id: 3,
    title: 'Sajjangarh Palace',
    location: 'Udaipur, Rajasthan',
    category: 'History',
    duration: '3-4 hrs',
    rating: 4.6,
    reviews: 1200,
    price: 350,
    description:
      'Visit the Monsoon Palace perched atop the Aravalli Hills, offering panoramic views of Udaipur city and its shimmering lakes especially at sunset.',
    img: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=600',
    saved: false,
  },
  {
    id: 4,
    title: 'Local Rajasthani Food Tour',
    location: 'Udaipur, Rajasthan',
    category: 'Food',
    duration: '4-5 hrs',
    rating: 4.7,
    reviews: 980,
    price: 1200,
    description:
      'Embark on a guided culinary journey through Udaipur\'s old city lanes. Savour Dal Baati Churma, Gatte ki Sabji, Mawa Kachori, and more at iconic local spots.',
    img: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600',
    saved: false,
  },
  {
    id: 5,
    title: 'Kumbhalgarh Fort Trek',
    location: 'Rajsamand, Rajasthan',
    category: 'Adventure',
    duration: 'Full Day',
    rating: 4.8,
    reviews: 750,
    price: 900,
    description:
      'Trek along the second-longest wall in the world and explore the ancient Kumbhalgarh Fort, home to 360 temples and breathtaking views of the Aravalli range.',
    img: 'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=600',
    saved: false,
  },
  {
    id: 6,
    title: 'Bagore Ki Haveli Show',
    location: 'Udaipur, Rajasthan',
    category: 'Food',
    duration: '2-3 hrs',
    rating: 4.5,
    reviews: 1100,
    price: 250,
    description:
      'Experience an electrifying evening of Rajasthani folk music, Ghoomar dance, and puppet shows inside the beautifully restored 18th-century Bagore Ki Haveli.',
    img: 'https://images.pexels.com/photos/3278215/pexels-photo-3278215.jpeg?auto=compress&cs=tinysrgb&w=600',
    saved: false,
  },
];

const CATEGORIES = ['All', 'Exploration', 'Food', 'History', 'Adventure'];
const DURATIONS = ['2-3 hrs', '3-4 hrs', '4-5 hrs', 'Full Day'];

const categoryColor = (cat) => {
  switch (cat) {
    case 'Food':       return 'bg-amber-100 text-amber-700';
    case 'History':    return 'bg-purple-100 text-purple-700';
    case 'Adventure':  return 'bg-emerald-100 text-emerald-700';
    default:           return 'bg-[#FFF0E6] text-[#C84F14]';
  }
};

// ─── Component ───────────────────────────────────────────────────────────────
const Activities = () => {
  const { toastSuccess } = useToast();

  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDurations, setActiveDurations] = useState([]);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [searchTerm, setSearchTerm] = useState('');

  // Toggle duration filter
  const toggleDuration = (d) =>
    setActiveDurations((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
    );

  // Toggle saved
  const toggleSave = (id) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const updated = { ...a, saved: !a.saved };
        toastSuccess(updated.saved ? 'Added to wishlist!' : 'Removed from wishlist.');
        return updated;
      })
    );
  };

  // Filter logic
  const filtered = activities.filter((a) => {
    const matchCat = activeCategory === 'All' || a.category === activeCategory;
    const matchDur = activeDurations.length === 0 || activeDurations.includes(a.duration);
    const matchPrice = a.price <= maxPrice;
    const matchSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchDur && matchPrice && matchSearch;
  });

  return (
    <div className="pb-8">
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
          <Link to="/dashboard" className="hover:text-[#F97316] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#F97316] font-semibold">Things To Do</span>
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">Things To Do</h1>
        <p className="text-xs text-slate-400 mt-1">Discover experiences to savour, Rajasthan</p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search activities..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]/20 focus:border-[#F97316] text-[#0F172A] placeholder-slate-300"
        />
      </div>

      {/* Main 2-column layout */}
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── LEFT SIDEBAR: Filters ── */}
        <aside className="lg:w-56 xl:w-64 flex-shrink-0 space-y-5">

          {/* Category Pills */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
                    activeCategory === cat
                      ? 'bg-[#C84F14] text-white border-[#C84F14] shadow-sm'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-[#F97316] hover:text-[#F97316]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider mb-3">Duration</h3>
            <ul className="space-y-2.5">
              {DURATIONS.map((d) => (
                <li key={d} className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id={`dur-${d}`}
                    checked={activeDurations.includes(d)}
                    onChange={() => toggleDuration(d)}
                    className="w-4 h-4 rounded accent-[#C84F14] cursor-pointer"
                  />
                  <label htmlFor={`dur-${d}`} className="text-xs text-slate-600 cursor-pointer font-medium">
                    {d}
                  </label>
                </li>
              ))}
            </ul>
          </div>

          {/* Price */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xs font-bold text-[#0F172A] uppercase tracking-wider">Max Price</h3>
              <span className="text-xs font-bold text-[#F97316]">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="250"
              max="2000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#C84F14]"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1.5">
              <span>₹250</span>
              <span>₹2,000</span>
            </div>
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setActiveCategory('All');
              setActiveDurations([]);
              setMaxPrice(2000);
              setSearchTerm('');
            }}
            className="w-full py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors"
          >
            Reset Filters
          </button>
        </aside>

        {/* ── RIGHT CONTENT: Activity Cards Grid ── */}
        <div className="flex-1">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-bold text-slate-600">No activities found</p>
              <p className="text-xs text-slate-400 mt-1">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filtered.map((activity) => (
                <div
                  key={activity.id}
                  className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={activity.img}
                      alt={activity.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {/* Category Badge */}
                    <span className={`absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full ${categoryColor(activity.category)}`}>
                      {activity.category}
                    </span>
                    {/* Wishlist button */}
                    <button
                      onClick={() => toggleSave(activity.id)}
                      className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow transition-all ${
                        activity.saved
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/90 text-slate-400 hover:text-rose-500'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${activity.saved ? 'fill-current' : ''}`} />
                    </button>
                    {/* Duration badge */}
                    <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {activity.duration}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex flex-col flex-1 justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-bold text-[#0F172A] text-sm leading-tight">{activity.title}</h3>
                        <span className="text-sm font-bold text-[#F97316] whitespace-nowrap">₹{activity.price.toLocaleString('en-IN')}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3" /> {activity.location}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{activity.description}</p>
                    </div>

                    {/* Rating + Button */}
                    <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-50">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
                        <span className="text-xs font-bold text-[#0F172A]">{activity.rating}</span>
                        <span className="text-[10px] text-slate-400">({activity.reviews.toLocaleString()})</span>
                      </div>
                      <button
                        onClick={() => toastSuccess(`"${activity.title}" added to itinerary!`)}
                        className="flex items-center gap-1.5 bg-[#C84F14] hover:bg-[#A93D0E] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm shadow-[#C84F14]/20"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add to Itinerary
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results count */}
          <p className="text-xs text-slate-400 mt-4 text-right">
            Showing <span className="font-bold text-slate-600">{filtered.length}</span> of {activities.length} activities
          </p>
        </div>
      </div>
    </div>
  );
};

export default Activities;
