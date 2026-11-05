# 1. Update src/app/farmer/insurance/apply/page.tsx
with open('src/app/farmer/insurance/apply/page.tsx', 'r', encoding='utf-8') as f:
    apply_code = f.read()

# Add clear 80% subsidy and 20% farmer share clarification in Step 3
old_apply_step3 = '''                <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                  <strong className="text-slate-900 font-black">{t('ins.farmer_pays')}:</strong>
                  <strong className="text-emerald-700 font-black text-lg">₹{farmerPayable.toLocaleString()}</strong>
                </div>
              </div>'''

new_apply_step3 = '''                <div className="flex justify-between items-center pt-1 text-sm sm:text-base">
                  <strong className="text-slate-900 font-black">{t('ins.farmer_pays')}:</strong>
                  <strong className="text-emerald-700 font-black text-lg">₹{farmerPayable.toLocaleString()}</strong>
                </div>
                <div className="text-[11px] text-slate-500 font-sans pt-1 border-t border-slate-200">
                  Central & State PMFBY subsidizes 80% of total premium. Farmer pays remaining 20% net.
                </div>
              </div>'''

if old_apply_step3 in apply_code:
    apply_code = apply_code.replace(old_apply_step3, new_apply_step3)
    with open('src/app/farmer/insurance/apply/page.tsx', 'w', encoding='utf-8') as f:
        f.write(apply_code)
    print("Updated apply/page.tsx")

# 2. Update src/app/insurer/policies/page.tsx
with open('src/app/insurer/policies/page.tsx', 'r', encoding='utf-8') as f:
    pol_code = f.read()

old_pol_card = '''                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Farmer Share</span>
                          <strong className="text-emerald-700">₹{policy.farmerShare.toLocaleString()}</strong>
                        </div>'''

new_pol_card = '''                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Farmer Share (20%)</span>
                          <strong className="text-emerald-700">₹{policy.farmerShare.toLocaleString()}</strong>
                        </div>
                        <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200">
                          <span className="text-slate-400 block text-[9px] uppercase font-bold">Govt Subsidy (80%)</span>
                          <strong className="text-blue-700">₹{policy.subsidyAmount.toLocaleString()}</strong>
                        </div>'''

if old_pol_card in pol_code:
    pol_code = pol_code.replace(old_pol_card, new_pol_card)
    with open('src/app/insurer/policies/page.tsx', 'w', encoding='utf-8') as f:
        f.write(pol_code)
    print("Updated insurer/policies/page.tsx")

# 3. Update src/app/api/policies/route.ts
with open('src/app/api/policies/route.ts', 'r', encoding='utf-8') as f:
    api_pol = f.read()

if 'calculatePolicyPremium' not in api_pol:
    api_pol = api_pol.replace(
        "import { store } from '@/lib/db/store';",
        "import { store } from '@/lib/db/store';\nimport { calculatePolicyPremium } from '@/lib/subsidy';"
    )
    api_pol = api_pol.replace(
        "const newPolicy: Policy = {\n      id,",
        "const sInsured = Number(sumInsured) || 50000;\n    const calc = calculatePolicyPremium(sInsured);\n    const newPolicy: Policy = {\n      id,"
    )
    api_pol = api_pol.replace("sumInsured: Number(sumInsured) || 50000,", "sumInsured: sInsured,")
    api_pol = api_pol.replace("subsidyAmount: Number(subsidyAmount) || 2000,", "subsidyAmount: Number(subsidyAmount) || calc.subsidyAmount,")
    api_pol = api_pol.replace("farmerShare: Number(farmerShare) || 500,", "farmerShare: Number(farmerShare) || calc.farmerShare,")
    with open('src/app/api/policies/route.ts', 'w', encoding='utf-8') as f:
        f.write(api_pol)
    print("Updated api/policies/route.ts")

# 4. Remove heavy mathematical equation string from claims/[id]/page.tsx
with open('src/app/insurer/claims/[id]/page.tsx', 'r', encoding='utf-8') as f:
    claims_detail = f.read()

claims_detail = claims_detail.replace(
    '<div className="bg-slate-900 text-emerald-400 p-2 rounded-lg text-[11px]">{ev.chfCalculation.formula}</div>',
    '<div className="bg-slate-900 text-emerald-400 p-2.5 rounded-xl text-xs font-bold">Parametric CHF Subsidy Rate: ₹8,000 / ha (0.4 – 0.6 Deficit Tier)</div>'
)

with open('src/app/insurer/claims/[id]/page.tsx', 'w', encoding='utf-8') as f:
    f.write(claims_detail)
print("Updated insurer/claims/[id]/page.tsx")
