# Cinematic Pipeline — viral PT-BR biblical TikToks

End-to-end pipeline: roteiro JSON → per-line PT-BR narration → cinematic stills → animated shots (Ken Burns) → crossfade composite → burned-in word-highlighted captions → ducked ambient score → 1080×1920 H.264 ready for TikTok upload.

## Architecture

```
roteiro.json (8-shot story, hook→payoff)
        │
        ▼
narrationGenerator.js    (ElevenLabs PT-BR, per-line MP3 + duration probe)
        │
        ▼
imageGenerator.js        (FAL flux-pro, character-locked, cinematic prompts)
        │
        ▼
videoComposer.js         (Ken Burns + xfade + captions + audio mix + fades)
        │
        ▼
cinematicPipeline.js     (orchestrator, retries, manifest, idempotent)
        │
        ▼
output/<slug>_<ts>.mp4   (1080×1920 H.264 AAC, 30fps, ready to upload)
```

## Env vars

```
ELEVEN_API_KEY=...
ELEVEN_VOICE_ID=...           # PT-BR voice (e.g. Antônio, Adam multilingual)
FAL_KEY=...                   # FAL.ai for image generation
MUSIC_DIR=./assets/music      # optional ambient pads (.mp3/.wav)
FONT_PATH=./assets/fonts/Inter-Black.ttf
```

## Usage

```bash
node src/cinematic/runShow.js jonas
node src/cinematic/runShow.js davi_e_golias --no-cache
```

## What makes it viral (vs the v1/v2/v3 attempts)

| Old                          | New                                                |
| ---------------------------- | -------------------------------------------------- |
| One audio dump over shots    | Per-line audio, shot duration = narration duration |
| English voice                | PT-BR voice, stability 0.32 + style 0.65           |
| Static images                | Ken Burns zoom-in/out per shot                     |
| Hard cuts                    | 0.6s xfade + 0.4s audio crossfade                  |
| No captions                  | Word-by-word burned-in (TikTok-style)              |
| Random ending                | Hook bookend + CTA shot ("comenta AMÉM")           |
| Inconsistent characters      | Character lock token in every prompt               |
| No music                     | Ambient pad ducked -18dB under narration           |
