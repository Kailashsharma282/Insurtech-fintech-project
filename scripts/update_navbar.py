with open('src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Define ROLE_NAV_LINKS definition to insert before export const Navbar
role_links_def = '''interface NavItem {
  name: string;
  href: string;
  icon?: any;
  highlight?: boolean;
}

const ROLE_NAV_LINKS: Record<Role, NavItem[]> = {
  FARMER: [
    { name: 'Dashboard', href: '/farmer/dashboard', icon: Satellite },
    { name: 'My Farms', href: '/farmer/farms', icon: Layers },
    { name: 'Photo AI & NPK', href: '/farmer/disease', icon: Sparkles },
    { name: 'Insurance Claims', href: '/farmer/insurance-validation', icon: ShieldCheck, highlight: true },
    { name: 'Weather Telemetry', href: '/intelligence/weather', icon: Activity },
    { name: 'Policies', href: '/farmer/insurance', icon: FileText },
  ],
  INSURER: [
    { name: 'Underwriting Desk', href: '/insurer/dashboard', icon: Activity },
    { name: 'Cadastral Risk Map', href: '/insurer/risk-map', icon: Satellite, highlight: true },
    { name: 'Parametric Claims', href: '/insurer/claims', icon: ShieldCheck },
    { name: 'Policies Portfolio', href: '/insurer/policies', icon: FileText },
    { name: 'Settlement Payouts', href: '/insurer/payouts', icon: Zap },
    { name: 'Audit Trail', href: '/insurer/audit', icon: Layers },
  ],
  ADMIN: [
    { name: 'System Overview', href: '/admin/overview', icon: Activity },
    { name: 'IoT Relays', href: '/operations/iot', icon: Cpu, highlight: true },
    { name: 'AI Models', href: '/admin/ai-models', icon: Sparkles },
    { name: 'Exceptions Desk', href: '/admin/exceptions', icon: ShieldCheck },
    { name: 'Cadastral Map', href: '/insurer/risk-map', icon: Satellite },
  ],
  FIELD_AGENT: [
    { name: 'Field Risk Map', href: '/insurer/risk-map', icon: Satellite, highlight: true },
    { name: 'Farms Registry', href: '/farmer/farms', icon: Layers },
    { name: 'Leaf AI Scanner', href: '/farmer/disease', icon: Sparkles },
    { name: 'Ground Inspection', href: '/insurer/claims', icon: ShieldCheck },
    { name: 'Weather Station', href: '/intelligence/weather', icon: Activity },
  ],
};
'''

# 1. Insert ROLE_NAV_LINKS before export const Navbar
if 'const ROLE_NAV_LINKS' not in text:
    text = text.replace('export const Navbar: React.FC = () => {', role_links_def + '\nexport const Navbar: React.FC = () => {')

# 2. Update handleRoleChange inside Navbar
old_handle_role = '''  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'FARMER') router.push('/farmer/dashboard');
    else if (newRole === 'INSURER') router.push('/insurer/dashboard');
    else if (newRole === 'ADMIN') router.push('/operations/iot');
    else if (newRole === 'FIELD_AGENT') router.push('/intelligence/map');
  };'''

new_handle_role = '''  const activeNavLinks = ROLE_NAV_LINKS[role] || ROLE_NAV_LINKS.FARMER;

  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    if (newRole === 'FARMER') router.push('/farmer/dashboard');
    else if (newRole === 'INSURER') router.push('/insurer/dashboard');
    else if (newRole === 'ADMIN') router.push('/admin/overview');
    else if (newRole === 'FIELD_AGENT') router.push('/insurer/risk-map');
  };'''

if old_handle_role in text:
    text = text.replace(old_handle_role, new_handle_role)

# 3. Update brand logo link
old_brand_link = '<Link href="/farmer/dashboard" className="flex items-center space-x-1.5 sm:space-x-2.5 group">'
new_brand_link = '''<Link 
                href={role === 'INSURER' ? '/insurer/dashboard' : role === 'ADMIN' ? '/admin/overview' : role === 'FIELD_AGENT' ? '/insurer/risk-map' : '/farmer/dashboard'} 
                className="flex items-center space-x-1.5 sm:space-x-2.5 group"
              >'''
if old_brand_link in text:
    text = text.replace(old_brand_link, new_brand_link)

# 4. Replace desktop nav links with dynamic links
nav_start = '{/* 2. Center: Primary Navigation Links */}'
nav_end = '{/* 3. Right: Demo Persona Pill & Quick Controls (NO LOGIN/SIGNUP) */}'

new_desktop_nav = '''{/* 2. Center: Dynamic Role-Specific Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold overflow-x-hidden">
              {activeNavLinks.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/farmer/dashboard' && item.href !== '/insurer/dashboard' && item.href !== '/admin/overview' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'bg-blue-600/25 text-blue-300 border border-blue-500/40'
                        : item.highlight
                        ? 'text-blue-400 hover:text-white hover:bg-slate-800'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            '''

if nav_start in text and nav_end in text:
    start_pos = text.find(nav_start)
    end_pos = text.find(nav_end)
    text = text[:start_pos] + new_desktop_nav + text[end_pos:]

# 5. Replace mobile drawer navigation links
mobile_block_start = '<div className="space-y-1 border-t border-slate-800 pt-2">'
mobile_block_end = '{/* Mobile Dark / Light Mode Toggle */}'

new_mobile_nav = '''<div className="space-y-1 border-t border-slate-800 pt-2">
              <div className="px-3 py-1 flex items-center justify-between text-[10px] uppercase font-mono font-bold text-slate-400">
                <span>{role} Workspace Navigation</span>
                <span className="text-blue-400">{activeNavLinks.length} Links</span>
              </div>
              {activeNavLinks.map((item) => {
                const Icon = item.icon || Layers;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                      isActive 
                        ? 'bg-blue-600/30 text-blue-300 border border-blue-500/30' 
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span className="flex items-center space-x-2">
                      <Icon className="w-4 h-4 text-blue-400 shrink-0" />
                      <span>{item.name}</span>
                    </span>
                    <span className="text-slate-500">&rarr;</span>
                  </Link>
                );
              })}
            </div>

            '''

if mobile_block_start in text and mobile_block_end in text:
    start_pos = text.find(mobile_block_start)
    end_pos = text.find(mobile_block_end)
    text = text[:start_pos] + new_mobile_nav + text[end_pos:]

with open('src/components/layout/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated Navbar.tsx with role-based navigation!')

