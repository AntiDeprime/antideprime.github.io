#!/usr/bin/env sh
set -eu

SOURCE="${1:-profile.jpeg}"
ASSETS_DIR="assets"
TMP_DIR="${TMPDIR:-/tmp}/personal-website-assets"

mkdir -p "$ASSETS_DIR" "$TMP_DIR"

# Source photo is 3024x4032. Crop centrally to a square for identity icons.
cwebp -quiet -q 88 -crop 0 504 3024 3024 -resize 512 512 "$SOURCE" -o "$ASSETS_DIR/avatar.webp"

# Crop a wide social preview directly from the source and encode without EXIF/XMP.
ffmpeg -y -hide_banner -loglevel error \
  -i "$SOURCE" \
  -vf "crop=3024:1588:0:1222,scale=1200:630" \
  -q:v 3 \
  -map_metadata -1 \
  "$ASSETS_DIR/og-image.jpg"

# Derive PNG icons from the clean WebP avatar so Apple/EXIF/GPS metadata is not carried over.
sips -s format png "$ASSETS_DIR/avatar.webp" --out "$TMP_DIR/icon-512.png" >/dev/null
sips -z 512 512 "$TMP_DIR/icon-512.png" --out "$ASSETS_DIR/icon-512.png" >/dev/null
sips -z 192 192 "$TMP_DIR/icon-512.png" --out "$ASSETS_DIR/icon-192.png" >/dev/null
sips -z 180 180 "$TMP_DIR/icon-512.png" --out "$ASSETS_DIR/apple-touch-icon.png" >/dev/null
sips -z 48 48 "$TMP_DIR/icon-512.png" --out "$ASSETS_DIR/favicon.png" >/dev/null
