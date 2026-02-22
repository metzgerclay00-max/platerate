-- GetFives Schema v4: Rewards, Contacts, AI Responses
-- Run this in Supabase SQL Editor after v1-v3 schemas

-- ============================================
-- 1. REWARD CODES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS reward_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  feedback_id UUID REFERENCES feedback(id) ON DELETE SET NULL,
  code VARCHAR(10) UNIQUE NOT NULL,
  reward_type VARCHAR(50) DEFAULT 'free_drink',
  reward_text VARCHAR(255) DEFAULT 'Free drink of your choice',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'redeemed', 'expired')),
  redeemed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reward_codes_restaurant ON reward_codes(restaurant_id);
CREATE INDEX idx_reward_codes_status ON reward_codes(restaurant_id, status);
CREATE INDEX idx_reward_codes_code ON reward_codes(code);

-- RLS for reward_codes
ALTER TABLE reward_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can view their reward codes"
  ON reward_codes FOR SELECT
  USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Owners can update their reward codes"
  ON reward_codes FOR UPDATE
  USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  ));

CREATE POLICY "Anyone can insert reward codes"
  ON reward_codes FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 2. CONTACTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  phone VARCHAR(20) NOT NULL,
  name VARCHAR(100),
  last_sms_at TIMESTAMPTZ,
  review_received BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_contacts_restaurant_phone ON contacts(restaurant_id, phone);
CREATE INDEX idx_contacts_restaurant ON contacts(restaurant_id);

-- RLS for contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners can manage their contacts"
  ON contacts FOR ALL
  USING (restaurant_id IN (
    SELECT id FROM restaurants WHERE owner_id = auth.uid()
  ));

-- ============================================
-- 3. ADD REWARD SETTINGS TO RESTAURANTS
-- ============================================
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS reward_enabled BOOLEAN DEFAULT false;
ALTER TABLE restaurants ADD COLUMN IF NOT EXISTS reward_text VARCHAR(255) DEFAULT 'Free drink of your choice';

-- ============================================
-- 4. ADD AI RESPONSE FIELDS TO FEEDBACK
-- ============================================
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS ai_response TEXT;
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS ai_response_generated_at TIMESTAMPTZ;
