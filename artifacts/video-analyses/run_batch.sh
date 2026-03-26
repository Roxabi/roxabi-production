#!/bin/bash
# Batch video analysis pipeline — processes 10 videos sequentially
# Model: qwen3-vl:4b | Output: JSON per video + batch log

WORKDIR="/home/mickael/projects/roxabi-plugins/plugins/web-intel"
OUTDIR="/home/mickael/projects/roxabi-production/artifacts/video-analyses"
LOGFILE="$OUTDIR/batch.log"
export SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt

VIDEOS=(
  "https://www.youtube.com/watch?v=GnmzcahoJ18"
  "https://www.youtube.com/watch?v=7TuovV_f5d8"
  "https://www.youtube.com/watch?v=q4j6y-Yjp90"
  "https://www.youtube.com/watch?v=YPEvrpzz72w"
  "https://www.youtube.com/watch?v=Nd2pavAegx4"
  "https://www.youtube.com/watch?v=UhRGHr7pgnU"
  "https://www.youtube.com/watch?v=0soFIReWb1w"
  "https://www.youtube.com/watch?v=LqN_ItMqovA"
  "https://www.youtube.com/watch?v=uEit1oOJK0w"
  "https://www.youtube.com/watch?v=5O1uFIdUgVA"
)

echo "=== Batch video analysis started at $(date) ===" > "$LOGFILE"
echo "Model: qwen3-vl:4b" >> "$LOGFILE"
echo "Total videos: ${#VIDEOS[@]}" >> "$LOGFILE"
echo "" >> "$LOGFILE"

for i in "${!VIDEOS[@]}"; do
  URL="${VIDEOS[$i]}"
  # Extract video ID from URL
  VIDEO_ID=$(echo "$URL" | sed 's/.*v=//')
  NUM=$((i + 1))

  echo "[$NUM/10] Processing $VIDEO_ID ..." >> "$LOGFILE"
  echo "  URL: $URL" >> "$LOGFILE"
  echo "  Started: $(date)" >> "$LOGFILE"

  cd "$WORKDIR" && uv run python scripts/video_analyzer.py "$URL" \
    --model qwen3-vl:4b \
    --output "$OUTDIR/$VIDEO_ID.json" \
    >> "$LOGFILE" 2>&1

  EXIT_CODE=$?

  if [ $EXIT_CODE -eq 0 ]; then
    echo "  Result: SUCCESS (exit $EXIT_CODE)" >> "$LOGFILE"
  else
    echo "  Result: FAILED (exit $EXIT_CODE)" >> "$LOGFILE"
  fi
  echo "  Finished: $(date)" >> "$LOGFILE"
  echo "" >> "$LOGFILE"
done

echo "=== Batch video analysis completed at $(date) ===" >> "$LOGFILE"
echo "BATCH_DONE" >> "$LOGFILE"
