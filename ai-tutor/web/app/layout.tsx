import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RoboDynamics AI Tutor",
  description: "Multi-course AI Tutor integrated with RoboDynamics"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
