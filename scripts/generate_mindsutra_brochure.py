from __future__ import annotations

from pathlib import Path
from textwrap import wrap

from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "artifacts" / "vedica-brochure"
PAGE_W = 1654
PAGE_H = 2339


LEVELS = [
    {
        "id": "Level 1",
        "name": "Foundation",
        "color": "#22C55E",
        "tagline": "Build the speed base every student needs.",
        "headline": "Add 999 + 1 instantly and understand why it works.",
        "ideal": "Ideal for ages 9-10 or any student new to Vedic Maths.",
        "outcome": "Complements, fast addition, borrow-free subtraction, and 2-digit criss-cross multiplication.",
        "modules": [
            "Fast addition with complements",
            "Tables 11-19 by pattern",
            "Doubling and halving shortcuts",
            "Multiply by 11 in one split",
            "Borrow-free subtraction",
            "Multiply by 5 and 25",
            "Near-100 mental math",
            "Criss-cross 2-digit multiplication",
        ],
    },
    {
        "id": "Level 2",
        "name": "Speed Builder",
        "color": "#3B82F6",
        "tagline": "Unlock powerful shortcuts for exams.",
        "headline": "Multiply 97 x 103 in 5 seconds without a calculator.",
        "ideal": "Ideal for ages 10-11 with a basic mental-math foundation.",
        "outcome": "Near-100 multiplication, 3-digit criss-cross, decimals, fractions, and one-line division.",
        "modules": [
            "Near-100 multiplication",
            "Proportional multiplication",
            "Criss-cross 3-digit multiplication",
            "Running remainder division",
            "Squares near 50",
            "Fast fraction simplification",
            "Decimal speed arithmetic",
            "Flag division",
        ],
    },
    {
        "id": "Level 3",
        "name": "Power",
        "color": "#F59E0B",
        "tagline": "Advanced patterns that feel like magic.",
        "headline": "Solve 998 x 997 mentally in one breath.",
        "ideal": "Ideal for ages 11-12 ready for algebra patterns and integer operations.",
        "outcome": "Flexible-base multiplication, vinculum numbers, ratios, duplex squaring, and algebra by inspection.",
        "modules": [
            "Vinculum numbers",
            "Integer multiplication shortcuts",
            "Nikhilam with any base",
            "Ratio shortcuts",
            "HCF and LCM shortcuts",
            "Duplex squaring",
            "Paravartya division",
            "Algebra by inspection",
        ],
    },
    {
        "id": "Level 4",
        "name": "Ace",
        "color": "#8B5CF6",
        "tagline": "Elite techniques for competitive exams.",
        "headline": "Find cube roots of 6-digit numbers by inspection.",
        "ideal": "Ideal for ages 12-13+ preparing for tougher school math and exams.",
        "outcome": "Near-1000 multiplication, fast fractions, equations, exponents, geometry, and algebraic expansion.",
        "modules": [
            "Squaring near any base",
            "Rational number addition",
            "Linear equations with Paravartya",
            "Cubing with structure",
            "Near-1000 multiplication",
            "Exponent patterns",
            "Triangle area shortcuts",
            "Fast algebraic identities",
        ],
    },
    {
        "id": "Level 5",
        "name": "Champion",
        "color": "#EC4899",
        "tagline": "Mastery-level techniques for Olympiads and boards.",
        "headline": "Crack advanced math problems others skip.",
        "ideal": "Ideal for high-school learners and competition-focused students.",
        "outcome": "Roots by inspection, simultaneous equations, 4-digit multiplication, percentages, and advanced divisibility.",
        "modules": [
            "Square root by inspection",
            "Cube root by inspection",
            "Advanced algebraic identities",
            "Simultaneous equations",
            "Criss-cross 4-digit multiplication",
            "Percentage speed arithmetic",
            "Near-10000 multiplication",
            "Advanced divisibility rules",
        ],
    },
]


TESTIMONIALS = [
    "She flew through the Level 1 placement and finished Level 2 in 3 weeks. Her maths teacher asked what changed.",
    "My son used to take 40 minutes for maths homework. Now it is done in 15.",
    "The AI coach actually explains why, not just the answer.",
]


FAQS = [
    ("Safe for children?", "Yes. No ads, no social features, no strangers. Parents stay in control."),
    ("Works on phone and laptop?", "Yes. Vedica runs in the browser on phone, tablet, or laptop."),
    ("Will this help in school exams?", "Yes. Students still learn the logic, but reach answers faster and with fewer careless mistakes."),
    ("Subscription?", "No yearly renewal. Levels are designed as lasting learning assets."),
]


def ensure_dir() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)


def font(size: int, bold: bool = False, italic: bool = False) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
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


