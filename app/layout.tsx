import './globals.css';
import type { Metadata } from 'next';
import { Inter } from "next/font/google";
import NexusAssistant from "@/components/NexusAssistant";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <div className="min-h-screen bg-[#020617] text-white">
          {children}
          <NexusAssistant />
        </div>
      </body>
    </html>
  );
}
