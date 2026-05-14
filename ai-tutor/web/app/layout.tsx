import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import PlatformChrome from "@/components/PlatformChrome";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Robodynamics Academy",
  description: "Next-Gen Gamified AI Tutoring Platform",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);

  return (
    <html lang="en">
      <body className={inter.className}>
        <PlatformChrome loggedIn={Boolean(session?.userId)} childName={session?.childName}>
          {children}
        </PlatformChrome>
      </body>
    </html>
  );
}
