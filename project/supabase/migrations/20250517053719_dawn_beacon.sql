/*
  # Seed Market Prices Data

  1. Initial Data
    - Add sample market prices for common crops
    - Include different market locations
    - Set realistic price ranges
*/

INSERT INTO market_prices (crop_name, price_per_unit, unit, market_location, trend)
VALUES
  ('Rice', 2500, 'quintal', 'Chennai', 'up'),
  ('Wheat', 2200, 'quintal', 'Delhi', 'stable'),
  ('Tomato', 40, 'kg', 'Bangalore', 'up'),
  ('Potato', 25, 'kg', 'Kolkata', 'down'),
  ('Onion', 35, 'kg', 'Mumbai', 'up'),
  ('Cotton', 6000, 'quintal', 'Ahmedabad', 'stable'),
  ('Sugarcane', 350, 'quintal', 'Pune', 'up'),
  ('Soybean', 4000, 'quintal', 'Indore', 'down'),
  ('Maize', 1800, 'quintal', 'Patna', 'stable'),
  ('Groundnut', 5500, 'quintal', 'Hyderabad', 'up');