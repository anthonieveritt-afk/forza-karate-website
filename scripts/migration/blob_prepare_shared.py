"""Constants shared by blob_prepare.py and blob_apply.py."""
import re, html

CHROME = {'cropped-cropped-cropped-cropped-cropped-forzalogo2020-8.jpg', 'cropped-A-New-Design.jpg',
          '308172704_1901229570212044_8713578156505199520_n.jpg', 'Safeguarding-Code-in-MA-01.jpg'}
ALBUM_KEYS = ['upminster-2013-present-day', 'rayleigh-primary-school-2013-present-day', 'rayleigh-scout-hall-2012-2019',
              'shoeburyness-dojo', 'basildon', '2016-forza-club-championships', '2015-club-championships-rayleigh-rps',
              # '2014-christmas-presentation-evening' removed at the club's request (see manifest removedAlbums)
              'preparation-training-2021', 'super-champs',
              'niahm-junner-kumite-class', 'jordan-thomas-kumite-class', 'gallery/black-belts']
PER_ALBUM = 16  # photos per album already in the repo (public/gallery/archive), see import_gallery.py

def pick(lst, n):
    if len(lst) <= n: return lst
    step = len(lst) / n
    return [lst[int(i * step)] for i in range(n)]

def base(u):
    return re.sub(r'-\d+x\d+(?=\.\w+$)', '', html.unescape(u).split('?')[0]).replace('-scaled.', '.')


def removed_sources(repo):
    """Original URLs of photos removed at the club's request (data/blob-manifest.json "removed").
    Every migration script must skip these so they are never re-imported or re-uploaded."""
    import json, os
    p = os.path.join(repo, 'data', 'blob-manifest.json')
    if not os.path.exists(p):
        return set()
    return {base(r['source']) for r in json.load(open(p)).get('removed', [])}
