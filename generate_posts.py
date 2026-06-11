"""
═══════════════════════════════════════════════════════════
 LUZ DA PALAVRA — Image Post Generator v2
 Uses proven fal_subscribe pattern from stoic-factory
═══════════════════════════════════════════════════════════
"""
import httpx
import json
import os
import time
import sys
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
FAL_KEY = os.getenv("FAL_KEY", "")
FAL_BASE = "https://queue.fal.run"
OUTPUT_DIR = Path("public/images")
DATA_DIR = Path("data")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
DATA_DIR.mkdir(parents=True, exist_ok=True)


def fal_headers():
    return {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}


def fal_generate(prompt, model="fal-ai/flux-pro/v1.1-ultra"):
    """Submit to Fal queue, poll using returned URLs, return image URL."""
    # Submit
    payload = {"prompt": prompt, "aspect_ratio": "9:16", "safety_tolerance": 6}
    if "flux/dev" in model:
        payload = {"prompt": prompt, "image_size": {"width": 768, "height": 1344}, "num_images": 1}

    try:
        r = httpx.post(f"{FAL_BASE}/{model}", headers=fal_headers(), json=payload, timeout=15)
        if r.status_code == 403:
            print(f"  ⚠️  {model} 403, trying flux/dev...")
            return fal_generate(prompt, "fal-ai/flux/dev")
        r.raise_for_status()
        data = r.json()
    except Exception as e:
        print(f"  ❌ Submit error: {e}")
        return None

    request_id = data.get("request_id")
    if not request_id:
        # Direct result
        imgs = data.get("images", [])
        if imgs:
            return imgs[0]["url"] if isinstance(imgs[0], dict) else imgs[0]
        return None

    # Use URLs returned by Fal (critical!)
    status_url = data.get("status_url", f"{FAL_BASE}/{model}/requests/{request_id}/status")
    result_url = data.get("response_url", f"{FAL_BASE}/{model}/requests/{request_id}")
    print(f"  ⏳ Request: {request_id[:16]}...")

    # Poll
    for i in range(120):
        time.sleep(3)
        try:
            sr = httpx.get(status_url, headers=fal_headers(), timeout=10)
            sd = sr.json()
            status = sd.get("status", "")

            if status == "COMPLETED":
                rr = httpx.get(result_url, headers=fal_headers(), timeout=15)
                rd = rr.json()
                imgs = rd.get("images", [])
                if imgs:
                    url = imgs[0]["url"] if isinstance(imgs[0], dict) else imgs[0]
                    print(f"  ✅ Image generated!")
                    return url
                print(f"  ❌ No images in result")
                return None

            if status in ("FAILED", "ERROR"):
                print(f"  ❌ Failed: {sd.get('error', '')}")
                return None

            if (i + 1) % 10 == 0:
                print(f"  ⏳ Poll {i+1}...")
        except Exception as e:
            if (i + 1) % 10 == 0:
                print(f"  ⚠️  Poll {i+1}: {e}")

    print(f"  ❌ Timeout")
    return None


def add_overlay(input_path, output_path, verse, reference):
    """Add verse text overlay using FFmpeg."""
    font = "C\\\\:/Windows/Fonts/arialbd.ttf"

    # Word-wrap verse at ~28 chars
    words = verse.split()
    lines = []
    cur = ""
    for w in words:
        test = f"{cur} {w}".strip()
        if len(test) > 28:
            lines.append(cur)
            cur = w
        else:
            cur = test
    if cur:
        lines.append(cur)

    verse_escaped = "\\n".join(lines).replace("'", "\u2019").replace(":", "\\:")
    ref_escaped = reference.replace(":", "\\:")

    filters = [
        "curves=master='0/0 0.25/0.15 0.7/0.55 1/0.85'",
        f"drawtext=fontfile='{font}':text='{verse_escaped}':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=(h-text_h)/2-40:line_spacing=14:borderw=3:bordercolor=black@0.7",
        f"drawtext=fontfile='{font}':text='{ref_escaped}':fontcolor=#FFD700:fontsize=26:x=(w-text_w)/2:y=(h/2)+100:borderw=2:bordercolor=black@0.5",
        f"drawtext=fontfile='{font}':text='@luzdapalavra':fontcolor=white@0.5:fontsize=18:x=(w-text_w)/2:y=h-100:borderw=1:bordercolor=black@0.3",
    ]

    cmd = f'ffmpeg -y -i "{input_path}" -vf "{",".join(filters)}" -q:v 1 "{output_path}" 2>nul'
    ret = os.system(cmd)
    return ret == 0


