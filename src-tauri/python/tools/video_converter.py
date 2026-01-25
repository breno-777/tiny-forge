import sys
import json
import os
from pathlib import Path
import subprocess

ALLOWED_FORMATS = {"mp3", "mp4", "webm", "mkv"}


def get_yt_dlp_path() -> str:
    base = os.path.dirname(
        os.path.abspath(sys.executable if getattr(sys, "frozen", False) else __file__)
    )
    exe_path = os.path.join(base, "yt-dlp.exe")
    if not os.path.exists(exe_path):
        raise FileNotFoundError(f"yt-dlp.exe não encontrado em {exe_path}")
    return exe_path


def convert_video(src_url: str, dest_path: str, fmt: str, res: str = "720") -> dict:
    dest = Path(dest_path)
    dest.parent.mkdir(parents=True, exist_ok=True)

    fmt = fmt.lower()
    if fmt not in ALLOWED_FORMATS:
        raise ValueError(f"Unsupported format: {fmt}")

    height = int(res)

    yt_dlp_exe = get_yt_dlp_path()

    if fmt == "mp3":
        cmd = [
            yt_dlp_exe,
            "-x",
            "--audio-format",
            "mp3",
            "--audio-quality",
            "0",
            "-o",
            str(dest.with_suffix(".%(ext)s")),
            src_url,
        ]
    else:
        cmd = [
            yt_dlp_exe,
            "-f",
            f"bestvideo[height<={height}]+bestaudio/best",
            "-o",
            str(dest.with_suffix(".%(ext)s")),
            src_url,
        ]

    proc = subprocess.run(cmd, capture_output=True, text=True)
    if proc.returncode != 0:
        raise RuntimeError(f"yt-dlp failed: {proc.stderr}")

    generated = dest.with_suffix("." + fmt)
    final_dest = generated if generated.exists() else dest

    if generated.exists() and dest != generated:
        os.replace(generated, dest)
        final_dest = dest

    return {
        "src": src_url,
        "dest": str(final_dest),
        "size_before": 0,
        "size_after": final_dest.stat().st_size if final_dest.exists() else 0,
    }


def main():
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
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)


if __name__ == "__main__":
    main()
