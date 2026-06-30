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
import subprocess
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
    """Add verse text overlay using FFmpeg with premium editorial layout, large readable text, and background dimming."""
    font_serif = "C\\:/Windows/Fonts/georgiab.ttf"
    font_sans = "C\\:/Windows/Fonts/arialbd.ttf"
    font_heavy = "C\\:/Windows/Fonts/ariblk.ttf"

    # Word-wrap verse at ~20 chars (ideal for large text on 9:16)
    words = verse.split()
    lines = []
    cur = ""
    for w in words:
        test = f"{cur} {w}".strip()
        if len(test) > 20:
            lines.append(cur)
            cur = w
        else:
            cur = test
    if cur:
        lines.append(cur)

    # Calculate Y positions dynamically
    fontsize_verse = 76  # Large premium size
    line_spacing = 24
    num_lines = len(lines)
    total_height = num_lines * fontsize_verse + (num_lines - 1) * line_spacing

    filters = [
        "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.35:t=fill",  # 35% Dark dimming overlay to make text pop
    ]

    # Draw each line of the verse
    for i, line in enumerate(lines):
        line_escaped = line.replace("'", "\u2019").replace(":", "\\:")
        # Y position centered with -120px offset to leave room for reference below
        y_pos = f"(h-{total_height})/2-120+{i * (fontsize_verse + line_spacing)}"
        filters.append(
            f"drawtext=fontfile='{font_serif}':text='{line_escaped}':fontcolor=white:fontsize={fontsize_verse}:x=(w-text_w)/2:y={y_pos}:borderw=6:bordercolor=black@0.9"
        )

    # Centered gold separator line below the verse text block
    y_line = f"(h+{total_height})/2-70"
    filters.append(
        f"drawbox=x=(iw-160)/2:y={y_line}:w=160:h=4:color=#FFD700@0.8:t=fill"
    )

    # Draw reference in gold below the separator
    ref_escaped = reference.replace(":", "\\:")
    y_ref = f"(h+{total_height})/2-10"
    filters.append(
        f"drawtext=fontfile='{font_heavy}':text='{ref_escaped}':fontcolor=#FFD700:fontsize=46:x=(w-text_w)/2:y={y_ref}:borderw=4:bordercolor=black@0.8"
    )

    # Draw watermark at the bottom
    filters.append(
        f"drawtext=fontfile='{font_sans}':text='@luzdapalavra':fontcolor=white@0.6:fontsize=34:x=(w-text_w)/2:y=h-200:borderw=2:bordercolor=black@0.5"
    )

    cmd = [
        "ffmpeg", "-y", "-i", input_path,
        "-vf", ",".join(filters),
        "-frames:v", "1", "-update", "1",
        "-q:v", "1", output_path
    ]
    
    result = subprocess.run(cmd, capture_output=True, text=True)
    return result.returncode == 0


