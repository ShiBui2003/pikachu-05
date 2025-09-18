-- Insert sample issues (only if no issues exist)
INSERT INTO public.issues (title, description, category, status, location_address, location_lat, location_lng, user_id, upvotes)
SELECT 
  'Pothole on Main Street',
  'Large pothole causing damage to vehicles near the intersection of Main St and Oak Ave.',
  'Roads',
  'submitted',
  '123 Main Street, Downtown',
  40.7128,
  -74.0060,
  (SELECT id FROM auth.users LIMIT 1),
  15
WHERE NOT EXISTS (SELECT 1 FROM public.issues);

INSERT INTO public.issues (title, description, category, status, location_address, location_lat, location_lng, user_id, upvotes)
SELECT 
  'Broken Streetlight',
  'Streetlight has been out for 2 weeks, creating safety concerns for pedestrians.',
  'Lighting',
  'in_progress',
  '456 Oak Avenue, Residential District',
  40.7589,
  -73.9851,
  (SELECT id FROM auth.users LIMIT 1),
  8
WHERE NOT EXISTS (SELECT 1 FROM public.issues WHERE title = 'Broken Streetlight');

INSERT INTO public.issues (title, description, category, status, location_address, location_lat, location_lng, user_id, upvotes)
SELECT 
  'Overflowing Garbage Bin',
  'Public garbage bin has been overflowing for several days, attracting pests.',
  'Sanitation',
  'resolved',
  '789 Pine Street, City Park',
  40.7831,
  -73.9712,
  (SELECT id FROM auth.users LIMIT 1),
  3
WHERE NOT EXISTS (SELECT 1 FROM public.issues WHERE title = 'Overflowing Garbage Bin');
