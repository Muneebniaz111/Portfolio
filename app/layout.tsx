import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Muneeb Niaz — Software Engineer",
  description: "Full-Stack & Back-End Developer. Building scalable, efficient applications with Python, Django, React, and ASP.NET Core.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
