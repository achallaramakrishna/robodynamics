import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import { getUserProductEnrollments } from "@/lib/productEnrollmentDb";
import { getProductById, HOMEPAGE_PRODUCTS } from "@/lib/productRegistry";
import { getProductLaunchHref } from "@/lib/productLaunch";

function buildProductActionHref(productId: string, productHref: string, loggedIn: boolean, enrolled: boolean) {
  if (loggedIn && enrolled) return productHref;
  if (loggedIn) return `/api/auth/enroll?product=${encodeURIComponent(productId)}&next=${encodeURIComponent(productHref)}`;
  return `/auth/register?next=${encodeURIComponent(productHref)}`;
}

function buildSecondaryHref(productHref: string, loggedIn: boolean, enrolled: boolean) {
  if (loggedIn && enrolled) return "/enroll";
  if (loggedIn) return productHref;
  return `/auth/login?next=${encodeURIComponent(productHref)}`;
}

function formatProgressLabel(chaptersCompleted: number, totalChapters: number, status: string) {
  if (status === "completed") return "Completed";
  if (chaptersCompleted > 0 && totalChapters > 0) return `${chaptersCompleted}/${totalChapters} chapters done`;
  if (chaptersCompleted > 0) return `${chaptersCompleted} chapters done`;
  if (status === "in_progress") return "In progress";
  return "Ready to begin";
}

