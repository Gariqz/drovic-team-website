'use client'

import { Divider } from "@heroui/react"
import { Instagram, Youtube, Twitter } from "lucide-react"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-black border-t border-default-100 relative z-10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h4 className="text-2xl font-black text-primary">DROVIC</h4>
            <p className="text-default-500 max-w-sm">
              Creating unforgettable moments and building the strongest community on TikTok. Join the fun today!
            </p>
            <div className="flex gap-4">
              <Link href="#" className="p-2 bg-default-100 rounded-full hover:bg-primary hover:text-white transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="#" className="p-2 bg-default-100 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                <Youtube size={20} />
              </Link>
              <Link href="#" className="p-2 bg-default-100 rounded-full hover:bg-blue-400 hover:text-white transition-colors">
                <Twitter size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h5 className="font-bold text-lg mb-4">Discover</h5>
            <ul className="space-y-2 text-default-500">
              <li><Link href="/team" className="hover:text-primary transition-colors">Our Team</Link></li>
              <li><Link href="/gallery" className="hover:text-primary transition-colors">Gallery</Link></li>
              <li><Link href="/leaderboards" className="hover:text-primary transition-colors">Leaderboards</Link></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold text-lg mb-4">Community</h5>
            <ul className="space-y-2 text-default-500">
              <li><Link href="#" className="hover:text-primary transition-colors">Discord Server</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Guidelines</Link></li>
              <li><Link href="#" className="hover:text-primary transition-colors">Merchandise</Link></li>
            </ul>
          </div>
        </div>
        
        <Divider className="my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-default-400">
          <p>&copy; {new Date().getFullYear()} Drovic Team. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-default-800">Privacy Policy</Link>
            <Link href="#" className="hover:text-default-800">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}