import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      role = 'FARMER', 
      phone, 
      email, 
      district, 
      village, 
      organization, 
      licenseId, 
      primaryCrop, 
      farmSizeHa, 
      bankAccount 
    } = body;

    if (!name || (!phone && !email)) {
      return NextResponse.json(
        { error: 'Name and either Mobile Phone or Email are required.' },
        { status: 400 }
      );
    }

    const redirects: Record<string, string> = {
      FARMER: '/farmer/dashboard',
      INSURER: '/insurer/dashboard',
      ADMIN: '/admin/overview',
      FIELD_AGENT: '/intelligence/map',
    };

    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      role,
      phone,
      email,
      district: district || 'Nadia',
      village: village || 'Santipur',
      organization,
      licenseId,
      primaryCrop: primaryCrop || 'Aman Paddy',
      farmSizeHa: farmSizeHa ? parseFloat(farmSizeHa) : 2.5,
      bankAccount,
      token: `jwt_agrisure_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: 'Account successfully registered and active.',
      user: newUser,
      redirectUrl: redirects[role] || '/farmer/dashboard',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Registration failed. Please check form inputs.' },
      { status: 500 }
    );
  }
}
