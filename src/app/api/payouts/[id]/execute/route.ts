import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Policy check: "let payment not happen for now"
  const isBankGatewayEnabled = process.env.SIMULATE_BANK_GATEWAY !== 'false';
  if (!isBankGatewayEnabled) {
    return NextResponse.json(
      {
        success: false,
        held: true,
        error: 'Disbursements are currently paused for the Ghatal pilot. Electronic NEFT settlements are held pending direct banking mandate activation.',
        payoutId: id,
      },
      { status: 403 }
    );
  }

  const executed = store.executePayout(id);

  if (!executed) {
    return NextResponse.json({ success: false, error: 'Payout record not found' }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    message: `Payment reference ${executed.payoutRef} successfully settled via simulated RBI NEFT Gateway to ${executed.farmerName}`,
    data: executed
  });
}
