import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role = 'FARMER', identifier, password, otp } = body;

    if (!identifier) {
      return NextResponse.json(
        { error: 'Identifier (Mobile Phone or Email) is required.' },
        { status: 400 }
      );
    }

    // Role-based target redirects
    const redirects: Record<string, string> = {
      FARMER: '/farmer/dashboard',
      INSURER: '/insurer/dashboard',
      ADMIN: '/admin/overview',
      FIELD_AGENT: '/intelligence/map',
    };

    const userProfile = {
      id: `usr_${Date.now()}`,
      name: role === 'FARMER' ? 'Rajesh Mondal' : (role === 'INSURER' ? 'Priya Sengupta' : 'Authorized User'),
      role,
      identifier,
      token: `jwt_agrisure_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      authenticatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: userProfile,
      redirectUrl: redirects[role] || '/farmer/dashboard',
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Login processing failed. Please check credentials.' },
      { status: 500 }
    );
  }
}
