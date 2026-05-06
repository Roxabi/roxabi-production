#!/usr/bin/env bash
# Build the SFX track for the Roxabi trailer.
# v0.2: cue volumes ~halved, three "success-end" chimes dropped (felt cheesy
# under VO), badge-slams re-timed to actual frame anchors, hero impact-boom
# moved to the amber "I" reveal at localF180=102s.
set -euo pipefail
cd "$(dirname "$0")/.."

ASSETS=assets
OUT=out/roxabi-sfx.m4a
DURATION=110

# t_ms:file:vol  (volumes baked into the per-cue stream;
# the SFX track is then attenuated again in mix_final.sh.)
declare -a CUES=(
  "500:glitch-digital.mp3:0.30"     # S01 path-fragments enter
  "5000:whoosh-intro.mp3:0.25"      # approach to typewriter (was 3.5s)
  "10000:whoosh-trans.mp3:0.35"     # S01→S02
  "12000:data-process.mp3:0.25"     # team-cluster forms
  "15000:keyboard-typing.mp3:0.20"  # scaffold start localF150=15s (was 16s)
  "22000:impact-boom.mp3:0.35"      # "gap isn't skill" landing
  "25500:whoosh-trans.mp3:0.35"     # S02→S03
  "25700:impact-boom.mp3:0.25"      # LAYER 01 badge slam localF20=25.67s
  "42000:whoosh-trans.mp3:0.35"     # S03→S04
  "42300:impact-boom.mp3:0.25"      # LAYER 02 badge slam localF10=42.33s
  "46300:keyboard-typing.mp3:0.22"  # creed lines start localF130=46.33s
  "68000:whoosh-trans.mp3:0.35"     # S04→S05
  "70000:data-process.mp3:0.20"     # primitive nodes start localF60=70s
  "82000:whoosh-trans.mp3:0.35"     # S05→S06
  "82300:impact-boom.mp3:0.25"      # LAYER 03 badge slam localF10=82.33s
  "86000:data-process.mp3:0.18"     # forks essaime mid-animation
  "96000:whoosh-trans.mp3:0.35"     # S06→S07
  "102000:impact-boom.mp3:0.45"     # ROXABI amber "I" reveal localF180=102s
)
# DROPPED in v0.2:
#   64500 success-end  → felt chime-y under "yours the moment you clone"
#   76500 success-end  → redundant ding over compound edges
#   92000 success-end  → ditto over mirror tagline
#   100500 impact-boom (replaced by 102000 hit aligned to amber "I")

INPUTS=()
FILTER=""
LABELS=""
i=0
for cue in "${CUES[@]}"; do
  IFS=':' read -r t file vol <<< "$cue"
  INPUTS+=("-i" "$ASSETS/$file")
  FILTER+="[$i:a]adelay=${t}|${t},volume=${vol}[v$i];"
  LABELS+="[v$i]"
  i=$((i+1))
done

FILTER+="${LABELS}amix=inputs=${i}:duration=longest:normalize=0[mix];[mix]highpass=f=800,aresample=48000[out]"

mkdir -p out
echo "Building SFX track ($i cues) → $OUT (${DURATION}s)..."
ffmpeg -y -hide_banner -loglevel warning \
  "${INPUTS[@]}" \
  -filter_complex "$FILTER" \
  -map "[out]" -t $DURATION \
  -ar 48000 -ac 2 -c:a aac -b:a 192k \
  "$OUT"

echo "Done: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s"
