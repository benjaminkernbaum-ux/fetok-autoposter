#!/usr/bin/env python3
"""
╔═══════════════════════════════════════════════════════════╗
║  LUZ DA PALAVRA — Video Posts Generator v1                ║
║  Transforms static image posts into 20s TikTok videos     ║
║  with narration (ElevenLabs), Ken Burns, and ambient music ║
╚═══════════════════════════════════════════════════════════╝
"""
import os
import sys
import json
import time
import subprocess
from pathlib import Path

import httpx

# ═══════════════════════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════════════════════
def load_env():
    """Manually load .env file to avoid external dependency issues."""
    for path in [Path(".env"), Path("C:/Users/benja/LuzDaPalavra/stoic-factory/.env")]:
        if path.exists():
            try:
                for line in path.read_text(encoding="utf-8").splitlines():
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ[k.strip()] = v.strip()
            except Exception as e:
                print(f"⚠️ Failed to load env from {path}: {e}")

load_env()

ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")
ELEVENLABS_VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID", "GIuLCSVfgJaUuh7hYOY8")
ELEVENLABS_MODEL = os.environ.get("ELEVENLABS_MODEL", "eleven_multilingual_v2")

IMAGE_DIR = Path("public/images")
AUDIO_DIR = Path("cache/audio")
VIDEO_DIR = Path("public/videos")
MUSIC_DIR = Path("assets/music")
DATA_DIR = Path("data")

AUDIO_DIR.mkdir(parents=True, exist_ok=True)
VIDEO_DIR.mkdir(parents=True, exist_ok=True)
MUSIC_DIR.mkdir(parents=True, exist_ok=True)

# FFmpeg fonts
FONT_SERIF = "C\\:/Windows/Fonts/georgiab.ttf"
FONT_HEAVY = "C\\:/Windows/Fonts/ariblk.ttf"
FONT_SANS = "C\\:/Windows/Fonts/arialbd.ttf"

