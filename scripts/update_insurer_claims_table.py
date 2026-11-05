with open('src/app/insurer/claims/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update page root styling for dark mode
content = content.replace(
    '<div className="min-h-screen bg-[#F8FAFC] py-10 pb-24 md:pb-12">',
    '<div className="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 py-10 pb-24 md:pb-12 transition-colors">'
)

content = content.replace(
    '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">',
    '<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">'
)

content = content.replace(
    '<h1 className="text-2xl sm:text-3xl font-black text-[#0F172A] tracking-tight">',
    '<h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">'
)

content = content.replace(
    '<p className="text-xs sm:text-sm text-slate-500 mt-1">',
    '<p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">'
)

content = content.replace(
    '<span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold">',
    '<span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-700">'
)

content = content.replace(
    '<div className="bg-white p-6 rounded-3xl border border-[#E2E8F0] shadow-sm space-y-4">',
    '<div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">'
)

content = content.replace(
    '<div className="flex items-center space-x-2 text-xs font-bold text-slate-700">',
    '<div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-200">'
)

# Replace table with guaranteed no-wrap columns and explicit min-widths
old_table = '''          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1280px] text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                <tr className="whitespace-nowrap">
                  <th className="px-5 py-4 whitespace-nowrap">Claim #</th>
                  <th className="px-5 py-4 whitespace-nowrap">Policy #</th>
                  <th className="px-5 py-4 whitespace-nowrap">Farmer</th>
                  <th className="px-5 py-4 whitespace-nowrap">Insurance Unit</th>
                  <th className="px-5 py-4 whitespace-nowrap">Crop</th>
                  <th className="px-5 py-4 whitespace-nowrap">Trigger Type</th>
                  <th className="px-5 py-4 whitespace-nowrap">CHF Measured</th>
                  <th className="px-5 py-4 whitespace-nowrap">Baseline</th>
                  <th className="px-5 py-4 whitespace-nowrap">Loss Fraction</th>
                  <th className="px-5 py-4 whitespace-nowrap">Claim Amount</th>
                  <th className="px-5 py-4 whitespace-nowrap">Status</th>
                  <th className="px-5 py-4 text-right whitespace-nowrap">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap">
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100 font-mono whitespace-nowrap">
                      {claim.claimNumber}
                    </td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {claim.policyNumber}
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      {claim.farmerName}
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {claim.insuranceUnitCode}
                    </td>
                    <td className="px-5 py-4 text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {claim.crop}
                    </td>
                    <td className="px-5 py-4 text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {claim.triggerType.replace(/_/g, ' ')}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400 whitespace-nowrap">
                      {claim.chfMeasured.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {claim.chfBaseline.toFixed(2)}
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      {(claim.lossFraction * 100).toFixed(1)}%
                    </td>
                    <td className="px-5 py-4 font-mono font-black text-slate-900 dark:text-slate-100 whitespace-nowrap">
                      ₹{claim.claimAmount.toLocaleString()}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap ${
                        claim.status === 'DISBURSED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300' :
                        claim.status === 'APPROVED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300' :
                        claim.status === 'VERIFIED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        href={`/insurer/claims/${claim.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline whitespace-nowrap"
                      >
                        <span>Package</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 inline-block shrink-0" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>'''

new_table = '''          <div className="overflow-x-auto w-full">
            <table className="w-full min-w-[1420px] border-collapse text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700 uppercase tracking-wider text-[10px]">
                <tr className="whitespace-nowrap break-keep">
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[150px]">Claim #</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[160px]">Policy #</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[150px]">Farmer</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[130px]">Insurance Unit</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[110px]">Crop</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[130px]">Trigger Type</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[110px]">CHF Measured</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[90px]">Baseline</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[110px]">Loss Fraction</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[130px]">Claim Amount</th>
                  <th className="px-5 py-4 whitespace-nowrap break-keep min-w-[130px]">Status</th>
                  <th className="px-5 py-4 text-right whitespace-nowrap break-keep min-w-[110px]">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors whitespace-nowrap break-keep">
                    <td className="px-5 py-4 font-bold text-slate-900 dark:text-slate-100 font-mono whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block font-mono font-bold tracking-tight">{claim.claimNumber}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400 font-mono text-[11px] whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block font-mono">{claim.policyNumber}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block">{claim.farmerName}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block">{claim.insuranceUnitCode}</span>
                    </td>
                    <td className="px-5 py-4 text-slate-800 dark:text-slate-200 whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block font-medium">{claim.crop}</span>
                    </td>
                    <td className="px-5 py-4 text-[11px] text-slate-600 dark:text-slate-300 whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block">{claim.triggerType.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-red-600 dark:text-red-400 whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block font-mono">{claim.chfMeasured.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-slate-500 dark:text-slate-400 whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block font-mono">{claim.chfBaseline.toFixed(2)}</span>
                    </td>
                    <td className="px-5 py-4 font-mono font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block font-mono">{(claim.lossFraction * 100).toFixed(1)}%</span>
                    </td>
                    <td className="px-5 py-4 font-mono font-black text-slate-900 dark:text-slate-100 whitespace-nowrap break-keep">
                      <span className="whitespace-nowrap break-keep inline-block font-mono font-black">₹{claim.claimAmount.toLocaleString()}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap break-keep">
                      <span className={`inline-flex items-center justify-center min-w-[95px] text-[10px] font-bold px-3 py-1 rounded-full whitespace-nowrap break-keep uppercase tracking-wide border shadow-xs ${
                        claim.status === 'DISBURSED' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700' :
                        claim.status === 'APPROVED' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border-blue-300 dark:border-blue-700' :
                        claim.status === 'VERIFIED' ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/70 dark:text-purple-300 border-purple-300 dark:border-purple-700' :
                        'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      }`}>
                        {claim.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap break-keep">
                      <Link
                        href={`/insurer/claims/${claim.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline whitespace-nowrap break-keep"
                      >
                        <span className="whitespace-nowrap break-keep">Package</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 shrink-0 inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>'''

content = content.replace(old_table, new_table)

with open('src/app/insurer/claims/page.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated insurer/claims/page.tsx successfully!")
