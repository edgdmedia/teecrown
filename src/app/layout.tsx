import { DM_Sans, Roboto } from "next/font/google";
import "./globals.css";
import { Analytics } from "@/components/layout/analytics";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const roboto = Roboto({ subsets: ["latin"], variable: "--font-roboto", weight: ["300","400","500","700"], display: "swap" });

const siteUrl = "https://teecrownconsult.org";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tee'Crown Consult | Travel & Tourism",
  description: "Flights, visas, insurance and unforgettable tours — handled end to end by a proudly Nigerian travel company.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Tee'Crown Consult | Travel & Tourism",
    description: "Flights, visas, insurance and unforgettable tours — handled end to end by a proudly Nigerian travel company.",
    url: siteUrl,
    siteName: "Tee'Crown Consult",
    type: "website",
    locale: "en_US",
    images: [{ url: "/logo-landscape.webp", width: 1536, height: 512 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tee'Crown Consult | Travel & Tourism",
    description: "Flights, visas, insurance and unforgettable tours — handled end to end by a proudly Nigerian travel company.",
    images: ["/logo-landscape.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${roboto.variable}`}>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-primary)' }}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