# Verse data (same as generate_posts.py)
POSTS = [
    {"id":1, "verse":"Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem.", "ref":"Hebreus 11:1"},
    {"id":2, "verse":"Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes que não sabes.", "ref":"Jeremias 33:3"},
    {"id":3, "verse":"Porque estou certo de que nem a morte, nem a vida... nos poderá separar do amor de Deus.", "ref":"Romanos 8:38-39"},
    {"id":4, "verse":"Quando passares pelas águas estarei contigo, e quando pelos rios, eles não te submergirão.", "ref":"Isaías 43:2"},
    {"id":5, "verse":"Ele enxugará de seus olhos toda lágrima; e não haverá mais morte, nem haverá mais pranto...", "ref":"Apocalipse 21:4"},
    {"id":6, "verse":"Como a corça suspira pelas correntes das águas, assim, por ti, ó Deus, suspira a minha alma.", "ref":"Salmos 42:1"},
    {"id":7, "verse":"Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.", "ref":"Provérbios 3:6"},
    {"id":8, "verse":"Não vos inquieteis, pois, pelo dia de amanhã; porque o dia de amanhã cuidará de si mesmo.", "ref":"Mateus 6:34"},
    {"id":9, "verse":"O Senhor, teu Deus, está no meio de ti, poderoso para salvar; ele se deleitará em ti com alegria.", "ref":"Sofonias 3:17"},
    {"id":10, "verse":"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.", "ref":"Salmos 119:105"},
    {"id":11, "verse":"E não nos cansemos de fazer o bem, porque a seu tempo ceifaremos, se não desfalecermos.", "ref":"Gálatas 6:9"},
    {"id":12, "verse":"Dá força ao cansado, e multiplica as forças ao que não tem nenhum vigor.", "ref":"Isaías 40:29"},
    {"id":13, "verse":"Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.", "ref":"Salmos 34:18"},
    {"id":14, "verse":"Pensai nas coisas que são de cima, e não nas que são da terra.", "ref":"Colossenses 3:2"},
    {"id":15, "verse":"Tu conservarás em paz aquele cuja mente está firme em ti; porque ele confia em ti.", "ref":"Isaías 26:3"},
    {"id":16, "verse":"Se tomar as asas da alva, se habitar nos extremos do mar, até ali a tua mão me guiará...", "ref":"Salmos 139:9-10"},
    {"id":17, "verse":"Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", "ref":"1 Pedro 5:7"},
    {"id":18, "verse":"Aquietai-vos, e sabei que eu sou Deus; serei exaltado entre as nações...", "ref":"Salmos 46:10"},
    {"id":19, "verse":"Ora, àquele que é poderoso para fazer tudo muito mais abundantemente além daquilo que pedimos...", "ref":"Efésios 3:20"},
    {"id":20, "verse":"Tudo fez formoso em seu tempo; também pôs o mundo no coração deles...", "ref":"Eclesiastes 3:11"},
    {"id":21, "verse":"Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.", "ref":"2 Timóteo 1:7"},
    {"id":22, "verse":"Elevo os meus olhos para os montes; de onde vem o meu socorro? O meu socorro vem do Senhor...", "ref":"Salmos 121:1-2"},
    {"id":23, "verse":"Vós sois a luz do mundo; não se pode esconder uma cidade edificada sobre um monte.", "ref":"Mateus 5:14"},
    {"id":24, "verse":"As misericórdias do Senhor são a causa de não sermos consumidos... renovam-se cada manhã.", "ref":"Lamentações 3:22-23"},
    {"id":25, "verse":"Mas a vereda dos justos é como a luz da aurora, que vai brilhando mais e mais até ser dia perfeito.", "ref":"Provérbios 4:18"},
    {"id":26, "verse":"Eu sou a luz do mundo; quem me segue não andará em trevas, mas terá a luz da vida.", "ref":"João 8:12"},
    {"id":27, "verse":"Porque o Senhor Deus é um sol e escudo; o Senhor dará graça e glória; não negará bem algum...", "ref":"Salmos 84:11"},
    {"id":28, "verse":"Bendito o homem que confia no Senhor, e cuja esperança é o Senhor.", "ref":"Jeremias 17:7"},
    {"id":29, "verse":"Ora o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança...", "ref":"Romanos 15:13"},
    {"id":30, "verse":"Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.", "ref":"Salmos 91:1-2"},
]


# ═══════════════════════════════════════════════════════════
# PHASE 1: ELEVENLABS NARRATION
# ═══════════════════════════════════════════════════════════
def generate_narration(post_id, text, reference):
    """Generate PT-BR narration via ElevenLabs API. Caches result."""
    audio_path = AUDIO_DIR / f"post_{post_id:02d}_narration.mp3"
    if audio_path.exists() and audio_path.stat().st_size > 1000:
        print(f"  🔄 Cached narration ({audio_path.stat().st_size // 1024} KB)")
        return audio_path

    # Build narration script: dramatic pause structure
    narration = f"{text} ... {reference}."

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{ELEVENLABS_VOICE_ID}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg"
    }
    payload = {
        "text": narration,
        "model_id": ELEVENLABS_MODEL,
        "voice_settings": {
            "stability": 0.35,
            "similarity_boost": 0.85,
            "style": 0.75,
            "use_speaker_boost": True
        }
    }

    try:
        resp = httpx.post(url, json=payload, headers=headers, timeout=60)
        if resp.status_code == 200:
            audio_path.write_bytes(resp.content)
            print(f"  🎙️ Narration: {len(resp.content) // 1024} KB")
            return audio_path
        else:
            print(f"  ❌ ElevenLabs error {resp.status_code}: {resp.text[:200]}")
            return None
    except Exception as e:
        print(f"  ❌ ElevenLabs exception: {e}")
        return None


