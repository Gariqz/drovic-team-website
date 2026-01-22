'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants, useScroll, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import { Button, Card, Chip } from "@heroui/react"
import { Instagram, Zap, Skull, Frown, PartyPopper, Quote, MousePointer2, LucideIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/src/lib/supabase'

// --- ICON MAPPER ---
const iconMap: Record<string, LucideIcon> = {
  Skull: Skull,
  Zap: Zap,
  Frown: Frown,
  PartyPopper: PartyPopper
}

// --- GRADIENT MAPPER (FIX TEXT HILANG) ---
// Kita define class disini biar Tailwind generate CSS-nya.
// Kalau ngambil string dari DB ("from-blue-600..."), Tailwind gak bakal generate warnanya.
const gradientMap: Record<string, string> = {
  primary: "from-blue-600 to-indigo-500",
  secondary: "from-purple-600 to-fuchsia-500",
  warning: "from-amber-500 to-orange-500",
  danger: "from-red-600 to-rose-600",
  default: "from-gray-500 to-slate-500"
}

// --- TYPES (Sesuai Kolom Database) ---
type Member = {
  id: number
  name: string
  role: string
  trait: string
  trait_icon: string // "Skull", "Zap", dll
  bio: string
  image_url: string // URL dari Supabase Storage
  color: "primary" | "secondary" | "warning" | "danger"
  gradient: string
  tiktok_handle: string
  instagram_handle: string
}

export default function TeamPage() {
  const supabase = createClient()
  const [teamMembers, setTeamMembers] = useState<Member[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const containerRef = useRef(null)

  // 1. FETCH DATA SUPABASE
  useEffect(() => {
    const fetchTeam = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('id', { ascending: true }) // Atau order by 'sort_order'
      
      if (error) {
        console.error('Error fetching team:', error)
      } else {
        setTeamMembers(data as Member[] || [])
      }
      setIsLoading(false)
    }

    fetchTeam()
  }, [])

  // 2. SETUP LENIS SCROLL
  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => { lenis.destroy() }
  }, [])

  // 3. ANIMATION HOOKS (DITARUH DI ATAS, JANGAN DI DALAM JSX!)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 180])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  
  // FIX: Ini yang bikin error sebelumnya, sekarang udah dipindah ke sini (aman)
  const bgBottomY = useTransform(scrollYProgress, [0, 1], [0, -100]) 

  // --- SAFE GUARD ---
  const activeMember = teamMembers[activeIndex] || null

  // --- HELPERS ---
  
  // FIX: Helper baru buat ambil gradient dari Map lokal
  const getGradientClass = (color: string) => {
     return gradientMap[color] || gradientMap.default
  }

  const getBlobColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-blue-600';
      case 'secondary': return 'bg-purple-600';
      case 'warning': return 'bg-amber-500';
      case 'danger': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  }

  const getTraitColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]';
      case 'secondary': return 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]';
      case 'warning': return 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]';
      case 'danger': return 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]';
      default: return 'text-gray-400';
    }
  }

  const getActiveBorderClass = (color: string) => {
    switch (color) {
      case 'primary': return 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]';
      case 'secondary': return 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]';
      case 'warning': return 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]';
      case 'danger': return 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]';
      default: return 'border-gray-500';
    }
  }

  // --- VARIANTS ---
  const contentVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.3 } }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden selection:bg-white/30">
      
      {/* LOADING STATE */}
      {isLoading || !activeMember ? (
         <div className="h-screen w-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
         </div>
      ) : (
        <>
          {/* --- DYNAMIC BACKGROUND --- */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Blob Atas */}
            <motion.div 
              style={{ y: bgY, rotate: bgRotate }}
              className={`absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${getBlobColorClass(activeMember.color)} mix-blend-screen`} 
            />
            {/* Blob Bawah (FIXED: Pake variable bgBottomY) */}
            <motion.div 
              style={{ y: bgBottomY, x: bgY }}
              className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-15 transition-colors duration-1000 ${getBlobColorClass(activeMember.color)} mix-blend-screen`} 
            />
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
          </div>

          <div className="container mx-auto px-4 pt-32 pb-24 relative z-10">
            
            {/* HEADER */}
            <motion.div style={{ opacity: headerOpacity }} className="text-center mb-16 space-y-4">
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-8xl font-black tracking-tight text-white drop-shadow-2xl"
              >
                MEET THE <br className="md:hidden" />
                {/* FIX: inline-block, padding bottom, dan getGradientClass */}
                <span className={`inline-block text-transparent bg-clip-text bg-gradient-to-r ${getGradientClass(activeMember.color)} pb-2`}>
                  SQUAD
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-zinc-400 flex items-center justify-center gap-2"
              >
                Select a character to view details <MousePointer2 size={16} className="animate-bounce text-white" />
              </motion.p>
            </motion.div>

            {/* MAIN DISPLAY AREA */}
            <div className="max-w-6xl mx-auto min-h-[600px] flex flex-col md:flex-row items-center gap-12 md:gap-20 mb-20">
              
              {/* LEFT: IMAGE CARD */}
              <div className="w-full md:w-1/2 flex justify-center md:justify-end perspective-1000">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMember.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative group w-[300px] h-[400px] md:w-[400px] md:h-[550px]"
                  >
                    {/* FIX: Gunakan getGradientClass */}
                    <div className={`absolute inset-0 bg-gradient-to-tr ${getGradientClass(activeMember.color)} rounded-[2.5rem] blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                    
                    <Card className="w-full h-full border-none bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
                      {/* FIX: Gunakan getGradientClass */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(activeMember.color)} opacity-20`} />
                      
                      <div className="relative w-full h-full">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[12rem] font-black text-white/5 select-none">{activeMember.name.charAt(0)}</span>
                        </div>
                        {/* FIX: IMAGE CONNECT TO SUPABASE */}
                        <Image 
                          src={activeMember.image_url} 
                          alt={activeMember.name}
                          fill
                          className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                          priority
                          unoptimized // Penting buat gambar eksternal
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                      </div>
                      
                      <div className="absolute bottom-8 left-8 md:hidden">
                        <h2 className="text-4xl font-black text-white">{activeMember.name}</h2>
                        <p className="text-zinc-300 font-medium text-lg">{activeMember.role}</p>
                      </div>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* RIGHT: DETAILS */}
              <div className="w-full md:w-1/2 space-y-8 text-center md:text-left">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeMember.id}
                    variants={contentVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-8"
                  >
                    {/* Badges */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-3">
                      <Chip 
                        variant="solid" 
                        classNames={{ 
                            base: `border-none shadow-lg ${getBlobColorClass(activeMember.color)}`, 
                            content: "font-bold text-white uppercase tracking-widest text-xs" 
                        }}
                        size="lg"
                      >
                        {activeMember.role}
                      </Chip>

                      <Chip 
                        variant="bordered"
                        size="lg"
                        className="border-white/20 bg-white/5 font-semibold text-zinc-300 text-xs"
                        startContent={
                          (() => {
                            // Logic Icon Mapping
                            const IconComp = iconMap[activeMember.trait_icon] || Zap
                            return <IconComp size={16} className={getTraitColorClass(activeMember.color)} />
                          })()
                        }
                      >
                        {activeMember.trait}
                      </Chip>
                    </div>

                    {/* Name */}
                    {/* FIX: Gunakan getGradientClass dan pb-2 */}
                    <h2 className={`text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getGradientClass(activeMember.color)} leading-none pb-2 -ml-1`}>
                      {activeMember.name}
                    </h2>

                    {/* Bio Box */}
                    <div className={`relative p-8 bg-white/5 backdrop-blur-md rounded-3xl border-l-4 border-${activeMember.color}-500 shadow-lg`}>
                      <Quote className={`absolute top-6 left-6 opacity-30 ${getTraitColorClass(activeMember.color)}`} size={48} />
                      <p className="text-xl text-zinc-200 font-medium leading-relaxed relative z-10 pl-4 italic">
                        "{activeMember.bio}"
                      </p>
                    </div>

                    {/* Social Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                      <Button
                        as={Link}
                        href={`https://tiktok.com/${activeMember.tiktok_handle}`}
                        target="_blank"
                        className="font-bold text-black bg-white hover:bg-zinc-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform h-14 px-8 text-lg"
                        radius="full"
                        startContent={
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                          </svg>
                        }
                      >
                        TikTok
                      </Button>
                      
                      <Button
                        as={Link}
                        href={`https://instagram.com/${activeMember.instagram_handle}`}
                        target="_blank"
                        variant="bordered"
                        className="font-bold border-zinc-700 text-white hover:bg-white/10 h-14 px-8 text-lg"
                        radius="full"
                        startContent={<Instagram size={22} />}
                      >
                        Instagram
                      </Button>
                    </div>

                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* CHARACTER SELECTOR */}
            <div className="max-w-4xl mx-auto mt-32">
              <div className="text-center mb-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Select Character</p>
              </div>
              
              <div className="grid grid-cols-4 gap-4 md:gap-8">
                {teamMembers.map((member, index) => {
                  const isActive = index === activeIndex
                  return (
                    <button
                      key={member.id}
                      onClick={() => setActiveIndex(index)}
                      className={`relative group flex flex-col items-center gap-4 transition-all duration-300 outline-none ${isActive ? 'scale-110 -translate-y-4' : 'opacity-50 hover:opacity-100 hover:-translate-y-2'}`}
                    >
                      <div className={`relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isActive ? getActiveBorderClass(member.color) : 'border-zinc-800 grayscale group-hover:grayscale-0'}`}>
                        {/* FIX: Gunakan getGradientClass */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${getGradientClass(member.color)} opacity-50`}></div>
                        {/* SELECTOR IMAGE SUPABASE */}
                        <Image 
                            src={member.image_url} 
                            alt={member.name} 
                            fill 
                            className="object-cover"
                            unoptimized
                        />
                      </div>
                      
                      <div className={`text-sm md:text-base font-bold transition-colors uppercase tracking-wider ${isActive ? getTraitColorClass(member.color) : 'text-zinc-500 group-hover:text-zinc-300'}`}>
                        {member.name}
                      </div>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="activeDot"
                          className={`absolute -bottom-3 w-1.5 h-1.5 rounded-full ${getBlobColorClass(member.color)} shadow-[0_0_10px_currentColor]`}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  )
}