import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { priority, assigned_to } = body;
    const issueId = params.id;

    if (!priority && !assigned_to) {
      return NextResponse.json({ error: 'Priority or assigned_to is required' }, { status: 400 });
    }

    // Update the issue
    const updateData: any = {
      updated_at: new Date().toISOString()
    };

    if (priority) {
      updateData.priority = priority;
    }

    if (assigned_to !== undefined) {
      updateData.assigned_to = assigned_to;
    }

    const { data: updatedIssue, error: updateError } = await supabase
      .from('issues')
      .update(updateData)
      .eq('id', issueId)
      .select(`
        *,
        profiles:user_id(full_name, email),
        assigned_profile:assigned_to(full_name, email),
        department:department_id(name, email)
      `)
      .single();

    if (updateError) {
      console.error('Error updating issue:', updateError);
      return NextResponse.json({ error: 'Failed to update issue' }, { status: 500 });
    }

    return NextResponse.json({ 
      issue: updatedIssue,
      message: 'Issue updated successfully'
    });
  } catch (error) {
    console.error('Error in PATCH /api/issues/[id]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}