#!/usr/bin/env -S uv run --script
# /// script
# requires-python = ">=3.10"
# dependencies = ["playwright"]
# ///
"""
Capture a Forge use-case diagram animation (forge.roxabi.dev "lyra-v2" theme) to an
ARTIFACT-FREE H.264 MP4, with a dynamic 16:9 camera that follows the active node.

Why this exists
---------------
Playwright `record_video` (webm/VP8 ~0.9 Mbps fixed) blocks/bands the dark gradient
backgrounds — visible compression artifacts that re-encoding to H.264 cannot recover.
Instead we take ONE LOSSLESS PNG per frame, then encode the sequence with ffmpeg
(same principle as renderer/render.ts). Source is pixel-perfect -> zero artifacts.

The Forge use-case engine is not seekable (a setTimeout(900ms) step chain + rAF
particles, no __seek). So we inject a VIRTUAL CLOCK that overrides setTimeout / rAF /
performance.now (pass-through until __v.enable()), then advance it 1000/fps ms per
frame -> deterministic and smooth. This is the external-animation analogue of this
repo's determinism contract (time = frame/fps; no Date.now/performance.now).

One-time (per machine): uv run --with playwright playwright install chromium

Examples
--------
  # Voice-STT use case of the factory workflow, with the Roxabi signature
  uv run scripts/make_brand_signature.py --out /tmp/sig.png
  uv run scripts/capture_forge_anim.py \
      --url file:///home/.../factory-workflow.html \
      --uc 1 --signature /tmp/sig.png \
      --out factory-workflow-voicestt.mp4

  # No signature, custom crop / output size / fps
  uv run scripts/capture_forge_anim.py --url https://forge.roxabi.dev/.../x.html \
      --uc 0 --crop 1280x720 --size 1920x1080 --fps 30 --out x.mp4
"""
import argparse
import os
import shutil
import subprocess
import sys
import tempfile
import time
from playwright.sync_api import sync_playwright

# ---- virtual-clock shim: native pass-through until window.__v.enable() ----
VCLOCK = r"""
(() => {
  const realST = window.setTimeout.bind(window);
  const realCT = window.clearTimeout.bind(window);
  const realRAF = window.requestAnimationFrame.bind(window);
  const realCAF = window.cancelAnimationFrame.bind(window);
  const realNow = performance.now.bind(performance);
  let fake = false, vnow = 0, id = 1;
  const timers = [], rafs = [];
  window.__v = {
    enable() { fake = true; vnow = 0; timers.length = 0; rafs.length = 0; },
    now() { return vnow; },
    pending() { return timers.length + rafs.length; },
    advance(dt) {
      vnow += dt;
      let guard = 0;
      for (;;) {
        let idx = -1, best = Infinity;
        for (let i = 0; i < timers.length; i++)
          if (timers[i].t <= vnow && timers[i].t < best) { best = timers[i].t; idx = i; }
        if (idx < 0) break;
        const t = timers.splice(idx, 1)[0];
        try { t.fn(); } catch (e) {}
        if (++guard > 100000) break;
      }
      const batch = rafs.splice(0, rafs.length);
      for (const r of batch) { try { r.fn(vnow); } catch (e) {} }
    },
  };
  window.setTimeout = (fn, delay, ...a) =>
    fake ? (timers.push({ t: vnow + (delay || 0), fn: () => fn(...a), id }), id++)
         : realST(fn, delay, ...a);
  window.clearTimeout = (h) => {
    if (fake) { const i = timers.findIndex(t => t.id === h); if (i >= 0) timers.splice(i, 1); }
    else realCT(h);
  };
  window.requestAnimationFrame = (fn) => fake ? (rafs.push({ fn, id }), id++) : realRAF(fn);
  window.cancelAnimationFrame = (h) => {
    if (fake) { const i = rafs.findIndex(r => r.id === h); if (i >= 0) rafs.splice(i, 1); }
    else realCAF(h);
  };
  performance.now = () => (fake ? vnow : realNow());
})();
"""

