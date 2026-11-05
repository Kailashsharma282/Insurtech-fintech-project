with open('src/app/farmer/farms/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# Normalize CRLF
text = text.replace('\r\n', '\n')

old_needle = "import React, { useState, useMemo } from 'react';"
new_needle = """import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';"""

if old_needle in text:
    text = text.replace(old_needle, new_needle)

old_state = "  const [selectedFarm, setSelectedFarm] = useState<Farm>(SEED_FARMS[0]);"
new_state = """  const [farmsList, setFarmsList] = useState<Farm[]>(SEED_FARMS);
  const [selectedFarm, setSelectedFarm] = useState<Farm>(SEED_FARMS[0]);

  useEffect(() => {
    fetch('/api/farms')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFarmsList(data);
          setSelectedFarm(data[0]);
        }
      })
      .catch(() => {});
  }, []);"""

if old_state in text:
    text = text.replace(old_state, new_state)

text = text.replace('SEED_FARMS.filter(farm => {', 'farmsList.filter(farm => {')
text = text.replace('[searchQuery, districtFilter, cropFilter, riskFilter]', '[farmsList, searchQuery, districtFilter, cropFilter, riskFilter]')

old_btn = '          <div className="flex items-center space-x-2">'
new_btn = """          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/register"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Register New Plot / Farmer</span>
            </Link>"""

if old_btn in text:
    text = text.replace(old_btn, new_btn)

with open('src/app/farmer/farms/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("SUCCESS: Updated farms list page with Register CTA and dynamic API synchronization!")