function buildCardMeta(product: { subtitle: string; audience: string }) {
  return `${product.subtitle} | ${product.audience}`;
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);
  const loggedIn = Boolean(session?.userId);

  let dbEnrollments = [] as Awaited<ReturnType<typeof getUserProductEnrollments>>;
  if (session?.userId) {
    try {
      dbEnrollments = await getUserProductEnrollments(session.userId, session.childId);
    } catch (error) {
      console.error("Homepage enrollment fetch failed:", error);
    }
  }

  const enrolledCards = dbEnrollments
    .map((enrollment) => {
      const product = getProductById(enrollment.productSlug);
      if (!product) return null;

      return {
        ...product,
        enrollment,
      };
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  const enrolledIds = new Set(enrolledCards.map((item) => item.id));
  const discoverCards = HOMEPAGE_PRODUCTS.filter((product) => !enrolledIds.has(product.id));

  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div style={styles.heroPanel}>
          <div style={styles.badge}>AI Tutors for Math, Coding, Literacy and Exams</div>
          <h1 style={styles.title}>Find the right AI tutor for your child.</h1>
          <p style={styles.subtitle}>
            One family login. Clear tutor choices. Continue from the right level.
          </p>
          <div style={styles.heroRow}>
            <a href={loggedIn ? "#my-tutors" : "#explore"} style={styles.primaryButton}>
              {loggedIn ? "Go to My Tutors" : "Explore Tutors"}
            </a>
            <a href={loggedIn ? "/enroll" : "/auth/register"} style={styles.secondaryButton}>
              {loggedIn ? "Browse All Tutors" : "Create Account"}
            </a>
          </div>
          <div style={styles.heroFacts}>
            <span style={styles.factPill}>{HOMEPAGE_PRODUCTS.length}+ tutors</span>
            <span style={styles.factPill}>Shared family login</span>
            <span style={styles.factPill}>Laptop, tablet and mobile</span>
          </div>
        </div>
      </section>

      {loggedIn ? (
        <section id="my-tutors" style={styles.section}>
          <div style={styles.sectionHeader}>
            <div>
              <div style={styles.sectionEyebrow}>My AI Tutors</div>
              <h2 style={styles.sectionTitle}>
                {session?.childName ? `${session.childName}'s tutors` : "Continue learning"}
              </h2>
            </div>
            <div style={styles.sectionMeta}>
              {session?.parentName ? `Parent: ${session.parentName}` : "Shared family account"}
            </div>
          </div>

          {enrolledCards.length > 0 ? (
            <div style={styles.cardGrid}>
              {enrolledCards.map((product) => (
                <article key={product.id} style={styles.marketCard}>
                  <div style={styles.cardMedia}>
                    <div style={{ ...styles.cardAccent, background: product.color }} />
                    <span style={styles.cardIcon}>{product.icon}</span>
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.cardMeta}>{buildCardMeta(product)}</div>
                    <h3 style={styles.cardTitle}>{product.name}</h3>
                    <p style={styles.cardText}>{product.description}</p>
                    <div style={styles.cardFooterRow}>
                      <span style={styles.cardStatus}>
                        {formatProgressLabel(
                          product.enrollment.chaptersCompleted,
                          product.enrollment.totalChapters,
                          product.enrollment.status,
                        )}
                      </span>
                      <span style={styles.cardAccuracy}>{Math.round(product.enrollment.accuracy)}% accuracy</span>
                    </div>
                    <div style={styles.cardActions}>
                      <a
                        href={getProductLaunchHref(product.id, product.href, product.enrollment)}
                        style={{ ...styles.cardButton, background: product.color }}
                      >
                        Continue
                      </a>
                      <a href="/enroll" style={styles.cardLink}>
                        View all tutors
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyTitle}>No tutors added yet.</div>
              <p style={styles.emptyText}>
                Start with one tutor below and it will appear here for the learner next time they sign in.
              </p>
            </div>
          )}
        </section>
      ) : null}

      <section id="explore" style={styles.section}>
        <div style={styles.sectionHeader}>
          <div>
            <div style={styles.sectionEyebrow}>Explore AI Tutors</div>
            <h2 style={styles.sectionTitle}>
              {loggedIn ? "Add another tutor" : "Choose a tutor and get started"}
            </h2>
          </div>
          <div style={styles.sectionMeta}>
            {loggedIn ? "Add in one click" : "Simple, trusted tutor marketplace"}
          </div>
        </div>

        <div style={styles.cardGrid}>
          {discoverCards.map((product) => (
            <article key={product.id} style={styles.marketCard}>
              <div style={styles.cardMedia}>
                <div style={{ ...styles.cardAccent, background: product.color }} />
                <span style={styles.cardIcon}>{product.icon}</span>
              </div>
              <div style={styles.cardBody}>
                <div style={styles.cardMeta}>{buildCardMeta(product)}</div>
                <h3 style={styles.cardTitle}>{product.name}</h3>
                <p style={styles.cardText}>{product.description}</p>
                <div style={styles.cardActions}>
                  <a
                    href={buildProductActionHref(product.id, product.href, loggedIn, false)}
                    style={{ ...styles.cardButton, background: product.color }}
                  >
                    {loggedIn ? "Add Tutor" : "Start Learning"}
                  </a>
                  <a href={buildSecondaryHref(product.href, loggedIn, false)} style={styles.cardLink}>
                    {loggedIn ? "Preview" : "Login"}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f9fafb",
    color: "#111827",
    padding: "24px 16px 56px",
  },
  hero: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "12px 0 32px",
  },
  heroPanel: {
    display: "grid",
    gap: "16px",
    padding: "32px",
    borderRadius: "24px",
    border: "1px solid #e5e7eb",
    background: "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
    boxShadow: "0 18px 50px rgba(15, 23, 42, 0.06)",
  },
  badge: {
    width: "fit-content",
    borderRadius: "999px",
    padding: "8px 12px",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  },
  title: {
    margin: 0,
    fontSize: "clamp(34px, 6vw, 58px)",
    lineHeight: 1.02,
    fontWeight: 900,
    maxWidth: "760px",
    letterSpacing: "-0.03em",
  },
  subtitle: {
    margin: 0,
    maxWidth: "640px",
    color: "#4b5563",
    fontSize: "18px",
    lineHeight: 1.7,
  },
  heroRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 20px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#ffffff",
    fontWeight: 800,
    background: "#111827",
    minWidth: "190px",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "14px 20px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#111827",
    fontWeight: 800,
    background: "#ffffff",
    border: "1px solid #d1d5db",
    minWidth: "190px",
  },
  heroFacts: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  factPill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: "999px",
    padding: "8px 12px",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: "13px",
    fontWeight: 700,
  },
  section: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "grid",
    gap: "18px",
    padding: "8px 0 20px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-end",
    flexWrap: "wrap",
  },
  sectionEyebrow: {
    color: "#2563eb",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "8px",
  },
  sectionTitle: {
    margin: 0,
    fontSize: "clamp(24px, 4vw, 36px)",
    lineHeight: 1.1,
    fontWeight: 900,
    color: "#111827",
  },
  sectionMeta: {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: 700,
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "18px",
  },
  marketCard: {
    display: "grid",
    gridTemplateRows: "160px 1fr",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  },
  cardMedia: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%)",
  },
  cardAccent: {
    position: "absolute",
    inset: 0,
    opacity: 0.12,
  },
  cardIcon: {
    position: "relative",
    zIndex: 1,
    fontSize: "54px",
  },
  cardBody: {
    display: "grid",
    gap: "12px",
    padding: "18px",
  },
  cardMeta: {
    color: "#6b7280",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  cardTitle: {
    margin: 0,
    fontSize: "24px",
    fontWeight: 900,
    color: "#111827",
    letterSpacing: "-0.02em",
  },
  cardText: {
    margin: 0,
    color: "#4b5563",
    fontSize: "14px",
    lineHeight: 1.7,
    minHeight: "72px",
  },
  cardFooterRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  cardStatus: {
    color: "#2563eb",
    fontSize: "13px",
    fontWeight: 800,
  },
  cardAccuracy: {
    color: "#6b7280",
    fontSize: "13px",
    fontWeight: 700,
  },
  cardActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    marginTop: "4px",
  },
  cardButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "138px",
    padding: "12px 16px",
    borderRadius: "12px",
    color: "#ffffff",
    textDecoration: "none",
    fontWeight: 800,
  },
  cardLink: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "110px",
    padding: "12px 0",
    color: "#111827",
    textDecoration: "none",
    fontWeight: 800,
  },
  emptyState: {
    borderRadius: "20px",
    border: "1px solid #e5e7eb",
    background: "#ffffff",
    padding: "24px",
  },
  emptyTitle: {
    fontSize: "22px",
    fontWeight: 900,
    marginBottom: "8px",
    color: "#111827",
  },
  emptyText: {
    margin: 0,
    color: "#6b7280",
    lineHeight: 1.7,
  },
};
