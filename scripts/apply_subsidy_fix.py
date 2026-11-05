import os

file_path = r"c:\Users\kaila\OneDrive\Desktop\Projects\Insurtech-fintech-project\src\app\farmer\insurance\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    c = f.read()

# 1. Update import
c = c.replace(
    "import { SEED_POLICIES } from '@/lib/db/seed-data';",
    "import { SEED_POLICIES, SEED_FARMS } from '@/lib/db/seed-data';"
)

# 2. Add farmAcreage computation in policy map
old_map = """            filteredPolicies.map((policy) => {
              const isActive = policy.status === 'ACTIVE';
              const isPending = policy.status === 'PENDING_APPROVAL';
              const isRejected = policy.status === 'REJECTED';"""

new_map = """            filteredPolicies.map((policy) => {
              const isActive = policy.status === 'ACTIVE';
              const isPending = policy.status === 'PENDING_APPROVAL';
              const isRejected = policy.status === 'REJECTED';
              const farmMatch = SEED_FARMS.find(f => f.id === policy.farmId || f.plotNumber === policy.farmPlot);
              const farmAcreage = farmMatch?.acreage || 2.8;"""

c = c.replace(old_map, new_map)

# 3. Replace the financial metrics grid
target_start = "{/* Financial Metrics Grid"
target_end = "Autonomous Sentinel-2 trigger"

idx_start = c.find(target_start)
idx_end_snippet = c.find(target_end, idx_start)

# Find the closing </div>\n                  </div> after target_end
closing_str = "</div>\n                  </div>"
if closing_str not in c[idx_end_snippet:idx_end_snippet+200]:
    closing_str = "</div>\r\n                  </div>"

idx_close = c.find(closing_str, idx_end_snippet)
idx_end = idx_close + len(closing_str)

new_block = """{/* Financial & Statutory CHF Subsidy Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs font-mono">
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
                          FARMER SHARE
                        </span>
                        <span className="text-[9px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 px-1.5 py-0.5 rounded">20% Share</span>
                      </div>
                      <strong className="text-lg sm:text-xl text-slate-900 dark:text-white font-black mt-1.5 block">
                        ₹{policy.farmerShare.toLocaleString()}
                      </strong>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-1 font-sans font-medium">
                        Govt Subsidy: ₹{policy.subsidyAmount.toLocaleString()} (80%)
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

                  {/* Statutory CHF Subsidy & Plot Payout Breakdown Table */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                        <h4 className="font-black text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                          Statutory CHF Subsidy Matrix — {policy.farmPlot} ({farmAcreage} ha)
                        </h4>
                      </div>
                      <span className="text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">
                        Direct RBI NEFT DBT Credit to Farmer Bank Account
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                      <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[11px] text-red-900 dark:text-red-200">0.0 – 0.2 CHF</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-red-600 text-white">Severe</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-red-700 dark:text-red-400 mt-1">
                            ₹15,000 <span className="text-[10px] font-normal text-slate-500">/ ha</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-red-200/60 dark:border-red-900/40 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Plot Payout:</span>
                          <strong className="text-red-900 dark:text-red-200 font-black">₹{(farmAcreage * 15000).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[11px] text-orange-900 dark:text-orange-200">0.2 – 0.4 CHF</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-orange-600 text-white">High</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-orange-700 dark:text-orange-400 mt-1">
                            ₹12,000 <span className="text-[10px] font-normal text-slate-500">/ ha</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-orange-200/60 dark:border-orange-900/40 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Plot Payout:</span>
                          <strong className="text-orange-900 dark:text-orange-200 font-black">₹{(farmAcreage * 12000).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-900/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[11px] text-amber-900 dark:text-amber-200">0.4 – 0.6 CHF</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-600 text-white">Moderate</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-amber-700 dark:text-amber-400 mt-1">
                            ₹8,000 <span className="text-[10px] font-normal text-slate-500">/ ha</span>
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-amber-200/60 dark:border-amber-900/40 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Plot Payout:</span>
                          <strong className="text-amber-900 dark:text-amber-200 font-black">₹{(farmAcreage * 8000).toLocaleString()}</strong>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/60 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="font-black text-[11px] text-emerald-900 dark:text-emerald-200">&gt; 0.6 CHF</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-emerald-600 text-white">Normal</span>
                          </div>
                          <div className="text-base sm:text-lg font-black text-emerald-700 dark:text-emerald-400 mt-1">
                            No Subsidy
                          </div>
                        </div>
                        <div className="mt-2 pt-1.5 border-t border-emerald-200/60 dark:border-emerald-900/40 flex justify-between items-center text-[11px]">
                          <span className="text-slate-600 dark:text-slate-400 font-sans">Plot Payout:</span>
                          <strong className="text-emerald-900 dark:text-emerald-200 font-black">₹0 (Healthy)</strong>
                        </div>
                      </div>
                    </div>
                  </div>"""

c = c[:idx_start] + new_block + c[idx_end:]
with open(file_path, "w", encoding="utf-8") as f:
    f.write(c)

print("SUCCESS: Farmer insurance page updated directly!")
