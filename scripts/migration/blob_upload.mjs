// Step 2 of the Vercel Blob photo migration (see README.md).
//
// Uploads prepared WebP files (from blob_prepare.py) to the public Blob store
// in manifest order, recording every put() in data/blob-manifest.json.
//
// Vercel Hobby allows 2,000 advanced operations (put/list/copy) a month and
// going over locks Blob for 30 days, so this script:
//   - never calls list(),
//   - counts every put() attempt (successful or not) against the month,
//   - stops at MONTH_CAP (default 1800) puts per calendar month.
//
// The token is read from BLOB_READ_WRITE_TOKEN or .env.local and is never printed.
//
// Usage (from the repo root):
//   MIGRATION_WORKDIR=/path/to/workdir BLOB_SDK=/path/to/node_modules/@vercel/blob/dist/index.js \
//     node scripts/migration/blob_upload.mjs [maxPutsThisRun]
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const REPO = resolve(new URL('../..', import.meta.url).pathname)
const MANIFEST = `${REPO}/data/blob-manifest.json`
const MONTH_CAP = Number(process.env.MONTH_CAP ?? 1800)
const RUN_CAP = Number(process.argv[2] ?? 0)
const CONCURRENCY = 4

function loadToken() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN
  const envFile = `${REPO}/.env.local`
  if (existsSync(envFile)) {
    const m = readFileSync(envFile, 'utf8').match(/^BLOB_READ_WRITE_TOKEN="?([^"\n]+)"?/m)
    if (m) return m[1]
  }
  throw new Error('BLOB_READ_WRITE_TOKEN not found')
}

const { put } = await import(process.env.BLOB_SDK ?? '@vercel/blob')
const token = loadToken()
const manifest = JSON.parse(readFileSync(MANIFEST, 'utf8'))
const month = new Date().toISOString().slice(0, 7)
manifest.operations ??= {}
manifest.operations[month] ??= { put: 0, list: 0 }
const ops = manifest.operations[month]

function save() {
  const clean = {
    ...manifest,
    items: manifest.items.map(({ localFile, ...rest }) => rest),
  }
  const up = clean.items.filter((i) => i.status === 'uploaded')
  clean.summary = {
    uploaded: { gallery: up.filter((i) => i.kind === 'gallery').length, news: up.filter((i) => i.kind === 'news').length },
    pending: {
      gallery: clean.items.filter((i) => i.kind === 'gallery' && i.status !== 'uploaded').length,
      news: clean.items.filter((i) => i.kind === 'news' && i.status !== 'uploaded').length,
    },
    storedBytes: up.reduce((s, i) => s + (i.bytes ?? 0), 0),
  }
  writeFileSync(MANIFEST, JSON.stringify(clean, null, 1) + '\n')
}

// Prepared files live in $MIGRATION_WORKDIR/blob-out/<pathname> (see blob_prepare.py).
const WORK = process.env.MIGRATION_WORKDIR ?? `${REPO}/.migration-cache`
for (const i of manifest.items) i.localFile ??= `${WORK}/blob-out/${i.pathname}`
// Never upload photos removed at the club's request (manifest "removed").
const removed = new Set((manifest.removed ?? []).map((r) => r.source))
const queue = manifest.items.filter((i) => i.status !== 'uploaded' && !removed.has(i.source) && existsSync(i.localFile))
let runPuts = 0
let stop = null

async function worker() {
  while (queue.length && !stop) {
    if (ops.put >= MONTH_CAP) { stop = `monthly cap of ${MONTH_CAP} puts reached`; break }
    if (RUN_CAP && runPuts >= RUN_CAP) { stop = `run cap of ${RUN_CAP} puts reached`; break }
    const it = queue.shift()
    ops.put++; runPuts++
    try {
      const res = await put(it.pathname, readFileSync(it.localFile), {
        access: 'public',
        contentType: 'image/webp',
        addRandomSuffix: false,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
        token,
      })
      it.status = 'uploaded'
      it.url = res.url
      it.uploadedAt = new Date().toISOString()
      delete it.error
    } catch (e) {
      it.error = String(e?.message ?? e).slice(0, 200)
      // Anything that looks like a quota, suspension or rate-limit problem stops the run.
      if (/limit|quota|suspend|blocked|forbidden|unauthori[sz]ed|429/i.test(it.error)) stop = `stopped on error: ${it.error}`
    }
    if (runPuts % 25 === 0) { save(); console.log(`puts this run: ${runPuts}, this month: ${ops.put}`) }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker))
save()
const failed = manifest.items.filter((i) => i.error && i.status !== 'uploaded').length
console.log(`done. puts this run: ${runPuts}, puts this month: ${ops.put}, failed: ${failed}${stop ? `, ${stop}` : ''}`)
