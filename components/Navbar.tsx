'use client'

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Button
} from "@heroui/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

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
      height={isScrolled ? "5rem" : "6rem"}
      // FIX: Base styles
      // - bg-black/20 (Dark transparent tint) biar teks putih makin jelas
      // - backdrop-blur-md (Blur halus)
      // - border-white/10 (Border putih tipis transparan)
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
        isScrolled 
          ? "bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-lg supports-[backdrop-filter]:bg-black/20" 
          : "bg-transparent border-transparent py-4"
      }`}
      classNames={{
        wrapper: "px-6 sm:px-10",
        item: [
          "flex",
          "relative",
          "h-full",
          "items-center",
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
      {/* --- MOBILE: Toggle (Putih) --- */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="text-white hover:text-primary transition-colors"
        />
      </NavbarContent>

      {/* --- MOBILE: Brand --- */}
      <NavbarContent className="sm:hidden pr-3" justify="center">
        <BrandLogo />
      </NavbarContent>

      {/* --- DESKTOP: Brand --- */}
      <NavbarContent className="hidden sm:flex gap-6" justify="start">
        <BrandLogo />
      </NavbarContent>

      {/* --- DESKTOP: Menu Links (FORCE WHITE) --- */}
      <NavbarContent className="hidden sm:flex gap-10" justify="center">
        {menuItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <NavbarItem key={item.name} isActive={isActive}>
              <Link
                href={item.href}
                // FIX: text-white/70 (inactive) -> text-white (hover/active)
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

      {/* --- GLOBAL: CTA Button (FORCE LIGHT STYLE) --- */}
      <NavbarContent justify="end">
        <NavbarItem>
          <Button
            as={Link}
            href="https://tiktok.com/@drovic.vn"
            target="_blank"
            size="lg" 
            variant="bordered"
            radius="full"
            // FIX: Border & Text White
            className={`group border-white/30 hover:border-primary/50 transition-all duration-300 font-bold h-12 sm:h-14 px-6 ${
                isScrolled ? "bg-white/5 hover:bg-white/10" : "bg-white/10 hover:bg-white/20"
            }`}
          >
            <span className="flex items-center justify-center w-7 h-7 bg-white text-black rounded-full group-hover:scale-110 transition-transform">
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </span>
            {/* FIX: Text White */}
            <span className="text-white group-hover:text-primary transition-colors hidden sm:block text-base">
              Follow Us
            </span>
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* --- MOBILE MENU (Dark Background) --- */}
      <NavbarMenu className="pt-8 bg-black/95 backdrop-blur-2xl border-t border-white/10">
        <div className="flex flex-col gap-6 px-4">
          {menuItems.map((item, index) => {
             const isActive = pathname === item.href
             return (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className={`w-full flex items-center gap-4 text-2xl font-bold tracking-tight transition-all ${
                    isActive 
                      ? "text-primary translate-x-2" 
                      : "text-white/60 hover:text-white"
                  }`}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {isActive && <span className="w-1 h-8 bg-primary rounded-full"/>}
                  {item.name}
                </Link>
              </NavbarMenuItem>
            )
          })}
        </div>
      </NavbarMenu>
    </Navbar>
  )
}

// --- BRAND LOGO (FIXED TEXT WHITE) ---
function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-4 group">
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 w-full h-full rounded-2xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow-sm border border-white/10">
          <Image 
            src="/drovic-logo-trans.png" 
            alt="Drovic Logo"
            fill
            className="object-cover"
            priority 
          />
        </div>
      </div>

      {/* FIX: Text selalu putih */}
      <span className="font-black text-2xl tracking-wider text-white group-hover:text-primary transition-colors duration-300 hidden xs:block">
        DROVIC
      </span>
    </Link>
  )
}