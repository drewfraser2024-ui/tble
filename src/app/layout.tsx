import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import AppBar from "@/components/layout/AppBar";
import BottomNav from "@/components/layout/BottomNav";
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
  title: "Tble It — Real reviews. Verified visits.",
  description:
    "Rate and review restaurants, chefs, bakers, stores, and businesses with detailed, receipt-verified reviews.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Tble It",
  },
};

export const viewport: Viewport = {
  themeColor: "#05070A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") || "";
  const isGate = pathname === "/gate";
  const isAuth = pathname.startsWith("/auth");
  const showChrome = !isGate && !isAuth;

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}
      >
        {showChrome && <AppBar />}
        <main className={showChrome ? "pt-appbar pb-bottomnav min-h-screen" : "min-h-screen"}>
          {children}
        </main>
        {showChrome && <BottomNav />}
      </body>
    </html>
  );
}
