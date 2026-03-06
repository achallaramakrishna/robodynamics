import csv
import json
import math
from pathlib import Path
from typing import Callable, Dict, List


PLAN_TSV = Path("artifacts/prod_qbank_prod_ready_plan_2026-03-01.tsv")
OUT_DIR = Path("artifacts/examprep_qbank_2026-03-04/grade6_svg_library")
MANIFEST_PATH = OUT_DIR / "grade6_math_svg_manifest.json"
README_PATH = OUT_DIR / "README.md"


def slugify(text: str) -> str:
    keep = []
    for ch in text.lower():
        if ch.isalnum():
            keep.append(ch)
        elif ch in (" ", "-", "_", "/"):
            keep.append("_")
    out = "".join(keep)
    while "__" in out:
        out = out.replace("__", "_")
    return out.strip("_")


def clean_session_title(raw: str) -> str:
    title = raw.strip()
    for prefix in ("Session ", "Chapter "):
        if title.startswith(prefix):
            if ":" in title:
                title = title.split(":", 1)[1].strip()
    return title


def svg_wrap(title: str, body: str, width: int = 440, height: int = 300) -> str:
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{width}" height="{height}" '
        f'viewBox="0 0 {width} {height}">'
        f'<rect width="{width}" height="{height}" fill="#ffffff" stroke="#d1d5db"/>'
        f'<text x="16" y="24" font-size="16" font-family="Arial" fill="#111827">{title}</text>'
        f"{body}</svg>"
    )


def render_line_ray_segment() -> str:
    body = (
        '<line x1="40" y1="70" x2="400" y2="70" stroke="#111827" stroke-width="3"/>'
        '<polygon points="400,70 392,64 392,76" fill="#111827"/>'
        '<text x="40" y="58" font-size="13" font-family="Arial">Line</text>'
        '<line x1="60" y1="145" x2="330" y2="145" stroke="#1d4ed8" stroke-width="3"/>'
        '<circle cx="60" cy="145" r="4" fill="#1d4ed8"/>'
        '<polygon points="330,145 322,139 322,151" fill="#1d4ed8"/>'
        '<text x="40" y="133" font-size="13" font-family="Arial">Ray</text>'
        '<line x1="70" y1="220" x2="290" y2="220" stroke="#059669" stroke-width="3"/>'
        '<circle cx="70" cy="220" r="4" fill="#059669"/>'
        '<circle cx="290" cy="220" r="4" fill="#059669"/>'
        '<text x="40" y="208" font-size="13" font-family="Arial">Line Segment</text>'
    )
    return svg_wrap("Basic Geometrical Ideas", body)


def render_polygon_types() -> str:
    body = (
        '<polygon points="80,200 130,110 230,110 280,200 180,250" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>'
        '<text x="120" y="275" font-size="13" font-family="Arial">Pentagon</text>'
        '<polygon points="330,110 390,145 390,215 330,250 270,215 270,145" fill="#dcfce7" stroke="#166534" stroke-width="2"/>'
        '<text x="300" y="275" font-size="13" font-family="Arial">Hexagon</text>'
    )
    return svg_wrap("Understanding Elementary Shapes", body)


def render_angle_set() -> str:
    x0, y0 = 100, 225
    acute_x, acute_y = x0 + 120, y0 - 65
    obt_x, obt_y = x0 + 25, y0 - 120
    body = (
        f'<line x1="{x0}" y1="{y0}" x2="{x0+170}" y2="{y0}" stroke="#111827" stroke-width="3"/>'
        f'<line x1="{x0}" y1="{y0}" x2="{acute_x}" y2="{acute_y}" stroke="#1d4ed8" stroke-width="3"/>'
        f'<text x="{x0+182}" y="{y0+4}" font-size="13">0°</text>'
        f'<text x="{acute_x+8}" y="{acute_y}" font-size="13">Acute</text>'
        f'<line x1="285" y1="225" x2="420" y2="225" stroke="#111827" stroke-width="3"/>'
        f'<line x1="285" y1="225" x2="{obt_x+210}" y2="{obt_y}" stroke="#ef4444" stroke-width="3"/>'
        '<text x="340" y="92" font-size="13">Obtuse</text>'
    )
    return svg_wrap("Lines and Angles", body)


