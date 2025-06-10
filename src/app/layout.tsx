import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://beioff.github.io/horecaservices'),
  title: "HoReCa B2B — Сервисы и продукты для ресторанного бизнеса",
  description: "Найдите лучшие B2B-решения для вашего ресторана, кафе или бара: POS-системы, CRM, доставка, оплата и управление. Сравните предложения и выберите оптимальное решение.",
  keywords: "HoReCa, ресторанный бизнес, POS-системы, CRM, доставка, оплата, автоматизация ресторана, B2B решения",
  authors: [{ name: "HoReCa B2B" }],
  openGraph: {
    title: "HoReCa B2B — Сервисы и продукты для ресторанного бизнеса",
    description: "Найдите лучшие B2B-решения для вашего ресторана, кафе или бара: POS-системы, CRM, доставка, оплата и управление.",
    type: "website",
    locale: "ru_RU",
    siteName: "HoReCa B2B",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
