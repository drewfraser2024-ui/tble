import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
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
  title: "Tble - Let's Table It",
  description: "Rate and review restaurants, chefs, bakers, stores, and businesses with detailed compartment-based reviews.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isGatePage = pathname === '/gate';

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        {!isGatePage && <Header />}
        <main className="flex-1">{children}</main>
        {!isGatePage && <Footer />}
      </body>
    </html>
  );
}
