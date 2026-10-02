"""Part of the one-off content migration from the old WordPress site. See README.md."""
import os as _os
REPO = _os.path.abspath(_os.path.join(_os.path.dirname(__file__), '..', '..'))
WORK = _os.environ.get('MIGRATION_WORKDIR', _os.path.join(REPO, '.migration-cache'))
import os, hashlib, requests
from PIL import Image, ImageOps
import pillow_heif
pillow_heif.register_heif_opener()
CACHE = f'{WORK}/cache'
os.makedirs(CACHE, exist_ok=True)
S = requests.Session(); S.headers['User-Agent'] = 'Mozilla/5.0 (forza content migration)'
def fetch(url):
    fn = os.path.join(CACHE, hashlib.md5(url.encode()).hexdigest() + os.path.splitext(url.split('?')[0])[1][:6])
    if not os.path.exists(fn):
        r = S.get(url, timeout=60); r.raise_for_status()
        open(fn, 'wb').write(r.content)
    return fn
def to_webp(src_file, dest, max_w=1200, q=76):
    im = Image.open(src_file)
    im = ImageOps.exif_transpose(im)
    if im.mode in ('P', 'LA', 'RGBA'):
        im = im.convert('RGBA'); bg = Image.new('RGB', im.size, (255,255,255)); bg.paste(im, mask=im.split()[-1]); im = bg
    elif im.mode != 'RGB':
        im = im.convert('RGB')
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(dest, 'WEBP', quality=q, method=6)
    return im.width, im.height
