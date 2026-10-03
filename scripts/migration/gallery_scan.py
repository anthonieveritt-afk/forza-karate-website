"""Part of the one-off content migration from the old WordPress site. See README.md."""
import os as _os
REPO = _os.path.abspath(_os.path.join(_os.path.dirname(__file__), '..', '..'))
WORK = _os.environ.get('MIGRATION_WORKDIR', _os.path.join(REPO, '.migration-cache'))
import os, re, json, requests
from bs4 import BeautifulSoup
S=requests.Session(); S.headers['User-Agent']='Mozilla/5.0'
albums = ['rayleigh-scout-hall-2012-2019','rayleigh-primary-school-2013-present-day','upminster-2013-present-day','shoeburyness-dojo','basildon',
 '2016-forza-club-championships','2015-club-championships-rayleigh-rps','2014-2','2014-christmas-presentation-evening','preparation-training-2021','super-champs','2022-super-champs',
 'niahm-junner-kumite-class','jordan-thomas-kumite-class','gallery/black-belts','gallery/association-training','gallery/competition-preparation-training',
 'gallery/england-national-team','gallery/joe-kellaway','gallery/paris-karate-open-2020','gallery/rayleigh-dojo','gallery/southend-dojo','gallery/southern-england-regional-squad']
os.makedirs(f'{WORK}/gal', exist_ok=True)
out={}; allimgs=set()
for a in albums:
    r=S.get(f'https://forzakarate.co.uk/{a}/',timeout=60)
    s=BeautifulSoup(r.text,'lxml')
    c=s.select_one('.entry-content') or s.select_one('article') or s.body
    title=(s.select_one('h1') or s.title).get_text(strip=True)
    imgs=[]
    for img in c.find_all('img'):
        src=img.get('data-orig-file') or img.get('data-large-file') or img.get('data-src') or img.get('src') or ''
        par=img.find_parent('a')
        if par and re.search(r'\.(jpe?g|png|webp|gif|heic)$',par.get('href',''),re.I): src=par['href']
        if 'wp-content/uploads' not in src: continue
        b=re.sub(r'-\d+x\d+(?=\.\w+$)','',src.split('?')[0])
        cap=None
        fig=img.find_parent('figure')
        if fig and fig.find('figcaption'): cap=fig.find('figcaption').get_text(' ',strip=True)
        if b not in [i['src'] for i in imgs]: imgs.append({'src':b,'alt':img.get('alt') or '','caption':cap})
    # headings in content for structure
    heads=[h.get_text(' ',strip=True) for h in c.find_all(['h2','h3','h4','strong'])][:30]
    out[a]={'title':title,'count':len(imgs),'imgs':imgs,'heads':heads,'status':r.status_code}
    allimgs|={i['src'] for i in imgs}
    print(a, r.status_code, title, len(imgs))
print('total unique', len(allimgs))
json.dump(out,open(f'{WORK}/gal/albums.json','w'),indent=1)
