#!/usr/bin/env bash
# Final mixdown: composite VO + SFX + BGM onto the silent video.
# v0.2 balance fix: VO louder + SFX/BGM dropped + harder sidechain.
# - VO  (narration.wav): vol 1.15, lead, asplit feeds sidechain key
# - SFX (track.m4a):     vol 0.55  (was 1.0 — user feedback "too high")
# - BGM (bgm-tech.mp3):  vol 0.16  (was 0.30 — user feedback "too high")
# - Sidechain: thr 0.03, ratio 12, atk 5ms, rel 250ms (was 0.05/8/20/400)
# - alimiter at the end to catch any peak.
set -euo pipefail
cd "$(dirname "$0")/.."

VERSION="${1:-v0.3}"
VIDEO_IN="out/roxabi-trailer-${VERSION}-noaudio.mp4"
VO=showcase/roxabi-narration.wav
SFX=out/roxabi-sfx.m4a
BGM=assets/bgm/bgm-tech.mp3
OUT="out/roxabi-trailer-${VERSION}.mp4"
DURATION=110

if [ ! -f "$VIDEO_IN" ]; then
  echo "FAIL: $VIDEO_IN not found — run renderer first" >&2
  exit 1
fi
for f in "$VO" "$SFX" "$BGM"; do
  [ -f "$f" ] || { echo "FAIL: $f missing" >&2; exit 1; }
done

echo "Mixing ${VERSION} → $OUT..."
ffmpeg -y -hide_banner -loglevel warning \
  -i "$VIDEO_IN" \
  -i "$VO" \
  -i "$SFX" \
  -i "$BGM" \
  -filter_complex "
[1:a]volume=1.15,aresample=48000,asplit=2[vo_mix][vo_sc];
[2:a]volume=0.55,aresample=48000[sfx];
[3:a]atrim=0:${DURATION},aresample=48000,
     afade=in:st=0:d=0.5,
     afade=out:st=$(echo "${DURATION}-2.5" | bc):d=2.5,
     lowpass=f=4000,
     volume=0.16[bgm_pre];
[bgm_pre][vo_sc]sidechaincompress=threshold=0.03:ratio=12:attack=5:release=250[bgm];
[vo_mix][sfx][bgm]amix=inputs=3:duration=longest:normalize=0,
     dynaudnorm=f=200:g=15,
     alimiter=limit=0.95[mix]
  " \
  -map 0:v -map "[mix]" \
  -t $DURATION \
  -c:v copy -c:a aac -b:a 192k \
  "$OUT"

echo
echo "Done."
ffprobe -v error -show_entries format=duration,size:stream=codec_type,codec_name,width,height,sample_rate,channels \
  -of default=noprint_wrappers=0 "$OUT" 2>&1 | head -25
