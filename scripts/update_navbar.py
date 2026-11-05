with open('src/components/layout/Navbar.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update container from max-w-7xl to full width
content = content.replace(
    '<div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">',
    '<div className="w-full px-2.5 sm:px-6 lg:px-8">'
)

# 2. Update nav element: remove overflow-x-hidden, optimize spacing
content = content.replace(
    '<nav className="hidden lg:flex items-center space-x-1 text-xs font-semibold overflow-x-hidden">',
    '<nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 text-xs font-semibold">'
)

content = content.replace(
    'className={`px-2.5 py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${',
    'className={`px-2 py-1.5 xl:px-2.5 xl:py-1.5 rounded-lg transition-all whitespace-nowrap shrink-0 ${'
)

# 3. Compact simulate shock text on lg screens
content = content.replace(
    '<span className="text-[11px]">Simulate Shock</span>',
    '<span className="text-[11px] hidden xl:inline">Simulate Shock</span><span className="text-[11px] xl:hidden">Simulate</span>'
)

# 4. Compact logout button text on lg screens
content = content.replace(
    '<span className="hidden sm:inline">Logout</span>',
    '<span className="hidden xl:inline">Logout</span>'
)

with open('src/components/layout/Navbar.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated Navbar.tsx successfully!")
