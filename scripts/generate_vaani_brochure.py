from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "artifacts" / "vaani-brochure"
PAGE_W = 1654
PAGE_H = 2339


LEVELS = [
    {
        "id": "Level 1",
        "name": "Hindi Akshar Launch",
        "color": "#F97316",
        "count": "46 lessons",
        "tagline": "A public-ready alphabet path for first-time Hindi readers.",
        "headline": "Start with swar and early vyanjan using tracing, visuals, and quick checks.",
        "ideal": "Ideal for first-time Hindi readers beginning letter recognition and sound mapping.",
        "outcome": "Recognize Hindi letters, trace them confidently, and connect sounds to simple anchor words.",
        "modules": [
            "Swar recognition",
            "Visual word anchors",
            "Guided tracing practice",
            "Sound-letter matching",
            "Early consonants",
            "Quick reading checks",
        ],
    },
    {
        "id": "Level 2",
        "name": "Matra and Vowel Modifiers",
        "color": "#8B5CF6",
        "count": "36 lessons",
        "tagline": "36 lessons covering all major vowel matras with tracing and speech practice.",
        "headline": "Transform consonants using matra marks to build real Hindi words.",
        "ideal": "Ideal for learners who know letters and are ready to modify sounds into full word forms.",
        "outcome": "Understand how matras change pronunciation, read modified characters, and write them accurately.",
        "modules": [
            "Matra recognition",
            "Base plus matra transformation",
            "Tracing matra forms",
            "Word-building practice",
            "Reading with sound cues",
            "Quick accuracy checks",
        ],
    },
    {
        "id": "Level 3",
        "name": "Consonant Conjuncts",
        "color": "#F59E0B",
        "count": "38 lessons",
        "tagline": "38 lessons covering ka, ta and other conjunct families with visual and speech practice.",
        "headline": "Master complex consonant combinations that appear in many Hindi words.",
        "ideal": "Ideal for readers ready to move beyond single letters and modified forms into fused sounds.",
        "outcome": "Recognize conjuncts in context, read more natural Hindi words, and write combined forms with confidence.",
        "modules": [
            "Conjunct formation",
            "Visual sound fusion",
            "Word recognition",
            "Writing combined forms",
            "Family-based review",
            "Reading fluency checks",
        ],
    },
    {
        "id": "Level 4",
        "name": "Barakhadi Mastery",
        "color": "#6366F1",
        "count": "36 lessons",
        "tagline": "36 lessons covering all 33 Hindi consonants with their complete 12-sound barakhadi rows.",
        "headline": "Master the full syllabic matrix of consonants and vowel sounds.",
        "ideal": "Ideal for learners ready to systematize reading and pronounce syllables instantly.",
        "outcome": "Read any Hindi syllable through the barakhadi grid and build stronger decoding speed for new words.",
        "modules": [
            "Barakhadi rows",
            "Consonant-vowel mapping",
            "Pronunciation practice",
            "Syllable recall",
            "Word construction",
            "Mastery review",
        ],
    },
    {
        "id": "Level 5",
        "name": "Simple Sentences",
        "color": "#10B981",
        "count": "30 lessons",
        "tagline": "30 lessons moving from 2-word sentences to full My World stories.",
        "headline": "Read and understand real Hindi sentences as the payoff of the earlier levels.",
        "ideal": "Ideal for learners ready to combine reading confidence into meaningful sentence-level understanding.",
        "outcome": "Read short Hindi sentences aloud, understand simple structure, and express everyday ideas.",
        "modules": [
            "Two-word sentences",
            "Three-word sentences",
            "Picture-supported reading",
            "Meaning checks",
            "Daily-life language",
            "Story-style practice",
        ],
    },
    {
        "id": "Level 6",
        "name": "Grammar Essentials",
        "color": "#EC4899",
        "count": "42 lessons",
        "tagline": "42 lessons covering nouns, adjectives, verbs, pronouns, and complex sentences.",
        "headline": "Move from reading to structured Hindi grammar and sentence construction.",
        "ideal": "Ideal for learners ready to understand how Hindi works, not just how it sounds.",
        "outcome": "Understand parts of speech, build grammatically correct Hindi sentences, and improve expressive confidence.",
        "modules": [
            "Nouns and pronouns",
            "Adjectives and modifiers",
            "Verbs and action words",
            "Sentence building",
            "Grammar patterns",
            "Complex sentence practice",
        ],
    },
]


