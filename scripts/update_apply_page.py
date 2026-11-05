file_path = r"c:\Users\kaila\OneDrive\Desktop\Projects\Insurtech-fintech-project\src\app\farmer\insurance\apply\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    c = f.read()

target = """                <div className="text-[11px] text-slate-500 font-sans pt-1 border-t border-slate-200">
                  Central & State PMFBY subsidizes 80% of total premium. Farmer pays remaining 20% net.
                </div>
              </div>"""

replacement = """                <div className="text-[11px] text-slate-500 font-sans pt-1 border-t border-slate-200">
                  Central & State PMFBY subsidizes 80% of total premium. Farmer pays remaining 20% net.
                </div>
              </div>

              {/* Statutory CHF Subsidy Schedule for Selected Plot */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Statutory CHF Subsidy Tiers ({selectedPlot.plotNumber} — {selectedPlot.areaHa} ha):</span>
                  <span className="text-[10px] text-slate-500 font-mono">Max: ₹{(selectedPlot.areaHa * 15000).toLocaleString()} DBT</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                    <span className="text-red-800 font-bold block">0.0–0.2 CHF</span>
                    <strong className="text-red-700">₹15k/ha (₹{(selectedPlot.areaHa * 15000).toLocaleString()})</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-orange-50 border border-orange-200">
                    <span className="text-orange-800 font-bold block">0.2–0.4 CHF</span>
                    <strong className="text-orange-700">₹12k/ha (₹{(selectedPlot.areaHa * 12000).toLocaleString()})</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                    <span className="text-amber-800 font-bold block">0.4–0.6 CHF</span>
                    <strong className="text-amber-700">₹8k/ha (₹{(selectedPlot.areaHa * 8000).toLocaleString()})</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-emerald-800 font-bold block">&gt; 0.6 CHF</span>
                    <strong className="text-emerald-700">No Subsidy (₹0)</strong>
                  </div>
                </div>
              </div>"""

if target in c:
    c = c.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)
    print("SUCCESS: apply/page.tsx updated")
else:
    print("Target not found in apply/page.tsx")