def render_3d_solids() -> str:
    body = (
        '<rect x="35" y="95" width="95" height="95" fill="#dbeafe" stroke="#1d4ed8" stroke-width="2"/>'
        '<rect x="55" y="75" width="95" height="95" fill="none" stroke="#1d4ed8" stroke-width="2"/>'
        '<line x1="35" y1="95" x2="55" y2="75" stroke="#1d4ed8" stroke-width="2"/>'
        '<line x1="130" y1="95" x2="150" y2="75" stroke="#1d4ed8" stroke-width="2"/>'
        '<line x1="130" y1="190" x2="150" y2="170" stroke="#1d4ed8" stroke-width="2"/>'
        '<text x="63" y="215" font-size="13">Cube</text>'
        '<ellipse cx="245" cy="95" rx="43" ry="16" fill="#fee2e2" stroke="#b91c1c" stroke-width="2"/>'
        '<line x1="202" y1="95" x2="202" y2="185" stroke="#b91c1c" stroke-width="2"/>'
        '<line x1="288" y1="95" x2="288" y2="185" stroke="#b91c1c" stroke-width="2"/>'
        '<ellipse cx="245" cy="185" rx="43" ry="16" fill="none" stroke="#b91c1c" stroke-width="2"/>'
        '<text x="220" y="215" font-size="13">Cylinder</text>'
        '<circle cx="360" cy="140" r="45" fill="#fef3c7" stroke="#92400e" stroke-width="2"/>'
        '<text x="336" y="215" font-size="13">Sphere</text>'
    )
    return svg_wrap("Three-Dimensional Shapes", body)


def render_cube_net() -> str:
    x0, y0, s = 120, 70, 40
    cells = [(1, 0), (1, 1), (1, 2), (0, 1), (2, 1), (3, 1)]
    body = []
    for r, c in cells:
        body.append(
            f'<rect x="{x0 + c*s}" y="{y0 + r*s}" width="{s}" height="{s}" '
            'fill="#e0f2fe" stroke="#0c4a6e" stroke-width="2"/>'
        )
    body.append('<text x="88" y="255" font-size="13" font-family="Arial">Valid cube net for folding questions</text>')
    return svg_wrap("Playing with Constructions", "".join(body))


def render_compass_construction() -> str:
    body = (
        '<line x1="75" y1="210" x2="365" y2="210" stroke="#111827" stroke-width="2"/>'
        '<circle cx="140" cy="210" r="4" fill="#111827"/>'
        '<circle cx="300" cy="210" r="4" fill="#111827"/>'
        '<text x="132" y="228" font-size="13">A</text>'
        '<text x="292" y="228" font-size="13">B</text>'
        '<path d="M 140 210 A 95 95 0 0 1 220 117" fill="none" stroke="#ef4444" stroke-width="2"/>'
        '<path d="M 300 210 A 95 95 0 0 0 220 117" fill="none" stroke="#ef4444" stroke-width="2"/>'
        '<circle cx="220" cy="117" r="4" fill="#ef4444"/>'
        '<line x1="140" y1="210" x2="220" y2="117" stroke="#1d4ed8" stroke-width="2"/>'
        '<line x1="300" y1="210" x2="220" y2="117" stroke="#1d4ed8" stroke-width="2"/>'
    )
    return svg_wrap("Constructions", body)


