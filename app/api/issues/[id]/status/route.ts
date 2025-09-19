import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export async function PUT(
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
    const { status, assigned_to, notes, estimated_completion } = body;
    const issueId = params.id;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Get current issue to check permissions and get user_id for notifications
    const { data: currentIssue, error: fetchError } = await supabase
      .from('issues')
      .select('user_id, department_id, status')
      .eq('id', issueId)
      .single();

    if (fetchError || !currentIssue) {
      return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
    }

    // Update the issue
    const updateData: any = {
      status,
      updated_at: new Date().toISOString()
    };

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

    // Create workflow state record with notes
    if (notes || estimated_completion) {
      await supabase
        .from('issue_workflow_states')
        .insert({
          issue_id: issueId,
          status,
          department_id: currentIssue.department_id,
          assigned_to: assigned_to || null,
          notes,
          estimated_completion: estimated_completion || null,
          created_by: user.id
        });
    }

    // Create detailed notification for status changes
    if (currentIssue.status !== status) {
      let notificationTitle = '';
      let notificationMessage = '';
      
      switch (status) {
        case 'assigned':
          if (currentIssue.status === 'submitted') {
            notificationTitle = '✅ Issue Accepted';
            notificationMessage = `Great news! Your issue "${updatedIssue.title}" has been accepted by the admin and assigned to ${updatedIssue.department?.name || 'a department'} for resolution.`;
          } else {
            notificationTitle = 'Issue Assigned';
            notificationMessage = `Your issue "${updatedIssue.title}" has been assigned to ${updatedIssue.department?.name || 'a department'}.`;
          }
          break;
        case 'in_progress':
          notificationTitle = '🔧 Work Started';
          notificationMessage = `Work has started on your issue "${updatedIssue.title}". Our team is actively working to resolve it.`;
          break;
        case 'resolved':
          notificationTitle = '🎉 Issue Resolved';
          notificationMessage = `Your issue "${updatedIssue.title}" has been resolved! Please check if the problem has been fixed and let us know if you need any further assistance.`;
          break;
        case 'closed':
          if (currentIssue.status === 'submitted') {
            notificationTitle = '❌ Issue Rejected';
            notificationMessage = `Your issue "${updatedIssue.title}" has been reviewed and rejected. This may be due to insufficient information or the issue not meeting our criteria.`;
          } else {
            notificationTitle = 'Issue Closed';
            notificationMessage = `Your issue "${updatedIssue.title}" has been closed.`;
          }
          break;
        default:
          notificationTitle = 'Issue Updated';
          notificationMessage = `Your issue "${updatedIssue.title}" status has been updated to ${status.replace('_', ' ')}.`;
      }
      
      // Add admin notes if provided
      if (notes) {
        notificationMessage += `\n\nAdmin Note: ${notes}`;
      }
      
      // Add estimated completion if provided
      if (estimated_completion) {
        const completionDate = new Date(estimated_completion).toLocaleDateString();
        notificationMessage += `\n\nEstimated completion: ${completionDate}`;
      }

      await supabase
        .from('notifications')
        .insert({
          user_id: currentIssue.user_id,
          title: notificationTitle,
          message: notificationMessage,
          link: `/citizen/my-issues/${issueId}`,
          issue_id: issueId
        });
    }

    return NextResponse.json({ 
      issue: updatedIssue,
      message: 'Issue updated successfully'
    });
  } catch (error) {
    console.error('Error in PUT /api/issues/[id]/status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}