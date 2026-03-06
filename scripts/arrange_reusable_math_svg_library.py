import json
import shutil
from collections import Counter
from pathlib import Path
from typing import Dict, List


SHARED_ROOT = Path("artifacts/examprep_qbank_2026-03-04/svg_library")
GRADE5_ROOT = SHARED_ROOT / "grade_5"
GRADE6_ROOT = SHARED_ROOT / "grade_6"

G5_SOURCE_JSON = Path("artifacts/examprep_qbank_2026-03-04/course_34/grade5_image_set_30/grade5_image_questions_30.json")
G5_SOURCE_IMAGES = Path("artifacts/examprep_qbank_2026-03-04/course_34/grade5_image_set_30/images")

G6_SOURCE_MANIFEST = Path("artifacts/examprep_qbank_2026-03-04/grade6_svg_library/grade6_math_svg_manifest.json")

INDEX_MANIFEST = SHARED_ROOT / "manifest_index.json"
README_PATH = SHARED_ROOT / "README.md"


def slugify(text: str) -> str:
    out = []
    for ch in text.lower():
        if ch.isalnum():
            out.append(ch)
        elif ch in (" ", "-", "_", "/"):
            out.append("_")
    value = "".join(out)
    while "__" in value:
        value = value.replace("__", "_")
    return value.strip("_")


def ensure_clean_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def parse_chapter(additional_info: str) -> str:
    marker = "Chapter: "
    if marker in additional_info:
        return additional_info.split(marker, 1)[1].strip()
    return "General"


def build_grade5_manifest() -> Dict:
    if not G5_SOURCE_JSON.exists():
        raise FileNotFoundError(f"Missing Grade 5 source json: {G5_SOURCE_JSON}")
    if not G5_SOURCE_IMAGES.exists():
        raise FileNotFoundError(f"Missing Grade 5 source images: {G5_SOURCE_IMAGES}")

    data = json.loads(G5_SOURCE_JSON.read_text(encoding="utf-8"))
    questions = data.get("questions", [])
    if not isinstance(questions, list):
        raise ValueError(f"Invalid Grade 5 source format: {G5_SOURCE_JSON}")

    grade_root = GRADE5_ROOT
    asset_dir = grade_root / "assets"
    ensure_clean_dir(asset_dir)

    assets: List[Dict] = []
    for idx, q in enumerate(questions, start=1):
        chapter = parse_chapter(str(q.get("additional_info", "")))
        q_image = str(q.get("question_image", ""))
        src_name = Path(q_image).name
        src_path = G5_SOURCE_IMAGES / src_name
        if not src_path.exists():
            # Skip broken refs; keeps manifest consistent with available files.
            continue
        template = f"set1_q{int(q.get('sequence_no', idx)):02d}"
        out_name = f"g5_{int(q.get('sequence_no', idx)):02d}_{slugify(chapter)}.svg"
        out_path = asset_dir / out_name
        shutil.copyfile(src_path, out_path)

        assets.append(
            {
                "sequence_no": len(assets) + 1,
                "chapter": chapter,
                "template": template,
                "filename": out_name,
                "relative_path": str(out_path).replace("\\", "/"),
                "source_ref": str(src_path).replace("\\", "/"),
                "tags": [slugify(chapter)],
            }
        )

    manifest = {
        "title": "Reusable SVG Library - Grade 5 Math",
        "grade": "5",
        "subject": "Mathematics",
        "generated_at": "2026-03-04",
        "source": str(G5_SOURCE_JSON).replace("\\", "/"),
        "assets": assets,
    }
    manifest_path = grade_root / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def build_grade6_manifest() -> Dict:
    if not G6_SOURCE_MANIFEST.exists():
        raise FileNotFoundError(f"Missing Grade 6 source manifest: {G6_SOURCE_MANIFEST}")

    src_data = json.loads(G6_SOURCE_MANIFEST.read_text(encoding="utf-8"))
    src_assets = src_data.get("assets", [])
    if not isinstance(src_assets, list):
        raise ValueError(f"Invalid Grade 6 source format: {G6_SOURCE_MANIFEST}")

    grade_root = GRADE6_ROOT
    asset_dir = grade_root / "assets"
    ensure_clean_dir(asset_dir)

    assets: List[Dict] = []
    for i, a in enumerate(src_assets, start=1):
        chapter = str(a.get("chapter", "")).strip() or "General"
        template = str(a.get("template", "")).strip() or f"template_{i:02d}"
        src_rel = str(a.get("relative_path", "")).strip()
        if not src_rel:
            continue
        src_path = Path(src_rel.replace("\\", "/"))
        if not src_path.exists():
            continue

        out_name = str(a.get("filename", "")).strip() or f"g6_{i:02d}_{slugify(chapter)}_{slugify(template)}.svg"
        out_path = asset_dir / out_name
        shutil.copyfile(src_path, out_path)

        assets.append(
            {
                "sequence_no": len(assets) + 1,
                "chapter": chapter,
                "template": template,
                "filename": out_name,
                "relative_path": str(out_path).replace("\\", "/"),
                "source_ref": str(src_path).replace("\\", "/"),
                "chapter_pdf_references": a.get("chapter_pdf_references", []),
                "tags": a.get("tags", []),
            }
        )

    manifest = {
        "title": "Reusable SVG Library - Grade 6 Math",
        "grade": "6",
        "subject": "Mathematics",
        "generated_at": "2026-03-04",
        "source": str(G6_SOURCE_MANIFEST).replace("\\", "/"),
        "assets": assets,
    }
    manifest_path = grade_root / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