# ═══════════════════════════════════════════════════════════
# PHASE 2: GET AUDIO DURATION
# ═══════════════════════════════════════════════════════════
def get_audio_duration(audio_path):
    """Get audio duration in seconds using ffprobe."""
    cmd = [
        "ffprobe", "-v", "error",
        "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1",
        str(audio_path)
    ]
    result = subprocess.run(cmd, capture_output=True, text=True)
    try:
        return float(result.stdout.strip())
    except:
        return 15.0  # fallback


# ═══════════════════════════════════════════════════════════
# PHASE 3: BUILD VIDEO WITH FFMPEG
# ═══════════════════════════════════════════════════════════
def build_video(post_id, verse, reference, image_path, audio_path, music_path=None):
    """Build a cinematic TikTok video using Ken Burns + narration + text overlay + music."""
    output_path = VIDEO_DIR / f"video_{post_id:02d}.mp4"

    # Get narration duration and add padding (2s intro + 3s outro)
    narration_duration = get_audio_duration(audio_path)
    total_duration = narration_duration + 5.0  # 2s intro silence + 3s outro
    intro_delay = 2.0  # seconds of silence before narration starts

    # Word-wrap verse at ~18 chars for large text
    words = verse.split()
    lines = []
    cur = ""
    for w in words:
        test = f"{cur} {w}".strip()
        if len(test) > 18:
            lines.append(cur)
            cur = w
        else:
            cur = test
    if cur:
        lines.append(cur)

    fontsize_verse = 76
    line_spacing = 24
    num_lines = len(lines)
    total_height = num_lines * fontsize_verse + (num_lines - 1) * line_spacing

    # ── Build complex filter graph ──
    # Ken Burns: slow zoom from 110% to 130% over duration (dramatic push-in)
    zoom_start = 1.1
    zoom_end = 1.3
    # zoompan: z = zoom_start + (zoom_end - zoom_start) * (on / (total_frames))
    fps = 30
    total_frames = int(total_duration * fps)

    filter_parts = []

    # Input 0: Image → zoompan (Ken Burns slow push-in)
    filter_parts.append(
        f"[0:v]scale=8000:-1,zoompan=z='min({zoom_start}+({zoom_end}-{zoom_start})*on/{total_frames}\\,{zoom_end})':"
        f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d={total_frames}:s=1080x1920:fps={fps}[kenburns]"
    )

    # Overlay filters (since image already has text overlay burnt-in)
    filters_overlay = []

    # CTA — appears near end
    cta_appear = total_duration - 4.0
    filters_overlay.append(
        f"drawtext=fontfile='{FONT_SANS}':text='SALVA e COMPARTILHA':"
        f"fontcolor=white:fontsize=36:"
        f"x=(w-text_w)/2:y=h-280:borderw=3:bordercolor=black@0.8:"
        f"enable='gte(t\\,{cta_appear:.2f})'"
    )

    # Film grain
    filters_overlay.append("noise=alls=6:allf=t")

    # Combine kenburns → overlay filters
    filter_parts.append(f"[kenburns]{','.join(filters_overlay)}[video]")

    # Audio: delay narration by intro_delay, then pad to total_duration
    filter_parts.append(
        f"[1:a]adelay={int(intro_delay * 1000)}|{int(intro_delay * 1000)},apad=whole_dur={total_duration},"
        f"afade=t=in:st=0:d=0.5,afade=t=out:st={total_duration - 1.5}:d=1.5[narration]"
    )

    # If music exists, mix it at low volume
    if music_path and Path(music_path).exists():
        filter_parts.append(
            f"[2:a]aloop=loop=-1:size=2e+09,atrim=duration={total_duration},"
            f"volume=0.12,afade=t=in:st=0:d=3,afade=t=out:st={total_duration - 3}:d=3[bgmusic]"
        )
        filter_parts.append(
            "[narration][bgmusic]amix=inputs=2:duration=first:dropout_transition=2[audio]"
        )
        audio_map = "[audio]"
    else:
        audio_map = "[narration]"

    filter_complex = ";".join(filter_parts)

    cmd = [
        "ffmpeg", "-y",
        "-loop", "1", "-i", str(image_path),  # input 0: image
        "-i", str(audio_path),                  # input 1: narration
    ]

    if music_path and Path(music_path).exists():
        cmd.extend(["-i", str(music_path)])     # input 2: background music

    cmd.extend([
        "-filter_complex", filter_complex,
        "-map", "[video]",
        "-map", audio_map,
        "-c:v", "libx264", "-preset", "superfast", "-crf", "22",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(total_duration),
        "-pix_fmt", "yuv420p",
        "-movflags", "+faststart",
        str(output_path)
    ])

    print(f"  🎬 Building video ({total_duration:.1f}s)...")
    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0 and output_path.exists():
        size_mb = output_path.stat().st_size / (1024 * 1024)
        print(f"  ✅ Video ready! ({size_mb:.1f} MB)")
        return output_path
    else:
        print(f"  ❌ FFmpeg error: {result.stderr[-500:]}")
        return None


