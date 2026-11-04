import os

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return False, str(e)

    if 'Purba Medinipur' in content:
        new_content = content.replace('Purba Medinipur', 'Paschim Medinipur')
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        return True, 'replaced'
    return False, 'no match'

def main():
    root_dirs = ['src', 'public']
    count = 0
    for r_dir in root_dirs:
        for root, dirs, files in os.walk(r_dir):
            for file in files:
                if file.endswith(('.ts', '.tsx', '.json', '.js', '.mjs', '.css', '.md')):
                    full_path = os.path.join(root, file)
                    changed, msg = replace_in_file(full_path)
                    if changed:
                        print(f"Updated: {full_path}")
                        count += 1
    print(f"Total files updated from Purba Medinipur -> Paschim Medinipur: {count}")

if __name__ == '__main__':
    main()
