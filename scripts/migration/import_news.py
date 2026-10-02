"""Part of the one-off content migration from the old WordPress site. See README.md."""
import os as _os
REPO = _os.path.abspath(_os.path.join(_os.path.dirname(__file__), '..', '..'))
WORK = _os.environ.get('MIGRATION_WORKDIR', _os.path.join(REPO, '.migration-cache'))
import json, re, html, os, io, sys, hashlib
from concurrent.futures import ThreadPoolExecutor
import requests
from bs4 import BeautifulSoup, NavigableString, Comment
from PIL import Image, ImageOps
import pillow_heif
pillow_heif.register_heif_opener()

WP = f'{WORK}/wp'
CACHE = f'{WORK}/cache'
os.makedirs(CACHE, exist_ok=True)
OUT_IMG = f'{REPO}/public/news'
os.makedirs(OUT_IMG, exist_ok=True)
os.makedirs(f'{REPO}/content/news', exist_ok=True)

os.makedirs(WP, exist_ok=True)
if not os.path.exists(f'{WP}/posts.json'):
    allp = []
    for page in (1, 2, 3, 4):
        r = requests.get(f'https://forzakarate.co.uk/wp-json/wp/v2/posts?per_page=100&page={page}&_embed=wp:featuredmedia', timeout=60)
        if r.status_code != 200: break
        allp += r.json()
    json.dump(allp, open(f'{WP}/posts.json', 'w'))
    json.dump(requests.get('https://forzakarate.co.uk/wp-json/wp/v2/categories?per_page=100', timeout=60).json(), open(f'{WP}/cats.json', 'w'))
posts = json.load(open(f'{WP}/posts.json'))
cats = {c['id']: html.unescape(c['name']) for c in json.load(open(f'{WP}/cats.json'))}
slugs = {p['slug'] for p in posts}
S = requests.Session(); S.headers['User-Agent'] = 'Mozilla/5.0 (forza content migration)'

INTERNAL_MAP = {
  'grading': '/gradings/register', 'gradings': '/gradings', 'trial-class': '/trial-class', 'club-list': '/dojos',
  'join-today': '/join', 'join-today-2': '/club-rules', 'shop': '/shop', 'gallery': '/gallery',
  'safeguarding': '/safeguarding', 'para-karate': '/para-karate', 'para-karate-2': '/para-karate',
  'hall-of-fame': '/hall-of-fame', 'calendar': '/calendar', 'news': '/news', 'our-team-of-instructors': '/instructors',
  'upminster-dojo': '/dojos/upminster', 'rps-dojo': '/dojos/rayleigh', 'why-karate': '/why-karate',
  'saturday-superchamps': '/register/super-champs', 'super-champs-2': '/register/super-champs',
  'team-forza': '/team', 'kata-team': '/team', 'kumite-team': '/team', 'privacy-policy': '/privacy-policy',
  'forza-ninjas-infants': '/classes/ninjas', 'forza-kids-juniors': '/classes/juniors', 'forza-club-11yrsplus': '/classes/seniors',
}
LABELS = {'/dojos': 'Our dojos and class times', '/trial-class': 'Book a free trial', '/calendar': 'Club calendar', '/gradings/register': 'Grading registration', '/gradings': 'Gradings', '/join': 'Join Forza', '/shop': 'Club shop', '/gallery': 'Gallery', '/news/': 'Read the news story', '/para-karate': 'Para Karate', '/team': 'Team Forza', '/instructors': 'Our instructors', '/safeguarding': 'Safeguarding', '/hall-of-fame': 'Hall of Fame', '/club-rules': 'Club rules', '/classes/ninjas': 'Forza Ninjas', '/classes/juniors': 'Forza Juniors', '/classes/seniors': 'Forza Club', '/': 'Forza Karate Club'}
ALLOWED = {'p','br','strong','em','a','ul','ol','li','h2','h3','h4','blockquote','hr','table','thead','tbody','tr','th','td','iframe'}
RENAME = {'b':'strong','i':'em','h1':'h2','h5':'h4','h6':'h4'}
DROP = {'script','style','img','picture','figure','form','input','noscript','svg','button','select','textarea','video','audio','source','object','embed','canvas','map'}
EMAIL = re.compile(r'[\w.+-]+@[\w-]+(\.[\w-]+)+')
PHONE = re.compile(r'(?:\+44\s?|\b0)\d(?:[\s-]?\d){8,10}\b')
DROP_SENTENCES = [re.compile(r'\s*at www\.forzakarate\.co\.uk/trialclass', re.I), re.compile(r'For more information,? (?:get in contact with|contact) your instructor(?: for details)?\.?', re.I)]

