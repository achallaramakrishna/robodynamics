import Script from 'next/script';

export const metadata = {
  title: 'Mindsutra Early Access',
  description: 'MindSutra founding beta for parents and students.',
};

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      <style dangerouslySetInnerHTML={{ __html: `
        html, body {
          background-color: #0a0a0a !important; 
          background-image: none !important;
          color: #ffffff !important;
        }
      `}} />
      <div className="challenge-theme-wrapper">
        {children}
      </div>
    </>
  );
}
