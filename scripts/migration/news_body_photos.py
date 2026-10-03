"""Add each news post's in-body photos (still hosted on the old WordPress site)
to content/news/posts.json as `bodyPhotos`.

Each entry: {"src": original full-size URL, "thumb": small WordPress-generated
size (about 300px) for the thumbnail, "width", "height"}. Photos already shown
on the post (featured image, or ones downloaded into `gallery`) are skipped.

NOTE: these URLs point at https://forzakarate.co.uk/wp-content/uploads/ and only
work while the old WordPress hosting stays up. A `blob` key may be added per
photo once it has been copied to Vercel Blob (see scripts/migration/README.md).

Usage: python3 scripts/migration/news_body_photos.py /path/to/wp/posts.json
"""
import json, re, sys, html
from pathlib import Path

REPO = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).parent))
from blob_prepare_shared import removed_sources  # noqa: E402
REMOVED = removed_sources(str(REPO))
WP_POSTS = Path(sys.argv[1] if len(sys.argv) > 1 else '/workspace/forza-migrate/wp/posts.json')
OUT = REPO / 'content/news/posts.json'

SIZE = re.compile(r'-\d+x\d+(?=\.\w+$)')

def base(u):
    u = html.unescape(u).split('?')[0]
    return SIZE.sub('', u).replace('-scaled.', '.')

def attr(tag, name):
    m = re.search(r'\s%s="([^"]*)"' % name, tag)
    return html.unescape(m.group(1)) if m else None

wp = {p['slug']: p for p in json.load(open(WP_POSTS))}
posts = json.load(open(OUT))
total = 0
for post in posts:
    p = wp.get(post['slug'])
    if not p:
        continue
    raw = p['content']['rendered']
    fm = (p.get('_embedded') or {}).get('wp:featuredmedia') or []
    featured = fm[0].get('source_url') if fm and isinstance(fm[0], dict) else None
    skip = set()
    if featured:
        skip.add(base(featured))
    # The import used the first body image as the card image when there was no featured image,
    # and downloaded up to 3 extra photos for image-only posts.
    imgs = [t for t in re.findall(r'<img[^>]+>', raw) if 'forzakarate.co.uk/wp-content/uploads' in (attr(t, 'src') or '')]
    if not featured and imgs and post.get('image'):
        skip.add(base(attr(imgs[0], 'src')))
    if post.get('gallery'):
        rest = [base(attr(t, 'src')) for t in imgs if base(attr(t, 'src')) not in skip]
        skip.update(rest[:len(post['gallery'])])
    seen, photos = set(), []
    for t in imgs:
        src = attr(t, 'src')
        b = base(src)
        if b in skip or b in seen or b in REMOVED:
            continue
        seen.add(b)
        cands = []
        for part in (attr(t, 'srcset') or '').split(','):
            bits = part.strip().split()
            if len(bits) == 2 and bits[1].endswith('w'):
                cands.append((int(bits[1][:-1]), bits[0]))
        cands.sort()
        full = cands[-1][1] if cands else b
        small = next((u for w, u in cands if w >= 250), None) or src
        w, h = attr(t, 'width'), attr(t, 'height')
        entry = {'src': full, 'thumb': small}
        if w and h and w.isdigit() and h.isdigit():
            entry['width'], entry['height'] = int(w), int(h)
        photos.append(entry)
    # keep any blob URLs already recorded for these photos
    old = {x['src']: x for x in post.get('bodyPhotos', [])}
    for e in photos:
        if e['src'] in old and old[e['src']].get('blob'):
            e['blob'] = old[e['src']]['blob']
    post['bodyPhotos'] = photos
    total += len(photos)

json.dump(posts, open(OUT, 'w'), ensure_ascii=False, indent=1)
print('posts', len(posts), 'with body photos', sum(1 for p in posts if p.get('bodyPhotos')), 'photos', total)