def map_link(href):
    if not href: return None
    h = href.strip()
    if h.startswith(('mailto:', 'tel:', 'sms:', 'blob:', 'javascript:')): return None
    m = re.match(r'https?://(?:www\.)?forzakarate\.co\.uk(/[^?#]*)?', h)
    if m:
        path = (m.group(1) or '/').strip('/')
        if path.startswith('wp-content/'): return None
        if path == '': return '/'
        first = path.split('/')[-1] if path.split('/')[0] in ('gallery',) and len(path.split('/'))>1 else path.split('/')[0]
        if path in slugs: return f'/news/{path}'
        if first in slugs: return f'/news/{first}'
        if path.split('/')[0] in INTERNAL_MAP: return INTERNAL_MAP[path.split('/')[0]]
        return None
    if re.match(r'https?://(?:www\.)?(formsmarts\.com|f8s\.co)', h): return None
    if re.match(r'https?://(www\.|m\.)?facebook\.com', h): return h.split('?')[0]
    if h.startswith('http'): return h
    return None

def clean_html(raw):
    soup = BeautifulSoup(raw, 'lxml')
    body = soup.body or soup
    for c in body.find_all(string=lambda t: isinstance(t, Comment)): c.extract()
    for t in body.find_all(DROP): t.decompose()
    for t in body.find_all('iframe'):
        src = t.get('src', '')
        m = re.search(r'youtube(?:-nocookie)?\.com/embed/([\w-]+)', src)
        if m:
            t.attrs = {'src': f'https://www.youtube-nocookie.com/embed/{m.group(1)}', 'title': 'YouTube video', 'allowfullscreen': '', 'loading': 'lazy'}
        else:
            t.decompose()
    for t in list(body.find_all(True)):
        if t.parent is None: continue
        name = RENAME.get(t.name, t.name)
        t.name = name
        if name not in ALLOWED:
            t.unwrap(); continue
        if name == 'a':
            href = map_link(t.get('href'))
            if not href:
                t.unwrap(); continue
            t.attrs = {'href': href}
            txt = t.get_text(strip=True)
            if re.match(r'(https?://)?(www\.)?forzakarate\.co\.uk', txt):
                t.string = LABELS.get(href.split('/news/')[0] if not href.startswith('/news/') else '/news/', href)
            if href.startswith('http'):
                t.attrs.update({'target': '_blank', 'rel': 'noopener noreferrer'})
        elif name != 'iframe':
            t.attrs = {}
    # text scrubbing
    for s in list(body.find_all(string=True)):
        if not isinstance(s, NavigableString): continue
        txt = str(s)
        new = EMAIL.sub('', txt)
        new = PHONE.sub('', new)
        for r in DROP_SENTENCES: new = r.sub('', new)
        new = new.replace('\xa0', ' ')
        if new != txt: s.replace_with(new)
    # remove empty elements (repeat)
    for _ in range(3):
        for t in body.find_all(['p','li','h2','h3','h4','strong','em','a','blockquote','ul','ol']):
            if t.find('iframe') or t.find('br') and t.get_text(strip=True): continue
            if not t.get_text(strip=True) and not t.find('iframe'):
                t.decompose()
    out = ''.join(str(c) for c in body.contents)
    out = re.sub(r'(<br/?>\s*){2,}', '<br/>', out)
    out = re.sub(r'<p>\s*(<br/?>\s*)+', '<p>', out)
    out = re.sub(r'(<br/?>\s*)+</p>', '</p>', out)
    out = re.sub(r'\n{2,}', '\n', out).strip()
    return out

def first_body_img(raw):
    for m in re.findall(r'<img[^>]+src="([^"]+)"', raw):
        if 'forzakarate.co.uk/wp-content' in m:
            return re.sub(r'-\d+x\d+(?=\.\w+$)', '', m.split('?')[0])
    return None

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
        im = im.convert('RGBA')
        bg = Image.new('RGB', im.size, (255,255,255)); bg.paste(im, mask=im.split()[-1]); im = bg
    elif im.mode != 'RGB':
        im = im.convert('RGB')
    if im.width > max_w:
        im = im.resize((max_w, round(im.height * max_w / im.width)), Image.LANCZOS)
    im.save(dest, 'WEBP', quality=q, method=6)
    return im.width, im.height

