"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import AdminHeader from "@/components/AdminHeader";
import Footer from "@/components/Footer";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col text-white`}
      >
        <Toaster position="top-center" reverseOrder={false} />
        {isAdminRoute ? (
          <>
            <AdminHeader />
            <main className="grow bg-[#1F2937]">{children}</main>
          </>
        ) : (
          <>
            <Header onMenuClick={() => setIsSidebarOpen(true)} />
            <main className="grow bg-[#1F2937]">{children}</main>
            <Footer />
            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
          </>
        )}
      </body>
    </html>
  );
}