def draw_wrapped(
    draw: ImageDraw.ImageDraw,
    text: str,
    xy: tuple[int, int],
    width: int,
    line_font: ImageFont.ImageFont,
    fill: str,
    spacing: int = 10,
) -> int:
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


def pill(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int], fill: str, text: str, text_fill: str) -> None:
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
    img = vertical_gradient((PAGE_W, PAGE_H), "#FFF8EF", "#FFF1D6").convert("RGBA")
    add_soft_circles(img, ["#F59E0B", "#8B5CF6", "#22C55E"])
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle((96, 88, 430, 160), radius=32, fill="#111827")
    draw.text((128, 104), "RoboDynamics", font=font(34, bold=True), fill="#F9FAFB")
    draw.text((100, 230), "Vedica", font=font(124, bold=True), fill="#0F172A")
    draw.text((104, 370), "AI Vedic Maths Program", font=font(44, bold=False), fill="#B45309")
    y = draw_wrapped(
        draw,
        "A 5-level mental-math journey that builds speed, accuracy, and real mathematical confidence for school and competitive learning.",
        (104, 470),
        980,
        font(40),
        "#334155",
        spacing=14,
    )
    pill(draw, (104, y + 30, 480, y + 96), "#0F172A", "Ages 9-14", "#FFFFFF")
    pill(draw, (500, y + 30, 992, y + 96), "#FFFFFF", "40 Guided Lessons", "#0F172A")

    card = (92, 1280, 1562, 2080)
    draw.rounded_rectangle(card, radius=48, fill="#0F172A")
    draw.text((150, 1340), "What parents love", font=font(42, bold=True), fill="#F8FAFC")
    bullets = [
        "Interactive AI tutor that explains the logic, not just the answer",
        "Level-based progression from basics to Olympiad-style mastery",
        "Fast, visual methods that reduce careless errors and build confidence",
        "Works on phone, tablet, or laptop with parent-friendly visibility",
    ]
    by = 1445
    for bullet_text in bullets:
        draw.ellipse((152, by + 14, 176, by + 38), fill="#F59E0B")
        by = draw_wrapped(draw, bullet_text, (200, by), 1250, font(34), "#E2E8F0", spacing=10) + 16

    draw.text((150, 1868), "Signature promise", font=font(30, bold=True), fill="#FBBF24")
    draw_wrapped(
        draw,
        "Vedica turns intimidating math into patterns children can see, trust, and use quickly under pressure.",
        (150, 1915),
        1260,
        font(34),
        "#F8FAFC",
        spacing=10,
    )
    return img.convert("RGB")


def page_overview() -> Image.Image:
    img = vertical_gradient((PAGE_W, PAGE_H), "#F8FBFF", "#E7F0FF").convert("RGBA")
    add_soft_circles(img, ["#60A5FA", "#A78BFA", "#FDE68A"])
    draw = ImageDraw.Draw(img)
    draw.text((96, 110), "How Vedica Works", font=font(76, bold=True), fill="#0F172A")
    draw_wrapped(
        draw,
        "Each level contains 8 lessons designed to build conceptual clarity first, then speed and pattern recognition.",
        (100, 220),
        1200,
        font(34),
        "#475569",
    )

    band_y = 430
    band_h = 250
    steps = [
        ("1", "Learn the pattern", "#22C55E"),
        ("2", "Practice visually", "#3B82F6"),
        ("3", "Apply at speed", "#8B5CF6"),
        ("4", "Move to the next level", "#F59E0B"),
    ]
    step_w = 350
    for i, (num, label, color) in enumerate(steps):
        x = 96 + i * (step_w + 20)
        draw.rounded_rectangle((x, band_y, x + step_w, band_y + band_h), radius=36, fill=color)
        draw.text((x + 34, band_y + 30), num, font=font(72, bold=True), fill="#FFFFFF")
        draw_wrapped(draw, label, (x + 34, band_y + 122), step_w - 68, font(34, bold=True), "#FFFFFF", spacing=8)

    draw.text((96, 795), "5-Level Progression", font=font(50, bold=True), fill="#0F172A")
    timeline_y = 900
    for idx, level in enumerate(LEVELS):
        x = 100 + idx * 302
        color = level["color"]
        draw.rounded_rectangle((x, timeline_y, x + 250, timeline_y + 320), radius=36, fill=color)
        draw.text((x + 30, timeline_y + 28), level["id"], font=font(34, bold=True), fill="#FFFFFF")
        draw_wrapped(draw, level["name"], (x + 30, timeline_y + 94), 190, font(36, bold=True), "#FFFFFF", spacing=6)
        draw_wrapped(draw, level["tagline"], (x + 30, timeline_y + 176), 188, font(24), "#F8FAFC", spacing=6)

    box1 = (96, 1360, 746, 2086)
    box2 = (806, 1360, 1556, 2086)
    for box, title in [(box1, "Why it is different"), (box2, "Parent-ready answers")]:
        draw.rounded_rectangle(box, radius=42, fill="#FFFFFF")
        draw.text((box[0] + 36, box[1] + 34), title, font=font(42, bold=True), fill="#0F172A")

    body_y = 1450
    points = [
        "Interactive tutoring instead of passive video watching",
        "Pattern-based Vedic methods that reduce math anxiety",
        "Clear progression from school basics to advanced speed skills",
        "Strong fit for homework, exams, and competition prep",
    ]
    for point in points:
        draw.ellipse((130, body_y + 12, 152, body_y + 34), fill="#2563EB")
        body_y = draw_wrapped(draw, point, (174, body_y), 500, font(28), "#334155", spacing=8) + 12

    faq_y = 1450
    for q, a in FAQS:
        draw.text((842, faq_y), q, font=font(28, bold=True), fill="#0F172A")
        faq_y = draw_wrapped(draw, a, (842, faq_y + 42), 650, font(24), "#475569", spacing=7) + 20
    return img.convert("RGB")


