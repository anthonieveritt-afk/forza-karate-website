# Content migration scripts (old WordPress site → this repo)

One-off scripts used to import content from https://forzakarate.co.uk (WordPress) into the new site.
They are kept so the import can be re-run or extended. They are not part of the Next.js build.

Requirements: Python 3 with `requests`, `beautifulsoup4`, `lxml`, `Pillow` and `pillow-heif`.
Downloads are cached in `.migration-cache/` (git-ignored); set `MIGRATION_WORKDIR` to change it.

| Script | What it does |
|---|---|
| `import_news.py` | Pulls all posts from the WordPress REST API, sanitises the HTML (no images, scripts, forms, emails or phone numbers; old internal links mapped to new pages) and writes `content/news/posts.json`. Downloads each post's featured image as WebP (max 1200px wide) into `public/news/`. Image-only posts with 1–3 photos also keep those photos. |
| `gallery_scan.py` | Lists the photos in each old gallery album page (writes `.migration-cache/gal/albums.json`). |
| `import_gallery.py` | Imports a representative set of photos per album (default 16, set `PER_ALBUM`) as WebP into `public/gallery/archive/` and writes `content/gallery/archive.json`. Run `gallery_scan.py` first. |

Run from the repo root, e.g. `python3 scripts/migration/import_news.py`.

Body images inside news posts (about 1,840 unique images) were **not** imported because they would add roughly
170MB to the repo; only featured images were kept.
