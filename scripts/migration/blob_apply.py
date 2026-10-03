"""Step 3 of the Vercel Blob photo migration (see README.md).

Applies data/blob-manifest.json to the site content:
  - content/gallery/archive.json gets every old album photo, in the old site's
    order: repo copy (public/gallery/archive) if there is one, else the Blob
    URL, else (still pending) the original URL on the old site.
  - content/news/posts.json: each in-body photo that has been uploaded gets
    a `blob` URL; pending photos keep pointing at the old site.

Usage: MIGRATION_WORKDIR=/workspace/forza-migrate python3 scripts/migration/blob_apply.py
"""
import json, os, re, sys, html
sys.path.insert(0, os.path.dirname(__file__))
from news_helpers import WORK, REPO
from blob_prepare_shared import CHROME, ALBUM_KEYS, PER_ALBUM, pick, base

manifest = json.load(open(f'{REPO}/data/blob-manifest.json'))
by_source = {i['source']: i for i in manifest['items']}
by_base = {base(i['source']): i for i in manifest['items'] if i.get('status') == 'uploaded'}

# Gallery
albums_src = json.load(open(f'{WORK}/gal/albums.json'))
archive = json.load(open(f'{REPO}/content/gallery/archive.json'))
by_slug = {a['slug']: a for a in archive}
for key in ALBUM_KEYS:
    slug = key.split('/')[-1]
    album = by_slug[slug]
    imgs = [i['src'] for i in albums_src[key]['imgs'] if i['src'].split('/')[-1] not in CHROME]
    chosen = imgs if key == 'gallery/black-belts' else pick(imgs, PER_ALBUM)
    local = {u: n for n, u in enumerate(chosen, 1)}
    # repo copies, keyed by their file number
    repo_photos = {p['src']: p for p in album['photos'] if p['src'].startswith('/')}
    photos = []
    for n, u in enumerate(imgs, 1):
        num = len(photos) + 1
        alt = f"{album['name']} – photo {num}"
        if u in local:
            p = repo_photos[f'/gallery/archive/{slug}/{local[u]:02d}.webp']
            photos.append({'src': p['src'], 'alt': alt, 'width': p['width'], 'height': p['height']})
            continue
        it = by_source.get(u)
        if it and it.get('status') == 'uploaded':
            photos.append({'src': it['url'], 'alt': alt, 'width': it['width'], 'height': it['height']})
        else:
            entry = {'src': u, 'alt': alt, 'pending': True}
            if it and it.get('width'):
                entry.update(width=it['width'], height=it['height'])
            photos.append(entry)
    album['photos'] = photos
    album['totalOnOldSite'] = len(imgs)
json.dump(archive, open(f'{REPO}/content/gallery/archive.json', 'w'), ensure_ascii=False, indent=1)

# News
posts = json.load(open(f'{REPO}/content/news/posts.json'))
n_blob = n_pending = 0
for p in posts:
    for ph in p.get('bodyPhotos', []):
        it = by_base.get(base(ph['src']))
        if it:
            ph['blob'] = it['url']; n_blob += 1
        else:
            ph.pop('blob', None); n_pending += 1
json.dump(posts, open(f'{REPO}/content/news/posts.json', 'w'), ensure_ascii=False, indent=1)

g = [p for a in archive for p in a['photos']]
print('gallery photos', len(g), 'repo', sum(p['src'].startswith('/') for p in g),
      'blob', sum('blob.vercel-storage.com' in p['src'] for p in g), 'pending', sum(bool(p.get('pending')) for p in g))
print('news body photo slots: blob', n_blob, 'pending', n_pending)
