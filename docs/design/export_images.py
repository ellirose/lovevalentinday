"""Export the approved cover masters to the sizes in IMAGE_PROMPTS.md.

Run from any directory: py docs/design/export_images.py
Requires Pillow with AVIF support. Generated masters remain outside Code/.
"""

from io import BytesIO
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "docs/design/source"
DESTINATION = ROOT / "Code/assets/img"
SIZES = {
    "landscape": ((2560, 1440), 1600),
    "square": ((2048, 2048), 1200),
    "portrait": ((1440, 2560), 1080),
}
LIMIT = 350_000


def encode(image, image_format):
    for quality in range(92, 19, -2):
        buffer = BytesIO()
        options = {"quality": quality}
        if image_format == "JPEG":
            options.update(optimize=True, progressive=True)
        elif image_format == "WEBP":
            options.update(method=6)
        elif image_format == "AVIF":
            options.update(speed=6)
        image.save(buffer, format=image_format, **options)
        if buffer.tell() <= LIMIT:
            return buffer.getvalue(), quality
    raise RuntimeError(f"Cannot fit {image_format} {image.size} in {LIMIT} bytes")


def main():
    DESTINATION.mkdir(parents=True, exist_ok=True)
    for crop, (size, small_width) in SIZES.items():
        path = SOURCE / f"cover-{crop}.png"
        with Image.open(path) as original:
            master = ImageOps.exif_transpose(original).convert("RGB")
        if abs(master.width / master.height - size[0] / size[1]) > 0.002:
            raise ValueError(f"Unexpected aspect ratio for {path}")
        if master.size != size:
            master = master.resize(size, Image.Resampling.LANCZOS)
            master.info.clear()
            master.save(path, optimize=True)
        for width in (size[0], small_width):
            height = round(width * size[1] / size[0])
            image = master.resize((width, height), Image.Resampling.LANCZOS)
            image.info.clear()
            suffix = "" if width == size[0] else f"-{width}"
            for extension, image_format in (("avif", "AVIF"), ("webp", "WEBP"), ("jpg", "JPEG")):
                data, quality = encode(image, image_format)
                target = DESTINATION / f"cover-{crop}{suffix}.{extension}"
                target.write_bytes(data)
                with Image.open(target) as check:
                    check.load()
                    assert check.size == (width, height)
                    assert not check.getexif()
                    assert not check.info.get("icc_profile")
                print(f"{target.relative_to(ROOT)}: {width}x{height}, {len(data)} bytes, quality {quality}")


if __name__ == "__main__":
    main()
