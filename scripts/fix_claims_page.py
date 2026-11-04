path = 'src/app/insurer/claims/page.tsx'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

old_input = 'className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"'
new_input = 'className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"'

old_select = 'className="py-2.5 px-3 rounded-xl border border-slate-300 bg-white"'
new_select = 'className="py-2.5 px-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500"'

old_districts = '''              <option value="ALL">All Districts</option>
              <option value="Nadia">Nadia District</option>'''

new_districts = '''              <option value="ALL">All Districts</option>
              <option value="Paschim Medinipur">Paschim Medinipur (Ghatal)</option>
              <option value="Nadia">Nadia District</option>'''

c = c.replace(old_input, new_input)
c = c.replace(old_select, new_select)
c = c.replace(old_districts, new_districts)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print("SUCCESS: Updated claims page filters!")
