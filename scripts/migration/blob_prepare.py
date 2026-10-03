"""Step 1 of the Vercel Blob photo migration (see README.md).

Builds the upload queue in priority order (remaining gallery photos first, then
news in-body photos from the newest posts back), downloads the originals from
the old site and converts them to WebP (max 1600px wide) ready for upload.

Writes/updates data/blob-manifest.json. Items already marked "uploaded" are
never touched, so this can be re-run next month to prepare the next batch.

Usage: MIGRATION_WORKDIR=/workspace/forza-migrate python3 scripts/migration/blob_prepare.py [max_prepare]
"""
import json, os, re, sys, html
from concurrent.futures import ThreadPoolExecutor
sys.path.insert(0, os.path.dirname(__file__))
from news_helpers import fetch, to_webp, WORK, REPO

MAX_PREPARE = int(sys.argv[1]) if len(sys.argv) > 1 else 1900
OUT_DIR = f'{WORK}/blob-out'
MANIFEST = f'{REPO}/data/blob-manifest.json'

from blob_prepare_shared import CHROME, ALBUM_KEYS, PER_ALBUM, pick, base, removed_sources

REMOVED = removed_sources(REPO)  # photos removed at the club's request: never re-upload

albums = json.load(open(f'{WORK}/gal/albums.json'))
posts = sorted(json.load(open(f'{REPO}/content/news/posts.json')), key=lambda p: p['date'], reverse=True)

manifest = json.load(open(MANIFEST)) if os.path.exists(MANIFEST) else {}
items = {i['source']: i for i in manifest.get('items', [])}
order = []

# 1. Gallery photos not already in the repo
for key in ALBUM_KEYS:
    slug = key.split('/')[-1]
    imgs = [i['src'] for i in albums[key]['imgs'] if i['src'].split('/')[-1] not in CHROME]
    local = set(imgs if key == 'gallery/black-belts' else pick(imgs, PER_ALBUM))
    for n, u in enumerate(imgs, 1):
        if u in local or base(u) in REMOVED:
            continue
        order.append({'kind': 'gallery', 'album': slug, 'index': n, 'source': u,
                      'pathname': f'gallery/{slug}/{n:03d}.webp'})

# 2. News in-body photos, newest posts first (a photo used in several posts is uploaded once)
seen = {base(o['source']) for o in order}
for p in posts:
    for n, ph in enumerate(p.get('bodyPhotos', []), 1):
        b = base(ph['src'])
        if b in seen or b in REMOVED:
            continue
        seen.add(b)
        order.append({'kind': 'news', 'post': p['slug'], 'index': n, 'source': ph['src'],
                      'pathname': f"news/{p['slug'][:80]}/{n:03d}.webp"})

for o in order:
    if o['source'] not in items:
        items[o['source']] = {**o, 'status': 'pending'}
    else:
        items[o['source']].update({k: v for k, v in o.items() if items[o['source']].get('status') != 'uploaded'})

queue = [items[o['source']] for o in order]
# keep uploaded items even if no longer queued, so their URLs stay on record
queue += [i for s, i in items.items() if i.get('status') == 'uploaded' and i not in queue]
todo = [i for i in queue if i['status'] != 'uploaded'][:MAX_PREPARE]

def work(it):
    dest = f"{OUT_DIR}/{it['pathname']}"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        if not os.path.exists(dest):
            to_webp(fetch(it['source']), dest, max_w=1600, q=78)
        from PIL import Image
        with Image.open(dest) as im:
            it['width'], it['height'] = im.size
        it['localFile'] = dest
        it['bytes'] = os.path.getsize(dest)
        it.pop('error', None)
    except Exception as e:  # noqa: BLE001
        it['error'] = str(e)[:200]
    return it

with ThreadPoolExecutor(8) as ex:
    list(ex.map(work, todo))

manifest.setdefault('store', {})
manifest['order'] = 'gallery first, then news in-body photos from the newest posts back'
manifest['items'] = queue
os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
json.dump(manifest, open(MANIFEST, 'w'), ensure_ascii=False, indent=1)
ok = [i for i in todo if 'localFile' in i]
print('queue', len(queue), 'gallery', sum(1 for i in queue if i['kind'] == 'gallery'),
      'news', sum(1 for i in queue if i['kind'] == 'news'))
print('prepared', len(ok), 'errors', sum(1 for i in todo if 'error' in i),
      'MB', round(sum(i['bytes'] for i in ok) / 1e6, 1))
