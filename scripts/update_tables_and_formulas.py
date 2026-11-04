import os

def update_chf():
    path = 'src/app/technology/chf/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    math_marker = '{/* Exact Mathematical Formulas Reference */}'
    if math_marker in content:
        idx = content.find(math_marker)
        replacement = '''{/* Operational Verification & Sensor Data Pipeline (Plain English, Zero Mathematical Noise) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-2">
              <span>Transparent Parametric Verification</span>
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
              How Crop Health Factor (CHF) Works for Farmers & Insurers
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Clear, transparent satellite and weather indicators evaluated in real-time — eliminating manual paperwork, delays, and disputes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                <span>🌿 1. Multi-Spectral Canopy Health (Sentinel-2)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Optical satellites scan farm fields every 5 days at 10-meter resolution, measuring plant chlorophyll density, leaf moisture, and photosynthetic vigor across the entire vegetative cycle.
              </p>
              <div className="flex items-center text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold pt-1">
                <span>✓ Detects leaf drying and drought stress days before visible to eye</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center space-x-2 text-blue-700 dark:text-blue-400 font-bold text-sm">
                <span>📡 2. Cloud-Penetrating Radar (Sentinel-1 SAR)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                C-band radar microwaves pass directly through thick monsoon clouds and nighttime rain, measuring crop structure, stem density, and standing flood inundation across floodplains.
              </p>
              <div className="flex items-center text-[11px] text-blue-800 dark:text-blue-400 font-semibold pt-1">
                <span>✓ 100% operational through cyclones, storms, and cloudbursts</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center space-x-2 text-amber-700 dark:text-amber-400 font-bold text-sm">
                <span>🌧️ 3. Weather & Thermal Baselines (ERA5 & CHIRPS)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Daily precipitation accumulation, consecutive dry/wet spells, and growing heat units are tracked against localized historical thresholds for Aman Paddy, Potato, and Jute.
              </p>
              <div className="flex items-center text-[11px] text-amber-800 dark:text-amber-400 font-semibold pt-1">
                <span>✓ Validates temperature spikes and catastrophic rainfall deficits</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div className="flex items-center space-x-2 text-purple-700 dark:text-purple-400 font-bold text-sm">
                <span>⚡ 4. Automated Zero-Paperwork Payout (CHF Index)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                When verified satellite and weather readings reflect severe crop loss (CHF &le; 0.55), claims are automatically triggered and approved for direct bank account disbursement.
              </p>
              <div className="flex items-center text-[11px] text-purple-800 dark:text-purple-400 font-semibold pt-1">
                <span>✓ Zero surveyor visits needed; instant actuarial transparency</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}'''
        updated = content[:idx] + replacement
        with open(path, 'w', encoding='utf-8') as f:
            f.write(updated)
        print('technology/chf: replaced math formulas successfully.')

def update_payouts():
    path = 'src/app/insurer/payouts/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find payouts table
    old_table_snippet = '<table className="w-full min-w-[750px] text-left text-xs text-slate-700 font-mono">'
    new_table_snippet = '<table className="w-full min-w-[1150px] text-left text-xs text-slate-700 dark:text-slate-300 font-mono">'
    
    if old_table_snippet in content:
        content = content.replace(old_table_snippet, new_table_snippet)
        content = content.replace('<thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px] font-sans">',
                                  '<thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px] font-sans whitespace-nowrap">')
        content = content.replace('<tbody className="divide-y divide-slate-100">',
                                  '<tbody className="divide-y divide-slate-100 dark:divide-slate-800 whitespace-nowrap">')
        content = content.replace('<div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">',
                                  '<div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-sm overflow-hidden">')
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('insurer/payouts: updated table width and whitespace-nowrap.')
    else:
        print('insurer/payouts: table snippet not found (may already be updated).')

def update_farmer_farms():
    path = 'src/app/farmer/farms/page.tsx'
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    old_table = '<table className="w-full min-w-[750px] text-left text-xs text-slate-700">'
    new_table = '<table className="w-full min-w-[1100px] text-left text-xs text-slate-700 dark:text-slate-300 whitespace-nowrap">'

    if old_table in content:
        content = content.replace(old_table, new_table)
        content = content.replace('<div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm overflow-hidden">',
                                  '<div className="bg-white dark:bg-slate-900 rounded-3xl border border-[#E2E8F0] dark:border-slate-800 shadow-sm overflow-hidden">')
        content = content.replace('<thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200 uppercase tracking-wider text-[10px]">',
                                  '<thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px] whitespace-nowrap">')
        content = content.replace('<tbody className="divide-y divide-slate-100">',
                                  '<tbody className="divide-y divide-slate-100 dark:divide-slate-800 whitespace-nowrap">')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('farmer/farms: updated table.')
    else:
        print('farmer/farms: already updated or snippet not matched.')

if __name__ == '__main__':
    update_chf()
    update_payouts()
    update_farmer_farms()
