path = 'src/components/maps/AgriMap.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Legend box container
c = c.replace(
    'className="absolute top-16 right-3 z-[1000] bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200 shadow-xl text-xs space-y-2 max-w-[270px] pointer-events-auto"',
    'className="absolute top-16 right-3 z-[1000] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl text-xs space-y-2 max-w-[270px] pointer-events-auto"'
)

c = c.replace(
    '<strong className="text-slate-900 text-[11px] font-bold truncate max-w-[175px]"',
    '<strong className="text-slate-900 dark:text-white text-[11px] font-bold truncate max-w-[175px]"'
)

c = c.replace(
    'border-b border-slate-100 pb-1.5',
    'border-b border-slate-100 dark:border-slate-800 pb-1.5'
)

c = c.replace(
    '<span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">',
    '<span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">'
)

c = c.replace(
    '<div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">',
    '<div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400">'
)

c = c.replace(
    '<span className="font-semibold text-blue-900">Silabati River</span>',
    '<span className="font-semibold text-blue-900 dark:text-blue-300">Silabati River</span>'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("SUCCESS: Updated AgriMap legend styling!")

