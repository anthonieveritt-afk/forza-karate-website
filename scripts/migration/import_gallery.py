"""Part of the one-off content migration from the old WordPress site. See README.md."""
import os as _os
REPO = _os.path.abspath(_os.path.join(_os.path.dirname(__file__), '..', '..'))
WORK = _os.environ.get('MIGRATION_WORKDIR', _os.path.join(REPO, '.migration-cache'))
import json, os, re, sys
sys.path.insert(0, os.path.dirname(__file__))
from concurrent.futures import ThreadPoolExecutor
from news_helpers import fetch, to_webp

OUT = f'{REPO}/public/gallery/archive'
PER_ALBUM = int(os.environ.get('PER_ALBUM', '16'))
CHROME = {'cropped-cropped-cropped-cropped-cropped-forzalogo2020-8.jpg', 'cropped-A-New-Design.jpg',
          '308172704_1901229570212044_8713578156505199520_n.jpg', 'Safeguarding-Code-in-MA-01.jpg'}
ALBUMS = [
  ('upminster-2013-present-day', 'Upminster Dojo (2013 – present day)', 'club', 'Training at our Upminster dojo, St Lawrence Church Hall.'),
  ('rayleigh-primary-school-2013-present-day', 'Rayleigh Primary School (2013 – present day)', 'club', 'Training at our Rayleigh dojo, Rayleigh Primary School.'),
  ('rayleigh-scout-hall-2012-2019', 'Rayleigh Scout Hall (2012 – 2019)', 'club', 'Where it all started: our first Rayleigh home.'),
  ('shoeburyness-dojo', 'Shoeburyness Dojo', 'club', None),
  ('basildon', 'Basildon (2021 – 2023)', 'club', None),
  ('2016-forza-club-championships', '2016 Forza Club Championships', 'competition', None),
  ('2015-club-championships-rayleigh-rps', '2015 Club Championships – Rayleigh', 'competition', None),
  ('2014-christmas-presentation-evening', '2014 Christmas Presentation Evening', 'event', None),
  ('preparation-training-2021', 'Preparation Training 2021', 'course', None),
  ('super-champs', 'Super Champs Preparation Training (2021)', 'course', 'Super Champs preparation training for 4–8 year olds.'),
  ('niahm-junner-kumite-class', 'Guest Instructor: Niamh Junner (2022)', 'course', 'Kumite class with Scottish international Niamh Junner.'),
  ('jordan-thomas-kumite-class', 'Guest Instructor: Jordan Thomas (2021)', 'course', 'Kumite class with Team GB’s Jordan Thomas, 2016 English World Karate Champion.'),
  ('gallery/black-belts', 'Black Belts', 'grading', 'Forza black belt gradings through the years.'),
]
data = json.load(open(f'{WORK}/gal/albums.json'))

def pick(lst, n):
    if len(lst) <= n: return lst
    step = len(lst) / n
    return [lst[int(i * step)] for i in range(n)]

albums_out = []; jobs = []
for key, name, cat, desc in ALBUMS:
    imgs = [i for i in data[key]['imgs'] if i['src'].split('/')[-1] not in CHROME]
    chosen = imgs if key == 'gallery/black-belts' else pick(imgs, PER_ALBUM)
    slug = key.split('/')[-1]
    os.makedirs(f'{OUT}/{slug}', exist_ok=True)
    photos = []
    for n, i in enumerate(chosen, 1):
        dest = f'{OUT}/{slug}/{n:02d}.webp'
        photos.append({'src': f'/gallery/archive/{slug}/{n:02d}.webp', 'alt': i['caption'] or f'{name} – photo {n}', '_url': i['src'], '_dest': dest})
    albums_out.append({'slug': slug, 'name': name, 'category': cat, 'description': desc,
                       'oldUrl': f'https://forzakarate.co.uk/{key}/', 'totalOnOldSite': len(imgs), 'photos': photos})

def work(ph):
    f = fetch(ph['_url'])
    w, h = to_webp(f, ph['_dest'], max_w=1200, q=74)
    ph['width'], ph['height'] = w, h
    return ph
allp = [p for a in albums_out for p in a['photos']]
with ThreadPoolExecutor(8) as ex: list(ex.map(work, allp))
for a in albums_out:
    a['photos'] = [{k: v for k, v in p.items() if not k.startswith('_')} for p in a['photos']]
    print(a['slug'], len(a['photos']), '/', a['totalOnOldSite'])
os.makedirs(f'{REPO}/content/gallery', exist_ok=True)
json.dump(albums_out, open(f'{REPO}/content/gallery/archive.json', 'w'), ensure_ascii=False, indent=1)
print('total photos', len(allp), 'old total', sum(a['totalOnOldSite'] for a in albums_out))
