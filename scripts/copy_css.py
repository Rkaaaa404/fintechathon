import re

with open('frontend_legacy/css/style.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace relative node_modules import with standard npm package import
css = re.sub(r'@import [\"\']\./node_modules/@fontsource/(.*?)[\"\'];', r'@import "@fontsource/\1";', css)

with open('frontend/src/app/legacy-styles.css', 'w', encoding='utf-8') as f:
    f.write(css)

print("Successfully written frontend/src/app/legacy-styles.css, length:", len(css))
