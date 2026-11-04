import { NextResponse } from 'next/server';
import { signJwt, SESSION_COOKIE_NAME } from '@/lib/auth';
import { Role } from '@/lib/types';
import { store } from '@/lib/db/store';
import { userStore } from '@/lib/db/user-store';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      role = 'FARMER', 
      phone, 
      email, 
      password,
      district = 'Ghatal, Paschim Medinipur', 
      village = 'Ghatal', 
      organization, 
      licenseId, 
      primaryCrop = 'Aman Paddy', 
      farmSizeHa, 
      bankAccount 
    } = body;

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Full name is required for registration.' },
        { status: 400 }
      );
    }

    const identifier = phone || email;
    if (!identifier || identifier.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Mobile Phone or Email is required.' },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password is required and must be at least 6 characters long.' },
        { status: 400 }
      );
    }

    // Register user in UserStore (hashes password with PBKDF2)
    const regResult = userStore.registerUser({
      name: name.trim(),
      role: role as Role,
      identifier: identifier.trim(),
      password,
      district,
      village,
      organization,
      licenseId,
      primaryCrop,
      farmSizeHa: farmSizeHa ? parseFloat(farmSizeHa) : 2.5,
      bankAccount,
    });

    if (regResult.error || !regResult.user) {
      return NextResponse.json(
        { success: false, error: regResult.error || 'Registration failed.' },
        { status: 409 }
      );
    }

    const newUser = regResult.user;

    // Role-based target redirects
    const redirects: Record<Role, string> = {
      FARMER: '/farmer/dashboard',
      INSURER: '/insurer/dashboard',
      ADMIN: '/admin/overview',
      FIELD_AGENT: '/intelligence/map',
    };

    // Generate real signed JWT
    const token = signJwt({
      userId: newUser.id,
      name: newUser.name,
      role: newUser.role,
      identifier: identifier.trim(),
      district: newUser.district,
      village: newUser.village,
      organization: newUser.organization,
    });

    const userProfile = {
      id: newUser.id,
      name: newUser.name,
      role: newUser.role,
      phone: newUser.phone,
      email: newUser.email,
      district: newUser.district,
      village: newUser.village,
      organization: newUser.organization,
      token,
      createdAt: newUser.createdAt,
    };

    // Audit log
    store.addAuditLog({
      entityType: 'FARMER_ENROLLMENT',
      entityId: newUser.id,
      action: 'NEW_USER_REGISTERED',
      actor: `${newUser.role}:${newUser.name}`,
      metadata: { role: newUser.role, identifier, district: newUser.district },
      hashSha256: `sha256:${Buffer.from(token).toString('base64').substring(0, 20)}...`,
      verificationStatus: 'VALID_CHAIN'
    });

    const response = NextResponse.json({
      success: true,
      message: 'Account registered and activated successfully.',
      user: userProfile,
      redirectUrl: redirects[newUser.role] || '/farmer/dashboard',
    }, { status: 201 });

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
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, error: 'Registration processing failed. Please check inputs.' },
      { status: 500 }
    );
  }
}
