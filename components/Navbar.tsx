'use client'

import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  Button
} from "@heroui/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
// Import icon manual biar bersih
import { Menu, X } from "lucide-react"

export default function Nav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Otomatis tutup menu kalau pindah halaman
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Team", href: "/team" },
    { name: "Leaderboards", href: "/leaderboards" },
    { name: "Gallery", href: "/gallery" },
    { name: "Assets", href: "/assets" },
  ]

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      maxWidth="xl"
      height="5rem" // Set fixed height biar konsisten
      isBordered={false}
      // FIX 1: z-[9999] biar layer paling atas, gak ketimpa konten page
      className={`fixed top-0 left-0 w-full z-[9999] transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg" 
          : "bg-transparent border-transparent py-4"
      }`}
      classNames={{
        wrapper: "px-6 sm:px-10",
        item: [
          "flex", "relative", "h-full", "items-center",
          "data-[active=true]:after:content-['']",
          "data-[active=true]:after:absolute",
          "data-[active=true]:after:bottom-0",
          "data-[active=true]:after:left-0",
          "data-[active=true]:after:right-0",
          "data-[active=true]:after:h-[2px]",
          "data-[active=true]:after:rounded-[2px]",
          "data-[active=true]:after:bg-primary",
        ],
      }}
    >
      {/* --- MOBILE: CUSTOM TOGGLE (Fix tulisan bocor) --- */}
      <NavbarContent className="sm:hidden" justify="start">
        <button 
          className="p-2 -ml-2 text-white hover:text-primary transition-colors outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {/* Toggle Icon Logic */}
          {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </NavbarContent>

      {/* --- MOBILE: Brand --- */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <BrandLogo />
      </NavbarContent>

      {/* --- DESKTOP: Brand --- */}
      <NavbarContent className="hidden sm:flex gap-6" justify="start">
        <BrandLogo />
      </NavbarContent>

      {/* --- DESKTOP: Menu Links --- */}
      <NavbarContent className="hidden sm:flex gap-10" justify="center">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <NavbarItem key={item.name} isActive={isActive}>
              <Link
                href={item.href}
                className={`relative text-base font-semibold transition-colors duration-300 ${
                  isActive 
                    ? "text-primary" 
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.name}
              </Link>
            </NavbarItem>
          )
        })}
      </NavbarContent>

      {/* --- GLOBAL: CTA Button --- */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            href="https://tiktok.com/@zenith.zth"
            target="_blank"
            size="lg" 
            variant="bordered"
            radius="full"
            className={`group border-white/30 hover:border-primary/50 transition-all duration-300 font-bold h-10 sm:h-14 px-4 sm:px-6 min-w-0 ${
                isScrolled ? "bg-white/5 hover:bg-white/10" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-white text-black rounded-full group-hover:scale-110 transition-transform">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-3 h-3 sm:w-3.5 sm:h-3.5">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </span>
            <span className="text-white group-hover:text-primary transition-colors hidden sm:block text-base">
              Follow Us
            </span>
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* --- MOBILE MENU (FULL COVER FIX) --- */}
      <NavbarMenu 
        // FIX 2: bg-black SOLID (bukan transparan) biar nutupin konten di belakang
        // FIX 3: h-[100dvh] dynamic viewport height biar pas di HP
        // FIX 4: pt-24 biar item menu turun dikit gak nabrak navbar
        className="bg-black/95 backdrop-blur-3xl pt-24 pb-10 h-[100dvh] fixed inset-0 z-[9998] overflow-y-auto border-t border-white/10"
        motionProps={{
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
          transition: { ease: "easeInOut", duration: 0.2 }
        }}
      >
        <div className="flex flex-col gap-6 px-4">
          {menuItems.map((item, index) => {
             const isActive = pathname === item.href
             return (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={`w-full flex items-center gap-4 text-4xl font-black tracking-tight transition-all duration-200 py-2 ${
                    isActive 
                      ? "text-primary translate-x-2" 
                      : "text-zinc-500 hover:text-white"
                  }`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {/* Indikator aktif */}
                  {isActive && <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_currentColor]"/>}
                  {item.name}
                </Link>
              </NavbarMenuItem>
            )
          })}
          
          {/* Tombol Follow Khusus Mobile */}
          <div className="mt-8 pt-8 border-t border-white/10">
             <Button 
                as={Link}
                href="https://tiktok.com/@zenith.zth"
                target="_blank"
                className="w-full bg-white text-black font-bold h-14 text-xl rounded-2xl shadow-xl"
                startContent={
                  <svg fill="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                  </svg>
                }
             >
                Follow on TikTok
             </Button>
          </div>
        </div>
      </NavbarMenu>
    </Navbar>
  )
}

function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 sm:gap-4 group">
      <div className="relative w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-sm border border-white/10">
          <Image 
            src="/zenith-logo-trans.png" 
            alt="Zenith Logo"
            fill
            className="object-cover"
            priority 
          />
        </div>
      </div>
      <span className="font-black text-xl sm:text-2xl tracking-wider text-white group-hover:text-primary transition-colors duration-300">
        ZENITH
      </span>
    </Link>
  )
}