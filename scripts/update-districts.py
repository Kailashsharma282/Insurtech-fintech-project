with open('src/lib/db/seed-data.ts', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace("export const DISTRICTS = ['Nadia', 'Burdwan', 'Hooghly', 'Murshidabad'] as const;",
                    "export const DISTRICTS = ['Paschim Medinipur', 'Nadia', 'Burdwan', 'Hooghly', 'Murshidabad'] as const;")

text = text.replace("name: 'Ghatal Central Gram Panchayat',\n    district: 'Nadia',",
                    "name: 'Ghatal Central Gram Panchayat',\n    district: 'Paschim Medinipur',")

with open('src/lib/db/seed-data.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated DISTRICTS in seed-data.ts')

