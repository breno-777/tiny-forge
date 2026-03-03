import sys
import json
import os
from pathlib import Path
import subprocess
from typing import Dict, Any

ALLOWED_FORMATS = {"mp3", "mp4", "webm", "mkv"}


def get_yt_dlp_path() -> str:
    base_dir = os.path.dirname(
        os.path.abspath(sys.executable if getattr(sys, "frozen", False) else __file__)
    )
    exe_path = os.path.join(base_dir, "yt-dlp.exe")
    if not os.path.exists(exe_path):
        raise FileNotFoundError(f"yt-dlp.exe não encontrado em {exe_path}")
    return exe_path


def build_cmd(src_url: str, dest: Path, fmt: str, height: int) -> list[str]:
    base = [
        get_yt_dlp_path(),
        "--no-progress",
        "--newline",
        "--no-playlist",
    ]

    if fmt == "mp3":
        return base + [
            "-f",
            "bestaudio/best",
            "-x",
            "--audio-format",
            "mp3",
            "--audio-quality",
            "0",
            "-o",
            str(dest.with_suffix(".%(ext)s")),
            src_url,
        ]

    if fmt == "mp4":
        return base + [
            "-f",
            f"bestvideo[ext=mp4][height<={height}]+bestaudio[ext=m4a]/best[ext=mp4]",
            "-o",
            str(dest.with_suffix(".%(ext)s")),
            src_url,
        ]

    if fmt == "mkv":
        return base + [
            "-f",
            f"bestvideo[height<={height}]+bestaudio/best",
            "--remux-video",
            "mkv",
            "-o",
            str(dest.with_suffix(".%(ext)s")),
            src_url,
        ]

    return base + [
        "-f",
        f"bestvideo[height<={height}]+bestaudio/best",
        "-o",
        str(dest.with_suffix(".%(ext)s")),
        src_url,
    ]


def convert_video(
    src_url: str, dest_path: str, fmt: str, res: str = "720"
) -> Dict[str, Any]:
    dest = Path(dest_path)
    dest.parent.mkdir(parents=True, exist_ok=True)

    fmt = fmt.lower()
    if fmt not in ALLOWED_FORMATS:
        raise ValueError(f"Unsupported format: {fmt}")

    try:
        height = int(res)
    except ValueError:
        raise ValueError(f"Invalid resolution value: {res}")

    cmd = build_cmd(src_url, dest, fmt, height)

    print(
        json.dumps({"debug": {"cmd": cmd, "dest": str(dest)}}, ensure_ascii=False),
        file=sys.stderr,
    )

    startupinfo = None
    if os.name == "nt":
        startupinfo = subprocess.STARTUPINFO()
        startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW

    try:
        proc = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding="utf-8",
            startupinfo=startupinfo,
        )
    except Exception as e:
        raise RuntimeError(f"Failed to run yt-dlp: {e}") from e

    final_dest = dest
    if not final_dest.exists():
        for ext in (fmt, "mp4", "mkv", "webm", "mp3"):
            candidate = dest.with_suffix("." + ext)
            if candidate.exists():
                final_dest = candidate
                break

    size_after = final_dest.stat().st_size if final_dest.exists() else 0

    if not final_dest.exists():
        raise RuntimeError(
            f"yt-dlp did not produce output file. code={proc.returncode}, stderr={proc.stderr or proc.stdout}"
        )

    return {
        "src": src_url,
        "dest": str(final_dest),
        "size_before": 0,
        "size_after": size_after,
        "stderr": proc.stderr,
        "stdout": proc.stdout,
        "returncode": proc.returncode,
    }


def main() -> None:
    if len(sys.argv) != 5:
        print(
            json.dumps(
                {"error": "Usage: video_converter.exe <url> <dest_file> <format> <res>"}
            )
        )
        sys.exit(1)

    url = sys.argv[1]
    dest = sys.argv[2]
    fmt = sys.argv[3]
    res = sys.argv[4]

    try:
        result = convert_video(url, dest, fmt, res)
        print(json.dumps(result, ensure_ascii=False))
    except Exception as e:
        error_payload = {
            "error": str(e),
            "type": type(e).__name__,
        }
        print(json.dumps(error_payload, ensure_ascii=False))
        sys.exit(1)


if __name__ == "__main__":
    main()
