file_path = r"c:\Users\kaila\OneDrive\Desktop\Projects\Insurtech-fintech-project\src\app\farmer\insurance\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    c = f.read()

# 1. Update the top global banner to emphasize 100% Free / Zero Farmer Share
old_global_top = """            <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-mono text-[11px] font-bold self-start sm:self-center shrink-0">
              100% Guaranteed Payout
            </span>"""

new_global_top = """            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 font-mono text-[11px] font-black">
                100% Free (Farmer Pays ₹0)
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 font-mono text-[11px] font-bold">
                100% Guaranteed Payout
              </span>
            </div>"""

if old_global_top in c:
    c = c.replace(old_global_top, new_global_top)

# 2. In each farmer card:
# Replace the 4-box grid (which has FARMER SHARE) with 3 clean boxes (SUBSIDY RATE, MAX PLOT SUBSIDY, TRIGGER CONDITION)
# and REMOVE the repeated matrix table below every farmer card!

target_start = "{/* Financial & Statutory CHF Subsidy Metrics Grid */}"
# Find from target_start up to the Rejection Details
rejection_comment = "{/* Rejection Details & Underwriter Notes */}"

idx_start = c.find(target_start)
idx_end = c.find(rejection_comment)

if idx_start != -1 and idx_end != -1:
    replacement = """{/* Clean Statutory CHF Subsidy Metrics (Farmer pays ₹0 - 100% Subsidized) */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs font-mono">
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          SUBSIDY RATE
                        </span>
                        <span className="text-[9px] font-bold text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/70 px-1.5 py-0.5 rounded">Max ₹15k/ha</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-red-700 dark:text-red-400 font-black mt-1.5 block">
                        ₹15,000 <span className="text-xs font-bold">/ ha</span>
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        Statutory CHF subsidy scale
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          MAX PLOT SUBSIDY
                        </span>
                        <span className="text-[9px] font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/70 px-1.5 py-0.5 rounded">{farmAcreage} ha Plot</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-blue-700 dark:text-blue-400 font-black mt-1.5 block">
                        ₹{(farmAcreage * 15000).toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        ₹15,000/ha × {farmAcreage} ha Direct DBT
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300 block text-[10px] uppercase font-black tracking-wider">
                          TRIGGER CONDITION
                        </span>
                        <span className="text-[9px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/70 px-1.5 py-0.5 rounded">CHF Trigger</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-amber-700 dark:text-amber-400 font-black mt-1.5 block">
                        CHF ≤ 0.60
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        Direct bank credit upon drop
                      </span>
                    </div>
                  </div>

                  """
    c = c[:idx_start] + replacement + c[idx_end:]
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)
    print("SUCCESS: Removed farmer share and removed repeated matrix from farmer card!")
else:
    print(f"ERROR: idx_start={idx_start}, idx_end={idx_end}")

