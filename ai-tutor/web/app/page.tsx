import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <div className="panel">
        <h1>RoboDynamics AI Tutor</h1>
        <p className="muted">
          This app hosts the Next.js tutor interface. Open the Vedic tutor launch page to continue.
        </p>
        <Link className="button" href="/ai-tutor/vedic">
          Open Vedic Math Tutor
        </Link>
      </div>
    </main>
  );
}

