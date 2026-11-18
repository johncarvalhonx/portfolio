"""Remonta o index.html a partir de src/template.html.

O index.html e um pacote autocontido: fontes, React e o runtime ficam
embutidos nele. Este script troca apenas o bloco do template (o HTML do
site) e mantem o resto do pacote como esta.

Uso: python build.py
"""
import json
import re
from pathlib import Path

root = Path(__file__).parent
index = root / "index.html"
template = (root / "src" / "template.html").read_text(encoding="utf-8")

html = index.read_text(encoding="utf-8")
encoded = json.dumps(template, ensure_ascii=False).replace("</", "<\\u002F")

pattern = re.compile(r'(<script type="__bundler/template"[^>]*>)(.*?)(</script>)', re.S)
if not pattern.search(html):
    raise SystemExit("bloco __bundler/template nao encontrado em index.html")
html = pattern.sub(lambda m: m.group(1) + "\n" + encoded + "\n  " + m.group(3), html, count=1)

index.write_text(html, encoding="utf-8", newline="\n")
print("index.html atualizado (%d bytes)" % len(html.encode("utf-8")))