# focus = centroid of active nodes + live particle, in viewport CSS px
QUERY = r"""() => {
  const pts = [];
  for (const el of document.querySelectorAll('.node.uc-active')) {
    const r = el.getBoundingClientRect();
    pts.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  }
  const pc = document.querySelector('g.uc-particle-wrap circle');
  if (pc) { const r = pc.getBoundingClientRect();
    if (r.width || r.height) pts.push({ x: r.left + r.width / 2, y: r.top + r.height / 2 }); }
  let cx = null, cy = null;
  if (pts.length) {
    cx = pts.reduce((a, p) => a + p.x, 0) / pts.length;
    cy = pts.reduce((a, p) => a + p.y, 0) / pts.length;
  }
  return { cx, cy, n: pts.length, state: (typeof ucState !== 'undefined' ? ucState : 'none') };
}"""


def parse_dims(s, what):
    try:
        w, h = s.lower().split("x")
        return int(w), int(h)
    except Exception:
        sys.exit(f"--{what} must be WxH (e.g. 1216x684), got {s!r}")


def main():
    ap = argparse.ArgumentParser(description="Forge use-case animation -> artifact-free 16:9 MP4.")
    ap.add_argument("--url", required=True, help="file:// or https:// of the forge diagram html")
    ap.add_argument("--out", required=True, help="output .mp4 path")
    ap.add_argument("--uc", type=int, default=1, help="use-case index to animate (default 1)")
    ap.add_argument("--fps", type=int, default=30)
    ap.add_argument("--viewport", default="1600x1280", help="render viewport CSS px")
    ap.add_argument("--crop", default="1216x684", help="16:9 camera window CSS px")
    ap.add_argument("--size", default="1920x1080", help="output video px")
    ap.add_argument("--signature", help="transparent PNG to overlay bottom-right (see make_brand_signature.py)")
    ap.add_argument("--sig-height", type=int, default=56, help="signature height px in the output")
    ap.add_argument("--ease", type=float, default=0.22, help="camera follow easing 0..1")
    ap.add_argument("--crf", type=int, default=16)
    ap.add_argument("--dsf", type=int, default=2, help="device scale factor (source crispness)")
    ap.add_argument("--intro", type=int, default=28, help="intro hold frames")
    ap.add_argument("--end", type=int, default=40, help="end hold frames")
    ap.add_argument("--reset-hold", type=int, default=22, help="post-reset frames (seamless loop seam)")
    ap.add_argument("--ffmpeg", default="ffmpeg")
    ap.add_argument("--keep-frames", action="store_true")
    args = ap.parse_args()

    VW, VH = parse_dims(args.viewport, "viewport")
    CW, CH = parse_dims(args.crop, "crop")
    OW, OH = parse_dims(args.size, "size")
    DT = 1000.0 / args.fps
    CX_MIN, CX_MAX = CW / 2, VW - CW / 2
    CY_MIN, CY_MAX = CH / 2, VH - CH / 2
    clamp = lambda v, lo, hi: lo if v < lo else hi if v > hi else v

    frames_dir = tempfile.mkdtemp(prefix=f"forgevid-{os.getpid()}-")  # PID-unique (concurrency-safe)
    state = {"i": 0}  # frame counter (dict so nested grab() can mutate it)

    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True, args=["--force-color-profile=srgb"])
            ctx = browser.new_context(viewport={"width": VW, "height": VH}, device_scale_factor=args.dsf)
            ctx.add_init_script(VCLOCK)
            page = ctx.new_page()
            page.goto(args.url, wait_until="load")
            page.wait_for_selector(".node", timeout=15000)
            time.sleep(1.6)  # real-clock init + layout + fonts (page renders before we virtualize time)

            # intro camera: first node of the chosen use case (fallback: viewport centre)
            focus = page.evaluate(
                "(uc) => { try {"
                "  const s = USE_CASES[uc].steps.find(s => s.nodes && s.nodes.length);"
                "  const e = document.querySelector('[data-id=\"' + s.nodes[0] + '\"]');"
                "  const r = e.getBoundingClientRect();"
                "  return { x: r.left + r.width/2, y: r.top + r.height/2 };"
                "} catch (e) { return null; } }",
                args.uc,
            ) or {"x": VW / 2, "y": VH / 2}
            cam_x = clamp(focus["x"], CX_MIN, CX_MAX)
            cam_y = clamp(focus["y"], CY_MIN, CY_MAX)

            def grab():
                x = clamp(cam_x - CW / 2, 0, VW - CW)
                y = clamp(cam_y - CH / 2, 0, VH - CH)
                page.screenshot(path=os.path.join(frames_dir, f"f{state['i']:06d}.png"),
                                clip={"x": x, "y": y, "width": CW, "height": CH})
                state["i"] += 1

            def ease_to(tx, ty):
                nonlocal cam_x, cam_y
                tx = clamp(tx, CX_MIN, CX_MAX); ty = clamp(ty, CY_MIN, CY_MAX)
                cam_x += (tx - cam_x) * args.ease
                cam_y += (ty - cam_y) * args.ease

            page.evaluate("window.__v.enable()")
            page.click(f'.uc-btn[data-uc="{args.uc}"]')
            for _ in range(args.intro):
                grab()

            page.click("#ucPlay")
            target = (cam_x, cam_y)
            for _ in range(1200):  # safety cap
                page.evaluate("(dt) => window.__v.advance(dt)", DT)
                info = page.evaluate(QUERY)
                if info["cx"] is not None:
                    target = (info["cx"], info["cy"])
                ease_to(*target)
                grab()
                if info["state"] == "done" and page.evaluate("window.__v.pending()") == 0:
                    break

            for _ in range(args.end):
                ease_to(*target)
                grab()

            page.evaluate("typeof resetUcVisuals === 'function' && resetUcVisuals()")
            for _ in range(args.reset_hold):
                grab()

            n = state["i"]
            browser.close()

        if n == 0:
            sys.exit("no frames captured")
        print(f"captured {n} frames -> encoding")
        encode(args, frames_dir, OW, OH)
        print(args.out)
    finally:
        if not args.keep_frames:
            shutil.rmtree(frames_dir, ignore_errors=True)
        elif os.path.isdir(frames_dir):
            print(f"frames kept: {frames_dir}")


