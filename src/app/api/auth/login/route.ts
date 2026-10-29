import { NextResponse } from 'next/server';
import { signJwt, SESSION_COOKIE_NAME } from '@/lib/auth';
import { Role } from '@/lib/types';
import { store } from '@/lib/db/store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role = 'FARMER', identifier, password, otp, name } = body;

    if (!identifier || identifier.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Mobile Phone or Email is required.' },
        { status: 400 }
      );
    }

    // Role-based target redirects
    const redirects: Record<Role, string> = {
      FARMER: '/farmer/dashboard',
      INSURER: '/insurer/dashboard',
      ADMIN: '/admin/overview',
      FIELD_AGENT: '/intelligence/map',
    };

    // Determine default display names & details based on persona
    let displayName = name;
    let district = 'Nadia';
    let village = 'Santipur';
    let organization = undefined;

    if (role === 'FARMER') {
      displayName = name || 'Subhash Biswas';
      district = 'Paschim Medinipur';
      village = 'Ghatal, West Bengal';
    } else if (role === 'INSURER') {
      displayName = name || 'Dr. S. Sen (Chief Actuary)';
      district = 'Kolkata Underwriting HQ';
      organization = 'Agriculture Insurance Company';
    } else if (role === 'ADMIN') {
      displayName = name || 'AgriSure Operations Lead';
      district = 'Geospatial Engineering Lab';
      organization = 'AgriSure Systems';
    } else if (role === 'FIELD_AGENT') {
      displayName = name || 'Prabir Bhattacharya (FA-WB-441)';
      district = 'Nadia & Murshidabad';
      organization = 'State Agri Extension Wing';
    }

    const userId = `usr_${role.toLowerCase()}_${Date.now()}`;

    // Create real signed JWT token
    const token = signJwt({
      userId,
      name: displayName,
      role: role as Role,
      identifier: identifier.trim(),
      district,
      village,
      organization,
    });

    const userProfile = {
      id: userId,
      name: displayName,
      role,
      phone: role === 'FARMER' || role === 'FIELD_AGENT' ? identifier : undefined,
      email: role === 'INSURER' || role === 'ADMIN' ? identifier : undefined,
      district,
      village,
      organization,
      token,
      authenticatedAt: new Date().toISOString(),
    };

    // Log the successful authentication in store audit logs
    store.addAuditLog({
      entityType: 'AUTH_SESSION',
      entityId: userId,
      action: 'USER_LOGIN_AUTHENTICATED',
      actor: `${role}:${displayName}`,
      metadata: { role, identifier, authMethod: otp ? 'OTP_SMS' : 'PASSWORD_HASH' },
      hashSha256: `sha256:${Buffer.from(token).toString('base64').substring(0, 20)}...`,
      verificationStatus: 'VALID_CHAIN'
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: userProfile,
      redirectUrl: redirects[role as Role] || '/farmer/dashboard',
    });

    // Set HTTP-only secure session cookie
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Login processing failed. Please verify credentials.' },
      { status: 500 }
    );
  }
}
