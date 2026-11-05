import urllib.request
import json

queries = ['Kharar', 'Singur', 'Ghatal', 'Arambagh']
for q in queries:
    url = f'https://nominatim.openstreetmap.org/search?q={q},+India&format=json&polygon_geojson=1&countrycodes=in&limit=1'
    req = urllib.request.Request(url, headers={'User-Agent': 'AgriSure/1.0 (agrisure@crop.in)'})
    try:
        with urllib.request.urlopen(req, timeout=5) as res:
            data = json.loads(res.read().decode())
            if data:
                item = data[0]
                gj = item.get('geojson', {}).get('type')
                name = item.get('display_name')[:40]
                print(f"{q}: {name} -> type={gj}")
            else:
                print(f"{q}: no result")
    except Exception as e:
        print(f"{q}: error {e}")