def encode(args, frames_dir, OW, OH):
    inputs = ["-framerate", str(args.fps), "-i", os.path.join(frames_dir, "f%06d.png")]
    if args.signature:
        inputs += ["-i", args.signature]
    inputs += ["-f", "lavfi", "-i", "anullsrc=channel_layout=stereo:sample_rate=44100"]

    if args.signature:
        audio_idx = 2
        filt = (f"[0:v]scale={OW}:{OH}:flags=lanczos,setsar=1[v];"
                f"[1:v]scale=-1:{args.sig_height}[sig];"
                f"[v][sig]overlay=W-w-40:H-h-30[outv]")
    else:
        audio_idx = 1
        filt = f"[0:v]scale={OW}:{OH}:flags=lanczos,setsar=1[outv]"

    cmd = [args.ffmpeg, "-y", *inputs,
           "-filter_complex", filt,
           "-map", "[outv]", "-map", f"{audio_idx}:a", "-shortest",
           "-c:v", "libx264", "-profile:v", "high", "-level", "4.0",
           "-pix_fmt", "yuv420p", "-crf", str(args.crf), "-preset", "slow",
           "-movflags", "+faststart", "-c:a", "aac", "-b:a", "96k",
           args.out]
    r = subprocess.run(cmd)
    if r.returncode != 0:
        sys.exit(f"ffmpeg failed ({r.returncode})")


if __name__ == "__main__":
    main()