def render_symmetry_axes() -> str:
    body = (
        '<rect x="70" y="80" width="120" height="120" fill="#eef2ff" stroke="#1e3a8a" stroke-width="2"/>'
        '<line x1="130" y1="80" x2="130" y2="200" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/>'
        '<line x1="70" y1="140" x2="190" y2="140" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/>'
        '<text x="86" y="222" font-size="13">Square: 4 lines</text>'
        '<polygon points="295,80 375,200 215,200" fill="#dcfce7" stroke="#166534" stroke-width="2"/>'
        '<line x1="295" y1="80" x2="295" y2="200" stroke="#ef4444" stroke-width="2" stroke-dasharray="6 6"/>'
        '<text x="240" y="222" font-size="13">Isosceles triangle: 1 line</text>'
    )
    return svg_wrap("Symmetry", body)


def render_reflection_grid() -> str:
    x0, y0, cell = 52, 52, 28
    body = []
    for i in range(9):
        body.append(f'<line x1="{x0}" y1="{y0+i*cell}" x2="{x0+12*cell}" y2="{y0+i*cell}" stroke="#d1d5db"/>')
    for i in range(13):
        body.append(f'<line x1="{x0+i*cell}" y1="{y0}" x2="{x0+i*cell}" y2="{y0+8*cell}" stroke="#d1d5db"/>')
    body.append(f'<line x1="{x0+6*cell}" y1="{y0}" x2="{x0+6*cell}" y2="{y0+8*cell}" stroke="#ef4444" stroke-width="2"/>')
    body.append('<polygon points="96,160 150,120 178,185 122,210" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/>')
    body.append('<polygon points="344,160 290,120 262,185 318,210" fill="#bfdbfe" stroke="#1d4ed8" stroke-width="2"/>')
    return svg_wrap("Symmetry Reflection", "".join(body))


def render_perimeter_rectangle() -> str:
    body = (
        '<rect x="95" y="85" width="250" height="130" fill="#f0f9ff" stroke="#0c4a6e" stroke-width="3"/>'
        '<text x="197" y="74" font-size="14">12 cm</text>'
        '<text x="356" y="156" font-size="14">7 cm</text>'
        '<text x="120" y="245" font-size="13">Perimeter = 2 × (length + breadth)</text>'
    )
    return svg_wrap("Perimeter and Area", body)


def render_area_grid_lshape() -> str:
    x0, y0, s = 90, 55, 28
    body = []
    for r in range(6):
        for c in range(7):
            if not (r >= 3 and c >= 4):
                body.append(
                    f'<rect x="{x0 + c*s}" y="{y0 + r*s}" width="{s}" height="{s}" '
                    'fill="#dcfce7" stroke="#166534" stroke-width="1.2"/>'
                )
    body.append('<text x="90" y="250" font-size="13">Each square = 1 sq unit</text>')
    return svg_wrap("Mensuration", "".join(body))


def render_unit_conversion() -> str:
    body = (
        '<rect x="38" y="80" width="365" height="150" rx="10" fill="#f9fafb" stroke="#9ca3af"/>'
        '<text x="75" y="125" font-size="15">1 m = 100 cm</text>'
        '<text x="75" y="160" font-size="15">1 cm = 10 mm</text>'
        '<text x="75" y="195" font-size="15">1 sq m = 10,000 sq cm</text>'
    )
    return svg_wrap("Mensuration Conversions", body)


def render_bar_graph() -> str:
    x0, y0 = 70, 230
    labels = ["Mon", "Tue", "Wed", "Thu", "Fri"]
    values = [4, 7, 5, 9, 6]
    body = ['<line x1="55" y1="230" x2="405" y2="230" stroke="#111827" stroke-width="2"/>']
    for i, (lab, val) in enumerate(zip(labels, values)):
        x = x0 + i * 62
        h = val * 16
        y = y0 - h
        body.append(f'<rect x="{x}" y="{y}" width="38" height="{h}" fill="#93c5fd" stroke="#1d4ed8"/>')
        body.append(f'<text x="{x+11}" y="{y-6}" font-size="12">{val}</text>')
        body.append(f'<text x="{x+5}" y="248" font-size="12">{lab}</text>')
    return svg_wrap("Data Handling", "".join(body))


