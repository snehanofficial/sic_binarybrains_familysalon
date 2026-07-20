import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins-var",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter-var",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BinaryBrains Family Salon",
  description:
    "Discover a family-friendly salon experience with transparent pricing, hygienic practices, and easy online booking tailored for all ages.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${inter.variable}`}
    >
      <body style={{ height: "100%", margin: 0 }}>{children}</body>
    </html>
  );
}
