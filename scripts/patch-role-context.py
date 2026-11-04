with open('src/context/RoleContext.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

old_profiles = """const DEFAULT_PROFILES: Record<Role, UserProfile> = {
  FARMER: {
    id: 'usr-farmer-01',
    name: 'Rajesh Mondal',
    role: 'FARMER',
    phone: '+91 98321 44820',
    district: 'Purba Medinipur',
    village: 'Ghatal, West Bengal',
    primaryCrop: 'Aman Paddy',
    farmSizeHa: 2.8,
    bankAccount: 'State Bank of India (***4921)',
    createdAt: '2026-06-15T10:00:00Z',
  },
  INSURER: {
    id: 'usr-insurer-01',
    name: 'Dr. S. Sen (Chief Actuary)',
    role: 'INSURER',
    email: 'underwriter@agrisure.in',
    organization: 'Agriculture Insurance Co. of India',
    licenseId: 'IRDAI-AGR-2024-8842',
    district: 'Kolkata HQ (West Bengal Cluster)',
    createdAt: '2026-01-10T09:00:00Z',
  },
  ADMIN: {
    id: 'usr-admin-01',
    name: 'Dr. Arindam Banerjee',
    role: 'ADMIN',
    email: 'admin@agrisure.in',
    organization: 'AgriSure Geospatial Lab & Engineering',
    createdAt: '2025-11-01T08:00:00Z',
  },
  FIELD_AGENT: {
    id: 'usr-agent-01',
    name: 'Prabir Bhattacharya (FA-WB-441)',
    role: 'FIELD_AGENT',
    phone: '+91 94330 12345',
    district: 'Ghatal, Purba Medinipur',
    organization: 'State Agri Extension Wing (FA-WB-441)',
    createdAt: '2026-03-20T11:30:00Z',
  },
};"""

new_profiles = """const DEFAULT_PROFILES: Record<Role, UserProfile> = {
  FARMER: {
    id: 'usr-farmer-01',
    name: 'Subhash Mondal (Plot #204)',
    role: 'FARMER',
    email: 'farmer@agrisure.in',
    phone: '+91 98321 44820',
    district: 'Purba Medinipur',
    village: 'Ghatal',
    primaryCrop: 'Aman Paddy',
    farmSizeHa: 2.8,
    bankAccount: 'State Bank of India (***4921)',
    createdAt: '2026-06-15T10:00:00Z',
  },
  INSURER: {
    id: 'usr-insurer-01',
    name: 'Dr. S. Sen (Chief Underwriter)',
    role: 'INSURER',
    email: 'insurer@agrisure.in',
    phone: '+91 98300 11223',
    organization: 'Agriculture Insurance Company',
    licenseId: 'IRDAI-AGR-2024-8842',
    district: 'Purba Medinipur & WB Cluster',
    createdAt: '2026-01-10T09:00:00Z',
  },
  ADMIN: {
    id: 'usr-admin-01',
    name: 'AgriSure Operations Administrator',
    role: 'ADMIN',
    email: 'admin@agrisure.in',
    phone: '+91 98300 99887',
    organization: 'AgriSure Systems Engineering Lab',
    district: 'Purba Medinipur',
    createdAt: '2025-11-01T08:00:00Z',
  },
  FIELD_AGENT: {
    id: 'usr-agent-01',
    name: 'Prabir Bhattacharya (Lead Field Inspector & CCE Agronomist)',
    role: 'FIELD_AGENT',
    email: 'inspector@agrisure.in',
    phone: '+91 94330 12345',
    district: 'Ghatal, Purba Medinipur',
    organization: 'State Agri Extension Wing (FA-WB-441)',
    createdAt: '2026-03-20T11:30:00Z',
  },
};"""

text = text.replace('\r\n', '\n')
old_profiles = old_profiles.replace('\r\n', '\n')
new_profiles = new_profiles.replace('\r\n', '\n')

text = text.replace(old_profiles, new_profiles)
text = text.replace("FIELD_AGENT: 'Agent@2026',", "FIELD_AGENT: 'Inspector@2026',")

with open('src/context/RoleContext.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated RoleContext.tsx profiles!")
