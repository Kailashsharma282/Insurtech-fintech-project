import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getSessionUser();

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        user: null,
      }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.userId,
        name: session.name,
        role: session.role,
        identifier: session.identifier,
        district: session.district,
        village: session.village,
        organization: session.organization,
      },
    });
  } catch (error) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    }, { status: 500 });
  }
}