# ═══════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════
def main():
    print("=" * 60)
    print("✝ LUZ DA PALAVRA — Video Posts Generator v1")
    print(f"  {len(POSTS)} videos | ElevenLabs + Ken Burns + FFmpeg")
    print("=" * 60)

    # Check for background music
    music_file = None
    music_candidates = list(MUSIC_DIR.glob("*.mp3")) + list(MUSIC_DIR.glob("*.m4a"))
    if music_candidates:
        music_file = str(music_candidates[0])
        print(f"\n🎵 Background music: {music_candidates[0].name}")
    else:
        print(f"\n⚠️ No background music in {MUSIC_DIR}/ — videos will have narration only")

    results = []
    cost = 0.0

    for idx, p in enumerate(POSTS):
        pid = p["id"]
        print(f"\n🎬 [{idx+1}/{len(POSTS)}] {p['ref']}")
        print(f"  📝 {p['verse'][:60]}...")

        # Check image exists
        image_path = IMAGE_DIR / f"post_{pid:02d}.jpg"
        if not image_path.exists():
            # Try raw image
            raw_path = IMAGE_DIR / f"raw_{pid:02d}.jpg"
            if raw_path.exists():
                image_path = raw_path
            else:
                print(f"  ❌ No image found, skipping")
                continue

        # Check if video already exists and skip if it does
        output_path = VIDEO_DIR / f"video_{pid:02d}.mp4"
        if output_path.exists() and output_path.stat().st_size > 1000000:
            print(f"  🔄 Video already exists, skipping build.")
            results.append(p)
            continue

        # Phase 1: Generate narration
        audio_path = generate_narration(pid, p["verse"], p["ref"])
        if not audio_path:
            print(f"  ❌ Narration failed, skipping")
            continue
        cost += 0.01  # ElevenLabs cost

        # Phase 2: Build video
        video_path = build_video(pid, p["verse"], p["ref"], image_path, audio_path, music_file)
        if video_path:
            results.append(p)
        
        # Small delay to avoid API rate limits
        time.sleep(0.5)

    # Save video metadata
    video_meta = []
    for p in results:
        video_meta.append({
            "id": p["id"],
            "title": p["verse"],
            "reference": p["ref"],
            "video": f"/videos/video_{p['id']:02d}.mp4",
            "image": f"/images/post_{p['id']:02d}.jpg",
            "caption": f"✨ {p['verse']}\n\n📖 {p['ref']}\n\n❤️ Salva se crê\n📲 Compartilha com alguém\n🔔 Siga @luzdapalavra\n\n#jesus #deus #fé #cristao #biblia #evangelho #fyp #viral #versiculododia\n\n🎬 @luzdapalavra"
        })
    (DATA_DIR / "videos.json").write_text(
        json.dumps({"videos": video_meta}, indent=2, ensure_ascii=False),
        encoding="utf-8"
    )

    print(f"\n{'=' * 60}")
    print(f"✅ {len(results)}/{len(POSTS)} videos | ~${cost:.2f} narration")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
