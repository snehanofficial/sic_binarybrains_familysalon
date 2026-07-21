import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Toaster } from "sonner";
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
  title: "BinaryBrains Family Salon — Bangalore's Trusted Grooming Destination",
  description:
    "Book premium salon appointments for the whole family. Transparent pricing, hospital-grade hygiene, certified stylists, and a calm welcoming experience. Located in Koramangala, Bangalore.",
  keywords: "family salon bangalore, hair salon koramangala, bridal makeup bangalore, kids haircut, beard styling",
  openGraph: {
    title: "BinaryBrains Family Salon",
    description: "Bangalore's most trusted family salon. Book appointments online.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
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
      <body style={{ height: "100%", margin: 0 }}>
        {children}
        <Toaster
          position="top-right"
          richColors
          toastOptions={{
            style: {
              fontFamily: "Inter, sans-serif",
              borderRadius: "14px",
              fontSize: "13px",
            },
          }}
        />
      </body>
    </html>
  );
}
