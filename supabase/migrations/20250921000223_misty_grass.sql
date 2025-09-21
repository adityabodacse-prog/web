/*
  # Sample Data for Aqua Alert System

  1. Sample Data
    - Demo user profiles with different roles
    - Sample sensors in various ocean locations
    - Recent sensor readings with realistic values
    - Sample hazard alerts for testing

  2. Notes
    - All sample data is for demonstration purposes
    - Coordinates represent realistic ocean monitoring locations
    - Sensor readings include normal and anomalous values
    - Alerts cover different hazard types and severity levels
*/

-- Insert sample user profiles (these will be created when users sign up)
-- Note: The actual user records are managed by Supabase Auth

-- Insert sample sensors
INSERT INTO sensors (id, name, location_lat, location_lng, is_active, last_reading_at) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Pacific Buoy Alpha', 36.7783, -119.4179, true, now() - interval '5 minutes'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Atlantic Monitor Beta', 40.7128, -74.0060, true, now() - interval '10 minutes'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Gulf Station Gamma', 29.7604, -95.3698, true, now() - interval '15 minutes'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Caribbean Sensor Delta', 18.2208, -66.5901, false, now() - interval '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Mediterranean Point Echo', 43.7696, 11.2558, true, now() - interval '8 minutes'),
  ('550e8400-e29b-41d4-a716-446655440006', 'North Sea Monitor Foxtrot', 56.4907, 3.2044, true, now() - interval '12 minutes');

-- Insert sample sensor readings for the last 24 hours
DO $$
DECLARE
  sensor_record RECORD;
  reading_time timestamptz;
  i integer;
BEGIN
  FOR sensor_record IN SELECT id, location_lat, location_lng FROM sensors WHERE is_active = true LOOP
    FOR i IN 0..47 LOOP -- 48 readings (every 30 minutes for 24 hours)
      reading_time := now() - (i * interval '30 minutes');
      
      INSERT INTO sensor_readings (
        sensor_id, timestamp, ph, temperature, turbidity, dissolved_oxygen,
        conductivity, salinity, water_level, location_lat, location_lng
      ) VALUES (
        sensor_record.id,
        reading_time,
        7.8 + (random() - 0.5) * 0.6, -- pH: 7.5-8.1
        15.0 + (random() - 0.5) * 10.0, -- Temperature: 10-20°C
        2.0 + random() * 8.0, -- Turbidity: 2-10 NTU
        6.0 + (random() - 0.5) * 4.0, -- DO: 4-8 mg/L
        35000 + (random() - 0.5) * 10000, -- Conductivity: 30000-40000 μS/cm
        34.0 + (random() - 0.5) * 2.0, -- Salinity: 33-35 PSU
        2.0 + (random() - 0.5) * 4.0, -- Water level: 0-4m
        sensor_record.location_lat + (random() - 0.5) * 0.01, -- Small location variance
        sensor_record.location_lng + (random() - 0.5) * 0.01
      );
    END LOOP;
  END LOOP;
END $$;

-- Insert some anomalous readings to trigger alerts
INSERT INTO sensor_readings (
  sensor_id, timestamp, ph, temperature, turbidity, dissolved_oxygen,
  conductivity, salinity, water_level, location_lat, location_lng
) VALUES
  -- High turbidity reading (potential oil spill)
  ('550e8400-e29b-41d4-a716-446655440001', now() - interval '2 hours', 7.9, 16.5, 45.0, 5.2, 36000, 34.2, 2.1, 36.7783, -119.4179),
  -- Low pH reading (chemical pollution)
  ('550e8400-e29b-41d4-a716-446655440002', now() - interval '1 hour', 6.8, 17.2, 3.5, 4.8, 35500, 33.8, 2.3, 40.7128, -74.0060),
  -- High water level (potential tsunami)
  ('550e8400-e29b-41d4-a716-446655440003', now() - interval '30 minutes', 8.0, 18.1, 4.2, 6.1, 34800, 34.1, 8.5, 29.7604, -95.3698);

-- Insert sample hazard alerts
INSERT INTO hazard_alerts (type, severity, title, description, location_lat, location_lng, affected_radius, is_active) VALUES
  ('oil_spill', 'high', 'Potential Oil Spill Detected', 'Elevated turbidity levels detected at Pacific Buoy Alpha. Possible oil contamination requiring immediate investigation.', 36.7783, -119.4179, 15.0, true),
  ('chemical_pollution', 'medium', 'pH Anomaly in Atlantic Waters', 'Unusual pH levels detected at Atlantic Monitor Beta. Chemical contamination suspected.', 40.7128, -74.0060, 10.0, true),
  ('tsunami', 'critical', 'Tsunami Warning - Gulf Coast', 'Significant water level rise detected. Immediate evacuation recommended for coastal areas.', 29.7604, -95.3698, 50.0, true),
  ('high_waves', 'low', 'Elevated Wave Activity', 'Moderate wave height increase observed in Mediterranean region.', 43.7696, 11.2558, 20.0, false),
  ('biological_pollution', 'medium', 'Algae Bloom Detected', 'Unusual dissolved oxygen patterns suggest potential harmful algae bloom.', 56.4907, 3.2044, 25.0, true);

-- Update sensor last_reading_at timestamps
UPDATE sensors SET last_reading_at = (
  SELECT MAX(timestamp) FROM sensor_readings WHERE sensor_readings.sensor_id = sensors.id
) WHERE is_active = true;