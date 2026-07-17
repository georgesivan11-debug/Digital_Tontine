import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "sonner";
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
  title: "Digital Tontine | La Tontine 2.0",
  description: "Gérez vos tontines en ligne de manière transparente, sécurisée et automatisée. Fini les cahiers, passez au digital !",
  openGraph: {
    title: "Digital Tontine | La Tontine 2.0",
    description: "Gérez vos tontines en ligne de manière transparente, sécurisée et automatisée. Rejoignez-nous !",
    url: "https://digital-tontine-7r4p.vercel.app",
    siteName: "Digital Tontine",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Digital Tontine Preview",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Tontine | La Tontine 2.0",
    description: "Gérez vos tontines en ligne de manière transparente et sécurisée.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
