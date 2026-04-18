# 🚂 Railway Deployment — FéTok Autoposter

Automated TikTok + Instagram Reels publisher with Higgsfield cinematic videos, Soul ID character consistency, and weekly scheduling.

## Quick Deploy

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new?template=https://github.com/benjaminkernbaum-ux/fetok-autoposter&envs=MIDJOURNEY_API_KEY,HIGGSFIELD_API_KEY,ELEVENLABS_API_KEY,TIKTOK_ACCESS_TOKEN,META_ACCESS_TOKEN,WEBHOOK_URL&optionalEnvs=REPLICATE_API_TOKEN,SOUL_REF_BASE_URL,CINEMATIC_ENABLED,CINEMATIC_CRON)

## Environment Variables (Required)

### AI APIs
- **MIDJOURNEY_API_KEY** — via ImagineAPI or useapi.net wrapper
- **HIGGSFIELD_API_KEY** — Higgsfield.ai v1 account
- **ELEVENLABS_API_KEY** — ElevenLabs multilingual v2 API

### Social Media
- **TIKTOK_ACCESS_TOKEN** — TikTok Business / Login Kit (`video.upload` + `video.publish`)
- **META_ACCESS_TOKEN** — Meta Graph API (for Instagram Reels)
- **IG_BUSINESS_ACCOUNT_ID** — Instagram Business account ID

### Optional
- **WEBHOOK_URL** — Discord/Slack webhook for post notifications
- **REPLICATE_API_TOKEN** — For face similarity validation (Soul ID)
- **SOUL_REF_BASE_URL** — Public URL base for storing character reference images
- **CINEMATIC_ENABLED** — Set to `true` to activate weekly cinematic scheduler
- **CINEMATIC_CRON** — Cron schedule (default: `0 23 * * 0` = Sun 20:00 BRT)

## First Run Checklist

1. **Deploy** the branch to Railway:
   ```bash
   railway link
   railway up
   ```

2. **Set all env vars** in Railway dashboard under Variables

3. **Generate Soul IDs** (one-time, if using cinematic pipeline):
   ```bash
   railway run npm run soulid:bootstrap
   ```
   - Generates 3 anchor keyframes per character
   - Trains Higgsfield Soul ID models
   - Stores soul_id in `data/soul_registry.json`

4. **Test cinematic pipeline** (before enabling scheduler):
   ```bash
   railway run npm run cinematic:pescador --publish
   ```

5. **Enable scheduler** (optional):
   - Set `CINEMATIC_ENABLED=true`
   - Scheduler runs every Sunday 20:00 BRT by default

## File Structure

```
fetok-autoposter/
├── src/
│   ├── index.js                    # Main entry point (verse + cinematic scheduler)
│   ├── cinematicPipeline.js        # MJ → HF → ElevenLabs → merge
│   ├── cinematicScheduler.js       # Weekly cron job
│   ├── higgsfieldGenerator.js      # MJ keyframe + HF animation
│   ├── mjStyleRef.js               # Soul ID --cref/--sref builder
│   ├── higgsfieldSoulId.js         # Soul ID training/management
│   ├── soulIdValidator.js          # Face similarity check
│   ├── narrationGenerator.js       # ElevenLabs voice
│   ├── videoConcat.js              # FFmpeg merge + overlay
│   ├── tiktokPoster.js             # TikTok upload
│   ├── metaPoster.js               # IG Reels upload
│   ├── publishFinal.js             # Unified publisher
│   ├── bootstrapSoulIds.js         # Soul ID registration
│   └── [verse pipeline...]         # Existing verse gen
├── data/
│   ├── roteiros.json               # 3 cinematic scripts (27 shots total)
│   └── soul_registry.json          # Character registry
├── output/                         # Generated content
│   ├── keyframes/                  # MJ PNG outputs
│   ├── shots/                      # Higgsfield MP4 shots
│   ├── audio/                      # ElevenLabs MP3
│   ├── final/                      # Merged final MP4s
│   ├── publish_history.json        # Upload records
│   └── soul_id_history.json        # Face validation log
└── Procfile                        # Railway entry point
```

## Pipeline Flow

```
Weekly Cron (Sun 20:00 BRT)
    ↓
Pick next roteiro from cycle (Pescador → Ovelha → Ossos)
    ↓
For each of 9-10 shots:
    ├─ MJ: Generate keyframe (with Soul ID --cref/--sref)
    ├─ Replicate: Validate face similarity (optional)
    └─ HF: Animate with DoP preset + soul_id
    ↓
ElevenLabs: Narrate PT-BR (3 stability levels)
    ↓
FFmpeg: Concat shots + overlay text + mux audio
    ↓
TikTok: Upload + publish (FILE_UPLOAD flow with polling)
    ↓
IG Reels: Create media container + publish (requires SOUL_REF_BASE_URL)
    ↓
Webhook: Notify Discord/Slack with per-platform status
    ↓
Record to publish_history.json
```

## Cost Breakdown (per video)

| Component | Cost | Notes |
|-----------|------|-------|
| Midjourney | ~$0.30 | 12 keyframes |
| Higgsfield DoP | ~$2.25 | 9 shots × $0.25 std |
| ElevenLabs | ~$0.08 | ~80 tokens |
| TikTok API | $0 | Official endpoint |
| Meta Graph | $0 | Official endpoint |
| **Total** | **~$2.65** | Weekly = ~$155/mo |

Optional:
- Replicate face validation: ~$0.01–0.05/check
- Soul ID training (one-time): ~$5–10 per character

## Monitoring

- **publish_history.json** — view per-platform results
- **soul_id_history.json** — face validation logs
- Logs in Railway dashboard (realtime streaming)
- Webhook notifications (Discord/Slack)

## Troubleshooting

### MJ timeouts
- Check `MIDJOURNEY_API_KEY` + `MIDJOURNEY_ENDPOINT`
- Verify useapi.net / ImagineAPI account has balance
- Increase retry backoff in `higgsfieldGenerator.js`

### HF timeouts
- Check `HIGGSFIELD_API_KEY` + `HIGGSFIELD_ENDPOINT`
- Verify 30-second polling intervals are not network-throttled
- Check image_base64 size (<50MB)

### Soul ID not training
- Ensure 3+ anchor keyframes exist on disk before `registerSoulId()`
- Verify JPEG/PNG format (no corrupted files)
- Check Higgsfield quota

### TikTok upload 400
- Verify `TIKTOK_ACCESS_TOKEN` has `video.upload` + `video.publish` scopes
- Check video size (<100MB) and duration (<60min)
- Ensure caption ≤ 2200 chars

### IG Reels won't publish
- **Critical:** Set `SOUL_REF_BASE_URL` to a public HTTP(S) URL
- Meta must be able to fetch the MP4 from that URL
- Ensure MP4 is <100MB
- Check `IG_BUSINESS_ACCOUNT_ID` format

## Development

Clone, install, and run locally:

```bash
git clone https://github.com/benjaminkernbaum-ux/fetok-autoposter.git
cd fetok-autoposter
cp .env.example .env
# ... fill in all API keys ...
npm install
npm run cinematic:pescador          # Manual test
npm run soulid:bootstrap             # Register Soul ID (one-time)
npm start                            # Run scheduler + verse poster
```

## License

Private — FéTok project. Reach out for API access.
