path = 'src/app/insurer/payouts/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if '{/* 7-Step Claim Settlement Timeline' in line:
        start_idx = i
    if '* Note: Payout gateway is configured' in line:
        end_idx = i - 1  # include the div before it
        break

assert start_idx != -1 and end_idx != -1, f"Indices not found: {start_idx}, {end_idx}"

replacement = [
    '            {/* 7-Step Claim Settlement Timeline */}\n',
    '            <div className="space-y-2.5">\n',
    '              <div className="text-xs font-mono text-blue-400 uppercase tracking-wider font-semibold">\n',
    '                Claim Settlement Timeline\n',
    '              </div>\n',
    '              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-2.5">\n',
    '                {[\n',
    '                  { step: "1. Weather Event", val: selectedPayout.timeline.weatherEvent, highlight: false },\n',
    '                  { step: "2. Satellite Pass", val: selectedPayout.timeline.satelliteVerification, highlight: false },\n',
    '                  { step: "3. CHF Calculation", val: selectedPayout.timeline.chfCalculation, highlight: false },\n',
    '                  { step: "4. Threshold Test", val: selectedPayout.timeline.thresholdTest, highlight: false },\n',
    '                  { step: "5. Qualification", val: selectedPayout.timeline.claimQualification, highlight: false },\n',
    '                  { step: "6. Payout Initiation", val: selectedPayout.timeline.payoutInitiation, highlight: false },\n',
    '                  { step: "7. Bank Confirmation", val: "Held (Pilot Mandate)", highlight: true },\n',
    '                ].map((item, i) => (\n',
    '                  <div key={i} className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 flex flex-col justify-between min-h-[72px]">\n',
    '                    <span className="text-slate-400 text-[10px] font-bold block">{item.step}</span>\n',
    '                    <strong className={`text-[11px] font-semibold mt-1 block leading-snug break-words ${item.highlight ? "text-amber-400" : "text-slate-200"}`}>\n',
    '                      {item.val}\n',
    '                    </strong>\n',
    '                  </div>\n',
    '                ))}\n',
    '              </div>\n',
    '            </div>\n',
    '\n',
]

new_lines = lines[:start_idx] + replacement + lines[end_idx:]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("SUCCESS: Updated timeline!")
