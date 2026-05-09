import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credex Audit | Enterprise AI SaaS Auditor',
  description: 'Automated audit engine for optimizing SaaS spend, security compliance, and vendor consolidation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-[#020617] text-white">
          {children}
        </div>
      </body>
    </html>
  );
}