FAQS = [
    ("Who is Vaani for?", "Vaani is designed for children building Hindi literacy step by step, from first letters to sentence construction."),
    ("How does learning happen?", "Through visual anchors, tracing, speaking practice, reading checks, and level-based progression."),
    ("Does it only teach letters?", "No. Vaani grows from alphabet confidence into matras, conjuncts, barakhadi, reading, and grammar."),
    ("Can parents follow progress?", "Yes. The level structure makes it easy to see what a child has learned and what comes next."),
]


def ensure_dir() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)


def font(size: int, bold: bool = False, italic: bool = False):
    candidates = []
    if bold:
        candidates += [
            "C:/Windows/Fonts/trebucbd.ttf",
            "C:/Windows/Fonts/georgiab.ttf",
            "C:/Windows/Fonts/arialbd.ttf",
        ]
    elif italic:
        candidates += [
            "C:/Windows/Fonts/georgiai.ttf",
            "C:/Windows/Fonts/ariali.ttf",
        ]
    else:
        candidates += [
            "C:/Windows/Fonts/trebuc.ttf",
            "C:/Windows/Fonts/georgia.ttf",
            "C:/Windows/Fonts/arial.ttf",
        ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


def hex_rgb(color: str) -> tuple[int, int, int]:
    color = color.lstrip("#")
    return tuple(int(color[i : i + 2], 16) for i in (0, 2, 4))


def vertical_gradient(size: tuple[int, int], top: str, bottom: str) -> Image.Image:
    w, h = size
    top_rgb = hex_rgb(top)
    bottom_rgb = hex_rgb(bottom)
    img = Image.new("RGB", size, top_rgb)
    px = img.load()
    for y in range(h):
        t = y / max(h - 1, 1)
        row = tuple(int(top_rgb[i] * (1 - t) + bottom_rgb[i] * t) for i in range(3))
        for x in range(w):
            px[x, y] = row
    return img


def draw_wrapped(draw, text: str, xy: tuple[int, int], width: int, line_font, fill: str, spacing: int = 10) -> int:
    x, y = xy
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        test = word if not current else f"{current} {word}"
        box = draw.textbbox((0, 0), test, font=line_font)
        if box[2] - box[0] <= width:
            current = test
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    line_h = draw.textbbox((0, 0), "Ag", font=line_font)[3]
    for line in lines:
        draw.text((x, y), line, font=line_font, fill=fill)
        y += line_h + spacing
    return y


def pill(draw, box: tuple[int, int, int, int], fill: str, text: str, text_fill: str) -> None:
    draw.rounded_rectangle(box, radius=30, fill=fill)
    label_font = font(30, bold=True)
    bbox = draw.textbbox((0, 0), text, font=label_font)
    tx = box[0] + ((box[2] - box[0]) - (bbox[2] - bbox[0])) / 2
    ty = box[1] + ((box[3] - box[1]) - (bbox[3] - bbox[1])) / 2 - 2
    draw.text((tx, ty), text, font=label_font, fill=text_fill)


def add_soft_circles(base: Image.Image, colors: list[str]) -> None:
    overlay = Image.new("RGBA", base.size, (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    circles = [
        (1100, -120, 1720, 500, colors[0]),
        (-120, 1500, 600, 2240, colors[1]),
        (1220, 1700, 1760, 2240, colors[2]),
    ]
    for x1, y1, x2, y2, color in circles:
        od.ellipse((x1, y1, x2, y2), fill=hex_rgb(color) + (70,))
    base.alpha_composite(overlay)


def page_cover() -> Image.Image:
    img = vertical_gradient((PAGE_W, PAGE_H), "#FFF8EF", "#FFF2E2").convert("RGBA")
    add_soft_circles(img, ["#F97316", "#8B5CF6", "#10B981"])
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle((96, 88, 430, 160), radius=32, fill="#111827")
    draw.text((128, 104), "RoboDynamics", font=font(34, bold=True), fill="#F9FAFB")
    draw.text((100, 230), "Vaani", font=font(124, bold=True), fill="#0F172A")
    draw.text((104, 370), "AI Hindi Literacy Program", font=font(44), fill="#C2410C")
    y = draw_wrapped(
        draw,
        "A 6-level Hindi literacy journey that takes children from first letters to reading, writing, sentence confidence, and grammar foundations.",
        (104, 470),
        990,
        font(40),
        "#334155",
        spacing=14,
    )
    pill(draw, (104, y + 30, 460, y + 96), "#0F172A", "6 Levels", "#FFFFFF")
    pill(draw, (490, y + 30, 1010, y + 96), "#FFFFFF", "228 Guided Lessons", "#0F172A")

    card = (92, 1260, 1562, 2080)
    draw.rounded_rectangle(card, radius=48, fill="#0F172A")
    draw.text((150, 1328), "What Vaani builds", font=font(42, bold=True), fill="#F8FAFC")
    bullets = [
        "Letter recognition through bright visual anchors and guided tracing",
        "Progression from akshars to matras, conjuncts, barakhadi, and reading",
        "Sentence-level confidence instead of isolated memorization",
        "A structured literacy path parents can easily understand and support",
    ]
    by = 1438
    for bullet_text in bullets:
        draw.ellipse((152, by + 14, 176, by + 38), fill="#F59E0B")
        by = draw_wrapped(draw, bullet_text, (200, by), 1250, font(34), "#E2E8F0", spacing=10) + 16

    draw.text((150, 1868), "Signature promise", font=font(30, bold=True), fill="#FBBF24")
    draw_wrapped(
        draw,
        "Vaani turns Hindi literacy into a guided, visual journey children can enjoy and families can trust.",
        (150, 1915),
        1240,
        font(34),
        "#F8FAFC",
        spacing=10,
    )
    return img.convert("RGB")


def page_overview() -> Image.Image:
    img = vertical_gradient((PAGE_W, PAGE_H), "#F8FBFF", "#EEF6FF").convert("RGBA")
    add_soft_circles(img, ["#60A5FA", "#A78BFA", "#FDBA74"])
    draw = ImageDraw.Draw(img)
    draw.text((96, 110), "How Vaani Works", font=font(76, bold=True), fill="#0F172A")
    draw_wrapped(
        draw,
        "Each level is designed to unlock the next layer of Hindi literacy: recognition, sound, reading, writing, fluency, and structure.",
        (100, 220),
        1260,
        font(34),
        "#475569",
    )

    band_y = 430
    steps = [
        ("1", "See the letter", "#F97316"),
        ("2", "Trace and say it", "#8B5CF6"),
        ("3", "Read it in words", "#10B981"),
        ("4", "Use it in sentences", "#F59E0B"),
    ]
    step_w = 350
    for i, (num, label, color) in enumerate(steps):
        x = 96 + i * (step_w + 20)
        draw.rounded_rectangle((x, band_y, x + step_w, band_y + 250), radius=36, fill=color)
        draw.text((x + 34, band_y + 30), num, font=font(72, bold=True), fill="#FFFFFF")
        draw_wrapped(draw, label, (x + 34, band_y + 122), step_w - 68, font(34, bold=True), "#FFFFFF", spacing=8)

    draw.text((96, 795), "6-Level Literacy Progression", font=font(50, bold=True), fill="#0F172A")
    timeline_y = 900
    card_w = 240
    gap = 16
    for idx, level in enumerate(LEVELS):
        x = 76 + idx * (card_w + gap)
        color = level["color"]
        draw.rounded_rectangle((x, timeline_y, x + card_w, timeline_y + 338), radius=34, fill=color)
        draw.text((x + 24, timeline_y + 24), level["id"], font=font(30, bold=True), fill="#FFFFFF")
        draw_wrapped(draw, level["name"], (x + 24, timeline_y + 78), 184, font(30, bold=True), "#FFFFFF", spacing=6)
        draw.text((x + 24, timeline_y + 254), level["count"], font=font(24, bold=True), fill="#F8FAFC")

    box1 = (96, 1380, 746, 2088)
    box2 = (806, 1380, 1556, 2088)
    for box, title in [(box1, "Why this matters"), (box2, "Parent-ready answers")]:
        draw.rounded_rectangle(box, radius=42, fill="#FFFFFF")
        draw.text((box[0] + 36, box[1] + 34), title, font=font(42, bold=True), fill="#0F172A")

    body_y = 1470
    points = [
        "Starts with confidence, not pressure",
        "Builds reading and writing together",
        "Creates a clear path from basic literacy to grammar",
        "Makes Hindi feel structured and approachable",
    ]
    for point in points:
        draw.ellipse((130, body_y + 12, 152, body_y + 34), fill="#2563EB")
        body_y = draw_wrapped(draw, point, (174, body_y), 500, font(28), "#334155", spacing=8) + 12

    faq_y = 1470
    for q, a in FAQS:
        draw.text((842, faq_y), q, font=font(28, bold=True), fill="#0F172A")
        faq_y = draw_wrapped(draw, a, (842, faq_y + 42), 650, font(24), "#475569", spacing=7) + 20
    return img.convert("RGB")


def page_level(level: dict[str, str], page_num: int) -> Image.Image:
    palette = {
        1: ("#FFF7ED", "#FFEDD5"),
        2: ("#F5F3FF", "#EDE9FE"),
        3: ("#FFF7ED", "#FEF3C7"),
        4: ("#EEF2FF", "#E0E7FF"),
        5: ("#ECFDF5", "#D1FAE5"),
        6: ("#FDF2F8", "#FCE7F3"),
    }
    top, bottom = palette[page_num]
    img = vertical_gradient((PAGE_W, PAGE_H), top, bottom).convert("RGBA")
    add_soft_circles(img, [level["color"], "#FFFFFF", "#CBD5E1"])
    draw = ImageDraw.Draw(img)
    accent = level["color"]

    draw.rounded_rectangle((94, 88, 340, 152), radius=28, fill=accent)
    draw.text((126, 102), level["id"], font=font(32, bold=True), fill="#FFFFFF")
    draw.text((96, 210), level["name"], font=font(76, bold=True), fill="#0F172A")
    draw_wrapped(draw, level["headline"], (100, 326), 1320, font(38), "#334155", spacing=10)

    left = (96, 500, 760, 2200)
    right = (820, 500, 1558, 2200)
    draw.rounded_rectangle(left, radius=44, fill="#FFFFFF")
    draw.rounded_rectangle(right, radius=44, fill="#FFFFFF")

    draw.text((134, 544), "Who this level is for", font=font(38, bold=True), fill="#0F172A")
    draw_wrapped(draw, level["ideal"], (136, 608), 560, font(28), "#475569", spacing=8)
    draw.text((134, 760), "What it unlocks", font=font(38, bold=True), fill="#0F172A")
    draw_wrapped(draw, level["outcome"], (136, 824), 560, font(28), "#475569", spacing=8)
    draw.text((134, 1010), "Level outline", font=font(38, bold=True), fill="#0F172A")

    module_y = 1084
    for idx, module in enumerate(level["modules"], start=1):
        draw.rounded_rectangle((136, module_y, 678, module_y + 92), radius=24, fill=accent)
        draw.text((158, module_y + 24), f"{idx:02d}", font=font(28, bold=True), fill="#FFFFFF")
        draw_wrapped(draw, module, (236, module_y + 18), 420, font(25, bold=True), "#FFFFFF", spacing=4)
        module_y += 106

    draw.text((856, 544), "Why families value it", font=font(38, bold=True), fill="#0F172A")
    benefit_text = [
        level["tagline"],
        f"{level['count']} in this stage of the journey.",
        "Structured progression keeps literacy growth visible and motivating.",
    ]
    benefit_y = 620
    for line in benefit_text:
        draw.ellipse((858, benefit_y + 10, 880, benefit_y + 32), fill=accent)
        benefit_y = draw_wrapped(draw, line, (904, benefit_y), 560, font(28), "#334155", spacing=8) + 18

    draw.rounded_rectangle((856, 1000, 1500, 1322), radius=36, fill=accent)
    draw.text((902, 1050), "Vaani move", font=font(32, bold=True), fill="#FFFFFF")
    draw_wrapped(
        draw,
        "Children do not just repeat. They see, trace, pronounce, read, and then apply the pattern in a more meaningful context.",
        (902, 1112),
        540,
        font(28),
        "#FFFFFF",
        spacing=8,
    )

    draw.text((856, 1446), "Progress signal", font=font(38, bold=True), fill="#0F172A")
    draw_wrapped(
        draw,
        f"{level['count']}. One clear literacy milestone. A strong bridge into the next stage of Hindi confidence.",
        (858, 1510),
        560,
        font(30),
        "#475569",
        spacing=8,
    )

    draw.rounded_rectangle((856, 1702, 1500, 2064), radius=36, outline=accent, width=4)
    draw.text((904, 1756), "Brochure takeaway", font=font(32, bold=True), fill="#0F172A")
    draw_wrapped(
        draw,
        "This level makes the next one easier because skills are layered, not scattered. That is the core strength of the Vaani journey.",
        (904, 1820),
        540,
        font(29),
        "#334155",
        spacing=8,
    )
    return img.convert("RGB")


def page_closing() -> Image.Image:
    img = vertical_gradient((PAGE_W, PAGE_H), "#0F172A", "#1E1B4B").convert("RGBA")
    add_soft_circles(img, ["#8B5CF6", "#F97316", "#10B981"])
    draw = ImageDraw.Draw(img)
    draw.text((96, 120), "Built for literacy confidence", font=font(72, bold=True), fill="#F8FAFC")
    draw_wrapped(
        draw,
        "From first akshars to grammar essentials, Vaani is designed as a complete Hindi literacy pathway instead of a disconnected set of drills.",
        (100, 230),
        1240,
        font(34),
        "#CBD5E1",
        spacing=10,
    )

    draw.rounded_rectangle((96, 520, 1558, 1180), radius=48, fill="#111827")
    draw.text((142, 590), "Vaani at a glance", font=font(48, bold=True), fill="#F8FAFC")
    summary = [
        "6 progression levels from alphabet launch to grammar essentials",
        "228 lessons across recognition, reading, writing, sentence use, and structure",
        "A child-friendly progression that makes Hindi feel achievable",
        "Clear literacy milestones that parents and educators can follow",
    ]
    sy = 700
    for line in summary:
        draw.ellipse((146, sy + 10, 170, sy + 34), fill="#F59E0B")
        sy = draw_wrapped(draw, line, (194, sy), 1180, font(30), "#E2E8F0", spacing=8) + 18

    draw.rounded_rectangle((96, 1290, 1558, 1980), radius=48, fill="#FFFFFF")
    draw.text((140, 1360), "Level journey summary", font=font(46, bold=True), fill="#0F172A")
    journey = [
        "Level 1 starts with recognition and tracing.",
        "Level 2 expands sounds through matras.",
        "Level 3 introduces conjunct reading.",
        "Level 4 builds full syllable mastery through barakhadi.",
        "Level 5 moves into sentence reading.",
        "Level 6 introduces grammar and sentence structure.",
    ]
    jy = 1460
    for line in journey:
        draw.ellipse((144, jy + 12, 166, jy + 34), fill="#8B5CF6")
        jy = draw_wrapped(draw, line, (194, jy), 1180, font(29), "#334155", spacing=8) + 14

    draw.rounded_rectangle((140, 2060, 640, 2148), radius=30, fill="#8B5CF6")
    draw.rounded_rectangle((690, 2060, 1404, 2148), radius=30, fill="#F59E0B")
    draw.text((176, 2082), "Product: Vaani", font=font(30, bold=True), fill="#FFFFFF")
    draw.text((726, 2082), "Company: RoboDynamics", font=font(30, bold=True), fill="#0F172A")
    return img.convert("RGB")


def save_pdf(pages: list[Image.Image]) -> Path:
    pdf_path = OUT_DIR / "vaani-brochure.pdf"
    pdf = canvas.Canvas(str(pdf_path), pagesize=(PAGE_W, PAGE_H))
    for page in pages:
        pdf.drawImage(ImageReader(page), 0, 0, width=PAGE_W, height=PAGE_H)
        pdf.showPage()
    pdf.save()
    return pdf_path


def save_previews(pages: list[Image.Image]) -> list[Path]:
    paths = []
    for idx, page in enumerate(pages, start=1):
        path = OUT_DIR / f"vaani-brochure-page-{idx}.png"
        page.save(path, format="PNG")
        paths.append(path)
    return paths


def main() -> None:
    ensure_dir()
    pages = [page_cover(), page_overview()]
    for idx, level in enumerate(LEVELS, start=1):
        pages.append(page_level(level, idx))
    pages.append(page_closing())
    pdf_path = save_pdf(pages)
    preview_paths = save_previews(pages)
    print(pdf_path)
    for path in preview_paths:
        print(path)


if __name__ == "__main__":
    main()
