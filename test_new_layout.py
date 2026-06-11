import os
import subprocess

font_serif = "C\\:/Windows/Fonts/georgiab.ttf"
font_sans = "C\\:/Windows/Fonts/arialbd.ttf"
font_heavy = "C\\:/Windows/Fonts/ariblk.ttf"

w = 1536
h = 2752

# Use a test verse
verse = "Dar-vos-ei um coração novo e porei dentro de vós um espírito novo."
ref = "Ezequiel 36\\:26"

# Wrap at max 20 characters
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

verse_wrapped = "\n".join(wrapped_lines).replace("'", "\u2019").replace(":", "\\:")
print("Wrapped lines:")
for line in wrapped_lines:
    print(f"  [{line}]")

fontsize_verse = 86
spacing_verse = 26
num_lines = len(wrapped_lines)
E_h = num_lines * fontsize_verse + (num_lines - 1) * spacing_verse

Y_verse = int((h - E_h)/2 - 120)
Y_line = Y_verse + E_h + 50
Y_ref = Y_verse + E_h + 110

filters = [
    "drawbox=x=0:y=0:w=iw:h=ih:color=black@0.35:t=fill",  # Dark overlay
    f"drawbox=x=(iw-160)/2:y={Y_line}:w=160:h=4:color=#FFD700@0.8:t=fill",  # Centered gold separator
    f"drawtext=fontfile='{font_serif}':text='{verse_wrapped}':fontcolor=white:fontsize={fontsize_verse}:x=(w-text_w)/2:y={Y_verse}:line_spacing={spacing_verse}:borderw=6:bordercolor=black@0.85",
    f"drawtext=fontfile='{font_heavy}':text='{ref}':fontcolor=#FFD700:fontsize=46:x=(w-text_w)/2:y={Y_ref}:borderw=4:bordercolor=black@0.8",
    f"drawtext=fontfile='{font_sans}':text='@luzdapalavra':fontcolor=white@0.6:fontsize=34:x=(w-text_w)/2:y=h-200:borderw=2:bordercolor=black@0.5"
]

cmd = [
    "ffmpeg", "-y", "-i", "public/images/post_06.jpg",
    "-vf", ",".join(filters),
    "-frames:v", "1", "-update", "1",
    "-q:v", "2", "public/images/test_layout.jpg"
]

res = subprocess.run(cmd, capture_output=True, text=True)
if res.returncode != 0:
    print("Error:", res.stderr)
else:
    print("Success! Generated test_layout.jpg")
