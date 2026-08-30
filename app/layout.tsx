import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Docket - Project Management",
  description: "A simple, clean project management tool.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      {/* We add bg-navy and text-white to the body so the whole site matches the navy theme */}
      <body className={`${geistSans.variable} ${geistMono.variable} bg-navy text-white antialiased`}>
        <Navbar />
        {/* 'children' is whatever page the user is currently on (Home, About, etc.) */}
        <main className="min-h-screen">
          {children}
        </main>

        <Footer/>
      </body>
    </html>
  );
}
