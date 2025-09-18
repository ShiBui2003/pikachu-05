-- Create a function to safely create test users if they don't exist
CREATE OR REPLACE FUNCTION create_test_user_if_not_exists() 
RETURNS UUID AS $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Check if test user exists
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;
  
  -- If not, create one
  IF test_user_id IS NULL THEN
    test_user_id := gen_random_uuid();
    
    -- Insert into auth.users (using direct insert as we can't use auth.users RPC in this context)
    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, 
      email_confirmed_at, recovery_sent_at, last_sign_in_at, 
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at, 
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      test_user_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'test@example.com',
      '$2a$10$2XQ8hPlGh2j2tFDduEhJk.6JxG6pX5v5z5X5v5X5v5X5v5X5v5X5u', -- password: test123
      NOW(), NOW(), NOW(),
      '{"provider":"email","providers":["email"]}',
      '{"email":"test@example.com","full_name":"Test User","role":"citizen"}',
      NOW(), NOW(),
      '', '', '', ''
    );
    
    -- Insert into profiles
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (test_user_id, 'test@example.com', 'Test User', NOW(), NOW());
  END IF;
  
  RETURN test_user_id;
END;
$$ LANGUAGE plpgsql;

-- Get or create test user
SELECT create_test_user_if_not_exists() AS test_user_id;

-- Insert sample issues (only if no issues exist)
DO $$
DECLARE
  test_user_id UUID;
BEGIN
  -- Get the test user ID
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;
  
  -- Only insert if we have a valid user
  IF test_user_id IS NOT NULL THEN
    -- Insert sample issues if they don't exist
    INSERT INTO public.issues (
      id, title, description, category, status, 
      location_address, location_lat, location_lng, 
      user_id, upvotes, created_at, updated_at
    )
    SELECT 
      gen_random_uuid(),
      'Pothole on Main Street',
      'Large pothole causing damage to vehicles near the intersection of Main St and Oak Ave.',
      'Roads',
      'submitted',
      '123 Main Street, Downtown',
      40.7128,
      -74.0060,
      test_user_id,
      15,
      NOW(),
      NOW()
    WHERE NOT EXISTS (SELECT 1 FROM public.issues WHERE title = 'Pothole on Main Street');

    INSERT INTO public.issues (
      id, title, description, category, status, 
      location_address, location_lat, location_lng, 
      user_id, upvotes, created_at, updated_at
    )
    SELECT 
      gen_random_uuid(),
      'Broken Streetlight',
      'Streetlight has been out for 2 weeks, creating safety concerns for pedestrians.',
      'Lighting',
      'in_progress',
      '456 Oak Avenue, Residential District',
      40.7589,
      -73.9851,
      test_user_id,
      8,
      NOW(),
      NOW()
    WHERE NOT EXISTS (SELECT 1 FROM public.issues WHERE title = 'Broken Streetlight');

    INSERT INTO public.issues (
      id, title, description, category, status, 
      location_address, location_lat, location_lng, 
      user_id, upvotes, created_at, updated_at
    )
    SELECT 
      gen_random_uuid(),
      'Overflowing Garbage Bin',
      'Public garbage bin has been overflowing for several days, attracting pests.',
      'Sanitation',
      'resolved',
      '789 Pine Street, City Park',
      40.7831,
      -73.9712,
      test_user_id,
      3,
      NOW(),
      NOW()
    WHERE NOT EXISTS (SELECT 1 FROM public.issues WHERE title = 'Overflowing Garbage Bin');
  END IF;
END $$;
