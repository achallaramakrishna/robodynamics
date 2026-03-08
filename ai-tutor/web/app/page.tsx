import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <div className="panel">
        <h1>RoboDynamics AI Tutor</h1>
        <p className="muted">
          This app hosts the multi-course AI Tutor interface.
        </p>
        <Link className="button" href="/ai-tutor/tutor">
          Open AI Tutor Workspace
        </Link>
      </div>
    </main>
  );
}
