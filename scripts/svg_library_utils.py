import json
import shutil
from pathlib import Path
from typing import Dict, Iterable, List, Tuple


def resolve_manifest_path(candidates: Iterable[Path]) -> Path:
    checked: List[str] = []
    for path in candidates:
        checked.append(str(path))
        if path.exists():
            return path
    raise FileNotFoundError(f"No manifest found. Checked: {checked}")


def load_manifest_assets(manifest_path: Path) -> Tuple[Dict, List[Dict]]:
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    assets = data.get("assets", [])
    if not isinstance(assets, list):
        raise ValueError(f"Invalid manifest format (assets must be list): {manifest_path}")
    return data, assets


def normalize_path(path_str: str) -> Path:
    if not path_str:
        raise ValueError("Empty path in asset manifest")
    return Path(path_str.replace("\\", "/"))


def build_chapter_template_lookup(assets: List[Dict], path_key: str = "relative_path") -> Dict[str, Path]:
    lookup: Dict[str, Path] = {}
    for asset in assets:
        chapter = str(asset.get("chapter", "")).strip()
        template = str(asset.get("template", "")).strip()
        raw_path = str(asset.get(path_key, "")).strip()
        if not (chapter and template and raw_path):
            continue
        lookup[f"{chapter}::{template}"] = normalize_path(raw_path)
    return lookup


def copy_asset_to_question_image(
    qid: int,
    chapter: str,
    template: str,
    lookup: Dict[str, Path],
    image_dir: Path,
    file_prefix: str,
    image_url_prefix: str,
) -> str:
    key = f"{chapter}::{template}"
    src_path = lookup.get(key)
    if src_path is None:
        raise KeyError(f"Missing SVG for key: {key}")
    if not src_path.exists():
        raise FileNotFoundError(f"SVG source does not exist: {src_path}")

    image_dir.mkdir(parents=True, exist_ok=True)
    out_name = f"{file_prefix}{qid:02d}.svg"
    out_path = image_dir / out_name
    shutil.copyfile(src_path, out_path)
    return f"{image_url_prefix}/{out_name}"