def render_pictograph() -> str:
    key = "1 ★ = 2 students"
    rows = [("Red", 3), ("Blue", 5), ("Green", 4)]
    body = [f'<text x="40" y="52" font-size="13">{key}</text>']
    y = 95
    for label, stars in rows:
        body.append(f'<text x="40" y="{y+6}" font-size="13">{label}</text>')
        for i in range(stars):
            body.append(f'<text x="{120+i*28}" y="{y+6}" font-size="18" fill="#f59e0b">★</text>')
        y += 55
    return svg_wrap("Data Handling and Presentation", "".join(body))


def render_tally_table() -> str:
    body = (
        '<rect x="70" y="70" width="300" height="165" fill="#ffffff" stroke="#111827"/>'
        '<line x1="180" y1="70" x2="180" y2="235" stroke="#111827"/>'
        '<line x1="280" y1="70" x2="280" y2="235" stroke="#111827"/>'
        '<line x1="70" y1="105" x2="370" y2="105" stroke="#111827"/>'
        '<line x1="70" y1="145" x2="370" y2="145" stroke="#111827"/>'
        '<line x1="70" y1="185" x2="370" y2="185" stroke="#111827"/>'
        '<text x="93" y="93" font-size="12">Item</text><text x="206" y="93" font-size="12">Tally</text><text x="315" y="93" font-size="12">Freq</text>'
        '<text x="95" y="132" font-size="12">Apple</text><text x="206" y="132" font-size="12">||||</text><text x="320" y="132" font-size="12">4</text>'
        '<text x="95" y="172" font-size="12">Banana</text><text x="206" y="172" font-size="12">||||| ||</text><text x="316" y="172" font-size="12">7</text>'
        '<text x="95" y="212" font-size="12">Mango</text><text x="206" y="212" font-size="12">|||||</text><text x="320" y="212" font-size="12">5</text>'
    )
    return svg_wrap("Data Table and Tally", body)


SVG_LIBRARY: List[Dict[str, object]] = [
    {"chapter": "Basic Geometrical Ideas", "template": "line_ray_segment", "renderer": render_line_ray_segment, "tags": ["line", "ray", "segment"]},
    {"chapter": "Understanding Elementary Shapes", "template": "polygon_types", "renderer": render_polygon_types, "tags": ["polygon", "shape"]},
    {"chapter": "Lines and Angles", "template": "angle_set", "renderer": render_angle_set, "tags": ["angles", "classification"]},
    {"chapter": "Three-Dimensional Shapes", "template": "solids_comparison", "renderer": render_3d_solids, "tags": ["cube", "cylinder", "sphere"]},
    {"chapter": "Playing with Constructions", "template": "cube_net_valid", "renderer": render_cube_net, "tags": ["net", "3d"]},
    {"chapter": "Constructions", "template": "compass_bisector", "renderer": render_compass_construction, "tags": ["compass", "construction"]},
    {"chapter": "Symmetry", "template": "axes_overview", "renderer": render_symmetry_axes, "tags": ["line_of_symmetry"]},
    {"chapter": "Symmetry", "template": "reflection_grid", "renderer": render_reflection_grid, "tags": ["reflection"]},
    {"chapter": "Perimeter and Area", "template": "perimeter_rectangle", "renderer": render_perimeter_rectangle, "tags": ["perimeter"]},
    {"chapter": "Mensuration", "template": "area_lshape_grid", "renderer": render_area_grid_lshape, "tags": ["area"]},
    {"chapter": "Mensuration", "template": "unit_conversion_card", "renderer": render_unit_conversion, "tags": ["unit-conversion"]},
    {"chapter": "Data Handling", "template": "bar_graph_week", "renderer": render_bar_graph, "tags": ["bar-graph"]},
    {"chapter": "Data Handling and Presentation", "template": "pictograph_students", "renderer": render_pictograph, "tags": ["pictograph"]},
    {"chapter": "Data Handling and Presentation", "template": "tally_table", "renderer": render_tally_table, "tags": ["tally", "frequency"]},
]


