import "./globals.css";
import { Inter, Space_Grotesk } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

export const metadata = {
  title: "SH1PATHON — Build. SH1P. Conquer.",
  description:
    "SH1PATHON is the ultimate hackathon by Bits&Bytes' Phaser × SH1P. 48 hours of building, shipping, and pushing boundaries. Join the most ambitious builders on the planet.",
  keywords: ["hackathon", "sh1pathon", "bits&bytes", "phaser", "sh1p", "coding", "builders"],
  openGraph: {
    title: "SH1PATHON — Build. SH1P. Conquer.",
    description: "The most ambitious hackathon on the planet. By Bits&Bytes' Phaser × SH1P.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        {children}
      </body>
    </html>
  );
}
