#!/usr/bin/env python3
"""Extract the three complete chest portraits from the APPROVED V7 film.
No invented or AI-generated assets; source: scene 11 at 5:02.
The film's chest UI remains a reference, not a static menu screenshot.
"""
from io import BytesIO
from pathlib import Path
import subprocess
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "rework/v7-scenes-01-12-hq-60fps.mp4"
OUTPUT = ROOT / "assets"
CROPS = {
    "normal": (85, 181, 276, 349),
    "epic": (392, 180, 579, 350),
    "legend": (704, 177, 884, 351),
}

def main():
    if not SOURCE.is_file():
        raise SystemExit(f"Film źródłowy nie istnieje: {SOURCE}")
    frame = subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-ss", "302",
         "-i", str(SOURCE), "-frames:v", "1", "-f", "image2pipe",
         "-vcodec", "png", "-"],
        capture_output=True, check=True,
    ).stdout
    image = Image.open(BytesIO(frame)).convert("RGBA")
    if image.size != (960, 540):
        raise SystemExit(f"Nieprawidłowy rozmiar kadru: {image.size}")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for kind, box in CROPS.items():
        chest = image.crop(box)
        width, height = chest.size
        mask = Image.new("L", chest.size, 0)
        painter = ImageDraw.Draw(mask)
        painter.rounded_rectangle((8, 8, width - 9, height - 9), radius=18, fill=255)
        chest.putalpha(mask.filter(ImageFilter.GaussianBlur(8)))
        chest.thumbnail((170, 145), Image.Resampling.LANCZOS)
        output = OUTPUT / f"v7-chest-{kind}.webp"
        chest.save(output, format="WEBP", quality=85, method=6)
        print(f"{output.relative_to(ROOT)}: {chest.size}, {output.stat().st_size} bytes")

if __name__ == "__main__":
    main()
