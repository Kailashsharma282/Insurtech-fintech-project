import os

path = os.path.join('src', 'lib', 'db', 'store.ts')
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = """  getFarmById(id: string): Farm | undefined {
    return this.farms.find(f => f.id === id || f.plotNumber.replace(/[^0-9]/g, '') === id.replace(/[^0-9]/g, ''));
  }"""

replacement = """  getFarmById(id: string): Farm | undefined {
    return this.farms.find(f => f.id === id || f.plotNumber.replace(/[^0-9]/g, '') === id.replace(/[^0-9]/g, ''));
  }

  addFarm(farm: Farm): Farm {
    const idx = this.farms.findIndex(f => f.id === farm.id);
    if (idx >= 0) {
      this.farms[idx] = farm;
    } else {
      this.farms.unshift(farm);
    }
    return farm;
  }"""

norm_text = text.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
norm_rep = replacement.replace('\r\n', '\n')

assert norm_target in norm_text, "Target not found in store.ts"
new_text = norm_text.replace(norm_target, norm_rep)

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(new_text)

print("Updated store.ts with addFarm successfully!")
