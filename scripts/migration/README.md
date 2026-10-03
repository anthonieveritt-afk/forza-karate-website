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

| `news_body_photos.py` | Adds each post's other in-body photos to `content/news/posts.json` as `bodyPhotos` (original URL plus a ~300px WordPress thumbnail). Shown under "More photos from this post". |
| `blob_prepare.py` | Builds the Vercel Blob upload queue in `data/blob-manifest.json` (remaining gallery photos first, then news in-body photos from the newest posts back), downloads the originals and converts them to WebP (max 1600px wide). |
| `blob_upload.mjs` | Uploads prepared files to the public Blob store with `put()`, in manifest order, and records each upload (URL, size) in the manifest. Never calls `list()`. Stops at `MONTH_CAP` (default 1,800) puts per calendar month. |
| `blob_apply.py` | Writes the Blob URLs into `content/gallery/archive.json` and `content/news/posts.json`. Anything still pending keeps pointing at the old site. |

Body images inside news posts are not stored in the repo (they would add roughly 170MB). They are being moved to
Vercel Blob instead.

## Vercel Blob photo migration

Store: `forza-karate-photos` (public, `lhr1`), connected to the `forza-karate-website` project, which provides the
`BLOB_READ_WRITE_TOKEN` env var. **Never commit the token.** `vercel env pull` writes it to `.env.local`, which is
git-ignored.

The Hobby plan allows 1GB of storage and 2,000 advanced operations (put/list/copy) a month, and going over a limit locks
Blob for 30 days. So uploads are spread over months, and `data/blob-manifest.json` records the puts used per month
(`operations`) and the status of every photo (`uploaded` with its URL, or `pending`).

To do the next batch (in a new calendar month):

```bash
export MIGRATION_WORKDIR=/path/to/workdir            # holds gal/albums.json and the download cache
python3 scripts/migration/blob_prepare.py 1800       # prepare the next 1,800 pending photos
BLOB_SDK=/path/to/node_modules/@vercel/blob/dist/index.js node scripts/migration/blob_upload.mjs 1800  # npm i @vercel/blob in a scratch dir
python3 scripts/migration/blob_apply.py              # point the site at the new URLs
```

Photos still pending load from `https://forzakarate.co.uk/wp-content/uploads/` and will break if the old WordPress
hosting is switched off before the migration finishes.
