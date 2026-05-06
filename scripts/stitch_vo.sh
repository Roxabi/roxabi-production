#!/usr/bin/env bash
# Stitch all 20 VO chunks into a single 110s narration.wav, each chunk
# positioned at its target start time. v0.2: re-timed to visual cues,
# zero overlaps (≥400ms gap between every consecutive pair).
set -euo pipefail
cd "$(dirname "$0")/.."

VO=showcase/roxabi-vo
OUT=showcase/roxabi-narration.wav
DURATION=110

# chunk_id:start_ms (v0.2 — synced to RoxabiTrailer.tsx visual anchors)
declare -a CUES=(
  "c01:6000"     # typewriter f185 = 6.17s
  "c02:8500"     # mono "five times" f255 = 8.50s
  "c03:11200"    # over team-of-50 cluster forming
  "c04:16500"    # scaffold lines start localF150 = 15s, VO catches up
  "c05:21000"    # "isn't skill / foundations" localF330 = 21s
  "c06:27500"    # hero "Roxabi starts with the smith" localF80 = 27.67s
  "c07:31000"    # "14 years" subtitle localF200 = 31.67s, ends as "agents"
  "c08:36300"    # "Same craft" localF340 = 36.33s
  "c09:43000"    # over terminal frame fade-in
  "c10:46800"    # creed header localF130 = 46.33s
  "c11:50800"    # quiet "six lines" — setup beat
  "c12:53000"    # reads back the principles cadence
  "c13:58400"    # MIT/no-telemetry/yours, lands on localF510 = 59s
  "c14:64000"    # "Not a framework. Primitives." — leads label by ~4s
  "c15:68400"    # list cadence as nodes start localF60 = 70s
  "c16:77600"    # "stands alone / compound" — edges form localF240 = 76s
  "c17:81600"    # LAYER 03 badge slam, "guild" reveal
  "c18:84200"    # forks essaiming
  "c19:90000"    # mirror tagline localF240 = 90s — clause-perfect sync
  "c20:104500"   # "One person. Team-scale output." localF260 = 104.67s
)

INPUTS=()
FILTER=""
LABELS=""
i=0
for cue in "${CUES[@]}"; do
  id="${cue%%:*}"
  delay_ms="${cue##*:}"
  INPUTS+=("-i" "$VO/$id.wav")
  FILTER+="[$i:a]adelay=${delay_ms}|${delay_ms},volume=1.0[v$i];"
  LABELS+="[v$i]"
  i=$((i+1))
done

FILTER+="${LABELS}amix=inputs=${i}:duration=longest:normalize=0[mix];[mix]aresample=48000,apad=whole_dur=${DURATION}[out]"

echo "Stitching $i VO chunks → $OUT (${DURATION}s)..."
ffmpeg -y -hide_banner -loglevel warning \
  "${INPUTS[@]}" \
  -filter_complex "$FILTER" \
  -map "[out]" -t $DURATION \
  -ar 48000 -ac 2 -c:a pcm_s16le \
  "$OUT"

echo "Done: $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s"
