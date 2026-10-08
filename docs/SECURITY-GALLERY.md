# Gallery security (Oct 2026)

## What was wrong
`/api/gallery-proxy/*` logged into Club Honbu as admin using `FORZA_HONBU_ADMIN_PASS`
and proxied arbitrary gallery API paths (including writes) to anonymous callers.
`/admin/gallery` was a public page that used that proxy.

## What we did
- Replaced the proxy with a permanent **410 Gone** for every HTTP method.
- Middleware also returns 410 for `/api/gallery-proxy/*`.
- Replaced `/admin/gallery` with a staff notice that links to Club Honbu’s own login.
- Public `/gallery` already used Club Honbu’s **public** API and is unchanged.
- Do **not** set `FORZA_HONBU_ADMIN_PASS` / `FORZA_HONBU_ADMIN_USER` in Vercel anymore.

## Ops follow-ups (Anthoni)
- In Vercel: remove `FORZA_HONBU_ADMIN_PASS`, `FORZA_HONBU_ADMIN_USER`, `FORZA_HONBU_URL` if present.
- On Railway `forza-club-honbu`: daily backups fail because `DEFAULT_OBJECT_STORAGE_BUCKET_ID`
  is unset — set a bucket (or disable the cron). Also consider removing
  `NODE_TLS_REJECT_UNAUTHORIZED=0` (disables TLS verification on outbound HTTPS).
