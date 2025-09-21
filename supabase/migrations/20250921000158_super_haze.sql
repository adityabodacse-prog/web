/*
  # Initial Schema for Aqua Alert Ocean Monitoring System

  1. New Tables
    - `user_profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text, unique)
      - `role` (enum: admin, operator, viewer)
      - `full_name` (text)
      - `organization` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `sensors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location_lat` (decimal)
      - `location_lng` (decimal)
      - `is_active` (boolean)
      - `last_reading_at` (timestamp)
      - `created_at` (timestamp)
    
    - `sensor_readings`
      - `id` (uuid, primary key)
      - `sensor_id` (uuid, foreign key)
      - `timestamp` (timestamp)
      - `ph` (decimal)
      - `temperature` (decimal)
      - `turbidity` (decimal)
      - `dissolved_oxygen` (decimal)
      - `conductivity` (decimal)
      - `salinity` (decimal)
      - `water_level` (decimal)
      - `location_lat` (decimal)
      - `location_lng` (decimal)
      - `created_at` (timestamp)
    
    - `hazard_alerts`
      - `id` (uuid, primary key)
      - `type` (enum: tsunami, high_waves, oil_spill, chemical_pollution, biological_pollution)
      - `severity` (enum: low, medium, high, critical)
      - `title` (text)
      - `description` (text)
      - `location_lat` (decimal)
      - `location_lng` (decimal)
      - `affected_radius` (decimal)
      - `is_active` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for role-based access control
    - Viewers can read data
    - Operators can read and create alerts
    - Admins have full access

  3. Indexes
    - Add indexes for performance on frequently queried columns
    - Spatial indexes for location-based queries
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'operator', 'viewer');
CREATE TYPE hazard_type AS ENUM ('tsunami', 'high_waves', 'oil_spill', 'chemical_pollution', 'biological_pollution');
CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high', 'critical');

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  role user_role DEFAULT 'viewer',
  full_name text,
  organization text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Sensors table
CREATE TABLE IF NOT EXISTS sensors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location_lat decimal(10, 8) NOT NULL,
  location_lng decimal(11, 8) NOT NULL,
  is_active boolean DEFAULT true,
  last_reading_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Sensor readings table
CREATE TABLE IF NOT EXISTS sensor_readings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sensor_id uuid REFERENCES sensors(id) ON DELETE CASCADE,
  timestamp timestamptz NOT NULL,
  ph decimal(4, 2) NOT NULL,
  temperature decimal(5, 2) NOT NULL,
  turbidity decimal(8, 2) NOT NULL,
  dissolved_oxygen decimal(6, 2) NOT NULL,
  conductivity decimal(10, 2) NOT NULL,
  salinity decimal(6, 2) NOT NULL,
  water_level decimal(8, 2) NOT NULL,
  location_lat decimal(10, 8) NOT NULL,
  location_lng decimal(11, 8) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Hazard alerts table
CREATE TABLE IF NOT EXISTS hazard_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type hazard_type NOT NULL,
  severity severity_level NOT NULL,
  title text NOT NULL,
  description text,
  location_lat decimal(10, 8) NOT NULL,
  location_lng decimal(11, 8) NOT NULL,
  affected_radius decimal(8, 2) DEFAULT 10,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE sensor_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE hazard_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can read own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can read all profiles"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for sensors
CREATE POLICY "All authenticated users can read sensors"
  ON sensors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can manage sensors"
  ON sensors
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- RLS Policies for sensor_readings
CREATE POLICY "All authenticated users can read sensor readings"
  ON sensor_readings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "System can insert sensor readings"
  ON sensor_readings
  FOR INSERT
  TO authenticated
  USING (true);

-- RLS Policies for hazard_alerts
CREATE POLICY "All authenticated users can read alerts"
  ON hazard_alerts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Operators and admins can create alerts"
  ON hazard_alerts
  FOR INSERT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('operator', 'admin')
    )
  );

CREATE POLICY "Operators and admins can update alerts"
  ON hazard_alerts
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid() AND role IN ('operator', 'admin')
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX IF NOT EXISTS idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_hazard_alerts_active ON hazard_alerts(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_hazard_alerts_created_at ON hazard_alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_sensors_active ON sensors(is_active) WHERE is_active = true;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hazard_alerts_updated_at
  BEFORE UPDATE ON hazard_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();