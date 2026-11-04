import os

path = os.path.join('src', 'context', 'ThemeContext.tsx')
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

target = """    try {
      const saved = localStorage.getItem('agrisure_theme') as Theme | null;
      if (saved === 'dark' || saved === 'light') {
        setThemeState(saved);
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {"""

replacement = """    try {
      const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const queryTheme = urlParams?.get('theme') as Theme | null;
      const saved = (queryTheme === 'dark' || queryTheme === 'light') ? queryTheme : (localStorage.getItem('agrisure_theme') as Theme | null);
      if (saved === 'dark' || saved === 'light') {
        setThemeState(saved);
        if (saved === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } else {"""

norm_text = text.replace('\r\n', '\n')
norm_target = target.replace('\r\n', '\n')
norm_rep = replacement.replace('\r\n', '\n')

assert norm_target in norm_text, "Target not found in ThemeContext.tsx"
new_text = norm_text.replace(norm_target, norm_rep)

with open(path, 'w', encoding='utf-8', newline='') as f:
    f.write(new_text)

print("Updated ThemeContext.tsx successfully!")

