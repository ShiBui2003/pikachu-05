import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    
    let query = supabase
      .from('issues')
      .select(`
        *,
        profiles:user_id(full_name, email),
        assigned_profile:assigned_to(full_name, email),
        comments:comments(count),
        issue_votes:issue_votes(count)
      `)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }
    
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,location_address.ilike.%${search}%`);
    }

    const { data: issues, error } = await query;
    
    if (error) {
      console.error('Error fetching issues:', error);
      return NextResponse.json({ error: 'Failed to fetch issues' }, { status: 500 });
    }

    // Get total count for pagination
    let countQuery = supabase.from('issues').select('*', { count: 'exact', head: true });
    if (category && category !== 'all') countQuery = countQuery.eq('category', category);
    if (status && status !== 'all') countQuery = countQuery.eq('status', status);
    if (search) countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%,location_address.ilike.%${search}%`);
    
    const { count } = await countQuery;

    return NextResponse.json({
      issues: issues || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Error in GET /api/issues:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, description, category, priority, location_address, location_lat, location_lng, image_url } = body;

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Title, description, and category are required' }, { status: 400 });
    }

    // Insert the issue and return with related profile info (requires FKs between issues.user_id and profiles.id)
    const { data: issue, error } = await supabase
      .from('issues')
      .insert({
        title,
        description,
        category,
        priority: priority || 'medium',
        location_address,
        location_lat: location_lat ? parseFloat(location_lat) : null,
        location_lng: location_lng ? parseFloat(location_lng) : null,
        image_url,
        user_id: user.id
      })
      .select(`
        *,
        profiles:user_id(full_name, email)
      `)
      .single();
    
    if (issue && !error) {
      return NextResponse.json({ issue }, { status: 201 });
    }

    if (error) {
      console.error('Error creating issue:', error);
      return NextResponse.json({ error: 'Failed to create issue' }, { status: 500 });
    }

    return NextResponse.json({ issue }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/issues:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