def page_level(level: dict[str, object], page_num: int) -> Image.Image:
    palette = {
        1: ("#F3FFF7", "#E2FCEB"),
        2: ("#F4F9FF", "#E5F0FF"),
        3: ("#FFF8EF", "#FFEDD5"),
        4: ("#F8F4FF", "#EEE8FF"),
        5: ("#FFF4FB", "#FFE3F3"),
    }
    top, bottom = palette[page_num]
    img = vertical_gradient((PAGE_W, PAGE_H), top, bottom).convert("RGBA")
    add_soft_circles(img, [level["color"], "#FFFFFF", "#CBD5E1"])
    draw = ImageDraw.Draw(img)
    accent = level["color"]

    draw.rounded_rectangle((94, 88, 340, 152), radius=28, fill=accent)
    draw.text((126, 102), level["id"], font=font(32, bold=True), fill="#FFFFFF")
    draw.text((96, 210), level["name"], font=font(88, bold=True), fill="#0F172A")
    draw_wrapped(draw, level["headline"], (100, 338), 1320, font(40), "#334155", spacing=10)

    left = (96, 520, 760, 2200)
    right = (820, 520, 1558, 2200)
    draw.rounded_rectangle(left, radius=44, fill="#FFFFFF")
    draw.rounded_rectangle(right, radius=44, fill="#FFFFFF")

    draw.text((134, 564), "Who this level is for", font=font(38, bold=True), fill="#0F172A")
    draw_wrapped(draw, level["ideal"], (136, 628), 560, font(28), "#475569", spacing=8)
    draw.text((134, 780), "What students unlock", font=font(38, bold=True), fill="#0F172A")
    draw_wrapped(draw, level["outcome"], (136, 844), 560, font(28), "#475569", spacing=8)
    draw.text((134, 1040), "8-module outline", font=font(38, bold=True), fill="#0F172A")

    module_y = 1114
    for idx, module in enumerate(level["modules"], start=1):
        draw.rounded_rectangle((136, module_y, 678, module_y + 90), radius=24, fill=accent)
        draw.text((158, module_y + 22), f"{idx:02d}", font=font(28, bold=True), fill="#FFFFFF")
        draw_wrapped(draw, module, (236, module_y + 18), 420, font(25, bold=True), "#FFFFFF", spacing=4)
        module_y += 104

    draw.text((856, 564), "Why parents choose it", font=font(38, bold=True), fill="#0F172A")
    benefit_text = [
        level["tagline"],
        "Short, focused lessons designed for momentum instead of overwhelm.",
        "Pattern-first learning improves speed and accuracy together.",
    ]
    benefit_y = 640
    for line in benefit_text:
        draw.ellipse((858, benefit_y + 10, 880, benefit_y + 32), fill=accent)
        benefit_y = draw_wrapped(draw, line, (904, benefit_y), 560, font(28), "#334155", spacing=8) + 18

    draw.rounded_rectangle((856, 1030, 1500, 1338), radius=36, fill=accent)
    draw.text((902, 1080), "Vedica move", font=font(32, bold=True), fill="#FFFFFF")
    draw_wrapped(
        draw,
        "Students do not just memorize tricks. They see the structure, practice it, then learn to use it with confidence under time pressure.",
        (902, 1142),
        540,
        font(28),
        "#FFFFFF",
        spacing=8,
    )

    draw.text((856, 1458), "Sample result", font=font(38, bold=True), fill="#0F172A")
    samples = {
        "Level 1": "Borrow-free subtraction and 2-digit multiplication feel natural instead of scary.",
        "Level 2": "School-style arithmetic becomes faster, cleaner, and far less error-prone.",
        "Level 3": "Students start seeing algebra and number patterns as structured puzzles.",
        "Level 4": "Advanced school math becomes quicker and more strategic.",
        "Level 5": "Competition-focused learners gain elite speed and confidence on hard problems.",
    }
    draw_wrapped(draw, samples[level["id"]], (858, 1524), 560, font(30), "#475569", spacing=8)

    draw.rounded_rectangle((856, 1702, 1500, 2052), radius=36, outline=accent, width=4)
    draw.text((904, 1756), "Progress signal", font=font(32, bold=True), fill="#0F172A")
    draw_wrapped(
        draw,
        "8 guided lessons. One strong level identity. A clear bridge to the next stage of mathematical confidence.",
        (904, 1822),
        540,
        font(29),
        "#334155",
        spacing=8,
    )
    return img.convert("RGB")


