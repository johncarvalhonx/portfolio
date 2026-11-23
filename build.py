"""Remonta o index.html a partir de src/template.html.

O index.html e um pacote autocontido: fontes, React e o runtime ficam
embutidos nele. Este script troca apenas o bloco do template (o HTML do
site) e mantem o resto do pacote como esta.

Os arquivos em src/ (CSS e JS do desktop) entram no template por linhas
`/* @include src/arquivo */`.

Uso: python build.py
"""
import json
import re
from pathlib import Path

root = Path(__file__).parent
index = root / "index.html"

INCLUDE = re.compile(r"^[ \t]*(?:/\*|<!--)\s*@include\s+(\S+)\s*(?:\*/|-->)[ \t]*$", re.M)


def expand_includes(text, base):
    """Troca linhas `/* @include src/x.js */` (ou `<!-- ... -->`) pelo conteudo do arquivo."""
    count = 0

    def sub(m):
        nonlocal count
        target = base / m.group(1)
        if not target.is_file():
            raise SystemExit("include nao encontrado: %s" % m.group(1))
        count += 1
        return target.read_text(encoding="utf-8").rstrip("\n")

    out = INCLUDE.sub(sub, text)
    print("%d include(s) expandido(s)" % count)
    return out


template = expand_includes((root / "src" / "template.html").read_text(encoding="utf-8"), root)

html = index.read_text(encoding="utf-8")
encoded = json.dumps(template, ensure_ascii=False).replace("</", "<\\u002F")

pattern = re.compile(r'(<script type="__bundler/template"[^>]*>)(.*?)(</script>)', re.S)
if not pattern.search(html):
    raise SystemExit("bloco __bundler/template nao encontrado em index.html")
html = pattern.sub(lambda m: m.group(1) + "\n" + encoded + "\n  " + m.group(3), html, count=1)

index.write_text(html, encoding="utf-8", newline="\n")
print("index.html atualizado (%d bytes)" % len(html.encode("utf-8")))
