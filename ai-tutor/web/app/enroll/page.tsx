import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import { getUserProductEnrollments, type ProductEnrollmentRecord } from "@/lib/productEnrollmentDb";
import { getProductLaunchHref as getProductLaunchHrefShared } from "@/lib/productLaunch";

const PRODUCTS = [
  { id: "mindsutra", name: "Vedika", href: "/mindsutra", accent: "#8b5cf6", blurb: "Vedic math and structured mental calculation." },
  { id: "mindsparc", name: "Yukti", href: "/mindsparc", accent: "#10b981", blurb: "Aptitude, patterns, logic, and reasoning." },
  { id: "moneymind", name: "Artha", href: "/moneymind", accent: "#f59e0b", blurb: "Financial literacy, safety, budgeting, and investing." },
  { id: "vidya", name: "Vidya", href: "/vidya/level-1", accent: "#22c55e", blurb: "Logic building, computational reasoning, and problem-solving with Python." },
  { id: "neet", name: "NEET Prep", href: "/ai-tutor/neet/session", accent: "#06b6d4", blurb: "Medical entrance prep with guided tutor sessions." },
  { id: "hindiguru", name: "HindiSutra", href: "/hindiguru/course/grade-12-core", accent: "#ec4899", blurb: "Hindi language and literature tracks across grades." },
  { id: "vaani", name: "Vaani", href: "/vaani/level-1", accent: "#f97316", blurb: "Hindi foundational literacy with audio and tracing." },
  { id: "kaveri", name: "Kaveri", href: "/kaveri", accent: "#14b8a6", blurb: "Kannada learning and guided early reading experiences." },
];

function getProductLaunchHref(
  product: (typeof PRODUCTS)[number],
  enrollmentsByProduct: Map<string, ProductEnrollmentRecord>,
) {
  const enrollment = enrollmentsByProduct.get(product.id);
  return getProductLaunchHrefShared(product.id, product.href, enrollment);
}

export default async function EnrollPage({
  searchParams,
}: {
  searchParams?: { product?: string; next?: string };
}) {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);
  let dbEnrollments: ProductEnrollmentRecord[] = [];
  if (session?.userId) {
    try {
      dbEnrollments = await getUserProductEnrollments(session.userId, session.childId);
    } catch (error) {
      console.error("Enroll page enrollment fetch failed:", error);
    }
  }
  const enrollmentsByProduct = new Map(
    dbEnrollments.map((enrollment) => [enrollment.productSlug, enrollment] as const),
  );

  const recommended = String(searchParams?.product || "").trim().toLowerCase();
  const requestedNext = String(searchParams?.next || "").trim();
  const safeNext = requestedNext.startsWith("/") ? requestedNext : "";

  const products = [...PRODUCTS].sort((a, b) => {
    if (a.id === recommended) return -1;
    if (b.id === recommended) return 1;
    return 0;
  });

  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <div style={styles.header}>
          <div style={styles.eyebrow}>Common Login Complete</div>
          <h1 style={styles.title}>Choose where this learner goes next.</h1>
          <p style={styles.subtitle}>
            We now have one shared login and one shared registration flow. From here, you can send the learner into the product they want to explore or enroll in next.
          </p>
        </div>

        {safeNext ? (
          <div style={styles.continueCard}>
            <div style={styles.continueLabel}>Suggested next step</div>
            <a href={safeNext} style={styles.continueButton}>
              Continue to requested product
            </a>
          </div>
        ) : null}

        <section style={styles.grid}>
          {products.map((product) => (
            <article
              key={product.id}
              style={{
                ...styles.card,
                borderColor: product.id === recommended ? `${product.accent}66` : "rgba(148,163,184,0.15)",
                boxShadow: product.id === recommended ? `0 0 0 1px ${product.accent}22` : "none",
              }}
            >
              <div style={{ ...styles.pill, color: product.accent, borderColor: `${product.accent}55`, background: `${product.accent}14` }}>
                {product.id === recommended ? "Recommended" : "Available"}
              </div>
              <div style={styles.cardTitle}>{product.name}</div>
              <div style={styles.cardText}>{product.blurb}</div>
              <a href={getProductLaunchHref(product, enrollmentsByProduct)} style={{ ...styles.cardButton, background: product.accent }}>
                Open {product.name}
              </a>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(99,102,241,0.14), transparent 28%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
    color: "#f8fafc",
    padding: "28px 18px 56px",
  },
  shell: {
    maxWidth: "1140px",
    margin: "0 auto",
    display: "grid",
    gap: "22px",
  },
  header: {
    display: "grid",
    gap: "14px",
    paddingTop: "16px",
  },
  eyebrow: {
    width: "fit-content",
    border: "1px solid rgba(129,140,248,0.35)",
    background: "rgba(99,102,241,0.12)",
    color: "#c7d2fe",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  title: {
    margin: 0,
    fontSize: "clamp(34px, 5vw, 56px)",
    lineHeight: 1.02,
    fontWeight: 900,
  },
  subtitle: {
    margin: 0,
    maxWidth: "780px",
    color: "#cbd5e1",
    fontSize: "17px",
    lineHeight: 1.7,
  },
  continueCard: {
    borderRadius: "20px",
    border: "1px solid rgba(148,163,184,0.18)",
    background: "rgba(15,23,42,0.75)",
    padding: "18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  continueLabel: {
    color: "#cbd5e1",
    fontWeight: 700,
  },
  continueButton: {
    display: "inline-flex",
    padding: "12px 18px",
    borderRadius: "14px",
    textDecoration: "none",
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
  },
  card: {
    borderRadius: "22px",
    border: "1px solid",
    background: "rgba(15,23,42,0.78)",
    padding: "20px",
    display: "grid",
    gap: "12px",
  },
  pill: {
    width: "fit-content",
    border: "1px solid",
    borderRadius: "999px",
    padding: "5px 10px",
    fontSize: "11px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: 800,
  },
  cardText: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: 1.6,
    minHeight: "66px",
  },
  cardButton: {
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "12px 16px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#fff",
    fontWeight: 800,
  },
};
