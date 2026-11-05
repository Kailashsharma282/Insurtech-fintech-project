file_path = r"c:\Users\kaila\OneDrive\Desktop\Projects\Insurtech-fintech-project\src\app\farmer\insurance\apply\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    c = f.read()

# Make farmer payable 0
old_calc = """  // Financial calculations with 80% PMFBY subsidy
  const sumInsured = coverageTier === 'COMPREHENSIVE' ? selectedPlot.defaultSumInsured : Math.round(selectedPlot.defaultSumInsured * 0.85);
  const grossPremium = Math.round(sumInsured * (coverageTier === 'COMPREHENSIVE' ? 0.05 : 0.04));
  const govtSubsidy = Math.round(grossPremium * 0.80);
  const farmerPayable = grossPremium - govtSubsidy; // 20% farmer share (~2% of sum insured)"""

new_calc = """  // Financial calculations: 100% Govt Subsidized (Farmer pays ₹0)
  const sumInsured = coverageTier === 'COMPREHENSIVE' ? selectedPlot.defaultSumInsured : Math.round(selectedPlot.defaultSumInsured * 0.85);
  const grossPremium = Math.round(sumInsured * (coverageTier === 'COMPREHENSIVE' ? 0.05 : 0.04));
  const govtSubsidy = grossPremium; // 100% covered by Govt
  const farmerPayable = 0; // Farmer pays nothing"""

if old_calc in c:
    c = c.replace(old_calc, new_calc)

old_ui = """                <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                  <strong className="text-slate-900 font-black">{t('ins.farmer_pays')}:</strong>
                  <strong className="text-emerald-700 font-black text-lg">₹{farmerPayable.toLocaleString()}</strong>
                </div>
                <div className="text-[11px] text-slate-500 font-sans pt-1 border-t border-slate-200">
                  Central & State PMFBY subsidizes 80% of total premium. Farmer pays remaining 20% net.
                </div>"""

new_ui = """                <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                  <strong className="text-slate-900 font-black">Farmer Share (Net Payable):</strong>
                  <strong className="text-emerald-700 font-black text-lg">₹0 (100% Free)</strong>
                </div>
                <div className="text-[11px] text-emerald-700 font-sans pt-1 border-t border-slate-200 font-bold">
                  100% Central & State Government subsidized. Zero cost to registered farmers.
                </div>"""

if old_ui in c:
    c = c.replace(old_ui, new_ui)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(c)

print("SUCCESS: Updated apply/page.tsx for 0 farmer share")
