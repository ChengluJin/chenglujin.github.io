import re
import os
import urllib.request

css_file = 'assets/css/vendor/inter.css'
fonts_dir = 'assets/fonts/inter'
os.makedirs(fonts_dir, exist_ok=True)

with open(css_file, 'r') as f:
    css = f.read()

urls = re.findall(r'url\((https://[^\)]+)\)', css)

for url in urls:
    filename = url.split('/')[-1]
    local_path = os.path.join(fonts_dir, filename)
    print(f"Downloading {url} to {local_path}...")
    urllib.request.urlretrieve(url, local_path)
    # Replace in CSS
    relative_path = f"../../fonts/inter/{filename}"
    css = css.replace(url, relative_path)

with open(css_file, 'w') as f:
    f.write(css)

print("Done.")
