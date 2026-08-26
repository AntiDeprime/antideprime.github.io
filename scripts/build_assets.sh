#!/usr/bin/env sh
set -eu

# Source photo lives outside the deployed assets directory: src/profile.jpeg
SOURCE="${1:-src/profile.jpeg}"
ASSETS_DIR="assets"

mkdir -p "$ASSETS_DIR"

# Derive a centered square crop from the source dimensions instead of
# hardcoding coordinates that only work for one photo.
DIMS=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$SOURCE")
W=${DIMS%%,*}
H=${DIMS##*,}
SIDE=$((W < H ? W : H))
X=$(((W - SIDE) / 2))
Y=$(((H - SIDE) / 2))

# Square identity avatar: center-crop to a square and resize to 512.
cwebp -quiet -q 88 -crop "$X" "$Y" "$SIDE" "$SIDE" -resize 512 512 "$SOURCE" -o "$ASSETS_DIR/avatar-512.webp"

# Crop a wide social preview directly from the source and encode without EXIF/XMP.
# The framing offsets are chosen for the current source photo.
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
