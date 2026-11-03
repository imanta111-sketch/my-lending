"""Генерирует SVG-заглушки для витрины и hero. Запуск: python scripts/make-placeholders.py"""
from pathlib import Path

root = Path(__file__).resolve().parent.parent / "src" / "assets"
(root / "templates").mkdir(parents=True, exist_ok=True)

cols = {
    "cafe": ("#C2552D", "#F4EFE8"),
    "salon": ("#7A4FD6", "#F3F0F6"),
    "coach": ("#2F6B4F", "#EEF0EA"),
    "portfolio": ("#141414", "#F0EEE9"),
}
for name, (a, b) in cols.items():
    svg = (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="420" viewBox="0 0 640 420">'
        f'<rect width="640" height="420" fill="{b}"/>'
        f'<rect x="32" y="28" width="576" height="28" rx="14" fill="{a}" opacity=".15"/>'
        f'<rect x="48" y="96" width="320" height="40" rx="8" fill="{a}"/>'
        f'<rect x="48" y="152" width="240" height="14" rx="7" fill="{a}" opacity=".45"/>'
        f'<rect x="48" y="176" width="280" height="14" rx="7" fill="{a}" opacity=".45"/>'
        f'<rect x="48" y="220" width="140" height="44" rx="22" fill="{a}"/>'
        f'<rect x="400" y="96" width="192" height="270" rx="16" fill="{a}" opacity=".25"/>'
        f'<rect x="48" y="300" width="96" height="66" rx="10" fill="{a}" opacity=".2"/>'
        f'<rect x="160" y="300" width="96" height="66" rx="10" fill="{a}" opacity=".2"/>'
        f'<rect x="272" y="300" width="96" height="66" rx="10" fill="{a}" opacity=".2"/></svg>'
    )
    (root / "templates" / f"{name}.svg").write_text(svg, encoding="utf-8")

(root / "hero.svg").write_text(
    '<svg xmlns="http://www.w3.org/2000/svg" width="560" height="640" viewBox="0 0 560 640">'
    '<rect width="560" height="640" rx="32" fill="#3B5BFF"/>'
    '<circle cx="280" cy="250" r="110" fill="#F0EEE9" opacity=".9"/>'
    '<path d="M90 640c20-150 110-230 190-230s170 80 190 230z" fill="#F0EEE9" opacity=".9"/></svg>',
    encoding="utf-8",
)
print("ok")
