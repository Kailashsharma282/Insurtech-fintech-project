with open('src/app/farmer/farms/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update subtitle
text = text.replace(
    "Monitored plots across West Bengal (Nadia, Burdwan, Hooghly, Murshidabad). Total: <strong>{filteredFarms.length} of {SEED_FARMS.length} plots</strong>",
    "Monitored agricultural plots across Ghatal Block & West Bengal. Silabati river floodplain plots show low CHF (<0.55), while upland sectors show high CHF. Total: <strong>{filteredFarms.length} of {SEED_FARMS.length} plots</strong>"
)

# 2. Update AgriMap farms prop: pass filteredFarms (all 40 plots!)
text = text.replace(
    "farms={filteredFarms.slice(0, 25)}",
    "farms={filteredFarms}"
)

# 3. Add Paschim Medinipur to district filter
text = text.replace(
    '<option value="ALL">All Districts (West Bengal)</option>\n              <option value="Nadia">Nadia District</option>',
    '<option value="ALL">All Districts / Pilot Blocks</option>\n              <option value="Paschim Medinipur">Paschim Medinipur (Ghatal Block — 40 Plots)</option>\n              <option value="Nadia">Nadia District</option>'
)

with open('src/app/farmer/farms/page.tsx', 'w', encoding='utf-8') as f:
    f.write(text)

print("Updated farmer/farms/page.tsx")