# ═══════════════════════════════════════════════════════════
# 15 POSTS — Same style as the successful TikTok prints
# ═══════════════════════════════════════════════════════════
POSTS = [
    {"id":1, "verse":"Porque todas as promessas de Deus são nEle sim, e por Ele o amém.", "ref":"2 Coríntios 1:20",
     "bg":"Majestic golden throne room of heaven with ornate pillars and warm divine golden light rays, red roses on marble floor, celestial, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":2, "verse":"A visão é ainda para o tempo determinado; se tardar, espera-o, porque certamente virá.", "ref":"Habacuque 2:3",
     "bg":"Stunning golden hourglass with glowing sand on ancient wooden table, warm candlelight, golden bokeh particles, dark dramatic background, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":3, "verse":"Eu sei os planos que tenho para vocês: planos de paz e não de mal, para dar-vos futuro e esperança.", "ref":"Jeremias 29:11",
     "bg":"Golden wheat field at sunset with dramatic starry sky and Milky Way, warm light flooding landscape, path to mountains, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":4, "verse":"Quando eu tiver medo, confiarei em ti.", "ref":"Salmos 56:3",
     "bg":"Majestic night sky with aurora borealis over calm reflective lake surrounded by mountains, golden moonlight on water, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":5, "verse":"Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento.", "ref":"Provérbios 3:5",
     "bg":"Ancient stone temple interior lit by hundreds of golden candles, ornate arches and columns, divine atmosphere, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":6, "verse":"Dar-vos-ei um coração novo e porei dentro de vós um espírito novo.", "ref":"Ezequiel 36:26",
     "bg":"Stunning stained glass window in gothic cathedral with vibrant reds golds blues, divine golden light streaming through, red roses on stone altar, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":7, "verse":"Não se amoldem ao padrão deste mundo, mas transformem-se pela renovação da mente.", "ref":"Romanos 12:2",
     "bg":"Ancient tree of life with golden glowing leaves in mystical forest, divine light through canopy, floating golden particles, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":8, "verse":"Eis que faço coisa nova; não a conhecereis? Porei um caminho no deserto e rios no ermo.", "ref":"Isaías 43:19",
     "bg":"Dramatic red rock canyon with crystal river at golden hour, sunlight golden rays between canyon walls, desert oasis, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":9, "verse":"Fiel é o que vos chama, o qual também o fará.", "ref":"1 Tessalonicenses 5:24",
     "bg":"Spectacular golden sunrise over ancient biblical hilltop city, olive trees, dramatic gold and orange clouds, sacred atmosphere, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":10, "verse":"Deus não é homem para que minta, nem filho de homem para que se arrependa.", "ref":"Números 23:19",
     "bg":"Majestic ancient stone fortress on cliff edge overlooking vast ocean at sunset, golden light on walls, storm clouds parting to reveal divine rays, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":11, "verse":"Tudo posso naquele que me fortalece.", "ref":"Filipenses 4:13",
     "bg":"Epic mountain peak at sunrise with lone figure at summit arms raised, golden sky, dramatic clouds below, divine golden light rays from heaven, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":12, "verse":"O Senhor é o meu pastor e nada me faltará.", "ref":"Salmos 23:1",
     "bg":"Peaceful green valley with gentle stream at golden hour, sheep on hillside, golden sunlight through ancient olive trees, pastoral biblical landscape, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":13, "verse":"Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.", "ref":"Isaías 41:10",
     "bg":"Warm golden fire floating above open hand in dark forest at night, divine warmth radiating, golden sparks floating upward, spiritual moment, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":14, "verse":"Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito.", "ref":"João 3:16",
     "bg":"Dramatic wooden cross on hilltop silhouetted against spectacular golden crimson sunset, divine light rays from behind cross, sacred powerful, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":15, "verse":"Sede fortes e corajosos, pois o Senhor vosso Deus está convosco.", "ref":"Josué 1:9",
     "bg":"Ancient warrior shield and sword against stone wall in golden torchlight, battle-worn but unbroken, divine golden light, biblical warrior atmosphere, cinematic 8k hyperrealistic, no text no watermarks"},
]


def main():
    print("=" * 60)
    print("✝ LUZ DA PALAVRA — Image Posts v2")
    print(f"  {len(POSTS)} posts | Fal.ai Flux Pro")
    print("=" * 60)

    results = []
    for p in POSTS:
        pid = p["id"]
        final = OUTPUT_DIR / f"post_{pid:02d}.png"

        if final.exists():
            print(f"\n♻️  [{pid}] Already exists")
            results.append(p)
            continue

        print(f"\n🎨 [{pid}/{len(POSTS)}] {p['ref']}")
        print(f"  📝 {p['verse'][:50]}...")

        url = fal_generate(p["bg"])
        if not url:
            print(f"  ❌ Skip post {pid}")
            continue

        # Download raw
        raw = OUTPUT_DIR / f"raw_{pid:02d}.png"
        try:
            img = httpx.get(url, timeout=60).content
            raw.write_bytes(img)
            print(f"  ⬇ {len(img)//1024} KB")
        except Exception as e:
            print(f"  ❌ Download: {e}")
            continue

        # Overlay verse
        ok = add_overlay(str(raw), str(final), p["verse"], p["ref"])
        if ok and final.exists():
            print(f"  ✅ Post {pid} ready!")
            results.append(p)
            raw.unlink(missing_ok=True)
        else:
            print(f"  ❌ Overlay failed, keeping raw")
            if raw.exists():
                raw.rename(final)
                results.append(p)

    # Save posts.json
    captions = []
    for p in results:
        captions.append({
            "id": p["id"],
            "title": p["verse"],
            "reference": p["ref"],
            "image": f"/images/post_{p['id']:02d}.png",
            "caption": f"✨ {p['verse']}\n\n📖 {p['ref']}\n\n❤️ Curta se crê\n📲 SALVA pra lembrar\n🔄 Compartilhe\n🔔 Siga @luzdapalavra\n\n#jesus #deus #fé #cristao #biblia #evangelho #fyp #viral\n\n🎬 @luzdapalavra"
        })
    (DATA_DIR / "posts.json").write_text(json.dumps({"posts": captions}, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\n{'=' * 60}")
    print(f"✅ {len(results)}/{len(POSTS)} posts | ~${len(results)*0.03:.2f}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
