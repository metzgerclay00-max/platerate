-- ===========================================
-- PlateRate V2 — Schema Updates
-- ===========================================
-- Run this in Supabase SQL Editor AFTER the original schema

-- 1. Add feedback categories column to feedback table
ALTER TABLE public.feedback
ADD COLUMN IF NOT EXISTS categories text[] DEFAULT '{}';

-- 2. Add Google baseline fields to restaurants table
ALTER TABLE public.restaurants
ADD COLUMN IF NOT EXISTS google_baseline_reviews integer DEFAULT NULL,
ADD COLUMN IF NOT EXISTS google_baseline_rating numeric(2,1) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS google_baseline_date timestamp with time zone DEFAULT NULL,
ADD COLUMN IF NOT EXISTS alert_email text DEFAULT '';

-- 3. Events table for funnel tracking
CREATE TABLE IF NOT EXISTS public.events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL, -- 'form_opened', 'rating_submitted', 'google_clicked', 'feedback_submitted'
  feedback_id uuid REFERENCES public.feedback(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- 4. Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for events
CREATE POLICY "Owners can view events for their restaurants"
  ON public.events FOR SELECT
  USING (
    restaurant_id IN (
      SELECT id FROM public.restaurants WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can insert events"
  ON public.events FOR INSERT
  WITH CHECK (true);

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_events_restaurant ON public.events(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_events_type ON public.events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_created ON public.events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_feedback_categories ON public.feedback USING GIN(categories);
