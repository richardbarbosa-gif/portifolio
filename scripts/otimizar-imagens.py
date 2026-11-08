"""Gera as versões leves das imagens do site em otimizadas/ — sem tocar nos originais.

Por que: os prints de página têm 1366 px de largura e até 13 mil px de altura, mas aparecem em cards
de ~380 px. Baixar e decodificar o original custava ~686 MB de memória na home (trava PC antigo).
Aqui cada imagem ganha versões na largura certa; o HTML usa srcset e o navegador escolhe sozinho
(monitor comum → 400 px; Retina/celular → a maior). A CDN da Hostinger ainda converte para WebP
para quem suporta. O print inteiro (lightbox / "Tamanho original") continua sendo o PNG original.

Uso:  python3 scripts/otimizar-imagens.py <pasta-com-originais> <pasta-de-saída>
      (as duas com a mesma estrutura do site: paginas/, fotos/, blog/)
Saída: <saída>/otimizadas/<pasta>/<nome>-<largura>.jpg  + relatório de qualidade (SSIM).
"""
import json
import os
import sys

import numpy as np
from PIL import Image

# pasta/nome-sem-extensão → larguras geradas. Nunca amplia: largura > original é ignorada.
ALVOS = {
    "paginas": (["delivery", "devbox", "naoresidente", "noiva", "performancemed", "petshoop",
                 "polatto", "portaldotempo", "quadrinhos", "relacionamento", "saidafiscal"], [400, 760]),
    "fotos-cards": (["crm", "polatto", "relacionamento", "alura", "cabelereiro", "noiva", "pet", "gibi"], [400, 720]),
    "fotos-logo": (["logo"], [400, 800]),
    "fotos-perfil": (["perfil"], [400]),
    "blog": (["natal", "chatgpt1", "chatgpt2", "house", "sandler", "2026", "carnaval", "2026p2",
              "ringue", "rendaextra"], [400, 760]),
}
QUALIDADE = 92          # JPEG alto; 4:4:4 (sem subamostragem de cor) mantém texto e bordas vermelhas nítidos


def achar_original(raiz, pasta, nome):
    for ext in (".png", ".jpg", ".jpeg"):
        p = os.path.join(raiz, pasta, nome + ext)
        if os.path.exists(p):
            return p
    raise FileNotFoundError(f"{pasta}/{nome}.(png|jpg)")


def ssim(a, b):
    """SSIM em luminância com janela 8x8 (imagens integrais, só numpy). 1.0 = idêntico."""
    a = a.astype(np.float64); b = b.astype(np.float64)
    c1, c2 = (0.01 * 255) ** 2, (0.03 * 255) ** 2
    def media(x, k=8):
        s = np.cumsum(np.cumsum(np.pad(x, ((1, 0), (1, 0))), 0), 1)
        return (s[k:, k:] - s[:-k, k:] - s[k:, :-k] + s[:-k, :-k]) / (k * k)
    ma, mb = media(a), media(b)
    va = media(a * a) - ma ** 2; vb = media(b * b) - mb ** 2; cov = media(a * b) - ma * mb
    m = ((2 * ma * mb + c1) * (2 * cov + c2)) / ((ma ** 2 + mb ** 2 + c1) * (va + vb + c2))
    return float(m.mean())


def main(raiz, saida):
    relatorio = []
    for chave, (nomes, larguras) in ALVOS.items():
        pasta = chave.split("-")[0]
        for nome in nomes:
            orig = achar_original(raiz, pasta, nome)
            im = Image.open(orig)
            im = im.convert("RGB")  # todos opacos (conferido: alfa 255 em 100% dos pixels)
            for w in larguras:
                if w >= im.width:
                    continue
                h = round(im.height * w / im.width)
                ref = im.resize((w, h), Image.LANCZOS)  # referência sem perda, mesmo tamanho
                destino = os.path.join(saida, "otimizadas", pasta, f"{nome}-{w}.jpg")
                os.makedirs(os.path.dirname(destino), exist_ok=True)
                ref.save(destino, "JPEG", quality=QUALIDADE, subsampling=0, optimize=True, progressive=True)
                volta = Image.open(destino).convert("L")
                q = ssim(np.asarray(ref.convert("L")), np.asarray(volta))
                relatorio.append({"arquivo": os.path.relpath(destino, saida), "origem": os.path.relpath(orig, raiz),
                                  "dim": [w, h], "bytes": os.path.getsize(destino), "ssim": round(q, 4)})
                print(f"{relatorio[-1]['arquivo']:<44} {w}x{h:<6} {os.path.getsize(destino)/1024:8.0f} KB  SSIM {q:.4f}")
    with open(os.path.join(saida, "otimizadas", "relatorio.json"), "w") as f:
        json.dump(relatorio, f, ensure_ascii=False, indent=1)
    s = [r["ssim"] for r in relatorio]
    print(f"\n{len(relatorio)} arquivos · {sum(r['bytes'] for r in relatorio)/1e6:.1f} MB · SSIM mínimo {min(s):.4f} · médio {sum(s)/len(s):.4f}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
