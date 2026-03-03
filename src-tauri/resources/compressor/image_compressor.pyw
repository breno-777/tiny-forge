import sys
import json
import os
from pathlib import Path

from PIL import Image, features

SUPPORTED_SAVE_FORMATS = {
    "jpeg": "JPEG",
    "jpg": "JPEG",
    "png": "PNG",
    "webp": "WEBP",
    "bmp": "BMP",
    "tiff": "TIFF",
    "gif": "GIF",
    "ico": "ICO",
    "avif": "AVIF" if features.check("avif") else None,
}


def compress_image(src_path: str, dest_path: str, fmt: str, quality: int = 80) -> dict:
    src = Path(src_path)
    dest = Path(dest_path)

    fmt = fmt.strip().lower()

    if fmt not in SUPPORTED_SAVE_FORMATS or SUPPORTED_SAVE_FORMATS[fmt] is None:
        raise ValueError(f"Unsupported output format: {fmt}")

    if not src.is_file():
        raise FileNotFoundError(f"Source file not found: {src}")

    with Image.open(src) as img:
        params: dict = {}

        save_format = SUPPORTED_SAVE_FORMATS[fmt]

        if save_format == "JPEG":
            params["optimize"] = True
            params["quality"] = int(quality)
            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGB")

        elif save_format == "PNG":
            params["optimize"] = True
            params["compress_level"] = 6

        elif save_format == "WEBP":
            params["quality"] = int(quality)

        elif save_format == "AVIF":
            params["quality"] = int(quality)

        dest.parent.mkdir(parents=True, exist_ok=True)
        img.save(dest, format=save_format, **params)

    return {
        "src": str(src),
        "dest": str(dest),
        "size_before": src.stat().st_size,
        "size_after": dest.stat().st_size,
    }


def main() -> None:
    if len(sys.argv) < 5:
        print(
            json.dumps(
                {"error": "Usage: compressor.exe <src> <dest> <format> <quality>"}
            )
        )
        sys.exit(1)

    src_path = sys.argv[1]
    dest_path = sys.argv[2]
    fmt = sys.argv[3]
    try:
        quality = int(sys.argv[4])
    except ValueError:
        print(json.dumps({"error": "Quality must be an integer"}))
        sys.exit(1)

    try:
        result = compress_image(src_path, dest_path, fmt, quality)
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
