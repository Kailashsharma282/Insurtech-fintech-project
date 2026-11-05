file_path = r"c:\Users\kaila\OneDrive\Desktop\Projects\Insurtech-fintech-project\src\app\insurer\policies\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    c = f.read()

target = """                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Sum Insured</span>
                          <strong className="text-slate-900">₹{policy.sumInsured.toLocaleString()}</strong>
                        </div>"""

replacement = """                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Subsidy Rate</span>
                          <strong className="text-red-700">Max ₹15k/ha</strong>
                        </div>"""

if target in c:
    c = c.replace(target, replacement)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)
    print("SUCCESS: insurer/policies/page.tsx updated")
else:
    print("Target not found in insurer/policies/page.tsx")
