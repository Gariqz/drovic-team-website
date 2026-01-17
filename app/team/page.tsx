'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, Variants, useScroll, useTransform } from 'framer-motion'
import Lenis from 'lenis'
import { Button, Card, Chip } from "@heroui/react"
import { Instagram, Zap, Skull, Frown, PartyPopper, Quote, MousePointer2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// --- Types ---
type Member = {
  id: number
  name: string
  role: string
  trait: string
  traitIcon: any
  bio: string
  image: string
  color: "primary" | "secondary" | "warning" | "danger"
  gradient: string
  socials: {
    tiktok: string
    instagram: string
  }
}

const teamMembers: Member[] = [
  {
    id: 1,
    name: 'Uqi',
    role: 'Team Leader',
    trait: 'Dark Jokes Specialist',
    traitIcon: Skull,
    bio: 'The captain who steers the ship into chaos. Known for humor that crosses the line but keeps the audience laughing. Leadership with a touch of darkness.',
    image: '/team/uqi.jpg',
    color: 'primary',
    gradient: 'from-blue-600 to-indigo-500', // Adjusted gradient for better contrast
    socials: { tiktok: '@uqi', instagram: '@uqi' }
  },
  {
    id: 2,
    name: 'Gaga',
    role: 'Team Member',
    trait: 'Certified Gooner',
    traitIcon: Zap,
    bio: 'Focus and intensity personified. When he locks in, the game is over. He brings a different level of energy and "dedication" to the stream.',
    image: '/team/ghassan.jpg',
    color: 'secondary',
    gradient: 'from-purple-600 to-fuchsia-500',
    socials: { tiktok: '@ghassan', instagram: '@ghassan' }
  },
  {
    id: 3,
    name: 'Syn',
    role: 'Team Member',
    trait: 'Resident Cry Baby',
    traitIcon: Frown,
    bio: 'Emotional damage is his middle name. Whether it is a sad game ending or a roast battle, expect tears (of joy, hopefully). The heart of the team.',
    image: '/team/rangga.jpg',
    color: 'warning',
    gradient: 'from-amber-500 to-orange-500',
    socials: { tiktok: '@rangga', instagram: '@rangga' }
  },
  {
    id: 4,
    name: 'Jay',
    role: 'Team Member',
    trait: 'King of Drama',
    traitIcon: PartyPopper,
    bio: 'Lives for the plot twists. If there is no chaos, he creates it. The mastermind behind the most dramatic moments on stream.',
    image: '/team/ajay.jpg',
    color: 'danger',
    gradient: 'from-red-600 to-rose-600',
    socials: { tiktok: '@ajay', instagram: '@ajay' }
  }
]

export default function TeamPage() {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeMember = teamMembers[activeIndex]
  const containerRef = useRef(null)

  useEffect(() => {
    const lenis = new Lenis()
    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
    return () => { lenis.destroy() }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Background movements
  const bgY = useTransform(scrollYProgress, [0, 1], [0, 300])
  const bgRotate = useTransform(scrollYProgress, [0, 1], [0, 180])
  
  const headerOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])

  const contentVariants: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } 
    },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } }
  }

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0, 
      transition: { type: "spring", stiffness: 100, damping: 20 } 
    },
    exit: { opacity: 0, scale: 0.95, y: -20, transition: { duration: 0.3 } }
  }

  // FIX: Warna Background Blob (Vivid colors for dark theme)
  const getBlobColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'bg-blue-600';
      case 'secondary': return 'bg-purple-600';
      case 'warning': return 'bg-amber-500';
      case 'danger': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  }

  // FIX: Text Highlight Colors (Lighter for contrast against black)
  const getTraitColorClass = (color: string) => {
    switch (color) {
      case 'primary': return 'text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]';
      case 'secondary': return 'text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]';
      case 'warning': return 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]';
      case 'danger': return 'text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.5)]';
      default: return 'text-gray-400';
    }
  }

  // FIX: Selector Border
  const getActiveBorderClass = (color: string) => {
    switch (color) {
      case 'primary': return 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.6)]';
      case 'secondary': return 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]';
      case 'warning': return 'border-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]';
      case 'danger': return 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)]';
      default: return 'border-gray-500';
    }
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden selection:bg-white/30">
      
      {/* --- DYNAMIC BACKGROUND (Dark Mode Optimized) --- */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Blob atas */}
        <motion.div 
          style={{ y: bgY, rotate: bgRotate }}
          className={`absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-20 transition-colors duration-1000 ${getBlobColorClass(activeMember.color)} mix-blend-screen`} 
        />
        {/* Blob bawah */}
        <motion.div 
           style={{ y: useTransform(scrollYProgress, [0, 1], [0, -100]), x: bgY }}
          className={`absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] opacity-15 transition-colors duration-1000 ${getBlobColorClass(activeMember.color)} mix-blend-screen`} 
        />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="container mx-auto px-4 pt-32 pb-24 relative z-10">
        
        {/* Header */}
        <motion.div style={{ opacity: headerOpacity }} className="text-center mb-16 space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black tracking-tight text-white drop-shadow-2xl"
          >
            MEET THE <span className={`text-transparent bg-clip-text bg-gradient-to-r ${activeMember.gradient}`}>SQUAD</span>
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
                <div className={`absolute inset-0 bg-gradient-to-tr ${activeMember.gradient} rounded-[2.5rem] blur-[60px] opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                
                <Card className="w-full h-full border-none bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl rounded-[2.5rem] overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${activeMember.gradient} opacity-20`} />
                  
                  <div className="relative w-full h-full">
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[12rem] font-black text-white/5 select-none">{activeMember.name.charAt(0)}</span>
                     </div>
                    <Image 
                      src={activeMember.image}
                      alt={activeMember.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                  </div>
                  
                  {/* Mobile Text */}
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
                {/* Badges - FIX: Explicit Colors */}
                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  <Chip 
                    variant="solid" 
                    // FIX: Paksa warna text putih biar kebaca di atas warna primary/secondary
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
                      <activeMember.traitIcon 
                        size={16} 
                        className={getTraitColorClass(activeMember.color)} 
                      />
                    }
                  >
                    {activeMember.trait}
                  </Chip>
                </div>

                {/* Name */}
                <h2 className={`text-6xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r ${activeMember.gradient} leading-none pb-2 -ml-1`}>
                  {activeMember.name}
                </h2>

                {/* Bio Box - FIX: Contrast Text */}
                <div className={`relative p-8 bg-white/5 backdrop-blur-md rounded-3xl border-l-4 border-${activeMember.color}-500 shadow-lg`}>
                  <Quote className={`absolute top-6 left-6 opacity-30 ${getTraitColorClass(activeMember.color)}`} size={48} />
                  <p className="text-xl text-zinc-200 font-medium leading-relaxed relative z-10 pl-4 italic">
                    "{activeMember.bio}"
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                  <Button
                    as={Link}
                    href={`https://tiktok.com/${activeMember.socials.tiktok}`}
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
                    href={`https://instagram.com/${activeMember.socials.instagram}`}
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
                     <div className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-50`}></div>
                     <Image 
                        src={member.image} 
                        alt={member.name} 
                        fill 
                        className="object-cover"
                     />
                  </div>
                  
                  {/* FIX: Selector Text Visibility */}
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
    </div>
  )
}