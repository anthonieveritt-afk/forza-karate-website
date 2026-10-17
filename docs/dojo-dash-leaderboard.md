# Dojo Dash shared leaderboard

API: `app/api/dojo-dash/scores/route.ts` (GET `?board=`, POST, admin DELETE). Nickname filter: `lib/dojo-dash/nickfilter.js`, a verbatim copy of the game's NF. Keep the two in sync.

## Stored per entry
`n` nickname (filtered, max 12 chars, two on the team board), `s` score, `t` time, `b` belt index, `m` mastery level (optional), `d` date. The board key is the mode. There's no IP, location, user agent or real name.

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
2. Optionally add the env vars `DD_RATE_SALT` (a random string) and `DD_ADMIN_TOKEN` (a random string; it turns on the removal endpoint).
3. Redeploy the preview and test it. Then merge.

## Removing an entry (privacy request)
```
curl -X DELETE https://<site>/api/dojo-dash/scores -H "Authorization: Bearer $DD_ADMIN_TOKEN" -H 'Content-Type: application/json' -d '{"n":"Nickname"}'
```
This removes every entry with that nickname, including team entries, from all boards. You can also delete it by hand in the Upstash console: the keys are `dd:lb:<board>`.
