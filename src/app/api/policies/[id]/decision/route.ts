import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action, rejectionReason, underwriterNotes } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Policy ID is required' }, { status: 400 });
    }

    if (action === 'APPROVE') {
      const policy = store.approvePolicy(id, underwriterNotes || 'Approved by Chief Underwriter. Risk limits within threshold.');
      if (!policy) {
        return NextResponse.json({ success: false, error: 'Policy not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Policy ${policy.policyNumber} has been approved and issued successfully.`,
        data: policy
      });
    }

    if (action === 'REJECT') {
      const reason = rejectionReason || 'EXCEEDS_SPATIAL_IU_RISK_CAP';
      const policy = store.rejectPolicy(
        id, 
        reason, 
        underwriterNotes || 'Application does not meet parametric underwriting acceptance criteria.'
      );
      if (!policy) {
        return NextResponse.json({ success: false, error: 'Policy not found' }, { status: 404 });
      }
      return NextResponse.json({
        success: true,
        message: `Policy application ${policy.policyNumber} has been rejected.`,
        data: policy
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action specified. Must be APPROVE or REJECT.' 
    }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process underwriting decision' }, { status: 500 });
  }
}