def excerpt_of(p, html_body):
    ex = BeautifulSoup(p['excerpt']['rendered'], 'lxml').get_text(' ', strip=True)
    ex = html.unescape(ex)
    ex = re.sub(r'\s*(\[…\]|\[\.\.\.\]|Continue reading.*|Read More.*)$', '', ex).strip()
    if not ex:
        ex = BeautifulSoup(html_body, 'lxml').get_text(' ', strip=True)
    ex = EMAIL.sub('', PHONE.sub('', ex))
    ex = re.sub(r'\s+', ' ', ex).strip()
    if len(ex) > 200: ex = ex[:197].rsplit(' ', 1)[0] + '…'
    return ex

def process(p):
    slug = p['slug']
    title = html.unescape(BeautifulSoup(p['title']['rendered'], 'lxml').get_text())
    raw = p['content']['rendered']
    body = clean_html(raw)
    fm = (p.get('_embedded') or {}).get('wp:featuredmedia') or []
    src = fm[0].get('source_url') if fm and isinstance(fm[0], dict) else None
    img_source = 'featured' if src else None
    if not src:
        src = first_body_img(raw); img_source = 'first-body' if src else None
    image = None; err = None
    if src:
        try:
            f = fetch(src)
            dest = f'{OUT_IMG}/{slug}.webp'
            w, h = to_webp(f, dest)
            image = {'src': f'/news/{slug}.webp', 'width': w, 'height': h, 'alt': title}
        except Exception as e:
            err = f'{src}: {e}'
    gallery = []
    text_len0 = len(BeautifulSoup(body, 'lxml').get_text(strip=True)) if body else 0
    body_imgs = []
    for m in re.findall(r'<img[^>]+src="([^"]+)"', raw):
        if 'forzakarate.co.uk/wp-content' in m:
            b = re.sub(r'-\d+x\d+(?=\.\w+$)', '', m.split('?')[0])
            if b not in body_imgs: body_imgs.append(b)
    extra = [b for b in body_imgs if b != src]
    if text_len0 < 20 and 0 < len(extra) <= 3:
        for i, b in enumerate(extra, 1):
            try:
                f = fetch(b)
                w, h = to_webp(f, f'{OUT_IMG}/{slug}-{i}.webp')
                gallery.append({'src': f'/news/{slug}-{i}.webp', 'width': w, 'height': h, 'alt': f'{title} – photo {i}'})
            except Exception as e:
                err = (err or '') + f' | {b}: {e}'
    catnames = [cats.get(c) for c in p.get('categories', []) if cats.get(c) and cats.get(c) != 'General News']
    text_len = len(BeautifulSoup(body, 'lxml').get_text(strip=True)) if body else 0
    return {
        'slug': slug, 'title': title, 'date': p['date'], 'modified': p['modified'],
        'category': catnames[0] if catnames else None,
        'excerpt': excerpt_of(p, body), 'image': image, 'gallery': gallery, 'html': body,
        'oldUrl': p['link'],
        '_imgSource': img_source, '_err': err, '_textLen': text_len,
        '_bodyImgCount': len(set(re.findall(r'<img[^>]+src="([^"]+)"', raw))),
    }

with ThreadPoolExecutor(8) as ex:
    res = list(ex.map(process, posts))
res.sort(key=lambda r: r['date'], reverse=True)
report = [{k: r[k] for k in ('slug','_imgSource','_err','_textLen','_bodyImgCount')} for r in res]
json.dump(report, open(f'{WORK}/news-report.json', 'w'), indent=1)
clean = [{k: v for k, v in r.items() if not k.startswith('_')} for r in res]
json.dump(clean, open(f'{REPO}/content/news/posts.json', 'w'), ensure_ascii=False, indent=1)
print('posts', len(clean), 'with image', sum(1 for r in clean if r['image']), 'errors', [r['_err'] for r in res if r['_err']])
print('empty text', sum(1 for r in res if r['_textLen'] < 20))
