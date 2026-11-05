with open('src/app/farmer/insurance/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add CHF Subsidy Matrix right above Filter Navigation Tabs
matrix_jsx = '''        {/* Official Parametric CHF Subsidy Matrix (Direct from Field Rate Sheet) */}
        <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
                  Calibrated Rate Sheet
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">Per Hectare Scale</span>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                Official Parametric CHF Subsidy & Indemnity Matrix
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Direct statutory bank transfer (DBT) indemnity determined by measured Crop Health Factor (CHF) from Sentinel-2 & SAR imagery.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-mono text-[11px] font-bold self-start sm:self-center shrink-0">
              100% Guaranteed Payout
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 font-mono">
            <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-red-900 dark:text-red-200">0.0 – 0.2 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white">Severe</span>
                </div>
                <div className="text-xl font-black text-red-700 dark:text-red-400 mt-2">
                  ₹15,000 <span className="text-xs font-semibold">/ ha</span>
                </div>
              </div>
              <p className="text-[11px] text-red-800 dark:text-red-300 mt-2 font-sans font-medium">Severe inundation / loss</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-orange-900 dark:text-orange-200">0.2 – 0.4 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-600 text-white">High</span>
                </div>
                <div className="text-xl font-black text-orange-700 dark:text-orange-400 mt-2">
                  ₹12,000 <span className="text-xs font-semibold">/ ha</span>
                </div>
              </div>
              <p className="text-[11px] text-orange-800 dark:text-orange-300 mt-2 font-sans font-medium">High crop stress / deficit</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-900 dark:text-amber-200">0.4 – 0.6 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-600 text-white">Moderate</span>
                </div>
                <div className="text-xl font-black text-amber-700 dark:text-amber-400 mt-2">
                  ₹8,000 <span className="text-xs font-semibold">/ ha</span>
                </div>
              </div>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 mt-2 font-sans font-medium">Moderate deficit / watch</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">0.6 – 0.8 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-600 text-white">Normal</span>
                </div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
                  No Subsidy
                </div>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-sans font-medium">Normal crop health</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-emerald-900 dark:text-emerald-200">0.8 – 1.0 CHF</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-700 text-white">Optimal</span>
                </div>
                <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 mt-2">
                  No Subsidy
                </div>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-sans font-medium">Optimal canopy vigor</p>
            </div>
          </div>
        </div>

        {/* Filter Navigation Tabs */}'''

if 'Official Parametric CHF Subsidy & Indemnity Matrix' not in content:
    content = content.replace('{/* Filter Navigation Tabs */}', matrix_jsx)

# Replace financial metrics grid with crystal-clear high contrast boxes
old_grid = '''                  {/* Financial Metrics Grid (Super High Contrast in Light & Dark Mode) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono">
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        {t('ins.sum_insured')}
                      </span>
                      <strong className="text-lg sm:text-xl text-blue-700 dark:text-blue-400 font-black mt-1 block">
                        ₹{policy.sumInsured.toLocaleString()}
                      </strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        {t('ins.farmer_pays')}
                      </span>
                      <strong className="text-lg sm:text-xl text-slate-900 dark:text-white font-black mt-1 block">
                        ₹{policy.farmerShare.toLocaleString()}
                      </strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        PMFBY Subsidy (80%)
                      </span>
                      <strong className="text-lg sm:text-xl text-emerald-700 dark:text-emerald-400 font-black mt-1 block">
                        ₹{policy.subsidyAmount.toLocaleString()}
                      </strong>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 shadow-xs">
                      <span className="text-slate-600 dark:text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                        {t('ins.trigger_condition')}
                      </span>
                      <strong className="text-lg sm:text-xl text-amber-700 dark:text-amber-400 font-black mt-1 block">
                        CHF &le; {policy.triggerChf}
                      </strong>
                    </div>
                  </div>'''

new_grid = '''                  {/* Financial Metrics Grid (Clean High-Contrast Cards with Explicit Explanations) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          SUM INSURED
                        </span>
                        <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-1.5 py-0.5 rounded">Scale of Finance</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-blue-700 dark:text-blue-400 font-black mt-1.5 block">
                        ₹{policy.sumInsured.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        Max coverage (₹51,785/ha × 2.8 ha)
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          FARMER NET PAYABLE (20%)
                        </span>
                        <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded">20% Share</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-slate-900 dark:text-white font-black mt-1.5 block">
                        ₹{policy.farmerShare.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        20% of ₹{(policy.premiumAmount || (policy.farmerShare + policy.subsidyAmount)).toLocaleString()} Total Premium
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          GOVT SUBSIDY (80%)
                        </span>
                        <span className="text-[9px] font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/70 px-1.5 py-0.5 rounded">80% Govt</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-emerald-700 dark:text-emerald-400 font-black mt-1.5 block">
                        ₹{policy.subsidyAmount.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        State & Central PMFBY Subsidy
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          TRIGGER CONDITION
                        </span>
                        <span className="text-[9px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-1.5 py-0.5 rounded">CHF Index</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-amber-700 dark:text-amber-400 font-black mt-1.5 block">
                        CHF &le; {policy.triggerChf}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        Autonomous Sentinel-2 trigger
                      </span>
                    </div>
                  </div>'''

content = content.replace(old_grid, new_grid)

with open('src/app/farmer/insurance/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated farmer/insurance/page.tsx successfully!")

