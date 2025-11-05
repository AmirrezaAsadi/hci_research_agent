import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HCI Research Trends | SIGCHI UC",
  description: "Discover the latest Human-Computer Interaction research trends from ArXiv. Automated paper discovery, trend analysis, and student-friendly summaries.",
  keywords: "HCI, Human-Computer Interaction, research, ArXiv, trends, SIGCHI, UC",
  authors: [{ name: "SIGCHI UC Student Chapter" }],
  openGraph: {
    title: "HCI Research Trends | SIGCHI UC",
    description: "Stay updated with the latest HCI research from ArXiv",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
