path = 'src/app/intelligence/map/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# Farm Drawer
c = c.replace(
    'className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-5"',
    'className="lg:col-span-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-sm space-y-5"'
)

c = c.replace(
    '<span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">',
    '<span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">'
)

c = c.replace(
    '<h3 className="font-extrabold text-xl text-[#0F172A] mt-2">',
    '<h3 className="font-extrabold text-xl text-[#0F172A] dark:text-white mt-2">'
)

c = c.replace(
    '<p className="text-xs text-slate-500 mt-0.5">',
    '<p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">'
)

c = c.replace(
    'border-b border-slate-100 pb-4',
    'border-b border-slate-100 dark:border-slate-800 pb-4'
)

c = c.replace(
    'border-b border-slate-100',
    'border-b border-slate-100 dark:border-slate-800'
)

c = c.replace(
    '<span className="text-slate-500">Crop & Acreage:</span>',
    '<span className="text-slate-500 dark:text-slate-400">Crop & Acreage:</span>'
)

c = c.replace(
    '<strong className="text-slate-900">{selectedFarm.currentCrop}',
    '<strong className="text-slate-900 dark:text-white">{selectedFarm.currentCrop}'
)

c = c.replace(
    'bg-blue-50/50 px-2 rounded-lg',
    'bg-blue-50/80 dark:bg-blue-950/50 px-2 rounded-lg'
)

c = c.replace(
    '<span className="text-blue-900 font-semibold flex items-center gap-1">',
    '<span className="text-blue-900 dark:text-blue-300 font-semibold flex items-center gap-1">'
)

c = c.replace(
    '<strong className="text-blue-950 font-mono">',
    '<strong className="text-blue-950 dark:text-blue-200 font-mono">'
)

c = c.replace(
    '<span className="text-slate-500">Current CHF Index:</span>',
    '<span className="text-slate-500 dark:text-slate-400">Current CHF Index:</span>'
)

c = c.replace(
    '<span className="text-slate-500">Baseline CHF (4-Yr Normal):</span>',
    '<span className="text-slate-500 dark:text-slate-400">Baseline CHF (4-Yr Normal):</span>'
)

c = c.replace(
    '<strong className="text-slate-800 font-mono">{selectedFarm.chfBaseline.toFixed(2)}</strong>',
    '<strong className="text-slate-800 dark:text-slate-200 font-mono">{selectedFarm.chfBaseline.toFixed(2)}</strong>'
)

c = c.replace(
    '<span className="text-slate-500">Baseline Deviation &Delta;:</span>',
    '<span className="text-slate-500 dark:text-slate-400">Baseline Deviation &Delta;:</span>'
)

c = c.replace(
    '<span className="text-slate-500">Soil Moisture:</span>',
    '<span className="text-slate-500 dark:text-slate-400">Soil Moisture:</span>'
)

c = c.replace(
    '<span className="text-slate-500">Sentinel-2 NDVI / S1 VH:</span>',
    '<span className="text-slate-500 dark:text-slate-400">Sentinel-2 NDVI / S1 VH:</span>'
)

c = c.replace(
    '<strong className="text-slate-700 font-mono">',
    '<strong className="text-slate-700 dark:text-slate-300 font-mono">'
)

c = c.replace(
    '<span className="text-slate-500">Sum Insured:</span>',
    '<span className="text-slate-500 dark:text-slate-400">Sum Insured:</span>'
)

c = c.replace(
    '<strong className="text-slate-900 font-mono">',
    '<strong className="text-slate-900 dark:text-white font-mono">'
)

# Search filters bar at the top
c = c.replace(
    'className="bg-white p-4 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs"',
    'className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-[#E2E8F0] dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs"'
)

c = c.replace(
    'className="py-2 px-3 rounded-xl border border-slate-300 bg-white"',
    'className="py-2 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("SUCCESS: Updated intelligence map page!")

