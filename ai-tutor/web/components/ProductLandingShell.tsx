type ProductStat = {
  label: string;
  value: string;
};

type ProductLevel = {
  id: string;
  name: string;
  tagline: string;
  accent: string;
  meta: string;
  lessons: { id: string; title: string }[];
};

export default function ProductLandingShell({
  eyebrow,
  title,
  subtitle,
  accent,
  stats,
  levels,
  primaryHref,
  primaryLabel,
  secondaryHref = "/auth/login",
  secondaryLabel = "Login",
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  accent: string;
  stats: ProductStat[];
  levels: ProductLevel[];
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <main style={styles.page}>
      <section style={styles.hero}>
        <div
          style={{
            ...styles.eyebrow,
            borderColor: `${accent}55`,
            background: `${accent}14`,
            color: accent,
          }}
        >
          {eyebrow}
        </div>
        <h1 style={styles.title}>{title}</h1>
        <p style={styles.subtitle}>{subtitle}</p>
        <div style={styles.ctaRow}>
          <a href={primaryHref} style={{ ...styles.primaryButton, background: accent }}>
            {primaryLabel}
          </a>
          <a href={secondaryHref} style={styles.secondaryButton}>
            {secondaryLabel}
          </a>
        </div>
      </section>

      <section style={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} style={styles.statCard}>
            <div style={{ ...styles.statValue, color: accent }}>{stat.value}</div>
            <div style={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      <section style={styles.levelsGrid}>
        {levels.map((level) => (
          <article key={level.id} style={styles.levelCard}>
            <div style={styles.levelHeader}>
              <div>
                <div style={{ ...styles.levelName, color: level.accent }}>{level.name}</div>
                <div style={styles.levelTagline}>{level.tagline}</div>
              </div>
              <div style={styles.levelMeta}>{level.meta}</div>
            </div>
            <div style={styles.lessonList}>
              {level.lessons.slice(0, 4).map((lesson) => (
                <div key={lesson.id} style={styles.lessonRow}>
                  <span style={{ ...styles.lessonDot, background: level.accent }} />
                  <span>{lesson.title}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.12), transparent 24%), linear-gradient(180deg, #020617 0%, #0f172a 100%)",
    color: "#f8fafc",
    padding: "32px 20px 56px",
  },
  hero: {
    maxWidth: "1120px",
    margin: "0 auto",
    display: "grid",
    gap: "18px",
    padding: "36px 0 28px",
  },
  eyebrow: {
    width: "fit-content",
    border: "1px solid",
    borderRadius: "999px",
    padding: "8px 14px",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
  },
  title: {
    margin: 0,
    fontSize: "clamp(34px, 6vw, 60px)",
    lineHeight: 1.02,
    fontWeight: 900,
  },
  subtitle: {
    margin: 0,
    maxWidth: "760px",
    fontSize: "17px",
    lineHeight: 1.7,
    color: "#cbd5e1",
  },
  ctaRow: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "8px",
  },
  primaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    padding: "14px 20px",
    color: "#fff",
    textDecoration: "none",
    fontWeight: 800,
    minWidth: "170px",
  },
  secondaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "14px",
    padding: "14px 20px",
    color: "#e2e8f0",
    textDecoration: "none",
    fontWeight: 700,
    minWidth: "140px",
    border: "1px solid #334155",
    background: "rgba(15,23,42,0.66)",
  },
  statsGrid: {
    maxWidth: "1120px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "14px",
    padding: "8px 0 26px",
  },
  statCard: {
    borderRadius: "18px",
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(15,23,42,0.72)",
    padding: "18px",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: 900,
  },
  statLabel: {
    color: "#94a3b8",
    fontSize: "13px",
    marginTop: "4px",
  },
  levelsGrid: {
    maxWidth: "1120px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "16px",
  },
  levelCard: {
    borderRadius: "22px",
    border: "1px solid rgba(148,163,184,0.15)",
    background: "rgba(15,23,42,0.78)",
    padding: "20px",
    display: "grid",
    gap: "16px",
  },
  levelHeader: {
    display: "flex",
    justifyContent: "space-between",
    gap: "16px",
    alignItems: "flex-start",
  },
  levelName: {
    fontSize: "21px",
    fontWeight: 800,
    marginBottom: "4px",
  },
  levelTagline: {
    color: "#cbd5e1",
    fontSize: "13px",
    lineHeight: 1.5,
  },
  levelMeta: {
    color: "#94a3b8",
    fontSize: "12px",
    textAlign: "right",
    whiteSpace: "nowrap",
  },
  lessonList: {
    display: "grid",
    gap: "10px",
  },
  lessonRow: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#e2e8f0",
    fontSize: "14px",
  },
  lessonDot: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    flexShrink: 0,
  },
};
