import sys
import json
import os
from pathlib import Path

from PIL import Image


ALLOWED_FORMATS = {"jpeg", "jpg", "png", "webp"}


def compress_image(src_path: str, dest_path: str, fmt: str, quality: int = 80) -> dict:
    src = Path(src_path)
    dest = Path(dest_path)
    fmt = fmt.lower()

    if fmt not in ALLOWED_FORMATS:
        raise ValueError(f"Unsupported format: {fmt}")

    if not src.is_file():
        raise FileNotFoundError(f"Source file not found: {src}")

    with Image.open(src) as img:
        params: dict = {}

        if fmt in {"jpeg", "jpg"}:
            params["optimize"] = True
            params["quality"] = int(quality)
            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGB")

        elif fmt == "png":
            params["optimize"] = True
            params["compress_level"] = 6
            if img.mode == "P":
                img = img.convert("RGBA")

        elif fmt == "webp":
            params["quality"] = int(quality)
            if img.mode in ("RGBA", "LA", "P"):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")

        dest.parent.mkdir(parents=True, exist_ok=True)

        img.save(dest, format=fmt.upper(), **params)

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
