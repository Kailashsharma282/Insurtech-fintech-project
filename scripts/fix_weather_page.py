path = 'src/app/intelligence/weather/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'className="min-h-screen bg-[#F8FAFC] py-8 pb-24 md:pb-12"',
    'className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 pb-24 md:pb-12 text-[#0F172A] dark:text-white"'
)

c = c.replace(
    'border-b border-slate-200 pb-5',
    'border-b border-slate-200 dark:border-slate-800 pb-5'
)

c = c.replace(
    'text-xl sm:text-3xl font-black text-[#0F172A] tracking-tight break-words mt-1',
    'text-xl sm:text-3xl font-black text-[#0F172A] dark:text-white tracking-tight break-words mt-1'
)

c = c.replace(
    'text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-2',
    'text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2'
)

c = c.replace(
    'className="p-3 px-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900"',
    'className="p-3 px-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-2 text-xs text-emerald-900 dark:text-emerald-200"'
)

# 6 weather cards
c = c.replace(
    'className="p-4 rounded-3xl bg-white border border-[#E2E8F0] shadow-sm"',
    'className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 shadow-sm"'
)

c = c.replace(
    'className="text-xl font-black text-slate-900 mt-0.5"',
    'className="text-xl font-black text-slate-900 dark:text-white mt-0.5"'
)

# 7-day forecast
c = c.replace(
    'className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4"',
    'className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-4"'
)

c = c.replace(
    'border-b border-slate-100 pb-3',
    'border-b border-slate-100 dark:border-slate-800 pb-3'
)

c = c.replace(
    'font-bold text-base text-[#0F172A]',
    'font-bold text-base text-[#0F172A] dark:text-white'
)

c = c.replace(
    ": 'bg-slate-50 border-slate-200'",
    ": 'bg-slate-50 dark:bg-slate-800/90 border-slate-200 dark:border-slate-700'"
)

c = c.replace(
    "? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-400/20'",
    "? 'bg-blue-50/60 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 ring-1 ring-blue-400/20'"
)

c = c.replace(
    '<div className="font-bold text-xs text-slate-800">{f.day}</div>',
    '<div className="font-bold text-xs text-slate-800 dark:text-slate-100">{f.day}</div>'
)

c = c.replace(
    '<div className="text-sm font-black text-slate-900 mt-2">',
    '<div className="text-sm font-black text-slate-900 dark:text-white mt-2">'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("SUCCESS: Updated weather page dark mode support!")

