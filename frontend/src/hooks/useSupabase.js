import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/supabaseApi';

export const useSupabaseTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMyTrips();
      setTrips(data);
    } catch (err) {
      console.error('Error in useSupabaseTrips:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, refetch: fetchTrips };
};

export const useSupabaseTripDetails = (tripId) => {
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTripDetails = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await api.getTripById(tripId);
      setTrip(data);
    } catch (err) {
      console.error('Error in useSupabaseTripDetails:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchTripDetails();
  }, [fetchTripDetails]);

  return { trip, loading, error, refetch: fetchTripDetails };
};

export const useSupabaseCities = () => {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCities()
      .then(setCities)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return { cities, loading };
};

export const useSupabaseExpenses = (tripId) => {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalExpenses: 0, categoryBreakdown: {} });
  const [loading, setLoading] = useState(true);

  const fetchExpenses = useCallback(async () => {
    if (!tripId) return;
    setLoading(true);
    try {
      const data = await api.getExpensesByTrip(tripId);
      setExpenses(data);

      const budgetData = await api.calculateTripBudget(tripId);
      setSummary(budgetData);
    } catch (err) {
      console.error('Error in useSupabaseExpenses:', err);
    } finally {
      setLoading(false);
    }
  }, [tripId]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  return { expenses, summary, loading, refetch: fetchExpenses };
};
