with open('src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update imports
text = text.replace(
    "FileText\n} from 'lucide-react';",
    "FileText,\n  LogOut,\n  LogIn,\n  UserCheck\n} from 'lucide-react';"
)

# 2. Update useRole call
text = text.replace(
    "const { role, setRole, user } = useRole();",
    "const { role, setRole, user, logout } = useRole();"
)

# 3. Add desktop User / Logout controls before mobile drawer trigger
desktop_target = """              {/* Mobile Drawer Trigger */}"""
desktop_replacement = """              {/* User Account & Logout */}
              <Link
                href="/login"
                className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                title="Switch Demo Account"
              >
                <UserCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span className="hidden xl:inline truncate max-w-[100px]">{user?.name?.split(' ')[0] || 'Demo'}</span>
              </Link>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.push('/login');
                }}
                className="h-8 sm:h-9 px-2 sm:px-2.5 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/80 text-red-200 text-[11px] sm:text-xs font-bold flex items-center gap-1 transition-colors shrink-0"
                title="Log Out of Session"
              >
                <LogOut className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Drawer Trigger */}"""

text = text.replace(desktop_target, desktop_replacement)

# 4. Add mobile drawer Logout row at the bottom of mobile menu
mobile_target = """            </div>
          </div>
        )}"""
mobile_replacement = """            </div>

            {/* Mobile Account & Logout Row */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Switch Demo Account</span>
              </Link>
              <button
                type="button"
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await logout();
                  router.push('/login');
                }}
                className="py-2 px-3 rounded-lg bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 text-xs font-bold flex items-center justify-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}"""

text = text.replace(mobile_target, mobile_replacement)

with open('src/components/layout/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated Navbar.tsx with login/logout buttons and user profile pill!")

