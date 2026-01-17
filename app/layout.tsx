import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Nav from "@/components/Navbar";
import Footer from "@/components/Footer"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Drovic Team - Official Website",
  description: "Official team profile website for Drovic streaming team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // FIX 1: Ganti 'light' jadi 'dark' dan tambah inline style background
    <html lang="en" className="dark" style={{ backgroundColor: '#0a0a0a' }}>
      <body className={inter.className} style={{ backgroundColor: '#0a0a0a' }}>
        <Providers>
          <Nav />
          
          {/* FIX 2: Hapus 'pt-16'. Biarkan page yang handle padding sendiri biar background bisa full screen */}
          <main>
            {children}
          </main>
          
          <Footer />
        </Providers>
      </body>
    </html>
  );
}