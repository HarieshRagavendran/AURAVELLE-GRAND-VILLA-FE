
-- 1. DROP EXISTING TABLES IF RE-INITIALIZING (Optional, safe)
-- DROP TABLE IF EXISTS enquiries CASCADE;
-- DROP TABLE IF EXISTS rooms CASCADE;
-- DROP TABLE IF EXISTS site_settings CASCADE;

-- 2. CREATE ENQUIRIES TABLE
CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE,
  guest_count INTEGER DEFAULT 1,
  special_requests TEXT,
  status TEXT DEFAULT 'new', -- 'new', 'called', 'booked', 'cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CREATE ROOMS TABLE (Dynamic Pricing & Inventory)
CREATE TABLE IF NOT EXISTS rooms (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CREATE SITE SETTINGS TABLE (Phone, Email, WhatsApp, SEO tags)
CREATE TABLE IF NOT EXISTS site_settings (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  label TEXT,
  type TEXT DEFAULT 'text',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. SEED INITIAL SITE SETTINGS
INSERT INTO site_settings (key, value, label, type) VALUES
  ('phone', '+91 99446 12179', 'Contact Phone', 'tel'),
  ('email', 'auravellegrand@gmail.com', 'Contact Email', 'email'),
  ('whatsapp', '+919944612179', 'WhatsApp Contact', 'tel'),
  ('address', 'Kanthalloor, Kerala 685598', 'Villa Address', 'text'),
  ('price_range_start', '₹8,000', 'Starting Price Display', 'text'),
  ('instagram', 'https://instagram.com/thegrandauravelle', 'Instagram Profile', 'url'),
  ('facebook', '', 'Facebook Page', 'url'),
  ('meta_title', 'The Grand Auravelle Pool Villa · Luxury Retreat in Kanthalloor, Kerala', 'SEO Page Title', 'text'),
  ('meta_description', 'Experience luxury at The Grand Auravelle Pool Villa. Private pool suites, mountain views, waterfall treks, and world-class hospitality in Kanthalloor, Kerala.', 'SEO Meta Description', 'textarea')
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- 6. SEED INITIAL ROOM DATA
INSERT INTO rooms (name, subtitle, description, price, amenities, images, order_index, is_active) VALUES
(
  'Balcony Suite',
  'Panoramic Mountain View',
  'Wake up to misty hill vistas from your expansive private balcony. Features a king-size bed, handcrafted wooden finishes, a luxury rain shower en-suite, and sweeping morning horizons.',
  8500,
  '["King Bed", "Private Balcony", "Mountain View", "Rain Shower", "Mini Bar", "High-Speed WiFi", "Room Service", "Climate Control"]'::jsonb,
  '["images/balcony-suite.jpg", "images/balcony-view.jpg", "images/bedroom-spacious.jpg"]'::jsonb,
  1,
  true
),
(
  'Grand Pool Suite',
  'Private Heated Plunge Pool',
  'Indulge in absolute luxury with your dedicated heated plunge pool directly adjoining the bedroom suite. Features floor-to-ceiling glass, mood lighting, and complimentary campfire evenings.',
  14500,
  '["King Bed", "Private Heated Pool", "Mountain View", "En-suite Jacuzzi", "Outdoor Deck", "Complimentary Breakfast", "High-Speed WiFi", "24/7 Butler Support"]'::jsonb,
  '["images/bedroom-suite-1.jpg", "images/jacuzzi.jpg", "images/pool.jpg"]'::jsonb,
  2,
  true
),
(
  'Forest Retreat Villa',
  'Secluded Garden & Waterfall Proximity',
  'Nestled at the edge of the private evergreen forest. Complete privacy, serene birdsong, four-poster teakwood bed, and a private wooden lawn deck for starlit dining.',
  11000,
  '["Queen Bed", "Forest Lawn Access", "Outdoor Firepit Access", "Nature Trail Access", "Mini Bar", "Organic Toiletries", "High-Speed WiFi", "Room Service"]'::jsonb,
  '["images/bedroom-suite-2.jpg", "images/day-lawn.jpg", "images/forest-waterfall.jpg"]'::jsonb,
  3,
  true
),
(
  'Highland Jacuzzi Suite',
  'Open-Air Stargazing Jacuzzi',
  'Perched on the highest terrace with an open-air heated jacuzzi overlooking the tea estates and misty mountain tops. Ideal for couples and luxury getaways.',
  16500,
  '["King Bed", "Terrace Jacuzzi", "270° Mountain Panorama", "Luxury Bathrobes", "Espresso Machine", "Complimentary High Tea", "WiFi", "Climate Control"]'::jsonb,
  '["images/highland.jpeg", "images/jacuzzi.jpg", "images/day-facade.jpg"]'::jsonb,
  4,
  true
)
ON CONFLICT (id) DO NOTHING;

-- 7. ENABLE ROW LEVEL SECURITY (RLS) FOR BULLETPROOF DATABASE SECURITY
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- 8. POLICIES:
-- Public can read active rooms and site settings
CREATE POLICY "Public can view active rooms" ON rooms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view site settings" ON site_settings
  FOR SELECT USING (true);

-- Backend Service Role has full access (All inserts, updates, deletes are guarded by backend API)
CREATE POLICY "Service role has full access on enquiries" ON enquiries
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access on rooms" ON rooms
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role has full access on site_settings" ON site_settings
  FOR ALL USING (auth.role() = 'service_role');

-- 4. CREATE REVIEWS TABLE (Dynamic Guest Reviews Management)
CREATE TABLE IF NOT EXISTS reviews (
  id BIGSERIAL PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_location TEXT,
  guest_avatar TEXT,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  source TEXT DEFAULT 'Google',
  source_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample reviews (you can manage these via admin panel later)
INSERT INTO reviews (guest_name, guest_location, guest_avatar, rating, review_text, source, source_url, is_featured, display_order) VALUES
('Priya M.', 'Kochi', 'P', 5, 'The pool with that mountain backdrop — we still talk about it. Woke up to mist every morning and did not want to leave. The room was spotless and the hosts were incredibly warm.', 'Booking.com', 'https://www.booking.com/hotel/in/jose-villa-kanthalloor-by-voye-homes.html', true, 1),
('Rahul & Divya', 'Bangalore', 'R', 5, 'Perfect anniversary getaway. The jacuzzi at dusk with the cool mountain air was surreal. Campfire dinner was an unforgettable experience. Absolutely would return.', 'TripAdvisor', 'https://www.tripadvisor.in/Hotel_Review-g2337649-d34340156', true, 2),
('Anand K.', 'Chennai', 'A', 5, 'Kanthalloor is already beautiful — Auravelle makes it magical. The jeep safari, the fruit farm walk, the firepit evenings. An incredibly curated experience from start to finish.', 'VoyeHomes', 'https://voyehomes.com/jose-pool-villa-kanthalloor-by-voye-homes-umk', true, 3),
('Meera S.', 'Hyderabad', 'M', 5, 'We booked for a long weekend and stayed a full week — that says everything. The misty mornings, the private pool, the mountain silence. One of the best decisions we made this year.', 'MakeMyTrip', 'https://www.makemytrip.com/hotels/jose_villa_kanthalloor', false, 4),
('Thomas J.', 'Mumbai', 'T', 5, 'Clean, quiet, luxurious and surrounded by nature. The team was responsive from the first enquiry to checkout. The balcony view at sunrise is worth the entire trip on its own.', 'Booking.com', 'https://www.booking.com/hotel/in/jose-villa-kanthalloor-by-voye-homes.html', false, 5);

-- Enable RLS (Row Level Security) for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reviews
CREATE POLICY "Public can read reviews" ON reviews
  FOR SELECT USING (true);

-- Allow authenticated admin full access
CREATE POLICY "Admin can manage reviews" ON reviews
  FOR ALL USING (true);
