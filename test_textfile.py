import os
import httpx
import subprocess
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()
FAL_KEY = os.getenv("FAL_KEY", "")
FAL_BASE = "https://queue.fal.run"

font_serif = "C\\:/Windows/Fonts/georgiab.ttf"
font_sans = "C\\:/Windows/Fonts/arialbd.ttf"
font_heavy = "C\\:/Windows/Fonts/ariblk.ttf"

w = 1536
h = 2752

def fal_headers():
    return {"Authorization": f"Key {FAL_KEY}", "Content-Type": "application/json"}

def fal_generate(prompt, model="fal-ai/flux-pro/v1.1-ultra"):
    payload = {"prompt": prompt, "aspect_ratio": "9:16", "safety_tolerance": 6}
    r = httpx.post(f"{FAL_BASE}/{model}", headers=fal_headers(), json=payload, timeout=15)
    r.raise_for_status()
    data = r.json()
    request_id = data.get("request_id")
    if not request_id:
        imgs = data.get("images", [])
        return imgs[0]["url"] if isinstance(imgs[0], dict) else imgs[0]
    
    status_url = data.get("status_url", f"{FAL_BASE}/{model}/requests/{request_id}/status")
    result_url = data.get("response_url", f"{FAL_BASE}/{model}/requests/{request_id}")
    
    import time
    for i in range(40):
        time.sleep(3)
        sr = httpx.get(status_url, headers=fal_headers(), timeout=10)
        sd = sr.json()
        status = sd.get("status", "")
        if status == "COMPLETED":
            rr = httpx.get(result_url, headers=fal_headers(), timeout=15)
            rd = rr.json()
            imgs = rd.get("images", [])
            return imgs[0]["url"] if isinstance(imgs[0], dict) else imgs[0]
        if status in ("FAILED", "ERROR"):
            return None
    return None

# Wrap at max 20 characters
verse = "Dar-vos-ei um coração novo e porei dentro de vós um espírito novo."
ref = "Ezequiel 36\\:26"

words = verse.split()
wrapped_lines = []
current_line = ""
for word in words:
    test = f"{current_line} {word}".strip()
    if len(test) > 20:
        wrapped_lines.append(current_line)
        current_line = word
    else:
        current_line = test
if current_line:
    wrapped_lines.append(current_line)

verse_wrapped = "\n".join(wrapped_lines)

# Write to a temp text file with newline="\n" to fix the glyph boxes
text_file = "temp_verse.txt"
with open(text_file, "w", encoding="utf-8", newline="\n") as f:
    f.write(verse_wrapped)

fontsize_verse = 86
spacing_verse = 26
num_lines = len(wrapped_lines)
E_h = num_lines * fontsize_verse + (num_lines - 1) * spacing_verse

Y_verse = int((h - E_h)/2 - 120)
Y_line = Y_verse + E_h + 50
Y_ref = Y_verse + E_h + 110

filters = [
    "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.15:t=fill",  # Light dark overlay
    f"drawbox=x=(iw-160)/2:y={Y_line}:w=160:h=4:color=#FFD700@0.8:t=fill",  # Centered gold separator
    f"drawtext=fontfile='{font_serif}':textfile='{text_file}':fontcolor=white:fontsize={fontsize_verse}:x=(w-text_w)/2:y={Y_verse}:line_spacing={spacing_verse}:borderw=6:bordercolor=black@0.85",
    f"drawtext=fontfile='{font_heavy}':text='{ref}':fontcolor=#FFD700:fontsize=46:x=(w-text_w)/2:y={Y_ref}:borderw=4:bordercolor=black@0.8",
    f"drawtext=fontfile='{font_sans}':text='@luzdapalavra':fontcolor=white@0.6:fontsize=34:x=(w-text_w)/2:y=h-200:borderw=2:bordercolor=black@0.5"
]

print("Generating raw background...")
bg_prompt = "Stunning stained glass window in gothic cathedral with vibrant reds golds blues, divine golden light streaming through, red roses on stone altar, cinematic 8k hyperrealistic, no text no watermarks"
url = fal_generate(bg_prompt)
if not url:
    print("Failed to generate bg from Fal")
    exit(1)

print("Downloading background...")
img_data = httpx.get(url).content
temp_raw = Path("public/images/temp_raw_06.png")
temp_raw.write_bytes(img_data)

print("Applying overlay...")
cmd = [
    "ffmpeg", "-y", "-i", str(temp_raw),
    "-vf", ",".join(filters),
    "-frames:v", "1", "-update", "1",
    "-q:v", "2", "public/images/test_layout_clean_vibrant.jpg"
]

res = subprocess.run(cmd, capture_output=True, text=True)
if temp_raw.exists():
    temp_raw.unlink()
if os.path.exists(text_file):
    os.remove(text_file)

if res.returncode != 0:
    print("Error:", res.stderr)
else:
    print("Success! Generated test_layout_clean.jpg")
