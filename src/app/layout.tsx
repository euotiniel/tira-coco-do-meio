import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { WEBSITE_HOST_URL } from '@/lib/constants'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const meta = {
  title: 'Tira 💩 do meio',
  description:
    'Versão digital do jogo clássico angolano: Tira c*** do meio',
  image: `${WEBSITE_HOST_URL}/og-preview.jpg`,
}

export const metadata: Metadata = {
  title: {
    default: meta.title,
    template: '%s ',
  },
  keywords: [
    "Otoniel Emanuel",
    "Angola",
    "Luanda",
    "Open source",
    "Jogo Tradicional",
    "Tira Coco do Meio",
    "Shisima",
    "Dara",
    "Game Development",
    "Matrizes",
    "Game Logic",
    "Cultura Africana",
    "Jogos Clássicos"
  ],
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: WEBSITE_HOST_URL,
    siteName: meta.title,
    locale: 'en-US',
    type: 'website',
      
  },
  alternates: {
    canonical: WEBSITE_HOST_URL,
  },
}

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
