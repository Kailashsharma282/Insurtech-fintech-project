import crypto from 'crypto';
import { Role } from '../types';

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(':')) return false;
  const [salt, originalHash] = storedHash.split(':');
  try {
    const computedHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(originalHash), Buffer.from(computedHash));
  } catch {
    return false;
  }
}

export function normalizeIdentifier(val: string): string {
  const clean = (val || '').trim().toLowerCase();
  if (clean.includes('@')) return clean;
  // If phone, extract the numeric digits
  const digits = clean.replace(/[^0-9]/g, '');
  // Match last 10 digits for Indian mobile numbers
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export interface UserAccount {
  id: string;
  name: string;
  role: Role;
  phone?: string;
  email?: string;
  passwordHash: string;
  district: string;
  village?: string;
  organization?: string;
  licenseId?: string;
  primaryCrop?: string;
  farmSizeHa?: number;
  bankAccount?: string;
  createdAt: string;
}

export class UserStore {
  private users: UserAccount[] = [];

  constructor() {
    this.seedDefaultPilotUsers();
  }

  private seedDefaultPilotUsers() {
    // 1. Farmer: Subhash Biswas
    this.users.push({
      id: 'usr-farmer-01',
      name: 'Subhash Biswas',
      role: 'FARMER',
      phone: '+91 98321 44820',
      email: 'subhash.biswas@agrisure-wb.in',
      passwordHash: hashPassword('Farmer@2026'),
      district: 'Paschim Medinipur',
      village: 'Ghatal',
      primaryCrop: 'Aman Paddy',
      farmSizeHa: 2.8,
      createdAt: '2026-06-01T08:00:00Z',
    });

    // 2. Insurer: Dr. S. Sen (Chief Actuary / Underwriter)
    this.users.push({
      id: 'usr-insurer-01',
      name: 'Dr. S. Sen (Chief Actuary)',
      role: 'INSURER',
      email: 'underwriter@agrisure.in',
      phone: '+91 98300 11223',
      passwordHash: hashPassword('Insurer@2026'),
      district: 'Kolkata Underwriting HQ',
      organization: 'Agriculture Insurance Company',
      licenseId: 'IRDAI-AGR-2024-8842',
      createdAt: '2026-01-10T09:00:00Z',
    });

    // 3. Admin: AgriSure Operations Lead
    this.users.push({
      id: 'usr-admin-01',
      name: 'AgriSure Operations Lead',
      role: 'ADMIN',
      email: 'admin@agrisure.in',
      phone: '+91 98300 99887',
      passwordHash: hashPassword('Admin@2026'),
      district: 'Geospatial Engineering Lab',
      organization: 'AgriSure Systems',
      createdAt: '2025-11-01T08:00:00Z',
    });

    // 4. Field Agent: Prabir Bhattacharya
    this.users.push({
      id: 'usr-agent-01',
      name: 'Prabir Bhattacharya (FA-WB-441)',
      role: 'FIELD_AGENT',
      phone: '+91 94330 12345',
      email: 'agent@agrisure.in',
      passwordHash: hashPassword('Agent@2026'),
      district: 'Ghatal, Paschim Medinipur',
      organization: 'State Agri Extension Wing (FA-WB-441)',
      createdAt: '2026-03-20T11:30:00Z',
    });
  }

  findUserByIdentifier(rawIdentifier: string): UserAccount | undefined {
    const norm = normalizeIdentifier(rawIdentifier);
    if (!norm) return undefined;
    return this.users.find(u => {
      const emailNorm = u.email ? normalizeIdentifier(u.email) : '';
      const phoneNorm = u.phone ? normalizeIdentifier(u.phone) : '';
      return emailNorm === norm || phoneNorm === norm;
    });
  }

  getUserById(id: string): UserAccount | undefined {
    return this.users.find(u => u.id === id);
  }

  authenticate(rawIdentifier: string, passwordAttempt: string, requestedRole?: Role): { user?: UserAccount; error?: string } {
    if (!rawIdentifier || !rawIdentifier.trim()) {
      return { error: 'Mobile number or email is required.' };
    }
    if (!passwordAttempt || !passwordAttempt.trim()) {
      return { error: 'Account password is required.' };
    }

    const user = this.findUserByIdentifier(rawIdentifier);
    if (!user) {
      return { error: 'No account found matching this mobile number or email. Please register first.' };
    }

    if (requestedRole && user.role !== requestedRole) {
      return { error: `Account exists as ${user.role}, but you selected ${requestedRole}. Please switch role tabs.` };
    }

    const isValid = verifyPassword(passwordAttempt, user.passwordHash);
    if (!isValid) {
      return { error: 'Invalid password. Please check your credentials.' };
    }

    return { user };
  }

  registerUser(params: {
    name: string;
    role: Role;
    identifier: string;
    password: string;
    district?: string;
    village?: string;
    organization?: string;
    licenseId?: string;
    primaryCrop?: string;
    farmSizeHa?: number;
    bankAccount?: string;
  }): { user?: UserAccount; error?: string } {
    const existing = this.findUserByIdentifier(params.identifier);
    if (existing) {
      return { error: 'An account with this mobile number or email already exists. Please sign in.' };
    }

    if (!params.password || params.password.length < 6) {
      return { error: 'Password must be at least 6 characters long.' };
    }

    const isEmail = params.identifier.includes('@');
    const newUser: UserAccount = {
      id: `usr_${params.role.toLowerCase()}_${Date.now()}`,
      name: params.name.trim(),
      role: params.role,
      phone: !isEmail ? params.identifier.trim() : undefined,
      email: isEmail ? params.identifier.trim() : undefined,
      passwordHash: hashPassword(params.password),
      district: params.district || 'Ghatal, Paschim Medinipur',
      village: params.village || 'Ghatal',
      organization: params.organization,
      licenseId: params.licenseId,
      primaryCrop: params.primaryCrop || 'Aman Paddy',
      farmSizeHa: params.farmSizeHa || 2.5,
      bankAccount: params.bankAccount || 'Direct Bank NEFT Registered',
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return { user: newUser };
  }
}

const globalForUserStore = globalThis as unknown as { userStore: UserStore };
export const userStore = globalForUserStore.userStore || new UserStore();
if (process.env.NODE_ENV !== 'production') {
  globalForUserStore.userStore = userStore;
}

