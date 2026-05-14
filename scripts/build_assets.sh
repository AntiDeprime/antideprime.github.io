#!/usr/bin/env sh
set -eu

SOURCE="${1:-profile.jpeg}"
ASSETS_DIR="assets"
TMP_DIR="${TMPDIR:-/tmp}/personal-website-assets"

mkdir -p "$ASSETS_DIR" "$TMP_DIR"

# Source photo is 3024x4032. Crop centrally to a square for identity icons.
cwebp -quiet -q 88 -crop 0 504 3024 3024 -resize 512 512 "$SOURCE" -o "$ASSETS_DIR/avatar-512.webp"

# Crop a wide social preview directly from the source and encode without EXIF/XMP.
ffmpeg -y -hide_banner -loglevel error \
  -i "$SOURCE" \
  -vf "crop=3024:1588:0:1222,scale=1200:630" \
  -q:v 3 \
  -map_metadata -1 \
  "$ASSETS_DIR/og-image.jpg"

# Derive PNG icons from the clean WebP avatar so Apple/EXIF/GPS metadata is not carried over.
ffmpeg -y -hide_banner -loglevel error -i "$ASSETS_DIR/avatar-512.webp" -vf "scale=512:512" -map_metadata -1 "$ASSETS_DIR/icon-512.png"
ffmpeg -y -hide_banner -loglevel error -i "$ASSETS_DIR/avatar-512.webp" -vf "scale=192:192" -map_metadata -1 "$ASSETS_DIR/icon-192.png"
ffmpeg -y -hide_banner -loglevel error -i "$ASSETS_DIR/avatar-512.webp" -vf "scale=180:180" -map_metadata -1 "$ASSETS_DIR/apple-touch-icon.png"
ffmpeg -y -hide_banner -loglevel error -i "$ASSETS_DIR/avatar-512.webp" -vf "scale=48:48" -map_metadata -1 "$ASSETS_DIR/favicon.png"
