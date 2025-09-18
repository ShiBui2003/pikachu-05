-- Create a function to safely get or create test user
CREATE OR REPLACE FUNCTION public.get_or_create_test_user() 
RETURNS UUID AS $$
DECLARE
  test_user_id UUID;
BEGIN
  -- First try to get existing user
  SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;
  
  -- If not found, create one
  IF test_user_id IS NULL THEN
    test_user_id := gen_random_uuid();
    
    -- Insert into auth.users with error handling
    BEGIN
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
      
      -- Insert into profiles with error handling
      INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
      VALUES (test_user_id, 'test@example.com', 'Test User', NOW(), NOW())
      ON CONFLICT (id) DO NOTHING;
      
    EXCEPTION WHEN OTHERS THEN
      -- If user already exists, get the ID
      IF SQLSTATE = '23505' THEN -- unique_violation
        SELECT id INTO test_user_id FROM auth.users WHERE email = 'test@example.com' LIMIT 1;
      ELSE
        RAISE;
      END IF;
    END;
  END IF;
  
  -- Ensure profile exists
  INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
  VALUES (test_user_id, 'test@example.com', 'Test User', NOW(), NOW())
  ON CONFLICT (id) DO UPDATE 
  SET email = EXCLUDED.email, 
      full_name = EXCLUDED.full_name, 
      updated_at = NOW()
  WHERE profiles.id = EXCLUDED.id;
  
  RETURN test_user_id;
END;
$$ LANGUAGE plpgsql;

-- Create a function to seed test data
CREATE OR REPLACE FUNCTION public.seed_test_data()
RETURNS void AS $$
DECLARE
  test_user_id UUID;
  issue1_id UUID;
  issue2_id UUID;
  issue3_id UUID;
  user_exists BOOLEAN;
BEGIN
  -- Check if we have any users
  SELECT EXISTS (SELECT 1 FROM auth.users LIMIT 1) INTO user_exists;
  
  -- Only proceed if we have users or can create one
  IF NOT user_exists THEN
    -- Get or create test user
    SELECT public.get_or_create_test_user() INTO test_user_id;
    
    IF test_user_id IS NULL THEN
      RAISE EXCEPTION 'Failed to create test user';
    END IF;
  ELSE
    -- Use the first available user
    SELECT id INTO test_user_id FROM auth.users ORDER BY created_at LIMIT 1;
  END IF;
  
  -- Insert sample issues if they don't exist
  IF NOT EXISTS (SELECT 1 FROM public.issues WHERE title = 'Pothole on Main Street') THEN
    INSERT INTO public.issues (
      id, title, description, category, status, 
      location_address, location_lat, location_lng, 
      user_id, upvotes, created_at, updated_at
    ) VALUES (
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
    ) RETURNING id INTO issue1_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.issues WHERE title = 'Broken Streetlight') THEN
    INSERT INTO public.issues (
      id, title, description, category, status, 
      location_address, location_lat, location_lng, 
      user_id, upvotes, created_at, updated_at
    ) VALUES (
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
    ) RETURNING id INTO issue2_id;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM public.issues WHERE title = 'Overflowing Garbage Bin') THEN
    INSERT INTO public.issues (
      id, title, description, category, status, 
      location_address, location_lat, location_lng, 
      user_id, upvotes, created_at, updated_at
    ) VALUES (
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
    ) RETURNING id INTO issue3_id;
  END IF;
  
  RAISE NOTICE 'Test data seeded successfully';
END;
$$ LANGUAGE plpgsql;

-- Execute the seed function
SELECT public.seed_test_data();

-- Clean up temporary function
DROP FUNCTION IF EXISTS public.seed_test_data();
