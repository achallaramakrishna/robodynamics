import type { CSSProperties, ReactNode } from "react";

export default function PlatformChrome({
  loggedIn,
  childName,
  children,
}: {
  loggedIn: boolean;
  childName?: string | null;
  children: ReactNode;
}) {
  return (
    <div style={styles.shell}>
      <header style={styles.topNavWrap}>
        <div style={styles.topNav}>
          <a href="/" style={styles.brandWrap}>
            <span style={styles.brandLogoShell}>
              <img src="/rd-logo.jpg" alt="RoboDynamics" style={styles.brandLogo} />
            </span>
            <span style={styles.brandTextBlock}>
              <span style={styles.brandText}>RoboDynamics Academy</span>
              <span style={styles.brandSubtext}>
                {loggedIn && childName ? `${childName}'s AI tutor hub` : "One platform for every AI tutor"}
              </span>
            </span>
          </a>

          <nav style={styles.navLinks}>
            <a href="/" style={styles.navLink}>Home</a>
            <a href="/#explore" style={styles.navLink}>AI Tutors</a>
            <a href="/enroll" style={styles.navLink}>Parent Corner</a>
          </nav>

          <div style={styles.navActions}>
            {loggedIn ? (
              <>
                <a href="/enroll" style={styles.navGhostButton}>Dashboard</a>
                <a href="/#my-tutors" style={styles.navPrimaryButton}>My Tutors</a>
                <a href="/api/auth/logout" style={styles.navLogoutButton}>Logout</a>
              </>
            ) : (
              <>
                <a href="/auth/login" style={styles.navGhostButton}>Login</a>
                <a href="/auth/register" style={styles.navPrimaryButton}>Register</a>
              </>
            )}
          </div>
        </div>
      </header>

      <div style={styles.content}>{children}</div>

      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <div style={styles.footerBrand}>
            <div style={styles.footerTitle}>RoboDynamics Academy</div>
            <p style={styles.footerText}>
              Shared family login, progress-aware AI tutors, and one consistent learning experience across the RoboDynamics product family.
            </p>
          </div>
          <div style={styles.footerLinks}>
            <a href="/#explore" style={styles.footerLink}>AI Tutors</a>
            <a href={loggedIn ? "/enroll" : "/auth/login"} style={styles.footerLink}>
              {loggedIn ? "Dashboard" : "Login"}
            </a>
            <a href={loggedIn ? "/api/auth/logout" : "/auth/register"} style={styles.footerLink}>
              {loggedIn ? "Logout" : "Register"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  shell: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#020617",
  },
  topNavWrap: {
    position: "sticky",
    top: 0,
    zIndex: 80,
    backdropFilter: "blur(18px)",
    background: "rgba(255,255,255,0.96)",
    borderBottom: "1px solid #e5e7eb",
  },
  topNav: {
    maxWidth: "1180px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
    padding: "12px 16px",
  },
  brandWrap: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    textDecoration: "none",
    color: "#111827",
    minWidth: 0,
  },
  brandLogoShell: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0",
    borderRadius: "0",
    background: "transparent",
    flexShrink: 0,
  },
  brandLogo: {
    display: "block",
    width: "150px",
    height: "auto",
    objectFit: "contain",
  },
  brandTextBlock: {
    display: "grid",
    gap: "2px",
    minWidth: 0,
  },
  brandText: {
    fontSize: "18px",
    fontWeight: 800,
    color: "#111827",
    letterSpacing: "0.01em",
  },
  brandSubtext: {
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.3,
  },
  navLinks: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  navLink: {
    color: "#374151",
    textDecoration: "none",
    fontWeight: 700,
    fontSize: "14px",
  },
  navActions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    alignItems: "center",
  },
  navGhostButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#111827",
    fontWeight: 700,
    border: "1px solid #d1d5db",
    background: "#ffffff",
  },
  navPrimaryButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#ffffff",
    fontWeight: 800,
    background: "#2563eb",
  },
  navLogoutButton: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px 16px",
    borderRadius: "14px",
    textDecoration: "none",
    color: "#b91c1c",
    fontWeight: 700,
    border: "1px solid #fecaca",
    background: "#ffffff",
  },
  content: {
    flex: 1,
  },
  footer: {
    borderTop: "1px solid #e5e7eb",
    background: "#ffffff",
  },
  footerInner: {
    maxWidth: "1180px",
    margin: "0 auto",
    padding: "24px 16px 32px",
    display: "flex",
    justifyContent: "space-between",
    gap: "18px",
    flexWrap: "wrap",
  },
  footerBrand: {
    maxWidth: "520px",
    display: "grid",
    gap: "8px",
  },
  footerTitle: {
    fontSize: "16px",
    fontWeight: 800,
    color: "#111827",
  },
  footerText: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
    lineHeight: 1.7,
  },
  footerLinks: {
    display: "flex",
    gap: "14px",
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  footerLink: {
    color: "#374151",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: 700,
  },
};
