file_path = r"c:\Users\kaila\OneDrive\Desktop\Projects\Insurtech-fintech-project\src\app\insurer\policies\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    c = f.read()

target = """                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Farmer Share (20%)</span>
                          <strong className="text-emerald-700">₹{policy.farmerShare.toLocaleString()}</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Govt Subsidy (80%)</span>
                          <strong className="text-blue-700">₹{policy.subsidyAmount.toLocaleString()}</strong>
                        </div>"""

replacement = """                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Farmer Cost</span>
                          <strong className="text-emerald-700">₹0 (Free)</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Govt Subsidy</span>
                          <strong className="text-blue-700">100% Covered</strong>
                        </div>"""

if target in c:
    c = c.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)
    print("SUCCESS: Updated insurer/policies/page.tsx")
else:
    print("Target not found in insurer/policies/page.tsx")
