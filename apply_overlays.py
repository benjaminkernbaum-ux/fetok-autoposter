"""
Apply verse overlays to all 15 raw background images.
"""
import os
import json
import subprocess
from pathlib import Path

IMG_DIR = Path("public/images")

POSTS = [
    {"id":1, "verse":"Porque todas as\npromessas de Deus\nsão nEle sim,\ne por Ele o amém.", "ref":"2 Coríntios 1\\:20"},
    {"id":2, "verse":"A visão é ainda\npara o tempo\ndeterminado; se\ntardar, espera-o,\nporque certamente\nvirá.", "ref":"Habacuque 2\\:3"},
    {"id":3, "verse":"Eu sei os planos que\ntenho para vocês;\nplanos de paz e não\nde mal, para dar-vos\nfuturo e esperança.", "ref":"Jeremias 29\\:11"},
    {"id":4, "verse":"Quando eu\ntiver medo,\nconfiarei em\nti.", "ref":"Salmos 56\\:3"},
    {"id":5, "verse":"Confia no Senhor\nde todo o teu\ncoração e não te\nestribes no teu\npróprio\nentendimento.", "ref":"Provérbios 3\\:5"},
    {"id":6, "verse":"Dar-vos-ei um\ncoração novo e\nporei dentro de\nvós um espírito\nnovo.", "ref":"Ezequiel 36\\:26"},
    {"id":7, "verse":"Não se amoldem ao\npadrão deste\nmundo, mas\ntransformem-se\npela renovação da\nmente.", "ref":"Romanos 12\\:2"},
    {"id":8, "verse":"Eis que faço coisa\nnova, e agora sairá à\nluz; não a\nconhecereis? Porei um\ncaminho no deserto\ne rios no ermo.", "ref":"Isaías 43\\:19"},
    {"id":9, "verse":"Fiel é o que\nvos chama, o\nqual também o\nfará.", "ref":"1 Tessalonicenses 5\\:24"},
    {"id":10, "verse":"Deus não é homem\npara que minta,\nnem filho de homem\npara que se\narrependa.", "ref":"Números 23\\:19"},
    {"id":11, "verse":"Tudo posso\nnaquele que me\nfortalece.", "ref":"Filipenses 4\\:13"},
    {"id":12, "verse":"O Senhor é o meu\npastor e nada\nme faltará.", "ref":"Salmos 23\\:1"},
    {"id":13, "verse":"Não temas, porque\neu sou contigo;\nnão te assombres,\nporque eu sou\no teu Deus.", "ref":"Isaías 41\\:10"},
    {"id":14, "verse":"Porque Deus amou\no mundo de tal\nmaneira que deu\no seu Filho\nunigênito.", "ref":"João 3\\:16"},
    {"id":15, "verse":"Sede fortes e\ncorajosos, pois\no Senhor vosso\nDeus está\nconvosco.", "ref":"Josué 1\\:9"},
]


def overlay(pid, verse, ref):
    src = IMG_DIR / f"post_{pid:02d}.png"
    tmp = IMG_DIR / f"overlay_{pid:02d}.png"

    if not src.exists():
        print(f"  ❌ {src} not found")
        return False

    font = "C\\:/Windows/Fonts/arialbd.ttf"

    vf = (
        f"curves=master='0/0 0.25/0.15 0.7/0.55 1/0.85',"
        f"drawtext=fontfile='{font}':text='{verse}':fontcolor=white:fontsize=42:x=(w-text_w)/2:y=(h-text_h)/2-30:line_spacing=12:borderw=3:bordercolor=black@0.7,"
        f"drawtext=fontfile='{font}':text='{ref}':fontcolor=#FFD700:fontsize=26:x=(w-text_w)/2:y=(h/2)+120:borderw=2:bordercolor=black@0.5,"
        f"drawtext=fontfile='{font}':text='@luzdapalavra':fontcolor=white@0.5:fontsize=18:x=(w-text_w)/2:y=h-80:borderw=1:bordercolor=black@0.3"
    )

    cmd = [
        "ffmpeg", "-y", "-i", str(src),
        "-vf", vf,
        "-frames:v", "1", "-update", "1",
        "-q:v", "1", str(tmp)
    ]

    result = subprocess.run(cmd, capture_output=True, text=True)
    if result.returncode == 0 and tmp.exists():
        # Replace original
        src.unlink()
        tmp.rename(src)
        return True
    else:
        print(f"  stderr: {result.stderr[-200:]}")
        tmp.unlink(missing_ok=True)
        return False


def main():
    print("=" * 50)
    print("📝 Applying verse overlays to 15 images")
    print("=" * 50)

    ok = 0
    for p in POSTS:
        pid = p["id"]
        print(f"  [{pid:02d}] {p['ref'].replace(chr(92)+':',':')}...", end=" ")
        if overlay(pid, p["verse"], p["ref"]):
            print("✅")
            ok += 1
        else:
            print("❌")

    print(f"\n✅ {ok}/{len(POSTS)} overlays applied")


if __name__ == "__main__":
    main()
