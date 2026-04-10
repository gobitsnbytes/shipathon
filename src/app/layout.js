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
  title: "Shipathon — Build. Ship. Conquer.",
  description:
    "Shipathon is the ultimate hackathon by Phaser × Ship. 48 hours of building, shipping, and pushing boundaries. Join the most ambitious builders on the planet.",
  keywords: ["hackathon", "shipathon", "phaser", "ship", "coding", "builders"],
  openGraph: {
    title: "Shipathon — Build. Ship. Conquer.",
    description: "The most ambitious hackathon on the planet. By Phaser × Ship.",
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
      <head>
        <link
          rel="preload"
          href="/hero-video.mp4"
          as="video"
          type="video/mp4"
          fetchPriority="high"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