def page_closing() -> Image.Image:
    img = vertical_gradient((PAGE_W, PAGE_H), "#0F172A", "#1E1B4B").convert("RGBA")
    add_soft_circles(img, ["#8B5CF6", "#F59E0B", "#22C55E"])
    draw = ImageDraw.Draw(img)
    draw.text((96, 120), "Built for confident learners", font=font(74, bold=True), fill="#F8FAFC")
    draw_wrapped(
        draw,
        "From early mental-math fluency to Olympiad-style pattern recognition, Vedica gives students a step-by-step path that feels achievable and exciting.",
        (100, 236),
        1220,
        font(34),
        "#CBD5E1",
        spacing=10,
    )

    draw.text((96, 510), "What families say", font=font(46, bold=True), fill="#FBBF24")
    ty = 610
    for quote in TESTIMONIALS:
        draw.rounded_rectangle((96, ty, 1558, ty + 194), radius=34, fill="#FFFFFF")
        draw_wrapped(draw, quote, (136, ty + 40), 1120, font(23, italic=True), "#0F172A", spacing=8)
        ty += 222

    draw.rounded_rectangle((96, 1346, 1558, 1990), radius=48, fill="#111827")
    draw.text((140, 1412), "Brochure summary", font=font(48, bold=True), fill="#F8FAFC")
    summary = [
        "5 progression levels from Foundation to Champion",
        "40 lessons built around visual Vedic Math patterns",
        "Stronger speed, fewer careless errors, better confidence in school math",
        "Suitable for regular practice, exams, and competition pathways",
    ]
    sy = 1516
    for line in summary:
        draw.ellipse((144, sy + 10, 168, sy + 34), fill="#F59E0B")
        sy = draw_wrapped(draw, line, (192, sy), 1180, font(30), "#E2E8F0", spacing=8) + 18

    draw.rounded_rectangle((140, 1824, 732, 1912), radius=30, fill="#8B5CF6")
    draw.rounded_rectangle((764, 1824, 1404, 1912), radius=30, fill="#F59E0B")
    draw.text((176, 1846), "Product: Vedica", font=font(30, bold=True), fill="#FFFFFF")
    draw.text((800, 1846), "Company: RoboDynamics", font=font(30, bold=True), fill="#0F172A")
    draw.text((96, 2146), "Prepared from the current Vedica course and landing-page content in the workspace.", font=font(24), fill="#CBD5E1")
    return img.convert("RGB")


def save_pdf(pages: list[Image.Image]) -> Path:
    pdf_path = OUT_DIR / "vedica-brochure.pdf"
    pdf = canvas.Canvas(str(pdf_path), pagesize=(PAGE_W, PAGE_H))
    for page in pages:
        pdf.drawImage(ImageReader(page), 0, 0, width=PAGE_W, height=PAGE_H)
        pdf.showPage()
    pdf.save()
    return pdf_path


def save_previews(pages: list[Image.Image]) -> list[Path]:
    paths = []
    for idx, page in enumerate(pages, start=1):
        path = OUT_DIR / f"vedica-brochure-page-{idx}.png"
        page.save(path, format="PNG")
        paths.append(path)
    return paths


def main() -> None:
    ensure_dir()
    pages = [
        page_cover(),
        page_overview(),
        page_level(LEVELS[0], 1),
        page_level(LEVELS[1], 2),
        page_level(LEVELS[2], 3),
        page_level(LEVELS[3], 4),
        page_level(LEVELS[4], 5),
        page_closing(),
    ]
    pdf_path = save_pdf(pages)
    preview_paths = save_previews(pages)
    print(pdf_path)
    for path in preview_paths:
        print(path)


if __name__ == "__main__":
    main()