def load_chapter_pdf_map() -> Dict[str, List[str]]:
    chapter_to_pdfs: Dict[str, List[str]] = {}
    if not PLAN_TSV.exists():
        return chapter_to_pdfs

    with PLAN_TSV.open("r", encoding="utf-8") as f:
        reader = csv.DictReader(f, delimiter="\t")
        for row in reader:
            if row.get("subject_bucket") != "MATH":
                continue
            course_name = (row.get("course_name") or "").lower()
            if "grade 6" not in course_name:
                continue
            chapter = clean_session_title(row.get("session_title") or "")
            sample_pdf = row.get("sample_pdf") or ""
            if not chapter or not sample_pdf:
                continue
            chapter_to_pdfs.setdefault(chapter, [])
            if sample_pdf not in chapter_to_pdfs[chapter]:
                chapter_to_pdfs[chapter].append(sample_pdf)
    return chapter_to_pdfs


def chapter_pdf_refs(chapter: str, chapter_map: Dict[str, List[str]]) -> List[str]:
    direct = chapter_map.get(chapter, [])
    if direct:
        return direct
    # Fallback to fuzzy contains for chapter variants
    key = chapter.lower()
    refs: List[str] = []
    for k, vals in chapter_map.items():
        kk = k.lower()
        if key in kk or kk in key:
            refs.extend(vals)
    seen = []
    for p in refs:
        if p not in seen:
            seen.append(p)
    return seen


def generate_library() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    chapter_map = load_chapter_pdf_map()
    manifest: Dict[str, object] = {
        "title": "CBSE Grade 6 Math SVG Library",
        "generated_at": "2026-03-04",
        "source_plan_tsv": str(PLAN_TSV),
        "assets": [],
    }

    for i, item in enumerate(SVG_LIBRARY, start=1):
        chapter = str(item["chapter"])
        template = str(item["template"])
        renderer: Callable[[], str] = item["renderer"]  # type: ignore[assignment]
        tags = list(item["tags"])  # type: ignore[arg-type]

        filename = f"g6_{i:02d}_{slugify(chapter)}_{slugify(template)}.svg"
        out_path = OUT_DIR / filename
        out_path.write_text(renderer(), encoding="utf-8")

        asset_record = {
            "sequence_no": i,
            "chapter": chapter,
            "template": template,
            "filename": filename,
            "relative_path": str(out_path).replace("\\", "/"),
            "chapter_pdf_references": chapter_pdf_refs(chapter, chapter_map),
            "tags": tags,
        }
        manifest["assets"].append(asset_record)  # type: ignore[index]

    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    lines = [
        "# CBSE Grade 6 Math SVG Library",
        "",
        "This folder contains chapter-aligned SVG templates for image-based question generation.",
        "",
        f"- Total SVG Assets: `{len(SVG_LIBRARY)}`",
        f"- Manifest: `{MANIFEST_PATH}`",
        "",
        "## Chapter Coverage",
        "",
    ]
    chapter_counts: Dict[str, int] = {}
    for a in manifest["assets"]:  # type: ignore[index]
        ch = a["chapter"]  # type: ignore[index]
        chapter_counts[ch] = chapter_counts.get(ch, 0) + 1
    for ch in sorted(chapter_counts):
        lines.append(f"- `{ch}`: {chapter_counts[ch]} SVG templates")

    lines.extend(
        [
            "",
            "## Notes",
            "",
            "- `chapter_pdf_references` are pulled from Grade 6 rows in the prod-ready plan TSV.",
            "- Use these SVG files directly in `question_image` fields or as base templates for variants.",
            "",
        ]
    )
    README_PATH.write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    generate_library()
    print(f"Generated {len(SVG_LIBRARY)} SVG templates in {OUT_DIR}")


if __name__ == "__main__":
    main()

