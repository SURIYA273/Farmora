/*
  # Initial Schema Setup for Agriculture Management System

  1. New Tables
    - `farms`
      - Basic farm information and location
    - `crops`
      - Crop types and their details
    - `weather_data`
      - Weather information for different locations
    - `market_prices`
      - Daily market prices for different crops
    - `growth_analytics`
      - Plant growth tracking data

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create farms table
CREATE TABLE IF NOT EXISTS farms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  name text NOT NULL,
  location text NOT NULL,
  size_hectares numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create crops table
CREATE TABLE IF NOT EXISTS crops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES farms(id),
  name text NOT NULL,
  variety text NOT NULL,
  planting_date date NOT NULL,
  expected_harvest_date date,
  status text DEFAULT 'growing',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create weather_data table
CREATE TABLE IF NOT EXISTS weather_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id uuid REFERENCES farms(id),
  temperature numeric NOT NULL,
  humidity numeric NOT NULL,
  wind_speed numeric NOT NULL,
  rainfall numeric DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);

-- Create market_prices table
CREATE TABLE IF NOT EXISTS market_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name text NOT NULL,
  price_per_unit numeric NOT NULL,
  unit text NOT NULL,
  market_location text NOT NULL,
  trend text DEFAULT 'stable',
  recorded_at timestamptz DEFAULT now()
);

-- Create growth_analytics table
CREATE TABLE IF NOT EXISTS growth_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_id uuid REFERENCES crops(id),
  height numeric,
  health_status text DEFAULT 'good',
  growth_stage text,
  recorded_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE growth_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own farms"
  ON farms
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage crops on their farms"
  ON crops
  FOR ALL
  TO authenticated
  USING (farm_id IN (
    SELECT id FROM farms WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can access weather data for their farms"
  ON weather_data
  FOR ALL
  TO authenticated
  USING (farm_id IN (
    SELECT id FROM farms WHERE user_id = auth.uid()
  ));

CREATE POLICY "Everyone can read market prices"
  ON market_prices
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can access growth analytics for their crops"
  ON growth_analytics
  FOR ALL
  TO authenticated
  USING (crop_id IN (
    SELECT id FROM crops WHERE farm_id IN (
      SELECT id FROM farms WHERE user_id = auth.uid()
    )
  ));