import { supabase } from '../lib/supabaseClient';

// ====================================================================
// TRIPS API
// ====================================================================

export const getMyTrips = async () => {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      trip_stops (
        id,
        sequence,
        start_date,
        end_date,
        cities ( id, name, country, image_url )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const getTripById = async (tripId) => {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      users ( id, full_name, avatar_url ),
      trip_stops (
        id,
        sequence,
        start_date,
        end_date,
        cities ( id, name, country, image_url, latitude, longitude ),
        trip_activities (
          id,
          activity_date,
          start_time,
          end_time,
          notes,
          activities ( id, name, category, duration, estimated_cost, image_url )
        )
      ),
      expenses ( id, category, description, amount, expense_date )
    `)
    .eq('id', tripId)
    .single();

  if (error) throw error;
  return data;
};

export const createTrip = async (tripData) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('User must be authenticated to create a trip.');

  const { data, error } = await supabase
    .from('trips')
    .insert([{ ...tripData, user_id: user.id }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTrip = async (tripId, updates) => {
  const { data, error } = await supabase
    .from('trips')
    .update(updates)
    .eq('id', tripId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteTrip = async (tripId) => {
  const { error } = await supabase
    .from('trips')
    .delete()
    .eq('id', tripId);

  if (error) throw error;
  return true;
};

// ====================================================================
// CITIES API
// ====================================================================

export const getCities = async () => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
};

export const searchCities = async (query) => {
  const { data, error } = await supabase
    .from('cities')
    .select('*')
    .or(`name.ilike.%${query}%,country.ilike.%${query}%`)
    .limit(20);

  if (error) throw error;
  return data;
};

// ====================================================================
// TRIP STOPS API
// ====================================================================

export const addCityToTrip = async (stopData) => {
  const { data, error } = await supabase
    .from('trip_stops')
    .insert([stopData])
    .select(`
      *,
      cities ( id, name, country, image_url )
    `)
    .single();

  if (error) throw error;
  return data;
};

export const deleteTripStop = async (stopId) => {
  const { error } = await supabase
    .from('trip_stops')
    .delete()
    .eq('id', stopId);

  if (error) throw error;
  return true;
};

// ====================================================================
// ACTIVITIES API
// ====================================================================

export const getActivitiesByCity = async (cityId) => {
  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('city_id', cityId);

  if (error) throw error;
  return data;
};

export const addActivityToStop = async (activityData) => {
  const { data, error } = await supabase
    .from('trip_activities')
    .insert([activityData])
    .select(`
      *,
      activities ( id, name, category, duration, estimated_cost, image_url )
    `)
    .single();

  if (error) throw error;
  return data;
};

export const deleteTripActivity = async (tripActivityId) => {
  const { error } = await supabase
    .from('trip_activities')
    .delete()
    .eq('id', tripActivityId);

  if (error) throw error;
  return true;
};

// ====================================================================
// EXPENSES & BUDGET API
// ====================================================================

export const getExpensesByTrip = async (tripId) => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('trip_id', tripId)
    .order('expense_date', { ascending: false });

  if (error) throw error;
  return data;
};

export const addExpense = async (expenseData) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([expenseData])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const deleteExpense = async (expenseId) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) throw error;
  return true;
};

export const calculateTripBudget = async (tripId) => {
  const trip = await getTripById(tripId);

  // Sum estimated activity costs
  let estimatedActivityCost = 0;
  if (trip.trip_stops) {
    trip.trip_stops.forEach(stop => {
      if (stop.trip_activities) {
        stop.trip_activities.forEach(ta => {
          if (ta.activities) {
            estimatedActivityCost += Number(ta.activities.estimated_cost || 0);
          }
        });
      }
    });
  }

  // Sum logged actual expenses
  let totalExpenses = 0;
  const categoryBreakdown = {};

  if (trip.expenses) {
    trip.expenses.forEach(exp => {
      const amt = Number(exp.amount || 0);
      totalExpenses += amt;
      categoryBreakdown[exp.category] = (categoryBreakdown[exp.category] || 0) + amt;
    });
  }

  return {
    estimatedActivityCost,
    totalExpenses,
    categoryBreakdown,
  };
};

// ====================================================================
// PUBLIC SHARING API
// ====================================================================

export const generatePublicShareLink = async (tripId) => {
  const shareToken = `gt_share_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const { data, error } = await supabase
    .from('trips')
    .update({ is_public: true, share_token: shareToken })
    .eq('id', tripId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const getPublicTripByToken = async (shareToken) => {
  const { data, error } = await supabase
    .from('trips')
    .select(`
      *,
      users ( full_name, avatar_url ),
      trip_stops (
        id,
        sequence,
        start_date,
        end_date,
        cities ( name, country, image_url ),
        trip_activities (
          id,
          activity_date,
          start_time,
          end_time,
          notes,
          activities ( name, category, duration, estimated_cost, image_url )
        )
      )
    `)
    .eq('share_token', shareToken)
    .single();

  if (error) throw error;
  return data;
};
