import { NextRequest, NextResponse } from 'next/server';
import { store } from '@/lib/db/store';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ entityType: string; entityId: string }> }
) {
  const { entityType, entityId } = await params;
  const logs = store.getAuditLogs(entityType, entityId);

  return NextResponse.json({
    success: true,
    entityType,
    entityId,
    count: logs.length,
    data: logs
  });
}