def write_root_index(grade5_manifest: Dict, grade6_manifest: Dict) -> None:
    index = {
        "title": "Reusable SVG Library Index",
        "generated_at": "2026-03-04",
        "manifests": [
            {"grade": "5", "manifest": str((GRADE5_ROOT / "manifest.json")).replace("\\", "/"), "asset_count": len(grade5_manifest.get("assets", []))},
            {"grade": "6", "manifest": str((GRADE6_ROOT / "manifest.json")).replace("\\", "/"), "asset_count": len(grade6_manifest.get("assets", []))},
        ],
    }
    INDEX_MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    INDEX_MANIFEST.write_text(json.dumps(index, indent=2), encoding="utf-8")

    g5_ch = Counter(a.get("chapter", "General") for a in grade5_manifest.get("assets", []))
    g6_ch = Counter(a.get("chapter", "General") for a in grade6_manifest.get("assets", []))
    lines = [
        "# Reusable SVG Library (Grade 5 + Grade 6 Math)",
        "",
        "This folder is a shared SVG asset library for math question generation across Grade 5 and Grade 6 courses.",
        "",
        f"- Grade 5 assets: `{len(grade5_manifest.get('assets', []))}`",
        f"- Grade 6 assets: `{len(grade6_manifest.get('assets', []))}`",
        f"- Index file: `{INDEX_MANIFEST}`",
        "",
        "## Grade 5 Chapters",
        "",
    ]
    for chapter, count in sorted(g5_ch.items()):
        lines.append(f"- `{chapter}`: {count}")
    lines.extend(["", "## Grade 6 Chapters", ""])
    for chapter, count in sorted(g6_ch.items()):
        lines.append(f"- `{chapter}`: {count}")
    lines.extend(
        [
            "",
            "## Usage",
            "",
            "- Pick grade manifest (`grade_5/manifest.json` or `grade_6/manifest.json`).",
            "- Select `chapter` + `template` entry.",
            "- Copy `relative_path` SVG into the target course image folder.",
            "",
        ]
    )
    README_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    g5 = build_grade5_manifest()
    g6 = build_grade6_manifest()
    write_root_index(g5, g6)
    print(
        "Reusable SVG library arranged at "
        f"{SHARED_ROOT} | grade5={len(g5.get('assets', []))}, grade6={len(g6.get('assets', []))}"
    )


if __name__ == "__main__":
    main()

