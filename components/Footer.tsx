'use client'

import { Divider } from "@heroui/react"
import { Instagram, Youtube, Twitter } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    // FIX 1: bg-white dihapus, ganti jadi bg-[#0a0a0a] (Hitam) & border-white/10
    <footer className="bg-[#0a0a0a] border-t border-white/10 relative z-10 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            {/* Logo Text */}
            <h4 className="text-2xl font-black text-white tracking-wider">Zenith</h4>
            <p className="text-zinc-400 max-w-sm">
              Creating unforgettable moments and building the strongest community on TikTok. Join the fun today!
            </p>
            
            {/* FIX 2: Tombol Social Media jadi Transparan Putih */}
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-white/10 rounded-full text-white hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full text-white hover:bg-red-600 hover:text-white transition-colors">
                <Youtube size={20} />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full text-white hover:bg-blue-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-4 text-white">Discover</h5>
            {/* FIX 3: Link color jadi zinc-400 dan hover white */}
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="/team" className="hover:text-primary transition-colors">Our Team</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/leaderboards" className="hover:text-primary transition-colors">Leaderboards</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-lg mb-4 text-white">Community</h5>
            <ul className="space-y-2 text-zinc-400">
              <li><Link href="#" className="hover:text-primary transition-colors">Discord Server</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Merchandise</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Divider Gelap */}
        <Divider className="my-8 bg-white/10" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-zinc-500">
          <p>&copy; {new Date().getFullYear()} Zenith Team. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}