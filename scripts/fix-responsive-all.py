import os

files_to_fix = [
    'src/app/farmer/insurance/page.tsx',
    'src/app/farmer/farms/page.tsx',
    'src/app/farmer/farms/[id]/page.tsx',
    'src/app/insurer/dashboard/page.tsx',
    'src/app/insurer/claims/page.tsx',
    'src/app/insurer/claims/[id]/page.tsx',
    'src/app/intelligence/weather/page.tsx',
    'src/app/operations/iot/page.tsx',
    'src/app/admin/overview/page.tsx',
    'src/app/team/page.tsx',
]

def update_file(path, replacements):
    if not os.path.exists(path):
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    orig = content
    for old, new in replacements:
        content = content.replace(old, new)
    if content != orig:
        with open(path, 'w', encoding='utf-8', newline='') as f:
            f.write(content)
        print(f"Updated responsive styling: {path}")

# 1. Farmer Insurance
update_file('src/app/farmer/insurance/page.tsx', [
    (
        '<h3 className="text-base font-extrabold text-slate-900">',
        '<h3 className="text-base font-extrabold text-slate-900 break-words">'
    ),
    (
        '<div className="flex items-center gap-2 shrink-0">',
        '<div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">'
    ),
    (
        'className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center space-x-1.5"',
        'className="w-full sm:w-auto justify-center px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs transition-colors flex items-center space-x-1.5"'
    )
])

# 2. Farmer Farms
update_file('src/app/farmer/farms/page.tsx', [
    (
        '<div className="flex items-center justify-between">',
        '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">'
    ),
    (
        '<h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">',
        '<h1 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight break-words">'
    )
])

# 3. Insurer Dashboard
update_file('src/app/insurer/dashboard/page.tsx', [
    (
        '<h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">',
        '<h1 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight break-words">'
    ),
    (
        '<div className="flex items-center space-x-2">',
        '<div className="flex flex-wrap items-center gap-2">'
    )
])

# 4. Operations IoT
update_file('src/app/operations/iot/page.tsx', [
    (
        '<h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">',
        '<h1 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight break-words">'
    )
])

# 5. Team
update_file('src/app/team/page.tsx', [
    (
        '<h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">',
        '<h1 className="text-xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight break-words">'
    )
])

# 6. Admin Overview
update_file('src/app/admin/overview/page.tsx', [
    (
        '<h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">',
        '<h1 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight break-words">'
    )
])

# 7. Intelligence Weather
update_file('src/app/intelligence/weather/page.tsx', [
    (
        '<h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">',
        '<h1 className="text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight break-words">'
    )
])

print("Responsive styling updates applied.")

