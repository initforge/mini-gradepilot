import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "GradePilot - Academic Calculators for US Students",
    template: "%s | GradePilot",
  },
  description:
    "Free GPA calculator, grade calculator, and academic tools for US high school and college students. Analyze your grades, prioritize courses, and make data-driven decisions.",
  keywords: [
    "GPA calculator",
    "grade calculator",
    "college GPA",
    "high school GPA",
    "final grade calculator",
    "weighted GPA",
  ],
  authors: [{ name: "GradePilot" }],
  creator: "GradePilot",
  metadataBase: new URL("https://gradepilot.org"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "GradePilot",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
