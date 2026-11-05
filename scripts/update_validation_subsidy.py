with open('src/app/farmer/insurance-validation/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Add import
if 'getChfSubsidyPerHectare' not in text:
    text = text.replace(
        "import { CropPhotoAnalyzer } from '@/components/ui/CropPhotoAnalyzer';",
        "import { CropPhotoAnalyzer } from '@/components/ui/CropPhotoAnalyzer';\nimport { getChfSubsidyPerHectare, calculatePlotSubsidy } from '@/lib/subsidy';"
    )

# Add subsidy callout right above Metric Summary Grid
target = '{/* Metric Summary Grid */}'
replacement = '''{/* Official Simplified CHF Subsidy Calculation Box */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
                  <div>
                    <span className="font-bold text-slate-900 block font-sans">
                      Official Simplified Parametric Subsidy Rate: {chfValue < 0.2 ? '₹15,000 / ha (Severe Inundation)' : chfValue < 0.4 ? '₹12,000 / ha (High Deficit)' : chfValue < 0.6 ? '₹8,000 / ha (Moderate Watch)' : 'No Subsidy (Normal Crop Health)'}
                    </span>
                    <span className="text-slate-600 font-sans text-[11px]">
                      Standard Hectare Rule: ₹{getChfSubsidyPerHectare(chfValue).toLocaleString()}/ha &times; {selectedCandidate.areaHa} ha = <strong className="text-emerald-700 font-mono">₹{calculatePlotSubsidy(chfValue, selectedCandidate.areaHa).toLocaleString()}</strong>
                    </span>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono self-start sm:self-center shrink-0 ${
                    chfValue < 0.6 ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {chfValue < 0.6 ? 'CHF Payout Active' : 'Normal / No Loss'}
                  </span>
                </div>

                {/* Metric Summary Grid */}'''

if target in text:
    text = text.replace(target, replacement)
    with open('src/app/farmer/insurance-validation/page.tsx', 'w', encoding='utf-8') as f:
        f.write(text)
    print("Updated insurance-validation/page.tsx with simplified CHF subsidy rule!")
else:
    print("Target not found in insurance-validation")

