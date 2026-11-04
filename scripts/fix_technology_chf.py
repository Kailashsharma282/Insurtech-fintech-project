path = 'src/app/technology/chf/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace(
    'className="min-h-screen bg-[#F8FAFC] py-8 text-[#0F172A]"',
    'className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 py-8 text-[#0F172A] dark:text-white"'
)

c = c.replace(
    'text-2xl sm:text-3xl font-black text-slate-900 tracking-tight',
    'text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight'
)

c = c.replace(
    'text-sm text-slate-600 mt-1 max-w-2xl',
    'text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl'
)

c = c.replace(
    'className="p-6 rounded-xl bg-white border border-slate-200 shadow-sm space-y-4"',
    'className="p-6 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"'
)

c = c.replace(
    'className="p-3 rounded-lg bg-slate-50 border border-slate-200"',
    'className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700"'
)

c = c.replace(
    'className="text-sm text-slate-900"',
    'className="text-sm text-slate-900 dark:text-white"'
)

c = c.replace(
    'className="font-bold text-base text-slate-900"',
    'className="font-bold text-base text-slate-900 dark:text-white"'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("SUCCESS: Updated technology CHF page dark mode!")

