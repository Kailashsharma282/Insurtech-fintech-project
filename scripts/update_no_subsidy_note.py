file_path = r"c:\Users\kaila\OneDrive\Desktop\Projects\Insurtech-fintech-project\src\app\farmer\insurance\page.tsx"
with open(file_path, "r", encoding="utf-8") as f:
    c = f.read()

target1 = """              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-sans font-medium">Normal crop health</p>"""
replacement1 = """              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-sans font-medium">
                Normal crop health — <strong className="font-semibold text-emerald-900 dark:text-emerald-200">CHF is normal (&gt; 0.6)</strong>
              </p>"""

target2 = """              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-sans font-medium">Optimal canopy vigor</p>"""
replacement2 = """              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 mt-2 font-sans font-medium">
                Optimal canopy vigor — <strong className="font-semibold text-emerald-900 dark:text-emerald-200">CHF is normal (&gt; 0.6)</strong>
              </p>"""

if target1 in c and target2 in c:
    c = c.replace(target1, replacement1)
    c = c.replace(target2, replacement2)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(c)
    print("SUCCESS: Updated No Subsidy explanation with CHF is normal (> 0.6)")
else:
    print("Targets not found")
