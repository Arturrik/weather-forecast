import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Погодный тайм-капсул",
  description:
    "Визуализатор погодных воспоминаний — введите дату и место, и мы покажем атмосферу того дня",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Commissioner:ital,wght@0,400..700;1,400..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
