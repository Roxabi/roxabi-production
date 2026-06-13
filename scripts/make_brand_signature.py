#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["playwright"]
# ///
"""
Render a Roxabi brand lockup (foundation-block logo + wordmark) to a transparent PNG,
for use as a corner signature overlay on rendered videos.

One-time (per machine): uv run --with playwright playwright install chromium

Usage:
  uv run scripts/make_brand_signature.py                       # -> /tmp/roxabi_sig.png
  uv run scripts/make_brand_signature.py --out sig.png \
      --brand Roxabi --sub "factory · forge.roxabi.dev"

Logo source of truth: roxabi-site/brand/logo/foundation-block.svg (inlined below).
Site lockup: [foundation-block] + "Roxabi" (Inter 700/800), amber #f0b429 sublabel.
"""
import argparse
from playwright.sync_api import sync_playwright

# Canonical foundation-block mark (roxabi-site/brand/logo/foundation-block.svg), inlined.
LOGO_SVG = r"""
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Roxabi">
  <defs>
    <radialGradient id="fbCore" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#fde68a"/><stop offset="35%" stop-color="#fbbf24"/>
      <stop offset="100%" stop-color="#f0b429" stop-opacity="0.25"/>
    </radialGradient>
    <filter id="fbBloom" x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="1.7" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="fbBigBloom" x="-120%" y="-120%" width="340%" height="340%">
      <feGaussianBlur stdDeviation="3.4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>
  <g transform="translate(0,4)">
    <polygon points="12,18 32,28 32,48 12,38" fill="#11161d"/>
    <polygon points="52,18 52,38 32,48 32,28" fill="#171e27"/>
    <polygon points="32,8 52,18 32,28 12,18" fill="#1c2431"/>
    <ellipse cx="32" cy="18" rx="9" ry="5" fill="url(#fbCore)" filter="url(#fbBigBloom)" opacity="0.9"/>
    <polygon points="32,12 44,18 32,24 20,18" fill="url(#fbCore)" stroke="#fbbf24" stroke-width="0.8" filter="url(#fbBloom)"/>
    <path d="M32,8 52,18 52,38 32,48 12,38 12,18Z" fill="none" stroke="#f0b429" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M12,18 32,28 32,48 M52,18 32,28" fill="none" stroke="#f0b429" stroke-width="1.1" stroke-linejoin="round" opacity="0.75"/>
  </g>
</svg>
"""

HTML = """<!DOCTYPE html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&family=Inter:wght@600;700;800&display=swap" rel="stylesheet">
<style>
  html,body{{margin:0;padding:0;background:transparent}}
  .sig{{display:inline-flex;align-items:center;gap:13px;padding:6px 4px;
       font-family:"Inter",system-ui,sans-serif;
       filter:drop-shadow(0 2px 6px rgba(0,0,0,.85)) drop-shadow(0 0 2px rgba(0,0,0,.9))}}
  .sig svg{{width:46px;height:46px;display:block}}
  .wm{{display:flex;flex-direction:column;line-height:1}}
  .wm .brand{{font-weight:800;font-size:30px;letter-spacing:-.5px;color:#fafafa}}
  .wm .sub{{font-family:"JetBrains Mono",monospace;font-weight:600;font-size:11.5px;
           letter-spacing:.5px;color:#f0b429;margin-top:5px}}
  .wm .sub:empty{{display:none}}
</style></head><body>
<div class="sig" id="sig">{logo}
  <div class="wm"><span class="brand">{brand}</span><span class="sub">{sub}</span></div>
</div></body></html>"""


def main():
    ap = argparse.ArgumentParser(description="Render the Roxabi brand signature PNG (transparent).")
    ap.add_argument("--out", default="/tmp/roxabi_sig.png")
    ap.add_argument("--brand", default="Roxabi")
    ap.add_argument("--sub", default="factory · forge.roxabi.dev")
    ap.add_argument("--scale", type=int, default=3, help="device scale factor (crispness)")
    args = ap.parse_args()

    html = HTML.format(logo=LOGO_SVG, brand=args.brand, sub=args.sub)
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True)
        pg = b.new_context(device_scale_factor=args.scale).new_page()
        pg.set_content(html, wait_until="networkidle")
        pg.wait_for_timeout(400)
        pg.locator("#sig").screenshot(path=args.out, omit_background=True)
        b.close()
    print(args.out)


if __name__ == "__main__":
    main()
