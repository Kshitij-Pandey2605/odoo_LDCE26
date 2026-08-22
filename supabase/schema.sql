-- ====================================================================
-- GlobeTrotter Supabase Production Database Schema & RLS Policies
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (Public Profile synced with auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Trigger to automatically create a public user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution setup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_public BOOLEAN DEFAULT FALSE NOT NULL,
  share_token TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trips_user_id ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_share_token ON public.trips(share_token);
CREATE INDEX IF NOT EXISTS idx_trips_is_public ON public.trips(is_public);

-- 3. Cities Table
CREATE TABLE IF NOT EXISTS public.cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  state TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_cities_name_country ON public.cities(name, country);

-- 4. Trip Stops Table
CREATE TABLE IF NOT EXISTS public.trip_stops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  sequence INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trip_stops_trip_id ON public.trip_stops(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_stops_city_id ON public.trip_stops(city_id);

-- 5. Activities Catalog Table
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city_id UUID NOT NULL REFERENCES public.cities(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  duration INT NOT NULL, -- Duration in minutes
  estimated_cost NUMERIC(10, 2) DEFAULT 0.00 NOT NULL,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activities_city_id ON public.activities(city_id);
CREATE INDEX IF NOT EXISTS idx_activities_category ON public.activities(category);

-- 6. Trip Activities Table
CREATE TABLE IF NOT EXISTS public.trip_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_stop_id UUID NOT NULL REFERENCES public.trip_stops(id) ON DELETE CASCADE,
  activity_id UUID REFERENCES public.activities(id) ON DELETE SET NULL,
  activity_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_trip_activities_stop_id ON public.trip_activities(trip_stop_id);
CREATE INDEX IF NOT EXISTS idx_trip_activities_activity_id ON public.trip_activities(activity_id);

-- 7. Expenses Table
CREATE TABLE IF NOT EXISTS public.expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  expense_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_expenses_trip_id ON public.expenses(trip_id);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Users Table RLS
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.users FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- Trips Table RLS
CREATE POLICY "Users can view own trips" 
  ON public.trips FOR SELECT USING (auth.uid() = user_id OR is_public = true OR share_token IS NOT NULL);

CREATE POLICY "Users can insert own trips" 
  ON public.trips FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips" 
  ON public.trips FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips" 
  ON public.trips FOR DELETE USING (auth.uid() = user_id);

-- Cities Table RLS (Read-only public catalog)
CREATE POLICY "Cities are viewable by everyone" 
  ON public.cities FOR SELECT USING (true);

-- Trip Stops Table RLS
CREATE POLICY "Users can view trip stops for visible trips" 
  ON public.trip_stops FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = trip_stops.trip_id 
      AND (trips.user_id = auth.uid() OR trips.is_public = true OR trips.share_token IS NOT NULL)
    )
  );

CREATE POLICY "Users can manage stops for own trips" 
  ON public.trip_stops FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = trip_stops.trip_id AND trips.user_id = auth.uid()
    )
  );

-- Activities Catalog RLS
CREATE POLICY "Activities are viewable by everyone" 
  ON public.activities FOR SELECT USING (true);

-- Trip Activities RLS
CREATE POLICY "Users can view trip activities for visible trips" 
  ON public.trip_activities FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops
      JOIN public.trips ON trips.id = trip_stops.trip_id
      WHERE trip_stops.id = trip_activities.trip_stop_id 
      AND (trips.user_id = auth.uid() OR trips.is_public = true OR trips.share_token IS NOT NULL)
    )
  );

CREATE POLICY "Users can manage activities for own trip stops" 
  ON public.trip_activities FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trip_stops
      JOIN public.trips ON trips.id = trip_stops.trip_id
      WHERE trip_stops.id = trip_activities.trip_stop_id AND trips.user_id = auth.uid()
    )
  );

-- Expenses Table RLS
CREATE POLICY "Users can view expenses for own trips" 
  ON public.expenses FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = expenses.trip_id AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage expenses for own trips" 
  ON public.expenses FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.trips 
      WHERE trips.id = expenses.trip_id AND trips.user_id = auth.uid()
    )
  );
