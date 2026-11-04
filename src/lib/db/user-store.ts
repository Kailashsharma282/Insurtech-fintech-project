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
  aliases?: string[];
  passwordHash: string;
  altPasswordHash?: string;
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
    // 1. Farmer: Subhash Mondal
    this.users.push({
      id: 'usr-farmer-01',
      name: 'Subhash Mondal (Plot #204)',
      role: 'FARMER',
      phone: '+91 98321 44820',
      email: 'farmer@agrisure.in',
      aliases: ['subhash.biswas@agrisure-wb.in', 'subhash.mondal@agrisure.in', '9832144820'],
      passwordHash: hashPassword('Farmer@2026'),
      district: 'Paschim Medinipur',
      village: 'Ghatal',
      primaryCrop: 'Aman Paddy',
      farmSizeHa: 2.8,
      createdAt: '2026-06-01T08:00:00Z',
    });

    // 2. Insurer: Dr. S. Sen (Chief Underwriter)
    this.users.push({
      id: 'usr-insurer-01',
      name: 'Dr. S. Sen (Chief Underwriting Officer)',
      role: 'INSURER',
      email: 'insurer@agrisure.in',
      aliases: ['underwriter@agrisure.in', '9830011223'],
      phone: '+91 98300 11223',
      passwordHash: hashPassword('Insurer@2026'),
      district: 'Paschim Medinipur & WB Cluster',
      organization: 'Agriculture Insurance Company',
      licenseId: 'IRDAI-AGR-2024-8842',
      createdAt: '2026-01-10T09:00:00Z',
    });

    // 3. Admin: AgriSure Operations Administrator
    this.users.push({
      id: 'usr-admin-01',
      name: 'AgriSure Operations Administrator',
      role: 'ADMIN',
      email: 'admin@agrisure.in',
      aliases: ['admin@agrisure-systems.in', '9830099887'],
      phone: '+91 98300 99887',
      passwordHash: hashPassword('Admin@2026'),
      district: 'Paschim Medinipur',
      organization: 'AgriSure Systems Engineering Lab',
      createdAt: '2025-11-01T08:00:00Z',
    });

    // 4. Field Inspector: Prabir Bhattacharya (Lead Field Inspector & CCE Agronomist)
    this.users.push({
      id: 'usr-agent-01',
      name: 'Prabir Bhattacharya (Lead Field Inspector & CCE Agronomist)',
      role: 'FIELD_AGENT',
      phone: '+91 94330 12345',
      email: 'inspector@agrisure.in',
      aliases: ['agent@agrisure.in', 'field@agrisure.in', '9433012345'],
      passwordHash: hashPassword('Inspector@2026'),
      altPasswordHash: hashPassword('Agent@2026'),
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
      if (emailNorm === norm || phoneNorm === norm) return true;
      if (u.aliases && u.aliases.some(a => normalizeIdentifier(a) === norm)) return true;
      return false;
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
      return { error: 'No account found matching this mobile number or email. Please check your demo credentials.' };
    }

    if (requestedRole && user.role !== requestedRole) {
      return { error: `Account exists as ${user.role}, but you selected ${requestedRole}. Please switch role tabs.` };
    }

    let isValid = verifyPassword(passwordAttempt, user.passwordHash);
    if (!isValid && user.altPasswordHash) {
      isValid = verifyPassword(passwordAttempt, user.altPasswordHash);
    }

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
      id: `usr-reg-${Date.now()}`,
      name: params.name,
      role: params.role,
      email: isEmail ? params.identifier : undefined,
      phone: !isEmail ? params.identifier : undefined,
      passwordHash: hashPassword(params.password),
      district: params.district || 'Ghatal, Paschim Medinipur',
      village: params.village || 'Ghatal',
      organization: params.organization,
      licenseId: params.licenseId,
      primaryCrop: params.primaryCrop || 'Aman Paddy',
      farmSizeHa: params.farmSizeHa || 2.0,
      bankAccount: params.bankAccount,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    return { user: newUser };
  }

  getAllUsers(): UserAccount[] {
    return [...this.users];
  }
}

// Global in-memory singleton
const globalForUsers = globalThis as unknown as { userStoreInstance: UserStore };
export const userStore = globalForUsers.userStoreInstance || new UserStore();
if (process.env.NODE_ENV !== 'production') globalForUsers.userStoreInstance = userStore;
