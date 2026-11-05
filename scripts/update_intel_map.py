with open('src/app/intelligence/map/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('\r\n', '\n')

old_import = "import React, { useState, useMemo } from 'react';"
new_import = "import React, { useState, useMemo, useEffect } from 'react';"
text = text.replace(old_import, new_import)

old_state = """export default function SatelliteMapPage() {
  const [selectedLayer, setSelectedLayer] = useState<string>('chf');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [cropFilter, setCropFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedFarm, setSelectedFarm] = useState<Farm>(SEED_FARMS[0]);"""

new_state = """export default function SatelliteMapPage() {
  const [farmsList, setFarmsList] = useState<Farm[]>(SEED_FARMS);
  const [selectedLayer, setSelectedLayer] = useState<string>('chf');
  const [districtFilter, setDistrictFilter] = useState<string>('ALL');
  const [cropFilter, setCropFilter] = useState<string>('ALL');
  const [riskFilter, setRiskFilter] = useState<string>('ALL');
  const [selectedFarm, setSelectedFarm] = useState<Farm>(SEED_FARMS[0]);

  useEffect(() => {
    fetch('/api/farms')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setFarmsList(data);
          setSelectedFarm(data[0]);
        }
      })
      .catch(() => {});
  }, []);"""

text = text.replace(old_state, new_state)
text = text.replace('SEED_FARMS.filter(f => {', 'farmsList.filter(f => {')
text = text.replace('[districtFilter, cropFilter, riskFilter]', '[farmsList, districtFilter, cropFilter, riskFilter]')

with open('src/app/intelligence/map/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("SUCCESS: Updated intelligence map page with dynamic farm fetch!")

