with open('src/app/farmer/farms/page.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

first_idx = text.find('href="/register"')
if first_idx != -1:
    second_idx = text.find('href="/register"', first_idx + 1)
    if second_idx != -1:
        div_start = text.rfind('<div className="flex flex-wrap items-center gap-2">', 0, second_idx)
        link_end = text.find('</Link>', second_idx) + len('</Link>')
        text = text[:div_start] + '<div className="flex items-center space-x-2">' + text[link_end:]
        with open('src/app/farmer/farms/page.tsx', 'w', encoding='utf-8') as f:
            f.write(text)
        print('SUCCESS: Cleaned second button from individual farm cards!')
    else:
        print('Second occurrence not found.')
else:
    print('First occurrence not found.')

