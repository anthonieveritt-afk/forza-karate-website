# Dojo Dash shared leaderboard

API: `app/api/dojo-dash/scores/route.ts` (GET `?board=`, POST, DELETE by token), `app/api/dojo-dash/removal-requests/route.ts` (public form), `app/api/dojo-dash/admin/removals/route.ts` (admin). Helpers: `lib/dojo-dash/store.ts` and `lib/dojo-dash/removals.ts`. Nickname filter: `lib/dojo-dash/nickfilter.js`, a verbatim copy of the game's NF. Keep the two in sync.

## Stored per entry
`n` nickname (filtered, max 12 chars, two on the team board), `s` score, `t` time, `b` belt index, `m` mastery level (optional), `d` date, `h` hash of the device's removal token (never returned by GET). The board key is the mode. There's no IP, location, user agent or real name.

## Limits
- Boards are whitelisted: dojoDashLeaderboard, dojoDashTeam, dojoDashMastery, and dojoDashDaily-YYYY-MM-DD (only today's board can be written to).
- Each board keeps its top 50 entries. Daily boards expire after 14 days, and entries older than 12 months are pruned.
- Saves are limited to 6 per minute per client. The rate-limit key is a daily-salted SHA-256 of the IP and is deleted after 60 s.
- The request body is capped at 1 KB.
- GET responses are cached at the CDN for 10 s to keep the number of Redis commands low.

## Fallback
If `KV_REST_API_URL`/`KV_REST_API_TOKEN` (or `UPSTASH_REDIS_REST_URL`/`_TOKEN`) are missing, or Redis errors or times out (3 s), every call returns 503. The game then shows "Score saved on this device" and stays local-only.

## Setup (needs Anthoni's approval)
1. In Vercel, go to forza-karate-website → Storage → Marketplace → Upstash Redis. Choose the **Free** plan and set the primary region to **London (eu-west-2)**, with no read regions. Connect it to the project for Production and Preview. This adds `KV_REST_API_URL` and `KV_REST_API_TOKEN`.
2. Optionally add the env vars `DD_RATE_SALT` (a random string) and `DD_ADMIN_TOKEN` (16+ random characters; it turns on the admin removal endpoint used by the daily routine).
3. Redeploy the preview and test it. Then merge.

## Score removal

There are three ways to remove a score:

### 1. "Remove my score" in the game (instant, self-serve)
- `POST /api/dojo-dash/scores` returns a random 128-bit `token` with each saved score. The game keeps it only on that device, in localStorage under `dojoDashMyScores` (for up to 12 months, max 50 entries).
- The server stores only `h`, a SHA-256 hash of the token, inside the entry. `h` is never sent back out by GET.
- On the title or results screen, the game shows **🗑 My scores** if that device has saved scores online. Each one has a **Remove my score** button, which calls `DELETE /api/dojo-dash/scores` with `{"board": "...", "token": "..."}`.
  - It returns 200 if the score was removed. It returns 404 if the score had already gone (removed earlier, dropped out of the top 50, or expired).
  - It is rate-limited to 20 a minute.
  - The game also removes the score from the device's own board.

### 2. The public "Request removal" form (`/games/dojo-dash/remove`)
- The form takes the nickname, the game mode (career, daily, mastery, team or unsure), an optional approximate date (YYYY-MM-DD, within the last ~13 months) and an optional "I am a parent/carer" tick. It accepts no contact details or free text.
- It posts to `POST /api/dojo-dash/removal-requests`.
  - The nickname runs through the same filter as the game.
  - It has a hidden `website` honeypot. If a bot fills that in, it is told the request worked but nothing is stored.
  - It is rate-limited to 5 per 10 minutes per client.
  - Duplicate pending requests are ignored, and the queue (`dd:rq`) is capped at 200, oldest dropped first.
  - If storage isn't configured, it returns 503 and the form tells the user to email sensei.everitt@forzakarate.co.uk instead.

### 3. The admin endpoint, `/api/dojo-dash/admin/removals` (protected)
Every call needs the header `Authorization: Bearer $DD_ADMIN_TOKEN`. The endpoint is disabled (403) unless `DD_ADMIN_TOKEN` is set to 16 or more characters. Never print the token.

```bash
# list pending requests, what each would remove, and the last 50 log lines
curl -s https://<site>/api/dojo-dash/admin/removals -H "Authorization: Bearer $DD_ADMIN_TOKEN"

# dry run: what processing would remove, without changing anything
curl -s -X POST https://<site>/api/dojo-dash/admin/removals -H "Authorization: Bearer $DD_ADMIN_TOKEN" \
  -H 'Content-Type: application/json' -d '{"action":"process","dryRun":true}'

# process the queue: remove the matching entries, log them, clear the processed requests
curl -s -X POST https://<site>/api/dojo-dash/admin/removals -H "Authorization: Bearer $DD_ADMIN_TOKEN" \
  -H 'Content-Type: application/json' -d '{"action":"process"}'

# remove one nickname directly (e.g. after an email request); mode defaults to "unsure" = all boards
curl -s -X POST https://<site>/api/dojo-dash/admin/removals -H "Authorization: Bearer $DD_ADMIN_TOKEN" \
  -H 'Content-Type: application/json' -d '{"action":"remove","n":"Nickname","mode":"unsure"}'
```

**How requests are matched**
- The nickname is matched without regard to case. A team entry ("A & B") matches if either name matches, and the whole team entry is removed.
- The boards searched depend on the mode, and "unsure" searches every board.
- If a date was given, only entries saved within ±7 days of it count.
- A request with no match is still taken off the queue and logged as `no match`.

**The log** (`dd:rq:log`)
- Each line records when it was processed, the request id, the nickname, the mode, the date and the parent tick. It also lists what was removed (board, nickname, score and date), and a result of `removed` or `no match`.
- It is capped at 500 lines, and lines older than 12 months are pruned.

**Daily routine**
1. Once a day, call `GET` to see what's pending.
2. Then call `POST {"action":"process"}`.
3. Report `processed`, `removedEntries` and any `no match` results.
4. If something looks wrong, for example a request that would remove many entries, run the dry run first and check with Anthoni.

The privacy notice promises form requests will be done within 2 working days, and always within one month.

You can also delete by hand in the Upstash console. The keys are `dd:lb:<board>`, which are sorted sets of JSON entries.
