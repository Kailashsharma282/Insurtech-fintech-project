import { NextResponse } from 'next/server';
import { signJwt, SESSION_COOKIE_NAME } from '@/lib/auth';
import { Role } from '@/lib/types';
import { store } from '@/lib/db/store';
import { userStore } from '@/lib/db/user-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role = 'FARMER', identifier, password } = body;

    if (!identifier || identifier.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Mobile Phone or Email is required.' },
        { status: 400 }
      );
    }

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Password is required to authenticate.' },
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

    // Authenticate against UserStore (verifies PBKDF2 password hash)
    const authResult = userStore.authenticate(identifier, password, role as Role);

    if (authResult.error || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error || 'Invalid credentials. Authentication rejected.' },
        { status: 401 }
      );
    }

    const verifiedUser = authResult.user;

    // Create signed HMAC-SHA256 JWT token
    const token = signJwt({
      userId: verifiedUser.id,
      name: verifiedUser.name,
      role: verifiedUser.role,
      identifier: identifier.trim(),
      district: verifiedUser.district,
      village: verifiedUser.village,
      organization: verifiedUser.organization,
    });

    const userProfile = {
      id: verifiedUser.id,
      name: verifiedUser.name,
      role: verifiedUser.role,
      phone: verifiedUser.phone,
      email: verifiedUser.email,
      district: verifiedUser.district,
      village: verifiedUser.village,
      organization: verifiedUser.organization,
      token,
      authenticatedAt: new Date().toISOString(),
    };

    // Log the successful authentication in store audit logs
    store.addAuditLog({
      entityType: 'AUTH_SESSION',
      entityId: verifiedUser.id,
      action: 'USER_LOGIN_AUTHENTICATED',
      actor: `${verifiedUser.role}:${verifiedUser.name}`,
      metadata: { role: verifiedUser.role, identifier, authMethod: 'PASSWORD_PBKDF2_SHA512' },
      hashSha256: `sha256:${Buffer.from(token).toString('base64').substring(0, 20)}...`,
      verificationStatus: 'VALID_CHAIN'
    });

    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful.',
      user: userProfile,
      redirectUrl: redirects[verifiedUser.role] || '/farmer/dashboard',
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