# ═══════════════════════════════════════════════════════════
# 30 POSTS — Expanded feed with 15 new visual devotionals
# ═══════════════════════════════════════════════════════════
POSTS = [
    {"id":1, "verse":"Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem.", "ref":"Hebreus 11:1",
     "bg":"Mystical path shrouded in deep morning fog, a single warm golden lantern hanging from a wooden post illuminating the first few steps, soft divine light breaking through the mist, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":2, "verse":"Clama a mim, e responder-te-ei, e anunciar-te-ei coisas grandes e firmes que não sabes.", "ref":"Jeremias 33:3",
     "bg":"Deep majestic canyon at night under a brilliant glowing starry sky, a lone traveler standing on the edge looking up, divine golden rays of light descending from heaven, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":3, "verse":"Porque estou certo de que nem a morte, nem a vida... nos poderá separar do amor de Deus.", "ref":"Romanos 8:38-39",
     "bg":"A massive storm raging over a dark ocean, but in the center is a calm glowing island untouched by waves, illuminated by a warm heavenly light beam, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":4, "verse":"Quando passares pelas águas estarei contigo, e quando pelos rios, eles não te submergirão.", "ref":"Isaías 43:2",
     "bg":"A traveler walking safely across a rushing wild river, the water parting and calming around their feet, illuminated by a divine golden glow from above, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":5, "verse":"Ele enxugará de seus olhos toda lágrima; e não haverá mais morte, nem haverá mais pranto...", "ref":"Apocalipse 21:4",
     "bg":"An old weeping willow tree in a serene sunlit meadow, crystal clear dew drops falling from leaves like glowing diamonds, soft warm golden hour light, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":6, "verse":"Como a corça suspira pelas correntes das águas, assim, por ti, ó Deus, suspira a minha alma.", "ref":"Salmos 42:1",
     "bg":"A beautiful majestic deer drinking from a crystal clear forest stream at sunrise, divine light beams filtering through the tall ancient trees, mystical morning mist, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":7, "verse":"Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.", "ref":"Provérbios 3:6",
     "bg":"A high mountain pass with a winding stone path leading towards a bright glowing sunrise, clear blue sky, majestic mountain peaks, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":8, "verse":"Não vos inquieteis, pois, pelo dia de amanhã; porque o dia de amanhã cuidará de si mesmo.", "ref":"Mateus 6:34",
     "bg":"A serene wild field of white lilies swaying in a gentle breeze at sunset, warm orange and purple sky, peaceful atmosphere, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":9, "verse":"O Senhor, teu Deus, está no meio de ti, poderoso para salvar; ele se deleitará em ti com alegria.", "ref":"Sofonias 3:17",
     "bg":"A magnificent golden light crown hovering above a quiet, misty sanctuary valley, soft divine glow radiating peace and protection, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":10, "verse":"Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.", "ref":"Salmos 119:105",
     "bg":"A beautiful leather-bound open book on a stone altar, warm golden light glowing directly from the pages, dark atmospheric cathedral background, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":11, "verse":"E não nos cansemos de fazer o bem, porque a seu tempo ceifaremos, se não desfalecermos.", "ref":"Gálatas 6:9",
     "bg":"A single green sprout growing out of dry cracked desert earth, illuminated by a warm ray of golden sunlight, gentle morning dew on sprout, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":12, "verse":"Dá força ao cansado, e multiplica as forças ao que não tem nenhum vigor.", "ref":"Isaías 40:29",
     "bg":"An epic dry desert landscape with a massive ancient rock formation, a warm glowing golden spring of water bursting forth from the dry rock, cinematic 8k hyperrealistic, no text no watermarks"},
    {"id":13, "verse":"Perto está o Senhor dos que têm o coração quebrantado, e salva os contritos de espírito.", "ref":"Salmos 34:18",
     "bg":"A glowing golden Kintsugi bowl on a dark stone table, with bright gold filling the cracks, soft warm background light, cinematic 8k, no text no watermarks"},
    {"id":14, "verse":"Pensai nas coisas que são de cima, e não nas que são da terra.", "ref":"Colossenses 3:2",
     "bg":"Looking up through a circular opening of a dark cave to see a spectacular starry night sky with glowing nebula clouds and divine golden light rays, cinematic 8k, no text no watermarks"},
    {"id":15, "verse":"Tu conservarás em paz aquele cuja mente está firme em ti; porque ele confia em ti.", "ref":"Isaías 26:3",
     "bg":"A lone sailboat anchored in a perfectly still mirror-like lake under a breathtaking starry night sky, quiet waters, divine peace, cinematic 8k, no text no watermarks"},
    {"id":16, "verse":"Se tomar as asas da alva, se habitar nos extremos do mar, até ali a tua mão me guiará...", "ref":"Salmos 139:9-10",
     "bg":"An epic dramatic ocean view from a high cliff at sunrise, a white bird flying high over the waves towards the bright golden sun, cinematic 8k, no text no watermarks"},
    {"id":17, "verse":"Lançando sobre ele toda a vossa ansiedade, porque ele tem cuidado de vós.", "ref":"1 Pedro 5:7",
     "bg":"A quiet serene forest clearing with autumn leaves gently falling, a soft golden mist floating near the ground, peaceful warm lighting, cinematic 8k, no text no watermarks"},
    {"id":18, "verse":"Aquietai-vos, e sabei que eu sou Deus; serei exaltado entre as nações...", "ref":"Salmos 46:10",
     "bg":"A perfectly calm mountain lake at twilight reflecting a massive snowy mountain range and a quiet starry sky, deep stillness, cinematic 8k, no text no watermarks"},
    {"id":19, "verse":"Ora, àquele que é poderoso para fazer tudo muito mais abundantemente além daquilo que pedimos...", "ref":"Efésios 3:20",
     "bg":"A spectacular waterfall cascading into a glowing turquoise pool inside a lush hidden paradise canyon, golden sunlight filtering through ferns, cinematic 8k, no text no watermarks"},
    {"id":20, "verse":"Tudo fez formoso em seu tempo; também pôs o mundo no coração deles...", "ref":"Eclesiastes 3:11",
     "bg":"A beautiful ancient stone garden gate covered in blooming white roses, leading into a sun-drenched golden orchard at sunrise, cinematic 8k, no text no watermarks"},
    {"id":21, "verse":"Porque Deus não nos deu o espírito de temor, mas de fortaleza, e de amor, e de moderação.", "ref":"2 Timóteo 1:7",
     "bg":"A burning bush on a rocky mountain side, glowing with a brilliant warm golden fire that does not consume it, dark dramatic sky, cinematic 8k, no text no watermarks"},
    {"id":22, "verse":"Elevo os meus olhos para os montes; de onde vem o meu socorro? O meu socorro vem do Senhor...", "ref":"Salmos 121:1-2",
     "bg":"A traveler looking up at a massive towering snow-covered mountain range at sunrise, warm golden light hitting the peaks, cinematic 8k, no text no watermarks"},
    {"id":23, "verse":"Vós sois a luz do mundo; não se pode esconder uma cidade edificada sobre um monte.", "ref":"Mateus 5:14",
     "bg":"A beautiful stone city on top of a high hill at night, glowing warmly with thousands of small golden lights, starry sky, cinematic 8k, no text no watermarks"},
    {"id":24, "verse":"As misericórdias do Senhor são a causa de não sermos consumidos... renovam-se cada manhã.", "ref":"Lamentações 3:22-23",
     "bg":"A peaceful green meadow covered in fresh morning dew drops glistening like diamonds in the first rays of a warm golden sunrise, cinematic 8k, no text no watermarks"},
    {"id":25, "verse":"Mas a vereda dos justos é como a luz da aurora, que vai brilhando mais e mais até ser dia perfeito.", "ref":"Provérbios 4:18",
     "bg":"A stone pathway winding through a scenic forest, starting in dark shadows and ending in a brilliant sunlit clearing at dawn, cinematic 8k, no text no watermarks"},
    {"id":26, "verse":"Eu sou a luz do mundo; quem me segue não andará em trevas, mas terá a luz da vida.", "ref":"João 8:12",
     "bg":"A lone figure walking with a glowing golden staff on a dark pathway at night, the staff casting a warm protective bubble of light, cinematic 8k, no text no watermarks"},
    {"id":27, "verse":"Porque o Senhor Deus é um sol e escudo; o Senhor dará graça e glória; não negará bem algum...", "ref":"Salmos 84:11",
     "bg":"A large medieval knight shield made of polished steel and gold, standing in a field of wild red flowers, illuminated by a warm bright sun, cinematic 8k, no text no watermarks"},
    {"id":28, "verse":"Bendito o homem que confia no Senhor, e cuja esperança é o Senhor.", "ref":"Jeremias 17:7",
     "bg":"A majestic green tree with deep roots growing next to a flowing river, vibrant leaves, bright warm summer sun, cinematic 8k, no text no watermarks"},
    {"id":29, "verse":"Ora o Deus de esperança vos encha de todo o gozo e paz em crença, para que abundeis em esperança...", "ref":"Romanos 15:13",
     "bg":"A quiet ancient stone chapel interior with colorful stained glass windows casting warm glowing light patterns onto the stone floor, peaceful, cinematic 8k, no text no watermarks"},
    {"id":30, "verse":"Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará.", "ref":"Salmos 91:1-2",
     "bg":"A hidden cozy cave sanctuary during a heavy storm outside, a warm golden fire crackling inside, casting peaceful shadows on the cave walls, cinematic 8k, no text no watermarks"}
]



def main():
    print("=" * 60)
    print("✝ LUZ DA PALAVRA — Image Posts v2")
    print(f"  {len(POSTS)} posts | Fal.ai Flux Pro")
    print("=" * 60)

    results = []
    for p in POSTS:
        pid = p["id"]
        final = OUTPUT_DIR / f"post_{pid:02d}.jpg"

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
        raw = OUTPUT_DIR / f"raw_{pid:02d}.jpg"
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
            "image": f"/images/post_{p['id']:02d}.jpg",
            "caption": f"✨ {p['verse']}\n\n📖 {p['ref']}\n\n❤️ Curta se crê\n📲 SALVA pra lembrar\n🔄 Compartilhe\n🔔 Siga @luzdapalavra\n\n#jesus #deus #fé #cristao #biblia #evangelho #fyp #viral\n\n🎬 @luzdapalavra"
        })
    (DATA_DIR / "posts.json").write_text(json.dumps({"posts": captions}, indent=2, ensure_ascii=False), encoding="utf-8")

    print(f"\n{'=' * 60}")
    print(f"✅ {len(results)}/{len(POSTS)} posts | ~${len(results)*0.03:.2f}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    main()
