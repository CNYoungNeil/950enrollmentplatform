import os
import shutil
import time
from pathlib import Path

from fastapi import UploadFile

_EXT_TO_TYPE: dict[str, int] = {
    ".pdf": 1,
    ".doc": 2,
    ".docx": 3,
    ".ppt": 4,
    ".pptx": 5,
    ".zip": 6,
    ".png": 7,
    ".jpg": 7,
    ".jpeg": 7,
    ".gif": 7,
    ".webp": 7,
    ".bmp": 7,
    ".mp4": 8,
    ".avi": 8,
    ".mov": 8,
    ".mkv": 8,
    ".wmv": 8,
}


def save_upload(upload: UploadFile, dest_dir: str) -> tuple[str, int]:
    """Save UploadFile to dest_dir. Returns (file_url_path, file_type_code)."""
    os.makedirs(dest_dir, exist_ok=True)
    original_name = upload.filename or "unnamed"
    ext = Path(original_name).suffix.lower()
    file_type = _EXT_TO_TYPE.get(ext, 9)
    unique_name = f"{int(time.time() * 1000)}_{original_name}"
    dest_path = os.path.join(dest_dir, unique_name)
    with open(dest_path, "wb") as buf:
        shutil.copyfileobj(upload.file, buf)
    # Store as a URL-friendly forward-slash path
    file_url = "/" + dest_path.replace(os.sep, "/")
    return file_url, file_type
